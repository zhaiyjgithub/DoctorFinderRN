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
import {API_Register} from '../../utils/API';

export default class VerifyAccountViewController extends Component{
	constructor(props) {
		super(props);
		this.state = {
			account: '',
		}
	}

	showSpinner() {
		this.setState({isSpinnerVisible: true})
	}

	hideSpinner() {
		this.setState({isSpinnerVisible: false})
	}

	verifyEmail() {
		if (!this.state.account.length) {
			Toast.showWithGravity('Email can`t be empty!', Toast.LONG, Toast.CENTER)
			return
		}

		let param = {
			Email: this.state.account
		}

		this.showSpinner()
		HTTP.post(API_Register.verifyEmail, param).then((response) => {
			this.hideSpinner()
			if (response.data) {
				Keyboard.dismiss()
				setTimeout(() => {
					this.pushToResetPasswordPage()
				}, 600)
			}else {
				Toast.showWithGravity('Email is not found', Toast.SHORT, Toast.CENTER)
			}
		}).catch(() => {
			this.hideSpinner()
			Toast.showWithGravity('Request failed', Toast.SHORT, Toast.CENTER)
		})
	}

	pushToResetPasswordPage() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'ResetPasswordViewController',
				passProps: {
					account: this.state.account,
				},
				options: {
					statusBar: {
						visible: true,
						style: 'light'
					},
					topBar: {
						visible: true,
						title: {
							text: 'Reset Password'
						}
					},
				}
			}
		})
	}

	render() {
		let buttonHeight = ScreenDimensions.width*(50.0/375)
		return(
			<View style={{flex: 1, backgroundColor: Colors.white,
				alignItems: 'center',
			}}>
					<Text style={{fontSize: 18, fontWeight: 'bold',
						color: Colors.lightBlack, marginTop: 30
					}}>Input your email to verify</Text>

					<TextInput
						autoCorrect={false}
						autoCapitalize={'none'}
						keyboardType = {'email-address'}
						clearButtonMode={'while-editing'}
						onChangeText={(text) => {
							this.setState({account: text.trim() + ''})
						}}
						selectionColor = {Colors.theme}
						// value = {this.state.searchContent}
						underlineColorAndroid = {'transparent'}
						numberOfLines={1}
						placeholder = {'Email'}
						placeholderTextColor={Colors.lightGray}
						style={{width: ScreenDimensions.width - 40, marginTop: 30,
							height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
							color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
							borderWidth: 1.0, borderColor: Colors.theme
						}}/>


					<TouchableOpacity onPress={() => {
						this.verifyEmail()
					}} style={{width: ScreenDimensions.width - 40,
						height: buttonHeight, justifyContent: 'center', alignItems: 'center',
						backgroundColor: Colors.theme, borderRadius: 4,
						marginTop: 20
					}}>
						<Text style={{fontSize: 18, color: Colors.white, fontWeight: 'bold'}}>{'Verify'}</Text>
					</TouchableOpacity>

				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
