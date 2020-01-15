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

export default class SignUpViewController extends Component{
	constructor(props) {
		super(props);
		this.state = {
			account: '',
			password: '',
			code: ''
		}
	}
	render() {
		let buttonHeight = ScreenDimensions.width*(50.0/375)
		return(
			<View style={{flex: 1, backgroundColor: Colors.white,
				alignItems: 'center', justifyContent: 'space-between'
			}}>
				<View style={{flex: 1, backgroundColor: Colors.white,
					alignItems: 'center',
				}}>
					<Text style={{fontSize: 32, fontWeight: 'bold',
						color: Colors.lightBlack, marginTop: (PLATFORM.isIOS ? 44 : 20)
					}}>Doctor Finder</Text>

					<Text style={{fontSize: 24, fontWeight: 'bold',
						color: Colors.lightBlack, marginTop: 60
					}}>Create your account</Text>

					<TextInput
						keyboardType = {'email-address'}
						clearButtonMode={'while-editing'}
						onChangeText={(text) => {
							this.setState({account: text + ''})
						}}
						selectionColor = {Colors.theme}
						// value = {this.state.searchContent}
						underlineColorAndroid = {'transparent'}
						numberOfLines={1}
						placeholder = {'Account'}
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
							this.setState({password: text + ''})
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
								this.setState({code: text + ''})
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
							marginTop: 8, color: Colors.theme, width: 80,
						}}>
							<Text style={{fontSize: 16, color: Colors.white, fontWeight: 'bold'}}>{'Get'}</Text>
						</TouchableOpacity>
					</View>


					<TouchableOpacity style={{width: ScreenDimensions.width - 40,
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
			</View>
		)
	}
}
