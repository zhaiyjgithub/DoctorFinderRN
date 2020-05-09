import React, {Component} from 'react';
import {
	Alert,
	Animated,
	Image,
	Keyboard,
	RefreshControl,
	ScrollView,
	SectionList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import {Colors} from '../../utils/Styles';
import {ScreenDimensions} from '../../utils/Dimensions';
import {CollectionType, PLATFORM} from '../../utils/CustomEnums';
import {Navigation} from 'react-native-navigation';
import {HTTP} from '../../utils/HttpTools';
import {API_Answer, API_Doctor, API_Post, API_User, BaseUrl} from '../../utils/API';
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import LoadingFooter from '../../BaseComponents/LoadingFooter';
import Toast from 'react-native-simple-toast';
import AnswerItem from './view/AnswerItem';
import {ShareTool} from '../../utils/ShareTool';
import {CalcTimeStamp} from '../../utils/Utils';
import RouterEntry from '../../router/RouterEntry';

export default class PostDetailViewController extends Component{
	static defaultProps = {
		postInfo: null,
		isAppendPost: false
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
			isTotal: false,
			postLikes: props.postInfo ? props.postInfo.Likes : 0,
			totalAnswerCount: props.postInfo ? props.postInfo.AnswerCount : 0,
			appendText: '',
			appendingList: []
		}

		this.page = 1
		this.pageSize = 30
		this.addAnswerViewBottom = new Animated.Value(0)
		this.isCollected = false
		this.addKeyBoardListener()
		this.navigationEventListener = Navigation.events().bindComponent(this)
	}

	componentDidMount() {
		if (!this.props.isAppendPost) {
			this.refresh()
		}
		this.getMyAppendList()
		this.getCollectionStatus()
	}

	componentWillUnmount() {
		this.removeKeyBoardListener()
		this.navigationEventListener && this.navigationEventListener.remove();
	}

	getUserID() {
		return UserInfo.UserID
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
			if (!UserInfo.Token) {
				this.showNotSignUpAlert()
				return
			}

			if (this.isCollected) {
				this.cancelCollection()
			}else {
				this.addCollection()
			}
		}
	}

	getCollectionStatus() {
		let param = {
			ObjectID: this.props.postInfo.PostID,
			ObjectType: CollectionType.post,
			UserID: this.getUserID(),
		}

		HTTP.post(API_Doctor.getCollectionStatus, param).then((response) => {
			this.isCollected = response.data
			this.setTopBarButtons(this.isCollected)
		}).catch(() => {

		})
	}

	addCollection() {
		let param = {
			ObjectID: this.props.postInfo.PostID,
			ObjectType: CollectionType.post,
			UserID: this.getUserID(),
		}

		HTTP.post(API_User.addFavorite, param).then((response) => {
			if (response.code === 0) {
				this.isCollected = true
				this.setTopBarButtons(this.isCollected)
			}else {

			}
		}).catch(() => {

		})
	}

	cancelCollection() {
		let param = {
			ObjectID: this.props.postInfo.PostID,
			ObjectType: CollectionType.post,
			UserID: this.getUserID(),
		}

		HTTP.post(API_Doctor.deleteCollection, param).then((response) => {
			console.log(response)
			if (response.code === 0) {
				this.isCollected = false
				this.setTopBarButtons(this.isCollected)
			}
		}).catch(() => {

		})
	}

	setTopBarButtons(isCollected) {
		Navigation.mergeOptions(this.props.componentId, {
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
						icon: isCollected ?   require('../../../resource/image/home/star_selected.png') : require('../../../resource/image/home/star.png'),
					},
				]
			}
		})
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
			UserID: this.getUserID(),
			PostID: this.props.postInfo.PostID,
			Page: this.page,
			PageSize: this.pageSize
		}

		if (isRefresh) {
			this.setState({isRefreshing: true})
		}

		HTTP.post(API_Answer.getAnswerListByPage, param).then((response) => {
			if (response.code) {
				if (isRefresh) {
					this.setState({isRefreshing: false})
				}
				console.log(param)
				return
			}

			if (isRefresh) {
				this.setState({
					isRefreshing: false,
					dataSource: response.data,
					isTotal: response.data < this.pageSize
				})
			}else {
				this.setState({
					dataSource: this.state.dataSource.concat(response.data),
					isTotal: response.data < this.pageSize,
				}, () => {
					if (this.state.isTotal) {
						this.page = parseInt(this.state.dataSource.length/this.pageSize + 1)
					}
				})
			}
		}).catch(() => {
			if (isRefresh) {
				this.setState({isRefreshing: false})
			}
		})
	}

	getMyAppendList() {
		let param = {
			PostID: this.props.postInfo.PostID
		}

		this.showSpinner()
		HTTP.post(API_Post.getAppendByPostID, param).then((response) => {
			this.hideSpinner()
			if (!response.code) {
				this.setState({appendingList: response.data})
			}
		}).catch(() => {
			this.hideSpinner()
		})
	}

	createNewAnswer() {
		if (!this.state.newAnswer.length) {
			Toast.showWithGravity("Your comment can`t be empty!", Toast.LONG, Toast.CENTER)
			return
		}

		let param = {
			PostID: this.props.postInfo.PostID,
			UserID: this.getUserID(),
			Description: this.state.newAnswer
		}

		Keyboard.dismiss()
		this.showSpinner()
		HTTP.post(API_Answer.addAnswer, param).then((response) => {
			this.hideSpinner()

			this._answerTextInput.clear()
			this.setState({newAnswer: ""})

			if (!response.code) {
				this.setState({totalAnswerCount: this.state.totalAnswerCount + 1})
				Toast.showWithGravity("Add success", Toast.LONG, Toast.CENTER)

				this.refresh()
			}else {
				Toast.showWithGravity("Add failed", Toast.LONG, Toast.CENTER)
			}
		}).catch((error) => {
			this.hideSpinner()
		})
	}

	addAppendingToPost() {
		if (!this.state.appendText.length) {
			Toast.showWithGravity("Your appending text can`t be empty!", Toast.LONG, Toast.CENTER)
			return
		}

		let param = {
			PostID: this.props.postInfo.PostID,
			Append: this.state.appendText,
		}

		this.showSpinner()
		HTTP.post(API_Post.addAppendToPost, param).then((response) => {
			this.hideSpinner()
			if (!response.code) {
				Keyboard.dismiss()
				Toast.showWithGravity("Append success!", Toast.LONG, Toast.CENTER)
				this.getMyAppendList()
			}else {
				Toast.showWithGravity("Append failed!", Toast.LONG, Toast.CENTER)
			}
		}).catch(() => {
			this.hideSpinner()
			Toast.showWithGravity("Request failed!", Toast.LONG, Toast.CENTER)
		})
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

	renderListFooter() {
		return(
			<View style={{width: '100%', paddingBottom: 44 + 10 + (PLATFORM.isIPhoneX ? 34 : 0)}}>
				{!this.props.isAppendPost ? (<LoadingFooter isTotal={this.state.isTotal}
														   isLoading={this.state.dataSource.length}
				/>) : null}
			</View>
		)
	}

	renderAttachments(postInfo) {
		if (!postInfo.URLs.length) {
			return null
		}

		let size = (ScreenDimensions.width - 32 - 10)/2.0
		let imgUrl = BaseUrl + API_Post.imgPost +'?name='
		return(
			<View style={{width: ScreenDimensions.width, flexDirection: 'row', alignItems: 'center', marginTop: 8,
				paddingHorizontal: 16,
			}}>
				{postInfo.URLs.map((item ,index) => {
					return(
						<View key={index} style={{width: size, height: size, backgroundColor: Colors.listBg,
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
		let placeHolder = ''
		let sendButtonTile = ''
		if (!this.props.isAppendPost) {
			placeHolder = 'Write your comment...'
			sendButtonTile = 'Send'
		}else {
			placeHolder = 'Write your appending text...'
			sendButtonTile = 'Append'
		}

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
						placeholder = {placeHolder}
						placeholderTextColor={Colors.lightGray}
						onChangeText={(text) => {
							if (!this.props.isAppendPost) {
								this.setState({newAnswer: text.trim() + ''})
							}else {
								this.setState({appendText: text.trim() + ''})
							}
						}}
						defaultValue ={this.state.newAnswer}
						style={{
							width: ScreenDimensions.width - 32 - 60 - 8,
							height: 44,
							backgroundColor: Colors.searchBar,
							marginLeft: 16,
							borderRadius: 6,
							paddingLeft: 8,
							fontSize: 16,
							color: Colors.black
						}} />

					<TouchableOpacity onPress={() => {
						if (!UserInfo.Token) {
							this.showNotSignUpAlert()
							return
						}

						if (!this.props.isAppendPost) {
							this.createNewAnswer()
						}else {
							this.addAppendingToPost()
						}
					}} style={{width: 60, height: 30, borderRadius: 4, backgroundColor: Colors.theme,
						justifyContent: 'center', alignItems: 'center', marginRight: 16,
					}}>
						<Text style={{fontSize: 14, color: Colors.white,}}>{sendButtonTile}</Text>
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

		let timeStamp = CalcTimeStamp(postInfo.PostDate)
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
							<Text style={{fontSize: 14, color: Colors.lightGray}}>{timeStamp}</Text>
						</View>
					</View>

					<TouchableOpacity onPress={() => {
						this.addLikeToPost()
					}} style={{flexDirection: 'row', alignItems: 'center', marginRight: 16, minWidth: 30,}}>
						<Image source={require('../../../resource/image/post/like.png')} style={{width: 14, height: 14,}}/>
						<Text style={{fontSize: 14, color: Colors.lightGray, marginLeft: 3,}}>{this.state.postLikes}</Text>
					</TouchableOpacity>
				</View>


				<Text style={{fontSize: 20, color: Colors.black, fontWeight: 'bold',
					paddingHorizontal:16, marginTop: 8
				}}>{postInfo.Title}</Text>

				<Text style={{fontSize: 16, color: Colors.black,
					paddingHorizontal:16, marginTop: 8, marginBottom: 16
				}}>{postInfo.Description}</Text>

				{this.renderAttachments(postInfo)}

				{this.renderAppendingText()}
				{this.renderSectionHeader()}
			</View>
		)
	}

	renderAppendingText() {
		if (!this.state.appendingList.length) {
			return null
		}
		return(
			<View style={{
				marginHorizontal:16, marginVertical: 8
			}}>
				<View style={{width: ScreenDimensions.width - 32, height: 3, backgroundColor: Colors.lineColor,
					marginVertical: 16}}/>

				{this.state.appendingList.map((item) => {
					return(
						<View style={{paddingBottom: 8}}>
							<Text style={{fontSize: 14, backgroundColor: '#FDBD4E', color: Colors.black,
								paddingHorizontal: 8, fontStyle: 'italic', paddingTop: 8, fontWeight: 'bold'
							}}>{'Append at: ' + CalcTimeStamp(item.CreatedAt)}</Text>
							<Text style={{fontSize: 16, backgroundColor: '#FDBD4E', color: Colors.black,
								paddingHorizontal: 16, fontStyle: 'italic', paddingVertical: 8
							}}>{item.Content}</Text>
						</View>
					)
				})}
			</View>
		)
	}


	renderSectionHeader(){
		let postInfo = this.props.postInfo
		if (!postInfo || this.props.isAppendPost) {
			return null
		}

		let title = this.state.totalAnswerCount + ' replies totally'

		return(
			<View style={{width: '100%', height: 30, flexDirection: 'row', alignItems: 'center',
				backgroundColor: Colors.listBg, marginTop: postInfo.URLs.length ? 20 : 0,
			}}>
				<Text style={{fontSize: 14, color: Colors.black, marginLeft: 16,}}>{title}</Text>
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
			UserID: this.getUserID(),
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

	addLikeToPost() {
		let param = {
			UserID: this.getUserID(),
			PostID: this.props.postInfo.PostID
		}

		this.showSpinner()
		HTTP.post(API_Post.addLikes, param).then((response) => {
			this.hideSpinner()
			if (response.code) {
				Toast.showWithGravity('Add failed' , Toast.LONG, Toast.CENTER)
			}else {
				this.props.postInfo.Likes = this.props.postInfo.Likes + 1
				this.setState({postLikes: this.props.postInfo.Likes})
				Toast.showWithGravity('Add success', Toast.LONG, Toast.CENTER)
			}
		}).catch(() => {
			this.hideSpinner()
			Toast.showWithGravity('Add failed')
		})
	}

	renderItem(item) {
		if (item.type === 0) {
			return this.renderHeader()
		}else {
			if (!this.props.isAppendPost) {
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
			}else {
				return (
					<View style={{backgroundColor: Colors.white}}>
						<Text style={{marginLeft: 16, marginTop: 8, marginRight: 8,
							fontSize: 14, color: Colors.lightGray
						}}>{'Update at: ' + CalcTimeStamp(item.CreatedAt)}</Text>
						<Text  style={{marginLeft: 32, marginTop: 8, marginRight: 8,
							fontSize: 16, color: Colors.black, marginBottom: 8
						}}>{item.Content}</Text>

						<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, backgroundColor: Colors.lineColor}}/>
					</View>
				)
			}
		}
	}

	renderMyPostView() {
		return(
			<ScrollView style={{flex:1, backgroundColor: Colors.listBg}}>
				{this.renderHeader()}
				<View style={{width: '100%', height: 44 + 10 + (PLATFORM.isIPhoneX ? 34 : 0) + 50}}/>
			</ScrollView>
		)
	}

	renderSectionList() {
		return(
			<SectionList
				style={{flex: 1,}}
				renderItem={({item}) => this.renderItem(item)}
				sections={[{data: [{type: 0}]}, {data: this.state.dataSource}]}
				keyExtractor={(item, index) => {
					return 'key' + index
				}}

				refreshControl={
					<RefreshControl
						refreshing={this.state.isRefreshing}
						enabled = {true}
						onRefresh={() => {
							if (!this.props.isAppendPost) {
								this.refresh()
							}
						}
						}
					/>
				}
				onEndReachedThreshold = {0.1}
				onEndReached = {() => {
					if (!this.props.isAppendPost) {
						this.loadMore()
					}
				}}

				ListFooterComponent={() => {
					return this.renderListFooter()
				}}

			/>
		)
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.listBg}}>
				{!this.props.isAppendPost ? this.renderSectionList() : this.renderMyPostView()}

				{this.renderAddAnswerView()}
				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
