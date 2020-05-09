import React, {Component} from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity, ActivityIndicator,
} from 'react-native';
import {Colors} from '../utils/Styles';
import {NaviBarHeight, ScreenDimensions} from '../utils/Dimensions';

export default class ListEmptyView extends Component{
	render() {
		return(
			<View style={{width: ScreenDimensions.width, height: ScreenDimensions.height - NaviBarHeight.height,
				justifyContent: 'center', alignItems: 'center',
			}}>
				<Image style={{width: 100, height: 100}} source={require('../../resource/image/base/empty.png')}/>
				<Text style={{fontSize: 18, color: Colors.black, marginTop: 16, }}>{'No data...'}</Text>
			</View>
		)
	}
}
