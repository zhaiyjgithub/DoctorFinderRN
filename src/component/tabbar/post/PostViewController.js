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
import {NaviBarHeight, ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {Gender, PLATFORM} from '../../utils/CustomEnums';
import PostItem from './view/PostItem';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import {HTTP} from '../../utils/HttpTools';
import {API_Post} from '../../utils/API';
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import LoadingFooter from '../../BaseComponents/LoadingFooter';

export default class PostViewController extends Component{
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
	}

	componentDidMount() {
		this.refresh()
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
			Type: 0,
			Page: this.page,
			PageSize: this.pageSize,
		}

		if (isRefresh) {
			this.setState({isRefreshing: true})
		}

		HTTP.post(API_Post.getPostByPage, param).then((response) => {
			if (isRefresh) {
				this.setState({dataSource: response.data,
					isTotal: response.data.length < this.pageSize,
					isRefreshing: false
				})
			}else {
				this.setState({dataSource: this.state.dataSource.concat(response.data),
					isTotal: response.data.length < this.pageSize
				})
			}
		}).catch((error) => {

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

	renderFabButton() {
		return(
			<TouchableOpacity onPress={() => {
				this.pushToNewPostPage()
			}} style={{position: 'absolute', right: 16, bottom: TabBar.height + 32, backgroundColor: Colors.theme,
				borderRadius: 25, width: 50, height: 50, justifyContent: 'center', alignItems: 'center',
				shadowRadius: 8,
				shadowColor: Colors.theme,
				shadowOpacity: 0.5,
				shadowOffset: {width: 0, height: 0},
				elevation: 2,
			}}>
				<Image source={require('../../../resource/image/post/add.png')} style={{width: 25, height: 25, }}/>
			</TouchableOpacity>
		)
	}

	renderListFooter() {
		return(
			<LoadingFooter isTotal={this.state.isTotal}
				isLoading={this.state.dataSource.length}
			/>
		)
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
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
					onEndReachedThreshold = {1}
					onEndReached = {() => {
						this.loadMore()
					}}

					ListFooterComponent={() => {
						return this.renderListFooter()
					}}

				/>

				{this.renderFabButton()}

				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
