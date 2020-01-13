import {
	SectionList, Text, View,
	TouchableOpacity, Image,
	FlatList
} from 'react-native';
import {Colors} from '../../utils/Styles';
import React, {Component} from 'react';
import {ShareTool} from '../../utils/ShareTool';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';

export default class StateListViewController extends Component {
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
			dataSource: ['AL'],
			selectedState: props.selectedState,
			selectedCity: props.selectedCity
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
			this.props.didSelectedCity && this.props.didSelectedCity('')
			this.props.didSelectedState && this.props.didSelectedState('')
			Navigation.dismissModal(this.props.componentId);
		}
	}

	renderLineView() {
		return(
			<View style={{position: 'absolute', height: 1.0, left: 8, right: 0, bottom: 0, backgroundColor: Colors.lineColor}}/>
		)
	}

	renderRightArrowImage() {
		return(
			<Image source={require('../../../resource/image/base/checkmark.png')} style={{width: 16, height: 12, marginLeft: 8}}/>
		)
	}

	pushToCityPage() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'CityListViewController',
				passProps: {
					selectedCity: this.props.selectedState === this.state.selectedState ? this.props.selectedCity : '',
					didSelectedCity: (city) => {
						this.props.didSelectedCity && this.props.didSelectedCity(city)
					}
				},
				options: BaseNavigatorOptions('City')
			}
		});
	}

	renderItem(item) {
		let isSelected = (item === this.state.selectedState)
		return(
			<TouchableOpacity onPress={() => {
				this.pushToCityPage()
			}} style={{width: '100%', paddingHorizontal: 16, height: 50,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
			}}>
				<Text style={{fontSize: 16, color: isSelected ? Colors.theme : Colors.black,}}>{item}</Text>
				{isSelected ? this.renderRightArrowImage() : null}
				{this.renderLineView()}
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: Colors.white}}>
				<FlatList
					renderItem={({item}) => this.renderItem(item)}
					data={this.state.dataSource}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					// ListHeaderComponent={() => {
					//
					// }}
				/>
			</View>
		)
	}
}
