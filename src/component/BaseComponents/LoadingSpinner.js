import React, {Component} from 'react';
import {Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
import {Colors} from '../utils/Styles';
import Spinner from "react-native-spinkit";

export default class LoadingSpinner extends Component{
	static defaultProps = {
		size: 60,
		marginTop: 0,
		color: Colors.theme
	}
	constructor(props) {
		super(props);
		this.state = {
			visible: props.visible,
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			visible: props.visible,
		})
	}

	render() {
		if (this.state.visible) {
			return(
				<View style={{
					position: 'absolute',
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					backgroundColor: 'rgba(0,0,0, 0.20)',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<Spinner isVisible={true} size={this.props.size} type={'FadingCircleAlt'} color={this.props.color}/>
				</View>
			)
		}else {
			return null
		}
	}
}
