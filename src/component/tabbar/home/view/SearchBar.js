import React, {Component} from 'react'
import {
	Image, Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {Navigation} from 'react-native-navigation'
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';

export default class SearchBar extends Component {
	static defaultProps = {
		marginLeft: 18,
	}

	render() {
		let width = (ScreenDimensions.width - 32)
		return(
				<TouchableOpacity onPress={() => {
				}} style={{
					width: width,
					height: 36,
					backgroundColor: Colors.white,
					flexDirection: 'row',
					alignItems: 'center',
					borderRadius: 6,
				}}>
					<Image source={require('../../../../resource/image/home/Search.png')} style={{marginLeft: 10, marginRight: 10}}/>
					<Text style={{fontSize: 18, color: Colors.darkGray}}>{'Search'}</Text>
				</TouchableOpacity>
		)
	}
}
