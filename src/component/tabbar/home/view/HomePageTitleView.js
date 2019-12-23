import React, {Component} from 'react';
import {Text} from 'react-native';
import {Colors} from '../../../utils/Styles';

export default class HomePageTitleView extends Component {
	render() {
		return(
			<Text style={{fontSize: 16, fontWeight: 'bold', color: Colors.white}}>{'Home'}</Text>
		)
	}
}
