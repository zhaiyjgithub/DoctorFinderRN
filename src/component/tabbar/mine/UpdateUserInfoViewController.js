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
	Keyboard,
	AppState, TouchableOpacity, Image, Text, RefreshControl,
	TextInput
} from 'react-native'
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions} from '../../utils/Dimensions';
import {PLATFORM} from '../../utils/CustomEnums';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import Toast from 'react-native-simple-toast';
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import {HTTP} from '../../utils/HttpTools';
import {API_Register, API_User} from '../../utils/API';

const UpdateUserInfoType = {
	email: 0,
	name: 1,
}

export {
	UpdateUserInfoType
}

export default class UpdateUserInfoViewController extends Component{
	static defaultProps = {
		type: UpdateUserInfoType.name,
		placeholder: ''
	}

	constructor(props) {
		super(props);
		this.state = {
			item: props.item,
		}
	}

	getUserID() {
		return UserInfo.UserID
	}

	showSpinner() {
		this.setState({isSpinnerVisible: true})
	}

	hideSpinner() {
		this.setState({isSpinnerVisible: false})
	}

	updateUserInfo() {
		let item = this.state.item
		if (!item.length) {
			Toast.showWithGravity('User name can`t be empty!', Toast.LONG, Toast.CENTER)
			return
		}

		if (item.length < 4 || item.length > 20) {
			Toast.showWithGravity('User name length must be 4-20 characters!', Toast.LONG, Toast.CENTER)
			return;
		}

		let param = {
			UserID: this.getUserID()
		}

		if (this.props.type === UpdateUserInfoType.name) {
			param.Name = item
		}

		this.showSpinner()
		HTTP.post(API_User.updateUserInfo, param).then((response) => {
			this.hideSpinner()
			if (!response.code) {
				Keyboard.dismiss()
				setTimeout(() => {
					this.props.updateUserInfoCB && this.props.updateUserInfoCB()
					Toast.showWithGravity('Update success', Toast.SHORT, Toast.CENTER)
					Navigation.popToRoot(this.props.componentId)
				}, 600)
			}else {
				Toast.showWithGravity('Update failed', Toast.SHORT, Toast.CENTER)
			}
		}).catch(() => {
			this.hideSpinner()
			Toast.showWithGravity('Request failed', Toast.SHORT, Toast.CENTER)
		})
	}

	render() {
		let buttonHeight = ScreenDimensions.width*(50.0/375)
		let keyboardType = this.props.type === UpdateUserInfoType.email ? 'email-address' : 'default'

		return(
			<View style={{flex: 1, backgroundColor: Colors.white,
				alignItems: 'center',
			}}>
				<TextInput
					autoCorrect={false}
					autoCapitalize={'none'}
					keyboardType = {keyboardType}
					clearButtonMode={'while-editing'}
					onChangeText={(text) => {
						this.setState({item: text.trim() + ''})
					}}
					selectionColor = {Colors.theme}
					defaultValue = {this.state.item}
					underlineColorAndroid = {'transparent'}
					numberOfLines={1}
					placeholder = {this.props.placeholder}
					placeholderTextColor={Colors.lightGray}
					style={{width: ScreenDimensions.width - 40, marginTop: 30,
						height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
						color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
						borderWidth: 1.0, borderColor: Colors.theme
					}}/>


				<TouchableOpacity onPress={() => {
					this.updateUserInfo()
				}} style={{width: ScreenDimensions.width - 40,
					height: buttonHeight, justifyContent: 'center', alignItems: 'center',
					backgroundColor: Colors.theme, borderRadius: 4,
					marginTop: 20
				}}>
					<Text style={{fontSize: 16, color: Colors.white, fontWeight: 'bold'}}>{'Update'}</Text>
				</TouchableOpacity>

				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
