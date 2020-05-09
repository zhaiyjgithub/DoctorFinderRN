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
import {ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {Colors} from '../../utils/Styles';
import RouterEntry from '../../router/RouterEntry';
import {CacheDB} from '../../utils/DBTool';
import {DBKey} from '../../utils/CustomEnums';
import {API_Post, API_Register, API_User, BaseUrl} from '../../utils/API';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import {UpdateUserInfoType} from './UpdateUserInfoViewController';
import {HTTP} from '../../utils/HttpTools';
import Toast from "react-native-simple-toast"
import MyFavorViewController from './MyFavorViewController';
import {Version} from '../../utils/Config';

export default class MineViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [{data:[
				{title: 'Email', type: ItemType.email},

				]},

				{data:[
						{title: 'My Track', type: ItemType.track},
						{title: 'My Favorite', type: ItemType.favor},
						{title: 'My Post', type: ItemType.post},
					]},

				{data:[
						{title: 'Reset Password', type: ItemType.resetPassword},
						{title: 'Feedback', type: ItemType.feedback},
					]},
			],
			userName: ''
		}
	}

	getUserName() {
		return UserInfo.Name
	}

	getHeaderIcon() {
		return UserInfo.HeaderIcon
	}

	getUserGender() {
		return UserInfo.Gender
	}

	getUserEmail() {
		return UserInfo.Email
	}

	getUserID() {
		return UserInfo.UserID
	}

	componentDidMount() {
		this.setState({
			userName: this.getUserName()
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

	didSelectedItem(type) {
		if (!UserInfo.Token && (type === ItemType.track || type === ItemType.favor ||
			type === ItemType.post || type === ItemType.resetPassword
		)) {
			this.showNotSignUpAlert()
			return
		}

		switch (type) {
			case ItemType.signOut:
				this.showSignOutAlert()
				break

			case ItemType.email:
				break

			case ItemType.favor:
				this.pushToFavorPage()
				break

			case ItemType.post:
				this.pushToPostPage()
				break

			case ItemType.feedback:
				this.pushToFeedBackPage()
				break

			case ItemType.resetPassword:
				this.pushToUpdatePasswordPage()
				break

			case ItemType.signIn:
				this.signIn()
				break

			default: ;
		}
	}

	showSignOutAlert() {
		Alert.alert(
			'Do you want to sign out?',
			'Sign out.',
			[
				{text: 'Okay', onPress: () => {
						this.signOut()
					}, style: 'Cancel'},
				{text: 'Cancel', onPress: () => {
						// this.signOut()
					}, style: 'cancel'},
			],
			{ cancelable: false }
		)
	}

	pushToUpdateUserInfoPage(item, type, title) {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'UpdateUserInfoViewController',
				passProps: {
					type: type,
					item: item,
					placeholder: 'User Name',
					updateUserInfoCB:() => {
						this.getUserInfo()
					}
				},
				options: BaseNavigatorOptions(title)
			}
		})
	}

	pushToFavorPage() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'MyFavorViewController',
				passProps: {
				},
				options: BaseNavigatorOptions('')
			}
		})
	}

	pushToPostPage() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'MyPostListController',
				passProps: {
				},
				options: BaseNavigatorOptions('My Post')
			}
		})
	}

	pushToFeedBackPage() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'FeedbackViewController',
				passProps: {
				},
				options: BaseNavigatorOptions('FeedBack')
			}
		})
	}

	pushToUpdatePasswordPage() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'UpdatePasswordViewController',
				passProps: {
				},
				options: BaseNavigatorOptions('Reset Password')
			}
		})
	}

	signOut() {
		CacheDB.remove(DBKey.userInfo)
		RouterEntry.guide()
	}

	signIn() {
		Navigation.showModal({
			stack: {
				children: [{
					component: {
						name: 'GuideViewController',
						passProps: {
							isToSignUp: true
						},
						topBar: {
							visible: true,
							background: {
								color: Colors.theme,
							},
							noBorder: true,
							drawBehind: true,
						},
					}
				}]
			}
		});
	}

	getUserInfo() {
		let param = {
			UserID: this.getUserID()
		}

		HTTP.post(API_User.getUserInfo, param).then((response) => {
			if (response.code || !response.data) {
				Toast.showWithGravity("Get User Information failed")
				return
			}

			CacheDB.load(DBKey.userInfo, (cacheUserInfo) => {
				let token = cacheUserInfo.Token
				let newUserInfo = Object.assign({Token: token}, response.data)

				CacheDB.save(DBKey.userInfo, newUserInfo)
				this.setState({userName: newUserInfo.Name})
			})
		}).catch((error) => {
			console.log(error)
		})
	}

	renderListHeader() {
		let imageURI = require('../../../resource/image/base/avatar.jpg')
		if (this.getHeaderIcon()) {
			imageURI = {uri: BaseUrl + API_Register.headerImg +'?name=' + this.getHeaderIcon()}
		}

		return(
			<View style={{width: '100%', backgroundColor: Colors.red, height: 92,}}>
				<View style={{position: 'absolute', left: 0, right: 0, top: 0, height: 16 + 30, backgroundColor: Colors.theme}}/>
				<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 16 + 30, backgroundColor: Colors.systemGray}}/>

				<TouchableOpacity activeOpacity={1} style={{position: 'absolute', left: 16, top: 16, width: 60, height: 60,
					borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: Colors.white,
					backgroundColor: Colors.white, overflow: 'hidden'
				}}>
					<Image source={imageURI} style={{width: 60, height: 60,}}/>
				</TouchableOpacity>

				<Text onPress={() => {
					this.pushToUpdateUserInfoPage(this.getUserName(), UpdateUserInfoType.name, "Update Name")
				}} numberOfLines={1} style={{position: 'absolute', left: 16 + 60 + 8, bottom: 16 + 30, width: (ScreenDimensions.width - (16 + 60 + 8 + 8)),
						fontSize: 20, fontWeight: 'bold', color: Colors.white
					}}>{this.state.userName}</Text>
			</View>
		)
	}

	renderItem(item) {
		return(
			<TouchableOpacity activeOpacity={item.type === ItemType.email ? 1 : 0.2} onPress={() => {
				if (item.type !== ItemType.email) {
					this.didSelectedItem(item.type)
				}
			}} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
				backgroundColor: Colors.white
			}}>
				<Text style={{fontSize: 18, color: Colors.black, marginLeft: 16}}>
					{item.title}
				</Text>

				{item.type === ItemType.email ? <Text style={{width: ScreenDimensions.width - 32 - 60, fontSize: 16,
					color: Colors.lightGray, marginRight: 16, textAlign: "right",
				}}>
					{this.getUserEmail()}
				</Text> : <Image source={require('../../../resource/image/base/right_arrow.png')} style={{width: 8, height: 14, marginRight: 16,}}/>}

				<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.0, backgroundColor: Colors.lineColor}}/>
			</TouchableOpacity>
		)
	}

	renderListSectionHeader() {
		return(
			<View style={{height: 16, backgroundColor: Colors.listBg}}>
				<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.0, backgroundColor: Colors.lineColor}}/>
			</View>
		)
	}

	renderVersionNumber() {
		return(
			<View style={{width: '100%', alignItems: 'center', marginTop: 20,}}>
				<Text style={{fontSize: 12, color: Colors.lightGray}}>{'Version: ' + Version.Number}</Text>
			</View>
		)
	}

	renderListFooter() {
		let item = UserInfo.Token ? {title: 'Sign out', type: ItemType.signOut} : {title: 'Sign In', type: ItemType.signIn}
		return (
			<View style={{width: ScreenDimensions.width,
				paddingBottom: TabBar.height + 16,
			}}>
				{this.renderListSectionHeader()}

				<TouchableOpacity onPress={() => {
					this.didSelectedItem(item.type)
				}} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
					backgroundColor: Colors.white
				}}>
					<Text style={{fontSize: 18, color: Colors.red, marginLeft: 16}}>
						{item.title}
					</Text>
					<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.0, backgroundColor: Colors.lineColor}}/>
				</TouchableOpacity>

				{this.renderVersionNumber()}
			</View>
		)
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.white}}>
				<View style={{width: '100%', height: ScreenDimensions.height/2.0, backgroundColor: Colors.theme,
					position: 'absolute', left: 0, top: 0,
				}}/>
				<View style={{flex: 1, backgroundColor: Colors.clear}}>
					<SectionList
						style={{flex: 1, backgroundColor: Colors.listBg}}
						renderItem={({item}) => this.renderItem(item)}
						sections={this.state.dataSource}
						stickySectionHeadersEnabled={false}
						keyExtractor={(item, index) => {
							return 'key' + item.key + index
						}}
						ListHeaderComponent={() => {
							return this.renderListHeader()
						}}

						renderSectionHeader={({section}) => {
							return this.renderListSectionHeader()
						}}

						ListFooterComponent={() => {
							return this.renderListFooter()
						}}
					/>
				</View>
			</View>
		)
	}
}

const ItemType = {
	email: 0,
	track: 1,
	favor: 2,
	post: 3,
	resetPassword: 4,
	feedback: 5,
	about: 6,
	signOut: 7,
	signIn: 8,
}
