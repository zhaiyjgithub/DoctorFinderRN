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
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import Toast from 'react-native-simple-toast';
import {HTTP} from '../../utils/HttpTools';
import {API_User} from '../../utils/API';
import {Navigation} from 'react-native-navigation';

export default class UpdatePasswordViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			oldPassword: '',
			newPassword: '',
			confirmPassword: ''
		}
	}

	getUserPassword() {
		return UserInfo.Password
	}

	getUserEmail() {
		return UserInfo.Email
	}

	showSpinner() {
		this.setState({isSpinnerVisible: true})
	}

	hideSpinner() {
		this.setState({isSpinnerVisible: false})
	}

	updatePassword() {
		if (!this.state.oldPassword.length) {
			Toast.showWithGravity('Email can`t be empty!', Toast.SHORT, Toast.CENTER)
			return
		}

		if (!this.state.newPassword.length) {
			Toast.showWithGravity('Email can`t be empty!', Toast.SHORT, Toast.CENTER)
			return
		}


		if (this.state.oldPassword !== this.getUserPassword()) {
			Toast.showWithGravity('Old password is incorrect!', Toast.SHORT, Toast.CENTER)
			return
		}

		if (this.state.newPassword.length < 8 || this.state.newPassword.length > 20) {
			Toast.showWithGravity('Your password must be 8-20 characters with uppercase and lowercase letters and numbers!', Toast.SHORT, Toast.CENTER)
			return
		}

		if (this.state.newPassword !== this.state.confirmPassword) {
			Toast.showWithGravity('New password is not equal with the confirm password!', Toast.SHORT, Toast.CENTER)
			return
		}

		let param = {
			Email: this.getUserEmail(),
			OldPwd: this.state.oldPassword,
			NewPwd: this.state.newPassword
		}

		this.showSpinner()
		HTTP.post(API_User.updatePassword, param).then((response) => {
			this.hideSpinner()
			if (!response.code) {
				Toast.showWithGravity('Reset success', Toast.SHORT, Toast.CENTER)
				Keyboard.dismiss()
				setTimeout(() => {
					this.props.updateUserInfoCB && this.props.updateUserInfoCB()
					Navigation.popToRoot(this.props.componentId)
				}, 600)

			}else {
				Toast.showWithGravity('Reset success', Toast.SHORT, Toast.CENTER)
			}
		}).catch(() => {
			this.hideSpinner()
			Toast.showWithGravity('Request failed', Toast.SHORT, Toast.CENTER)
		})

	}

	render() {
		let buttonHeight = ScreenDimensions.width*(50.0/375)
		return(
			<View style={{flex: 1, backgroundColor: Colors.white, alignItems: 'center'}}>
				<TextInput
					secureTextEntry={true}
					clearButtonMode={'while-editing'}
					onChangeText={(text) => {
						this.setState({oldPassword: text.trim() + ''})
					}}
					selectionColor = {Colors.theme}
					underlineColorAndroid = {'transparent'}
					numberOfLines={1}
					placeholder = {'Old Password'}
					placeholderTextColor={Colors.lightGray}
					style={{width: ScreenDimensions.width - 40, marginTop: 20,
						height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
						color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
						borderWidth: 1.0, borderColor: Colors.theme
					}}/>

				<TextInput
					secureTextEntry={true}
					clearButtonMode={'while-editing'}
					onChangeText={(text) => {
						this.setState({newPassword: text.trim() + ''})
					}}
					selectionColor = {Colors.theme}
					// value = {this.state.searchContent}
					underlineColorAndroid = {'transparent'}
					numberOfLines={1}
					placeholder = {'New Password'}
					placeholderTextColor={Colors.lightGray}
					style={{width: ScreenDimensions.width - 40, marginTop: 20,
						height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
						color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
						borderWidth: 1.0, borderColor: Colors.theme
					}}/>

				<TextInput
					secureTextEntry={true}
					clearButtonMode={'while-editing'}
					onChangeText={(text) => {
						this.setState({confirmPassword: text.trim() + ''})
					}}
					selectionColor = {Colors.theme}
					// value = {this.state.searchContent}
					underlineColorAndroid = {'transparent'}
					numberOfLines={1}
					placeholder = {'Confirm Password'}
					placeholderTextColor={Colors.lightGray}
					style={{width: ScreenDimensions.width - 40, marginTop: 20,
						height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
						color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
						borderWidth: 1.0, borderColor: Colors.theme
					}}/>

				<Text style={{fontSize: 12, color: Colors.lightBlack, marginTop: 8,
					width: ScreenDimensions.width - 40, textAlign: 'center'
				}}>{'Your password must be 8-20 characters with uppercase and lowercase letters and numbers\n'}</Text>

				<TouchableOpacity onPress={() => {
					this.updatePassword()
				}} style={{flexDirection: 'row', alignItems: 'center', height: buttonHeight, width:  ScreenDimensions.width - 40, marginTop: 20,
					backgroundColor: Colors.theme, justifyContent: 'center', borderRadius: 4,
				}}>
					<Text style={{fontSize: 16, color: Colors.white, fontWeight: 'bold'}}>{'Update'}</Text>
				</TouchableOpacity>

				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
