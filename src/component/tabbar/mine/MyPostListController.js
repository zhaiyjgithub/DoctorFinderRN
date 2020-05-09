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
import {Gender, PLATFORM} from '../../utils/CustomEnums';
import PostItem from './../post/view/PostItem';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import {HTTP} from '../../utils/HttpTools';
import {API_Post} from '../../utils/API';
import LoadingFooter from '../../BaseComponents/LoadingFooter';

export default class MyPostListController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			isSpinnerVisible: false,
			isTotal: false,
			isRefreshing: false
		}

		this.page = 1
		this.pageSize = 30
		this.onEndReachedCalledDuringMomentumInTrend = false
	}

	componentDidMount() {
		this.refresh()
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

	renderItem(item) {
		return(
			<PostItem
				id={item.PostID}
				postInfo = {item}
				didSelectedItem={() => {
					this.pushToPostDetailPage(item)
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

				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
