import React, {Component} from 'react';
import {FlatList, Image, RefreshControl, TouchableOpacity, View, Alert, SectionList} from 'react-native';
import {Colors} from '../../utils/Styles';
import {TabBar} from '../../utils/Dimensions';
import PostItem from './view/PostItem';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import {HTTP} from '../../utils/HttpTools';
import {API_Post} from '../../utils/API';
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import LoadingFooter from '../../BaseComponents/LoadingFooter';
import RouterEntry from '../../router/RouterEntry';
import ListEmptyView from '../../BaseComponents/ListEmptyView';
import SearchBar from '../home/view/SearchBar';
import {SearchBarType} from '../../utils/CustomEnums';

export default class PostViewController extends Component{
	static options(passProps) {
		return {
			topBar: {
				title: {
					text: 'Post'
				},
			}
		};
	}

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
		this.isHasShowTopBarSearchBar = false
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

	showNotSignUpAlert() {
		Alert.alert(
			'Not Sign In',
			'Oh... You are not sign in now. ',
			[
				{text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
				{text: 'Sign In', onPress: () => {
						RouterEntry.modalSignUp()
					}},
			],
			{ cancelable: false }
		)
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
					refreshPostListCB:() => {
						this.refresh()
					}
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
		return this.renderSearchBar()
	}

	renderSearchBar() {
		return (
			<SearchBar
				type = {SearchBarType.normal}
				placeholder = {'Find something...'}
				onSubmitEditing={(searchContent) => {
					// this.goToSearch(searchContent, '')
				}}
			/>
		)
	}

	setTopBarView(isShow) {
		if (isShow && isShow !== this.isHasShowTopBarSearchBar) {
			this.isHasShowTopBarSearchBar = true
			Navigation.mergeOptions(this.props.componentId, {
				topBar: {
					title: {
						component: {
							name: 'SearchBar',
							passProps:{
								type: SearchBarType.max,
								placeholder: 'Find something...',
								onSubmitEditing: (searchContent) => {
									// this.goToSearch(searchContent, '')
								}
							}
						}
					}
				}
			});
		} else {
			if (isShow === false && isShow !== this.isHasShowTopBarSearchBar) {
				this.isHasShowTopBarSearchBar = false
				Navigation.mergeOptions(this.props.componentId, {
					topBar: {
						title: {
							component: {
								name: 'HomePageTitleView',
								passProps: {
									title: 'Post'
								}
							}
						}
					}
				});
			}
		}
	}

	renderFabButton() {
		return(
			<TouchableOpacity onPress={() => {
				if (!UserInfo.Token) {
					this.showNotSignUpAlert()
					return
				}
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
			<View style={{paddingBottom: TabBar.height}}>
				<LoadingFooter isTotal={this.state.isTotal}
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
					ListEmptyComponent={() => {
						return(
							<ListEmptyView />
						)
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
					onScroll={(event) => {
						const y = event.nativeEvent.contentOffset.y

						if (y > 46) {
							this.setTopBarView(true)
						}else {
							this.setTopBarView(false)
						}

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
