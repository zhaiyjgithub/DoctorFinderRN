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
	AppState, TouchableOpacity, Image, Text, RefreshControl, SectionList, ImageBackground,
} from 'react-native';
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {CollectionType, EventName, Gender, PLATFORM, SearchBarType} from '../../utils/CustomEnums';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import {HTTP} from '../../utils/HttpTools';
import {API_Post, API_User} from '../../utils/API';
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import LoadingFooter from '../../BaseComponents/LoadingFooter';
import DoctorInfoItem from '../home/view/DoctorInfoItem';
import PostItem from '../post/view/PostItem'
import Toast from 'react-native-simple-toast'
import ListEmptyView from '../../BaseComponents/ListEmptyView';

export default class MyFavorViewController extends Component{
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

	getUserID() {
		return UserInfo.UserID
	}

	constructor(props) {
		super(props)
		this.state = {
			doctorList: [],
			isDoctorListTotal: false,
			isDoctorListRefreshing: false,

			postList: [],
			isPostListTotal: false,
			isPostListRefreshing: false,

			selectedType: CollectionType.doctor,
			isSpinnerVisible: false,
			isEdit: false
		}

		this.doctorPage = 1
		this.doctorPageSize = 30
		this.postPage = 1
		this.postPageSize = 30
		this.isHasFinishDoctorsRefresh = false
		this.isHasFinishPostsRefresh = false
		this.setTitleView()

		this.navigationEventListener = Navigation.events().bindComponent(this);
	}

	navigationButtonPressed({ buttonId }) {
		if (buttonId === 'edit') {
			let isEdit = this.state.isEdit
			this.setState({isEdit: !isEdit})
			this.sendUpdateSegmentTabEnableStatusNoti(isEdit)
		}
	}

	sendUpdateSegmentTabEnableStatusNoti(isEnable) {
		DeviceEventEmitter.emit(EventName.other.segmentTabEnable, {isEnabled: isEnable})
	}

	setTitleView() {
		Navigation.mergeOptions(this.props.componentId, {
			topBar: {
				title: {
					component: {
						name: 'SegmentTabView',
						passProps:{
							menus: ['Doctor', 'Post'],
							handleIndexChange: (type) => {
								this.setState({selectedType: type})
								let x = (type === CollectionType.doctor ? 0 : ScreenDimensions.width)
								this._scrollView && this._scrollView.scrollTo({x: x, y: 0, animated: true})
							}
						}
					}
				}
			}
		});
	}

	componentDidMount() {
		setTimeout(() => {
			this.refreshDoctorList()
			this.refreshPostList()
		}, 800)
	}

	componentWillUnmount() {
		this.navigationEventListener && this.navigationEventListener.remove();
	}

	showSpinner() {
		this.setState({isSpinnerVisible: true})
	}

	hideSpinner() {
		this.setState({isSpinnerVisible: false})
	}

	updateSegmentTab(index) {
		DeviceEventEmitter.emit(EventName.other.segmentTab, {index: index})
	}

	refreshDoctorList() {
		if (this.state.isEdit) {
			return
		}
		this.doctorPage = 1
		this.getDoctorList(true)
	}

	loadMoreDoctorList() {
		if (this.state.isEdit) {
			return
		}
		this.doctorPage = this.doctorPage + 1
		this.getDoctorList(false)
	}

	getDoctorList(isRefresh) {
		let param = {
			UserID: this.getUserID(),
			Type: CollectionType.doctor,
			Page: this.doctorPage,
			PageSize: this.doctorPageSize,
		}

		if (isRefresh) {
			this.isHasFinishDoctorsRefresh = false
			this.setState({isDoctorListRefreshing: true})
		}

		HTTP.post(API_User.getMyFavorite, param).then((response) => {
			let mergerList = response.data.map((item) => {
				return Object.assign({isSelected: false}, item)
			})

			this.setState({
				doctorList: isRefresh ? mergerList : this.state.doctorList.concat(mergerList),
				isDoctorListTotal: mergerList.length < this.doctorPageSize,
				isDoctorListRefreshing: false
			})

			setTimeout(() => {
				this.isHasFinishDoctorsRefresh = true
			}, 200)
		}).catch((error) => {
			if (isRefresh) {
				this.setState({isDoctorListRefreshing: false})
			}
		})
	}

