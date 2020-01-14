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
	AppState, TouchableOpacity, Image, Text, RefreshControl
} from 'react-native'
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions} from '../../utils/Dimensions';
import {PLATFORM} from '../../utils/CustomEnums';

export default class PostViewController extends Component{
	render() {
		let buttonWidth = (ScreenDimensions.width - 40 - 16)/2.0
		let buttonHeight = ScreenDimensions.width*(50.0/375)
		return(
			<View style={{flex: 1, backgroundColor: Colors.white,
				alignItems: 'center', justifyContent: 'space-between'
			}}>
				<Text style={{fontSize: 22, fontWeight: 'bold',
					color: Colors.lightBlack, marginTop: ScreenDimensions.height*0.312
				}}>Doctor Finder</Text>

				<View style={{width: '100%', flexDirection: 'row', alignItems: 'center',
					justifyContent: 'space-between', paddingLeft: 25,
					marginBottom: PLATFORM.isIPhoneX ? 34 : 20,
				}}>
					<TouchableOpacity style={{width: buttonWidth,
						height: buttonHeight, justifyContent: 'center', alignItems: 'center'
					}}>
						<Text>{'Create account'}</Text>
					</TouchableOpacity>

					<TouchableOpacity style={{width: buttonWidth,
						height: buttonHeight, justifyContent: 'center', alignItems: 'center'
					}}>
						<Text>{'Log in'}</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}
