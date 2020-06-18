import React, {Component} from 'react'
import {
	FlatList,
	View,
	StyleSheet,
	Platform,
	Alert,
	DeviceEventEmitter,
	NativeModules,
	Animated,
	Linking,
	ScrollView,
	AppState, TouchableOpacity, Image, Text, RefreshControl, SectionList,
} from 'react-native';
import {Colors} from '../../utils/Styles';
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import {NaviBarHeight, ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {CollectionType, ErrorCode, Gender, PLATFORM} from '../../utils/CustomEnums';
import PostItem from './../post/view/PostItem';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import {HTTP} from '../../utils/HttpTools';
import {API_Post} from '../../utils/API';
import LoadingFooter from '../../BaseComponents/LoadingFooter';
import Toast from 'react-native-simple-toast';

export default class MyPostListController extends Component{
	static options(passProps) {
		return {
			topBar: {
				title: {
					text: 'Post'
				},
				rightButtons: [
					{
						id: 'edit',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						text: 'Edit',
					},
				]
			}
		};
	}

	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			isSpinnerVisible: false,
			isTotal: false,
			isRefreshing: false,
			isEdit: false
		}

		this.page = 1
		this.pageSize = 30
		this.onEndReachedCalledDuringMomentumInTrend = false
		this.navigationEventListener = Navigation.events().bindComponent(this);
	}

	navigationButtonPressed({ buttonId }) {
		if (buttonId === 'edit') {
			this.setState({isEdit: !this.state.isEdit})
		}
	}

	componentDidMount() {
		this.refresh()
	}

	componentWillUnmount() {
		this.navigationEventListener && this.navigationEventListener.remove();
	}

	getUserID() {
		return UserInfo.UserID
	}

	refresh() {
		this.page = 1
		this.getPostList(true)
	}

	loadMore() {
		this.page = this.page + 1
		this.getPostList(false)
	}

	getPostList(isRefresh) {
		let param = {
			UserID: this.getUserID(),
			Page: this.page,
			PageSize: this.pageSize,
		}

		if (isRefresh) {
			this.setState({isRefreshing: true})
		}

		HTTP.post(API_Post.getMyPostByPage, param).then((response) => {
			this.setState({dataSource: isRefresh ? response.data : this.state.dataSource.concat(response.data),
				isTotal: response.data.length < this.pageSize,
				isRefreshing: false
			})
		}).catch((error) => {
			this.setState({isRefreshing: false})
		})
	}

	showSpinner() {
		this.setState({isSpinnerVisible: true})
	}

	hideSpinner() {
		this.setState({isSpinnerVisible: false})
	}
	//
	pushToPostDetailPage(item) {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'PostDetailViewController',
				passProps: {
					postInfo: item,
					isAppendPost: true
				},
				options: BaseNavigatorOptions('Post Detail')
			}
		})
	}

	finishEdit() {
		this.setState({isEdit: false})
		let data = this.state.dataSource.map((item) => {
			item.isSelected = false

			return item
		})

		this.setState({dataSource: data})
	}

	deleteAction() {
		Alert.alert(
			'Are sure to delete ?',
			'Delete the selected items.',
			[
				{text: 'OK', onPress: () => {this.deleteSelectedItem()}},
				{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			],
			{ cancelable: false }
		)
	}

	deleteSelectedItem() {
		let deleteIdList = []
		let filterList = this.state.dataSource.filter((item) => {
			if (item.isSelected) {
				deleteIdList.push(item.PostID)
			}
			return !item.isSelected
		})

		if (deleteIdList.length) {
			this.setState({dataSource: filterList})
			this.finishEdit()
			this.deleteSelectedFromNet(deleteIdList)
		} else {
			Toast.showWithGravity('Please select at least one!', Toast.SHORT, Toast.CENTER)
		}
	}

	deleteSelectedFromNet(ids) {
		let param = {
			IDs: ids,
			UserID: this.getUserID()
		}

		this.showSpinner()
		HTTP.post(API_Post.deletePostByIds, param).then((response) => {
			this.hideSpinner()
			if (response.code === ErrorCode.Ok) {
				Toast.show('Delete successfully')
			}else {

			}
		}).catch(() => {
			this.hideSpinner()
			Toast.show('Request failed')
		})
	}

	renderButtonActonBar() {
		if (!this.state.isEdit) {
			return null
		}

		return(
			<View style={{width: ScreenDimensions.width, height: 50 + (PLATFORM.isIPhoneX ? 34 : 0),
				backgroundColor: Colors.bottom_bar, justifyContent: 'space-between', flexDirection: 'row',
				paddingHorizontal: 16,
			}}>
				<View style={{position: 'absolute', left: 0, top: 0, right: 0, height: 1, backgroundColor: Colors.lineColor}}/>

				<TouchableOpacity onPress={() => {
					this.finishEdit()
				}}>
					<Text style={{fontSize: 16, color: Colors.theme, marginTop: 16, fontWeight: 'bold'}}>{'Cancel'}</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => {
					this.deleteAction()
				}}>
					<Text style={{fontSize: 16, color: Colors.red, marginTop: 16, fontWeight: 'bold'}}>{'Delete'}</Text>
				</TouchableOpacity>
			</View>
		)
	}

	renderItem(item) {
		return(
			<PostItem
				id={item.PostID}
				isEdit={this.state.isEdit}
				isSelected = {item.isSelected}
				postInfo = {item}
				didSelectedItem={() => {
					if (this.state.isEdit) {
						return
					}

					this.pushToPostDetailPage(item)
				}}
				clickSelectedButton={() => {
					let dataSource = this.state.dataSource
					let index = dataSource.findIndex((data) => {
						return data.PostID === item.PostID
					})

					dataSource[index].isSelected = !dataSource[index].isSelected
					this.setState({doctorList: dataSource})
				}}
			/>
		)
	}

	renderHeader() {
		return(
			<View style={{width: '100%', height: 16, backgroundColor: Colors.clear}}/>
		)
	}

	renderListFooter() {
		return(
			<View style={{paddingBottom: TabBar.height}}>
				<LoadingFooter isTotal={this.state.dataSource.length && this.state.isTotal}
							   isLoading={this.state.dataSource.length}
				/>
			</View>
		)
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.listBg}}>
				<FlatList
					style={{flex: 1}}
					renderItem={({item}) => this.renderItem(item)}
					data={this.state.dataSource}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					ListHeaderComponent={() => {
						return this.renderHeader()
					}}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							enabled = {true}
							onRefresh={() => {
								this.refresh()
							}
							}
						/>
					}
					onEndReachedThreshold = {0.1}
					onEndReached = {() => {
						if (!this.onEndReachedCalledDuringMomentumInTrend) {
							this.loadMore()
							this.onEndReachedCalledDuringMomentumInTrend = true;
						}
					}}
					onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentumInTrend = false; }}
					ListFooterComponent={() => {
						return this.renderListFooter()
					}}
				/>

				{this.renderButtonActonBar()}
				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
