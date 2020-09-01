import React, {Component} from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity, ActivityIndicator,
} from 'react-native';
import {Colors} from '../utils/Styles';
import {ScreenDimensions} from '../utils/Dimensions';

export default class LoadingFooter extends Component{
	static defaultProps = {
		isTotal: false,
		isLoading: false,
		marginTop: 10
	}

	render() {
		if (this.props.isTotal) {
			return(
				<View style={{width: ScreenDimensions.width, height: 44, alignItems: 'center', marginTop: this.props.marginTop}}>
					<Text style={{fontSize: 14, color: Colors.lightGray,}}>{'No more data...'}</Text>
				</View>
			)
		}else if (this.props.isLoading) {
			return(
				<View style={{width: ScreenDimensions.width,alignItems: 'center', marginTop: this.props.marginTop}}>
					<ActivityIndicator color={Colors.theme}/>
					<Text style={{fontSize: 14, color: Colors.lightGray, marginTop: 8}}>{'Loading data...'}</Text>
				</View>
			)
		}else {
			return (<View />)
		}
	}
}
