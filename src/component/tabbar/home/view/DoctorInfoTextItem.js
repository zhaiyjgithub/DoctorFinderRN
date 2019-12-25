import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';

export default class DoctorInfoTextItem extends Component{
	static defaultProps = {
		title: '',
		desc: '',
		list: []
	}

	renderListContent() {
		return(
			<View style={{width: '100%'}}>
				{this.props.list.map((item, index) => {
					return(
						<View key={index} style={{marginTop: 8}}>
							<Text style={{maxWidth: '100%', fontSize: 16, color: Colors.black}}>{item.Name}</Text>
							<Text style={{maxWidth: '100%', fontSize: 14, color: Colors.lightGray}}>{item.Desc}</Text>
						</View>
					)
				})}
			</View>
		)
	}

	render() {
		if (!this.props.desc.length && !this.props.list.length) {
			return <View />
		}

		return(
			<View style={{
				width: ScreenDimensions.width,
				paddingBottom: 16,
			}}>
				<View style={{
					width: ScreenDimensions.width - 32,
					marginLeft: 16,
					borderRadius: 6,
					padding: 8,
					borderWidth: 1.0,
					borderColor: Colors.systemGray,
					backgroundColor: Colors.white
				}}>
					<Text style={{fontSize: 18, color: Colors.black,
						fontWeight: 'bold'
					}}>{this.props.title}</Text>

					{this.props.desc && this.props.desc.length ? (
						<Text style={{fontSize: 14, color: Colors.black,
							width: '100%', marginTop: 8
						}}>{this.props.desc}</Text>
					) : null}

					{this.renderListContent()}
				</View>
			</View>
		)
	}
}
