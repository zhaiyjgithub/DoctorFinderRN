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
	Keyboard, TouchableOpacity, Image, Text, RefreshControl,
	TextInput
} from 'react-native'
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions} from '../../utils/Dimensions';
import {Gender, PLATFORM} from '../../utils/CustomEnums';
import {Navigation} from 'react-native-navigation';
import {HTTP} from '../../utils/HttpTools';
import {API_Register, API_User} from '../../utils/API';
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import Toast from 'react-native-simple-toast'
import {MD5Encrypt, VerifyEmail} from '../../utils/Utils';

export default class SignUpViewController extends Component{
	constructor(props) {
		super(props);
		this.state = {
			account: '',
			password: '',
			confirmPassword: '',
			code: '',
			isSpinnerVisible: false,
			gender: Gender.maleType,
			codeButtonTitle: 'Get'
		}

		this.timerInterval= 0
	}

	componentDidMount() {
		this.addTimer()
	}

	componentWillUnmount() {
		this.clearTimer()
	}

	showSpinner() {
		this.setState({isSpinnerVisible: true})
	}

	hideSpinner() {
		this.setState({isSpinnerVisible: false})
	}

	addTimer() {
		this.timerId = setInterval(() => {
			if (this.timerInterval) {
				this.setState({codeButtonTitle: (this.timerInterval) + 's'})
				this.timerInterval = this.timerInterval - 1
			}else {
				if (this.state.codeButtonTitle !== 'Get') {
					this.setState({codeButtonTitle: 'Get'})
				}
			}
		}, 1000)
	}

	clearTimer() {
		this.timerId && clearInterval(this.timerId)
	}

	getVerificationCode() {
		if (!this.state.account.length) {
			Toast.showWithGravity('Email can`t be empty!', Toast.SHORT, Toast.CENTER)
			return
		}

		if (!VerifyEmail(this.state.account)) {
			Toast.showWithGravity('Email format is wrong!', Toast.SHORT, Toast.CENTER)
			return
		}

		let param = {
			Email: this.state.account
		}

		this.showSpinner()
		HTTP.post(API_Register.sendVerificationCode, param).then((response) => {
			this.hideSpinner()

			if (!response.code) {
				Toast.showWithGravity('Verification code has been sent to your email.',
						Toast.SHORT, Toast.CENTER
					)

				this.timerInterval = 59
			}else if (response.code === 4) {
				Toast.showWithGravity('This email has been registered.',
					Toast.LONG, Toast.CENTER
				)
			}else {
				Toast.showWithGravity('Send verification failed!',
					Toast.LONG, Toast.CENTER
				)
			}
		}).catch((error) => {
			this.hideSpinner()
			Toast.showWithGravity('Request failed!',
				Toast.LONG, Toast.CENTER
			)
		})
	}

	createAccount() {
		if (!this.state.account.length) {
			Toast.showWithGravity('Email can`t be empty!', Toast.SHORT, Toast.CENTER)
			return
		}

		if (!VerifyEmail(this.state.account)) {
			Toast.showWithGravity('Email format is wrong!', Toast.SHORT, Toast.CENTER)
			return
		}

		if (!this.state.password.length) {
			Toast.showWithGravity('Password can`t be empty!', Toast.SHORT, Toast.CENTER)
			return
		}

		if (this.state.password !== this.state.confirmPassword) {
			Toast.showWithGravity('Confirm password is not equal to password!', Toast.SHORT, Toast.CENTER)
			return
		}

		if (!this.state.code.length) {
			Toast.showWithGravity('Verification code can`t be empty!', Toast.SHORT, Toast.CENTER)
			return
		}

		let emailSplitArray = this.state.account.split('@')
		let encryptPwd = MD5Encrypt(this.state.account.toLowerCase() + this.state.password.toLowerCase())

		let param = {
			Email: this.state.account,
			Password: encryptPwd,
			VerificationCode: this.state.code,
			Name: emailSplitArray[0],
			Gender: this.state.gender
		}

		this.showSpinner()
		HTTP.post(API_Register.register, param).then((response) => {
			this.hideSpinner()
			if (!response.code) {
				this.showRegisterSuccessAlert()
			}else {
				Toast.showWithGravity(response.msg, Toast.LONG, Toast.CENTER)
			}
		}).catch((error) => {
			this.hideSpinner()
			Toast.showWithGravity('Request failed!', Toast.LONG, Toast.CENTER)
		})
	}

	showRegisterSuccessAlert() {
		Alert.alert(
			'Congratulate',
			'Register successfully!',
			[
				{text: 'Sign In', onPress: () => {
					this.modalToLogInPage()
					}},
			],
			{ cancelable: false }
		)
	}

	modalToLogInPage() {
		Navigation.showModal({
			stack: {
				children: [{
					component: {
						name: 'LogInViewController',
						passProps: {

						},
						options: {
							topBar: {
								visible: false
							}
						}
					}
				}]
			}
		});
	}

