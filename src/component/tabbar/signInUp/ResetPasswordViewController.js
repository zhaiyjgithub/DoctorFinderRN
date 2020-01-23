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
	AppState, TouchableOpacity, Image, Text, RefreshControl,
	TextInput
} from 'react-native'
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions} from '../../utils/Dimensions';
import {PLATFORM} from '../../utils/CustomEnums';
import {Navigation} from 'react-native-navigation';

export default class ResetPasswordViewController extends Component{
	static defaultProps = {
		account: ''
	}
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			confirmPassword: '',
			code: ''
		}
	}
	render() {
		let buttonHeight = ScreenDimensions.width*(50.0/375)
		return(
			<View style={{flex: 1, backgroundColor: Colors.white,
				alignItems: 'center', justifyContent: 'space-between'
			}}>
				<Text style={{fontSize: 18, fontWeight: 'bold',
					color: Colors.lightBlack, marginTop: 30
				}}>Reset the password with
					<Text style={{fontSize: 18, fontWeight: 'bold',
						color: Colors.theme, marginTop: 30
					}}>
						{this.props.account}
					</Text>
				</Text>

				<TextInput
					keyboardType = {'email-address'}
					clearButtonMode={'while-editing'}
					onChangeText={(text) => {
						this.setState({account: text.trim() + ''})
					}}
					selectionColor = {Colors.theme}
					// value = {this.state.searchContent}
					underlineColorAndroid = {'transparent'}
					numberOfLines={1}
					placeholder = {'New Password'}
					placeholderTextColor={Colors.lightGray}
					style={{width: ScreenDimensions.width - 40, marginTop: 30,
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
					placeholder = {'Confirm password again'}
					placeholderTextColor={Colors.lightGray}
					style={{width: ScreenDimensions.width - 40, marginTop: 20,
						height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
						color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
						borderWidth: 1.0, borderColor: Colors.theme
					}}/>

				<Text style={{fontSize: 16, color: Colors.lightBlack, marginTop: 8,
					width: ScreenDimensions.width - 40, textAlign: 'center'
				}}>{'Your password must be 8-20 characters with uppercase and lowercase letters and numbers\n'}</Text>

				<View style={{width: ScreenDimensions.width - 40, flexDirection: 'row',
					alignItems: 'center', justifyContent: 'space-between', marginTop: 20
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
						placeholder = {'Password'}
						placeholderTextColor={Colors.lightGray}
						style={{width: ScreenDimensions.width - 40 - 80 - 16,
							height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
							color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
							borderWidth: 1.0, borderColor: Colors.theme
						}}/>

					<TouchableOpacity style={{
						height: buttonHeight, justifyContent: 'center', alignItems: 'center',
						marginTop: 8, color: Colors.theme, width: 80, backgroundColor: Colors.white
					}}>
						<Text style={{fontSize: 16, color: Colors.white, fontWeight: 'bold'}}>{'Get'}</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity style={{width: ScreenDimensions.width - 40,
					height: buttonHeight, justifyContent: 'center', alignItems: 'center',
					backgroundColor: Colors.theme, borderRadius: 4,
					marginTop: 20
				}}>
					<Text style={{fontSize: 18, color: Colors.white, fontWeight: 'bold'}}>{'Reset'}</Text>
				</TouchableOpacity>

			</View>

		)
	}
}