	refreshPostList() {
		if (this.state.isEdit) {
			return
		}
		this.postPage = 1
		this.getPostList(true)
	}

	loadMorePostList() {
		if (this.state.isEdit) {
			return
		}
		this.postPage = this.postPage + 1
		this.getPostList(false)
	}

	getPostList(isRefresh) {
		let param = {
			UserID: this.getUserID(),
			Type: CollectionType.post,
			Page: this.postPage,
			PageSize: this.postPageSize,
		}

		if (isRefresh) {
			this.isHasFinishPostsRefresh = false
			this.setState({isPostListRefreshing: true})
		}

		HTTP.post(API_User.getMyFavorite, param).then((response) => {
			let mergerList = response.data.map((item) => {
				return Object.assign({isSelected: false}, item)
			})
			this.setState({
				postList: isRefresh ? mergerList : this.state.postList.concat(mergerList),
				isPostListTotal: mergerList.length < this.postPageSize,
				isPostListRefreshing: false
			})

			setTimeout(() => {
				this.isHasFinishPostsRefresh = true
			}, 200)
		}).catch((error) => {
			if (isRefresh) {
				this.setState({isPostListRefreshing: false})
			}
		})
	}


	showQuestionAlert() {
		Alert.alert(
			'Information is incorrect ?',
			'Thank you very much for the feedback you can provide us and other users.',
			[
				{text: 'Cancel', onPress: () => {}, style: 'cancel'},
				{text: 'Feedback', onPress: () => {

					}},
			],
			{ cancelable: false }
		)
	}

	pushToDoctorInfoPage(item) {
		if (this.state.isEdit) {
			return
		}

		Navigation.push(this.props.componentId, {
			component: {
				name: 'DoctorInfoViewController',
				passProps: {
					info: item,
				},
				options: BaseNavigatorOptions()
			}
		})
	}

	pushToPostDetailPage(item) {
		if (this.state.isEdit) {
			return
		}

		Navigation.push(this.props.componentId, {
			component: {
				name: 'PostDetailViewController',
				passProps: {
					postInfo: item,
				},
				options: BaseNavigatorOptions('Post Detail')
			}
		})
	}

	renderDoctorItem(item) {
		return(
			<DoctorInfoItem
				id = {item.Npi}
				info = {item}
				isEdit={this.state.isEdit}
				isSelected = {item.isSelected}
				didSelectedItem = {() => {
					this.pushToDoctorInfoPage(item)
				}}
				questionAction = {() => {
					this.showQuestionAlert()
				}}
				clickSelectedButton={() => {
					let doctorList = this.state.doctorList
					let index = doctorList.findIndex((data) => {
						return data.Npi === item.Npi
					})

					doctorList[index].isSelected = !doctorList[index].isSelected
					this.setState({doctorList: doctorList})
				}}
			/>
		)
	}

