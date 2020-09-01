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
import {Navigation} from 'react-native-navigation';
import {ShareTool} from '../../utils/ShareTool';
import Toast from 'react-native-simple-toast';
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import {HTTP} from '../../utils/HttpTools';
import {API_User} from '../../utils/API';

export default class FeedbackViewController extends Component{
	static options(passProps) {
		return {
			topBar: {
				rightButtons: [
					{
						id: 'send',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						icon: require('../../../resource/image/mine/send.png'),
					},
				]
			},
		};
	}

	constructor(props) {
		super(props)
		this.state = {
			feedbackText: ''
		}

		this.navigationEventListener = Navigation.events().bindComponent(this)
	}

	componentWillUnmount() {
		this.navigationEventListener && this.navigationEventListener.remove();
	}

	navigationButtonPressed({ buttonId }) {
		if (buttonId === 'send') {
			this.sendFeedback()
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

	sendFeedback() {
		if (!this.state.feedbackText.length) {
			Toast.showWithGravity("Your feedback text can`t be empty!", Toast.LONG, Toast.CENTER)
			return
		}

		let param = {
			UserID: this.getUserID(),
			FeedBack: this.state.feedbackText
		}

		this.showSpinner()
		HTTP.post(API_User.addNewFeedback, param).then((response) => {
			this.hideSpinner()
			if (!response.code) {
				Keyboard.dismiss()
				Toast.showWithGravity("Send success!", Toast.LONG, Toast.CENTER)
				setTimeout(() => {
					Navigation.pop(this.props.componentId);
				}, 1000)

			}else {
				Toast.showWithGravity("Send failed!", Toast.LONG, Toast.CENTER)
			}
		}).catch(() => {
			this.hideSpinner()
		})
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.white, alignItems: 'center'}}>
				<Text style={{color: Colors.black, fontSize: 16, marginHorizontal: 16,
					marginTop: 8,
				}}>{'We are very appreciate you can send any feedback to us. ' +
				'You can send the feedback below or email via '}
					<Text selectable={true} style={{color: Colors.blue, fontSize: 16,}}>{'yuanji.zhai@outlook.com'}</Text>
				</Text>

				<TextInput
					onChangeText={(text) => {
						this.setState({feedbackText: text.trim() + ''})
					}}
					multiline = {true}
					placeholder = {'Text here...'}
					placeholderTextColor={Colors.lightGray}
					style={{width: ScreenDimensions.width - 40, marginTop: 8,
						height: 200, paddingLeft: 8, fontSize: 16,
						color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
						borderWidth: 1.0, borderColor: Colors.theme, textAlignVertical: 'top'
					}}/>

				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
