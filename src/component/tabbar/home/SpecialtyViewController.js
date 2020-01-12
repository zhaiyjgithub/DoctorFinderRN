import {
	SectionList, Text, View,
	TouchableOpacity, Image,
} from 'react-native';
import {Colors} from '../../utils/Styles';
import React, {Component} from 'react';
import {ShareTool} from '../../utils/ShareTool';
import {Navigation} from 'react-native-navigation';

export default class SpecialtyViewController extends Component {
	static options(passProps) {
		return {
			topBar: {
				rightButtons: [
					{
						id: 'deselect',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						text: 'Deselect'
					},
				],
				leftButtons: [
					{
						id: 'cancel',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						text: 'Cancel'
					},
				]
			}
		};
	}

	constructor(props) {
		super(props);
		this.state = {
			dataSource: [{section: 0, header: 'A', data: [
					{section: 0, name: 'Internal Medicine'},
					{section: 0, name: 'OB/GYN'},
					{section: 0, name: 'Pediatrics'},
					{section: 0, name: 'Cardiology'},
				]},
				{section: 1, header: 'B', data: [
						{section: 1, name: 'Internal Medicine'},
						{section: 1, name: 'OB/GYN'},
						{section: 1, name: 'Pediatrics'},
						{section: 1, name: 'Cardiology'},
					]}
			]
		}
	}

	componentDidMount() {
		this.navigationEventListener = Navigation.events().bindComponent(this);
	}

	componentWillUnmount() {
		// Not mandatory
		if (this.navigationEventListener) {
			this.navigationEventListener.remove();
		}
	}

	navigationButtonPressed({ buttonId }) {
		if (buttonId === 'cancel') {
			Navigation.dismissModal(this.props.componentId);
		}else if (buttonId === 'deselect') {

		}
	}

	renderLineView() {
		return(
			<View style={{position: 'absolute', height: 1.0, left: 8, right: 0, bottom: 0, backgroundColor: Colors.lineColor}}/>
		)
	}

	renderRightArrowImage() {
		return(
			<Image source={require('../../../resource/image/base/right_arrow.png')} style={{width: 8, height: 13, marginLeft: 8}}/>
		)
	}

	renderItem(item) {
		return(
			<TouchableOpacity style={{width: '100%', paddingHorizontal: 16, height: 50,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
			}}>
				<Text style={{fontSize: 16, color: Colors.black,}}>{item.name}</Text>
				{this.renderRightArrowImage()}

				{this.renderLineView()}
			</TouchableOpacity>
		)
	}

	renderSectionHeader(header) {
		return(
			<View style={{justifyContent: 'center', paddingHorizontal: 8, height: 20,
				backgroundColor: Colors.lightGray,
			}}>
				<Text style={{fontSize: 14, color: Colors.black, fontWeight: 'bold'}}>{header}</Text>
			</View>
		)
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<SectionList
					renderItem={({item}) => this.renderItem(item)}
					sections={this.state.dataSource}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					renderSectionHeader={({section}) => {
						return this.renderSectionHeader(section.header)
					}}
				/>
			</View>
		)
	}
}
