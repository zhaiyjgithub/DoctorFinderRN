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
import PostItem from '../post/view/PostItem';
import Swiper from "react-native-swiper";

export default class MyFavorViewController extends Component{
	static options(passProps) {
		return {
			topBar: {
				title: {
					text: 'Post'
				},
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
		}

		this.doctorPage = 1
		this.doctorPageSize = 30
		this.postPage = 1
		this.postPageSize = 30
		this.isHasFinishDoctorsRefresh = false
		this.isHasFinishPostsRefresh = false
		this.setTitleView()
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
		this.refreshDoctorList()
		this.refreshPostList()
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
		this.doctorPage = 1
		this.getDoctorList(true)
	}

	loadMoreDoctorList() {
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
			this.setState({
				doctorList: isRefresh ? response.data : this.state.doctorList.concat(response.data),
				isDoctorListTotal: response.data.length < this.doctorPageSize,
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
		this.postPage = 1
		this.getPostList(true)
	}

	loadMorePostList() {
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
			this.setState({
				postList: isRefresh ? response.data : this.state.postList.concat(response.data),
				isPostListTotal: response.data.length < this.postPageSize,
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
			'Information is incorrect?',
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

	pushToNewPostPage() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'NewPostViewController',
				passProps: {

				},
				options: BaseNavigatorOptions('New Post')
			}
		})
	}

	renderItem(item) {
		if (this.state.selectedType === CollectionType.doctor) {
			return(
				<DoctorInfoItem
					id = {item.Npi}
					info = {item}
					didSelectedItem = {() => {
						this.pushToDoctorInfoPage(item)
					}}

					questionAction = {() => {
						this.showQuestionAlert()
					}}
				/>
			)
		}else {
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
	}

	renderHeader() {
		return(
			<View style={{width: '100%', height: 16, backgroundColor: Colors.clear}}/>
		)
	}

	renderListFooter() {
		if (this.state.selectedType === CollectionType.doctor) {
			return(
				<View style={{paddingBottom: TabBar.height}}>
					<LoadingFooter isDoctorListTotal={this.state.isDoctorListTotal}
								   isLoading={this.state.doctorList.length}
					/>
				</View>
			)
		}else {
			return(
				<View style={{paddingBottom: TabBar.height}}>
					<LoadingFooter isDoctorListTotal={this.state.isPostListTotal}
								   isLoading={this.state.postList.length}
					/>
				</View>
			)
		}
	}

	renderDoctorList() {
		return(
			<FlatList
				style={{flex: 1}}
				renderItem={({item}) => this.renderItem(item)}
				data={this.state.doctorList}
				keyExtractor={(item, index) => {
					return 'key' + item.key + index
				}}

				ListHeaderComponent={() => {
					return this.renderHeader()
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
				style={{flex: 1}}
				renderItem={({item}) => this.renderItem(item)}
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

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<ScrollView scrollEnabled= {(PLATFORM.isIOS)} showsHorizontalScrollIndicator={false} ref = {(o) => {
					this._scrollView = o
				}} onMomentumScrollEnd={(e) => {
					this.onAnimationEnd(e)
				}} style={{
					flex: 1,
					backgroundColor: Colors.systemGray
				}} horizontal={true} pagingEnabled={true}>
					{this.renderDoctorList()}
					{this.renderPostList()}
				</ScrollView>
				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
