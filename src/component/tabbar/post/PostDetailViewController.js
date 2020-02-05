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
	AppState, TouchableOpacity, Image, Text, RefreshControl, SectionList, Keyboard, TextInput,
} from 'react-native';
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {Gender, PLATFORM} from '../../utils/CustomEnums';
import PostItem from './view/PostItem';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import {HTTP} from '../../utils/HttpTools';
import {API_Answer, API_Post, BaseUrl} from '../../utils/API';
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import LoadingFooter from '../../BaseComponents/LoadingFooter';
import Toast from 'react-native-simple-toast'
import AnswerItem from './view/AnswerItem';
import {ShareTool} from '../../utils/ShareTool';

export default class PostDetailViewController extends Component{
	static defaultProps = {
		postInfo: null
	}

	static options(passProps) {
		return {
			topBar: {
				rightButtons: [
					{
						id: 'share',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						icon: require('../../../resource/image/home/share.png'),
					},
					{
						id: 'star',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						icon: require('../../../resource/image/home/star.png'),
					},
				]
			},
			bottomTabs: {
				visible: false
			}
		};
	}

	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			postInfo: props.postInfo,
			isSpinnerVisible: false,
			newAnswer: '',
			isRefreshing: false,
			isTotal: false
		}

		this.page = 1
		this.pageSize = 30
		this.addAnswerViewBottom = new Animated.Value(0)
		this.isCollected = false
		this.addKeyBoardListener()
		this.navigationEventListener = Navigation.events().bindComponent(this);
	}

	componentDidMount() {
		this.refresh()
	}

	componentWillUnmount() {
		this.removeKeyBoardListener()
		this.navigationEventListener && this.navigationEventListener.remove();
	}

	addKeyBoardListener() {
		if (PLATFORM.isIOS) {//keyboardDidShow
			this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
			this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
		}else {
			this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this));
			this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this));
		}
	}

	removeKeyBoardListener() {
		if (this.keyboardWillShowSub && this.keyboardWillHideSub) {
			this.keyboardWillShowSub.remove();
			this.keyboardWillHideSub.remove();
		}
	}

	keyboardWillShow(event) {
		let diff = event.endCoordinates.height - (PLATFORM.isIPhoneX ? 34 : 0);
		Animated.timing(this.addAnswerViewBottom,{duration: event.duration,toValue:diff}).start()
	}

	keyboardWillHide(event) {
		Animated.timing(this.addAnswerViewBottom,{duration: PLATFORM.isIOS ? event.duration : 300,toValue: 0}).start()
	}

	navigationButtonPressed({ buttonId }) {
		if (buttonId === 'share') {
			const shareOptions = {
				title: 'Share file',
				url: 'http://www.google.com',
				failOnCancel: false,
				message: 'Your description...'
			}

			ShareTool(shareOptions)
		}else if (buttonId === 'star') {
			// if (this.isCollected) {
			// 	this.cancelCollection()
			// }else {
			// 	this.addCollection()
			// }
		}
	}

	showSpinner() {
		this.setState({isSpinnerVisible: true})
	}

	hideSpinner() {
		this.setState({isSpinnerVisible: false})
	}

	refresh() {
		this.page = 1
		this.getAnswerList(true)
	}

	loadMore() {
		this.page = this.page + 1
		this.getAnswerList(false)
	}

	getAnswerList(isRefresh) {
		if (!this.props.postInfo) {
			return;
		}

		let param = {
			UserID: 1,
			PostID: this.props.postInfo.PostID,
			Page: this.page,
			PageSize: this.pageSize
		}

		if (isRefresh) {
			this.setState({isRefreshing: true})
		}

		HTTP.post(API_Answer.getAnswerListByPage, param).then((response) => {
			if (isRefresh) {
				this.setState({
					isRefreshing: false,
					dataSource: response.data,
					isTotal: response.data < this.pageSize
				})
			}else {
				this.setState({
					dataSource: this.state.dataSource.concat(response.data),
					isTotal: response.data < this.pageSize
				})
			}
		}).catch(() => {
			if (isRefresh) {
				this.setState({isRefreshing: false})
			}
		})
	}

	createNewAnswer() {
		if (!this.state.newAnswer.length) {
			Toast.showWithGravity("Your comment can`t be empty!", Toast.LONG, Toast.CENTER)
			return
		}

		let param = {
			PostID: this.props.postInfo.PostID,
			UserID: 1,
			Description: this.state.newAnswer
		}

		Keyboard.dismiss()
		this.showSpinner()
		HTTP.post(API_Answer.addAnswer, param).then((response) => {
			this.hideSpinner()

			this._answerTextInput.clear()
			this.setState({newAnswer: ""})


			if (!response.code) {
				Toast.showWithGravity("Add successfully", Toast.LONG, Toast.CENTER)
			}else {
				Toast.showWithGravity("Add failed", Toast.LONG, Toast.CENTER)
			}
		}).catch((error) => {
			this.hideSpinner()
		})
	}

	renderListFooter() {
		return(
			<View style={{width: '100%', paddingBottom: 44 + 10 + (PLATFORM.isIPhoneX ? 34 : 0)}}>
				<LoadingFooter isTotal={this.state.isTotal}
							   isLoading={this.state.dataSource.length}
				/>
			</View>
		)
	}

	renderAttachments(postInfo) {
		let size = (ScreenDimensions.width - 32 - 10)/2.0
		let imgUrl = BaseUrl + API_Post.imgPost +'?name='
		return(
			<View style={{width: ScreenDimensions.width, flexDirection: 'row', alignItems: 'center', marginTop: 8,
				paddingHorizontal: 16,
			}}>
				{postInfo.URLs.map((item ,index) => {
					return(
						<View key={index} style={{width: size, height: size, backgroundColor: Colors.systemGray,
							justifyContent: 'center', alignItems: 'center', marginRight: 10
						}}>
							<TouchableOpacity onPress={() => {
								//
							}} key={index} style={{width: size, height: size, backgroundColor: Colors.systemGray,
								justifyContent: 'center', alignItems: 'center',
							}}>
								<Image resizeMode={'cover'} style={{width: size, height: size}} source={{uri: imgUrl + item}}/>
							</TouchableOpacity>
						</View>
					)
				})}
			</View>
		)
	}

	renderAddAnswerView() {
		return(
			<Animated.View style={{
				backgroundColor: Colors.white,
				paddingVertical: 5,
				position: 'absolute',
				width: '100%',
				left: 0,
				height: 44 + 10 + (PLATFORM.isIPhoneX ? 34 : 0),
				bottom: this.addAnswerViewBottom,

			}}>
				<View style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}>
					<TextInput
						// returnKeyType={'return'}
						// clearButtonMode={'while-editing'}
						ref = {(o) => {
							this._answerTextInput = o
						}}
						numberOfLines={1}
						multiline={true}
						underlineColorAndroid={'transparent'}
						placeholder = {'Write your comment...'}
						placeholderTextColor={Colors.lightGray}
						onChangeText={(text) => {
							this.setState({newAnswer: text.trim() + ''})
						}}
						defaultValue ={this.state.newAnswer}
						style={{
							width: ScreenDimensions.width - 32 - 50 - 8,
							height: 44,
							backgroundColor: Colors.searchBar,
							marginLeft: 16,
							borderRadius: 6,
							paddingLeft: 8,
							fontSize: 16,
							color: Colors.black
						}} />

					<TouchableOpacity onPress={() => {
						this.createNewAnswer()
					}} style={{width: 50, height: 30, borderRadius: 4, backgroundColor: Colors.theme,
						justifyContent: 'center', alignItems: 'center', marginRight: 16,
					}}>
						<Text style={{fontSize: 14, color: Colors.white,}}>{'Send'}</Text>
					</TouchableOpacity>

				</View>
				<View style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1, backgroundColor: Colors.lineColor}}/>
			</Animated.View>
		)
	}

	renderHeader() {
		let postInfo = this.props.postInfo
		if (!postInfo) {
			return <View/>
		}
		return(
			<View style={{backgroundColor: Colors.white}}>
				<View style={{flexDirection: 'row', alignItems: 'center',
					justifyContent: 'space-between', width: '100%',marginTop: 20,
				}}>
					<View style={{flexDirection: 'row',
						 backgroundColor: Colors.white
					}}>
						<Image source={require("../../../resource/image/base/avatar.jpg")} style={{width: 50, height: 50, borderRadius: 6, marginLeft: 16,}}/>
						<View style={{ marginLeft: 8, justifyContent: 'space-between'}}>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Text style={{fontSize: 16, color: Colors.black, maxWidth: 120, textAlign: 'left'}}>{postInfo.UserName}</Text>
								<Text style={{marginLeft: 8, backgroundColor: Colors.systemGray, borderRadius: 10,
									paddingHorizontal: 5, paddingVertical: 3,
									color: Colors.green, fontWeight: 'bold',
								}}>{'tag'}</Text>
							</View>
							<Text style={{fontSize: 14, color: Colors.lightGray}}>{'2 day ago'}</Text>
						</View>
					</View>

					<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginRight: 16, minWidth: 30,}}>
						<Image source={require('../../../resource/image/post/like.png')} style={{width: 14, height: 14,}}/>
						<Text style={{fontSize: 14, color: Colors.lightGray, marginLeft: 3,}}>{postInfo.Likes}</Text>
					</TouchableOpacity>
				</View>


				<Text style={{fontSize: 20, color: Colors.black, fontWeight: 'bold',
					paddingHorizontal:16, marginTop: 8
				}}>{postInfo.Title}</Text>

				<Text style={{fontSize: 16, color: Colors.black,
					paddingHorizontal:16, marginTop: 8, marginBottom: 16
				}}>{postInfo.Description}</Text>

				{this.renderAttachments(postInfo)}

				{this.renderSectionHeader()}
			</View>
		)
	}

	renderSectionHeader(){
		return(
			<View style={{width: '100%', height: 30, flexDirection: 'row', alignItems: 'center',
				backgroundColor: Colors.systemGray, marginTop: 20,
			}}>
				<Text style={{fontSize: 14, color: Colors.black, marginLeft: 16,}}>{'32 replies'}</Text>
			</View>
		)
	}

	likeAction(likeItem) {
		this.addLikeToAnswer(likeItem.ID, () => {
			let list = this.state.dataSource.map((item, index) => {
				if (item.ID === likeItem.ID) {
					item.Likes = item.Likes + 1
				}

				return item
			})

			this.setState({dataSource: list})
		})
	}

	addLikeToAnswer(answerID, cb) {
		let param = {
			AnswerID: answerID,
			UserID: 1,
		}

		HTTP.post(API_Answer.addAnswerLikes, param).then((response) => {
			if (response.code) {
				Toast.showWithGravity("Add like failed", Toast.LONG, Toast.CENTER)
			}else {
				cb && cb()
			}
		}).catch((error) => {
			Toast.showWithGravity("Add like failed", Toast.LONG, Toast.CENTER)
		})
	}

	renderItem(item) {
		if (item.type === 0) {
			return this.renderHeader()
		}else {
			return <AnswerItem
				id= {item.ID}
				likes={item.Likes}
				answerInfo= {item}
				clickLike ={() => {
					this.likeAction(item)
				}}
				clickReply ={() => {
					this.setState({newAnswer: '@' + item.UserName + ' '})
					this._answerTextInput && this._answerTextInput.focus()
				}}
			/>
		}
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<SectionList
					style={{flex: 1}}
					renderItem={({item}) => this.renderItem(item)}
					sections={[{data: [{type: 0}]}, {data: this.state.dataSource,}]}
					keyExtractor={(item, index) => {
						return 'key' + index
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

				{this.renderAddAnswerView()}
				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
