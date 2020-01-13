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
			dataSource: [{
				code: "AK", name: "Alask"},
				{code: "AL", name: "Alabam"},
				{code: "AR", name: "Arkansa"},
				{code: "AZ", name: "Arizon"},
				{code: "CA", name: "Californi"},
				{code: "CO", name: "Colorad"},
				{code: "CT", name: "Connecticu"},
				{code: "DC", name: "District of Columbia"},
				{code: "DE", name: "Delawar"},
				{code: "FL", name: "Florid"},
				{code: "GA", name: "Georgi"},
				{code: "HI", name: "Hawai"},
				{code: "IA", name: "Iow"},
				{code: "ID", name: "Idah"},
				{code: "IL", name: "Illinoi"},
				{code: "IN", name: "Indian"},
				{code: "KS", name: "Kansa"},
				{code: "KY", name: "Kentuck"},
				{code: "LA", name: "Louisian"},
				{code: "MA", name: "Massachusett"},
				{code: "MD", name: "Marylan"},
				{code: "ME", name: "Main"},
				{code: "MI", name: "Michiga"},
				{code: "MN", name: "Minnesot"},
				{code: "MO", name: "Missour"},
				{code: "MS", name: "Mississipp"},
				{code: "MT", name: "Montan"},
				{code: "NC", name: "North Carolina"},
				{code: "ND", name: "North Dakota"},
				{code: "NE", name: "Nebrask"},
				{code: "NH", name: "New Hampshire"},
				{code: "NJ", name: "New Jersey"},
				{code: "NM", name: "New Mexico"},
				{code: "NV", name: "Nevad"},
				{code: "NY", name: "New York"},
				{code: "OH", name: "Ohi"},
				{code: "OK", name: "Oklahom"},
				{code: "OR", name: "Orego"},
				{code: "PA", name: "Pennsylvani"},
				{code: "RI", name: "Rhode Island"},
				{code: "SC", name: "South Carolina"},
				{code: "SD", name: "South Dakota"},
				{code: "TN", name: "Tennesse"},
				{code: "TX", name: "Texa"},
				{code: "UT", name: "Uta"},
				{code: "VA", name: "Virgini"},
				{code: "VT", name: "Vermon"},
				{code: "WA", name: "Washingto"},
				{code: "WI", name: "Wisconsi"},
				{code: "WV", name: "West Virginia"},
				{code: "WY", name: "Wyomin"},],
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
		let isSelected = (item.code === this.state.selectedState)

		let desc = item.name + '(' + item.code + ')'
		return(
			<TouchableOpacity onPress={() => {
				this.setState({selectedState: item.code})
				this.pushToCityPage()
			}} style={{width: '100%', paddingHorizontal: 16, height: 50,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
			}}>
				<Text style={{fontSize: 16, color: isSelected ? Colors.theme : Colors.black,}}>{desc}</Text>
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