	updateGender(type) {
		this.setState({gender: type})
	}

	render() {
		let buttonHeight = ScreenDimensions.width*(50.0/375)
		return(
			<TouchableOpacity onPress={() => {
				Keyboard.dismiss()
			}} activeOpacity={1} style={{flex: 1, backgroundColor: Colors.white,
				alignItems: 'center', justifyContent: 'space-between'
			}}>
				<View style={{flex: 1, backgroundColor: Colors.white,
					alignItems: 'center',
				}}>
					<Text style={{fontSize: 32, fontWeight: 'bold',
						color: Colors.lightBlack, marginTop: (PLATFORM.isIOS ? 44 : 20)
					}}>Doctor Finder</Text>

					<Text style={{fontSize: 24, fontWeight: 'bold',
						color: Colors.lightBlack, marginTop: 30
					}}>Create your account</Text>

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
						style={{width: ScreenDimensions.width - 40, marginTop: 40,
							height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
							color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
							borderWidth: 1.0, borderColor: Colors.theme
						}}/>

					<TextInput
						secureTextEntry={true}
						clearButtonMode={'while-editing'}
						onChangeText={(text) => {
							this.setState({password: text.trim() + ''})
						}}
						selectionColor = {Colors.theme}
						// value = {this.state.searchContent}
						underlineColorAndroid = {'transparent'}
						numberOfLines={1}
						placeholder = {'Password'}
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

					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
						width: ScreenDimensions.width - 40, marginVertical: 8,
					}}>
						<TouchableOpacity onPress={() => {
							this.updateGender(Gender.maleType)
						}} style={{flexDirection: 'row', alignItems: 'center',}}>
							<Image source={this.state.gender === Gender.maleType ? require('../../../resource/image/register/checkbox-selected.png') : require('../../../resource/image/register/checkbox-unselected.png')} style={{width: 18, height: 18, backgroundColor: Colors.white}}/>
							<Text style={{fontSize: 14, color: Colors.male, marginLeft: 5}}>{'Male'}</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => {
							this.updateGender(Gender.femaleTye)
						}} style={{flexDirection: 'row', alignItems: 'center', marginLeft: 40}}>
							<Image source={this.state.gender === Gender.femaleTye ? require('../../../resource/image/register/checkbox-selected.png') : require('../../../resource/image/register/checkbox-unselected.png')} style={{width: 18, height: 18, backgroundColor: Colors.white}}/>
							<Text style={{fontSize: 14, color: Colors.female, marginLeft: 5}}>{'Female'}</Text>
						</TouchableOpacity>
					</View>

					<View style={{width: ScreenDimensions.width - 40, flexDirection: 'row',
						alignItems: 'center', justifyContent: 'space-between', marginTop: 8
					}}>
						<TextInput
							keyboardType = {'number-pad'}
							clearButtonMode={'while-editing'}
							onChangeText={(text) => {
								this.setState({code: text.trim() + ''})
							}}
							selectionColor = {Colors.theme}
							underlineColorAndroid = {'transparent'}
							numberOfLines={1}
							placeholder = {'Verification code'}
							placeholderTextColor={Colors.lightGray}
							style={{width: ScreenDimensions.width - 40 - 80 - 16,
								height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
								color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
								borderWidth: 1.0, borderColor: Colors.theme
							}}/>

						<TouchableOpacity onPress={() => {
							if (this.timerInterval !== 0) {
								Toast.showWithGravity('Please wait!', Toast.SHORT, Toast.CENTER)
							}else {
								this.getVerificationCode()
							}
						}} style={{
							height: buttonHeight, justifyContent: 'center', alignItems: 'center',
							color: Colors.theme, width: 80, backgroundColor: Colors.theme, borderRadius: 4,
						}}>
							<Text style={{fontSize: 16, color: Colors.white, fontWeight: 'bold'}}>{this.state.codeButtonTitle}</Text>
						</TouchableOpacity>
					</View>


					<TouchableOpacity onPress={() => {
						this.createAccount()
					}} style={{width: ScreenDimensions.width - 40,
						height: buttonHeight, justifyContent: 'center', alignItems: 'center',
						backgroundColor: Colors.theme, borderRadius: 4,
						marginTop: 20
					}}>
						<Text style={{fontSize: 18, color: Colors.white, fontWeight: 'bold'}}>{'Create account'}</Text>
					</TouchableOpacity>

				</View>

				<TouchableOpacity onPress={() => {
					Navigation.dismissModal(this.props.componentId);
				}} style={{
					height: 30, justifyContent: 'center', alignItems: 'center',
					marginBottom: PLATFORM.isIPhoneX ? 34 : 20
				}}>
					<Text style={{fontSize: 16, color: Colors.theme,}}>{'Dismiss'}</Text>
				</TouchableOpacity>

				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</TouchableOpacity>
		)
	}
}