	renderPostItem(item) {
		return(
			<PostItem
				id={item.PostID}
				postInfo = {item}
				isEdit={this.state.isEdit}
				isSelected = {item.isSelected}
				didSelectedItem={() => {
					this.pushToPostDetailPage(item)
				}}
				clickSelectedButton={() => {
					let postList = this.state.postList
					let index = postList.findIndex((data) => {
						return data.PostID === item.PostID
					})

					postList[index].isSelected = !postList[index].isSelected
					this.setState({doctorList: postList})
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
		if (this.state.selectedType === CollectionType.doctor) {
			return(
				<View style={{paddingBottom: 0}}>
					<LoadingFooter isTotal={this.state.doctorList.length && this.state.isDoctorListTotal}
								   isLoading={this.state.doctorList.length}
					/>
				</View>
			)
		}else {
			return(
				<View style={{paddingBottom: 0}}>
					<LoadingFooter isTotal={this.state.postList.length && this.state.isPostListTotal}
								   isLoading={this.state.postList.length}
					/>
				</View>
			)
		}
	}

	renderDoctorList() {
		return(
			<FlatList
				style={{flex: 1, width: ScreenDimensions.width}}
				renderItem={({item}) => this.renderDoctorItem(item)}
				data={this.state.doctorList}
				keyExtractor={(item, index) => {
					return 'key' + item.key + index
				}}
				ListHeaderComponent={() => {
					return this.renderHeader()
				}}
				ListEmptyComponent={() => {
					return(
						<ListEmptyView />
					)
				}}
				refreshControl={
					<RefreshControl
						refreshing={this.state.isDoctorListRefreshing}
						enabled = {true}
						onRefresh={() => {
							this.refreshDoctorList()
						}
						}
					/>
				}
				onEndReachedThreshold = {0.1}
				onEndReached = {() => {
					if (this.isHasFinishDoctorsRefresh) {
						this.loadMoreDoctorList()
					}
				}}

				ListFooterComponent={() => {
					return this.renderListFooter()
				}}

			/>

		)
	}

	renderPostList() {
		return(
			<FlatList
				style={{flex: 1, width: ScreenDimensions.width}}
				renderItem={({item}) => this.renderPostItem(item)}
				data={this.state.postList}
				keyExtractor={(item, index) => {
					return 'key' + item.key + index
				}}

				ListHeaderComponent={() => {
					return this.renderHeader()
				}}

				refreshControl={
					<RefreshControl
						refreshing={this.state.isPostListRefreshing}
						enabled = {true}
						onRefresh={() => {
							this.refreshPostList()
						}
						}
					/>
				}
				onEndReachedThreshold = {0.1}
				onEndReached = {() => {
					if (this.isHasFinishPostsRefresh) {
						this.loadMorePostList()
					}
				}}

				ListFooterComponent={() => {
					return this.renderListFooter()
				}}

			/>

		)
	}

	onAnimationEnd(e){
		const offSetX = e.nativeEvent.contentOffset.x
		const currentPage = offSetX / (ScreenDimensions.width)

		this.updateSegmentTab((parseInt(currentPage) === 0) ? CollectionType.doctor : CollectionType.post)
		this.setState({selectedType: (parseInt(currentPage) === 0) ? CollectionType.doctor : CollectionType.post})
	}

	finishEdit() {
		this.setState({isEdit: false})
		this.sendUpdateSegmentTabEnableStatusNoti(true)

		if (this.state.selectedType === CollectionType.doctor) {
			let data = this.state.doctorList.map((item) => {
				item.isSelected = false

				return item
			})

			this.setState({doctorList: data})
		}else {
			let data = this.state.postList.map((item) => {
				item.isSelected = false

				return item
			})

			this.setState({postList: data})
		}
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
		if (this.state.selectedType === CollectionType.doctor) {
			let filterList = this.state.doctorList.filter((item) => {
				if (item.isSelected) {
					deleteIdList.push(item.Npi)
				}
				return !item.isSelected
			})

			if (deleteIdList.length) {
				this.setState({doctorList: filterList})
				this.finishEdit()
				this.deleteSelectFromNet(deleteIdList)
			}else {
				Toast.showWithGravity('Please select at least one!', Toast.SHORT, Toast.CENTER)
			}
		}else {
			let filterList = this.state.postList.filter((item) => {
				if (item.isSelected) {
					deleteIdList.push(item.PostID)
				}
				return !item.isSelected
			})

			if (deleteIdList.length) {
				this.setState({postList: filterList})
				this.finishEdit()
				this.deleteSelectFromNet(deleteIdList)
			}else {
				Toast.showWithGravity('Please select at least one!', Toast.SHORT, Toast.CENTER)
			}
		}
	}

	deleteSelectFromNet(ids) {
		let param = {
			UserID: this.getUserID(),
			ObjectIDs: ids
		}

		this.showSpinner()
		HTTP.post(API_User.deleteMyFavorite, param).then((response) => {
			this.hideSpinner()
			if (!response.code) {
				Toast.showWithGravity('Delete success!', Toast.SHORT, Toast.CENTER)
			}else {
				Toast.showWithGravity('Delete failed!', Toast.SHORT, Toast.CENTER)
			}
		}).catch(() => {
			this.hideSpinner()
			Toast.showWithGravity('Delete failed!', Toast.SHORT, Toast.CENTER)
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

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.listBg}}>
				<ScrollView scrollEnabled={!this.state.isEdit} showsHorizontalScrollIndicator={false} ref = {(o) => {
					this._scrollView = o
				}} onMomentumScrollEnd={(e) => {
					this.onAnimationEnd(e)
				}} style={{
					flex: 1,
					backgroundColor: Colors.listBg
				}} horizontal={true} pagingEnabled={true}>
					{this.renderDoctorList()}
					{this.renderPostList()}
				</ScrollView>

				{this.renderButtonActonBar()}
				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
