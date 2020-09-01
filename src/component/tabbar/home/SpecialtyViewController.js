import {
	SectionList, Text, View,
	TouchableOpacity, Image,
	PixelRatio
} from 'react-native';
import {Colors} from '../../utils/Styles';
import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {Specialty} from '../../../resource/specialty';
import {NaviBarHeight, ScreenDimensions} from '../../utils/Dimensions';
import {LargeList} from 'react-native-largelist-v3';

export default class SpecialtyViewController extends Component {
	static options(passProps) {
		return {
			topBar: {
				rightButtons: [
					{
						id: 'undo',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						text: 'Undo'
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
			dataSource: this.parseCityArray(Specialty),
			selectedSpecialty: props.selectedSpecialty
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
		}else if (buttonId === 'undo') {
			this.props.didSelectedSpecialty && this.props.didSelectedSpecialty('')
			Navigation.dismissModal(this.props.componentId);
		}
	}

	parseCityArray(cities) {
		let sectionMap = new Map()
		cities.forEach((city, index) => {
			let key = city.charAt(0).toUpperCase()
			if (sectionMap.has(key)) {
				let data = sectionMap.get(key)
				data.push(city)
			}else {
				let data = [city]
				sectionMap.set(key, data)
			}
		})

		let datas = []
		sectionMap.forEach((v, k) => {
			let item = {items: v, name: k , section: 0}
			datas.push(item)
		})

		datas = datas.sort((x, y) => {
			if (x.name > y.name) {
				return 1
			}else {
				return -1
			}
		})

		datas.forEach((item, index) => {
			item.section = index
		})

		return datas
	}

	scrollListView(index) {
		this._largeList && this._largeList.scrollToIndexPath({section: index, row: -1}, true)
	}

	renderIndexView() {
		return(
			<View style={{width: 12, position: 'absolute', top: 40, right: 10, backgroundColor: Colors.clear}}>
				{this.state.dataSource.map((item, index) => {
					return(
						<TouchableOpacity onPress={() => {
							this.scrollListView(index)
						}}>
							<Text style={{fontSize: 10, color: Colors.black, paddingVertical: 5}}>{item.name}</Text>
						</TouchableOpacity>
					)
				})}
			</View>
		)
	}

	renderLineView() {
		return(
			<View style={{position: 'absolute', height: 1.0, left: 8, right: 0, bottom: 0, backgroundColor: Colors.lineColor}}/>
		)
	}

	renderRightArrowImage() {
		return(
			<Image source={require('../../../resource/image/base/checkmark.png')} style={{width: 16, height: 12, marginLeft: 8,
				marginRight: 16
			}}/>
		)
	}

	renderItem(item) {
		let isSelected = (item === this.state.selectedSpecialty)
		return(
			<TouchableOpacity onPress={() => {
				let newSpecialty = this.state.selectedSpecialty === item ? '' : item
				this.props.didSelectedSpecialty && this.props.didSelectedSpecialty(newSpecialty)
				Navigation.dismissModal(this.props.componentId);
			}} style={{width: '100%', paddingHorizontal: 16, height: 50,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
			}}>
				<Text style={{fontSize: 16, color: isSelected ? Colors.theme : Colors.black,}}>{item}</Text>
				{isSelected ? this.renderRightArrowImage() : null}
				{this.renderLineView()}
			</TouchableOpacity>
		)
	}

	renderLargeList() {
		return(
			<LargeList
				ref = {(o) => {
					this._largeList = o
				}}
				data={this.state.dataSource}
				heightForSection={() => 30}
				renderSection={(section) => {
					if (!this.state.dataSource.length) {
						return ;
					}

					let title = this.state.dataSource[section].name
					return(
						<View style={{width: ScreenDimensions.width, height: 30, backgroundColor: Colors.systemGray,
							justifyContent: 'center'
						}}>
							<Text style={{fontSize: 18, color: Colors.black, fontWeight: 'bold',
								marginLeft: 15,
							}}>{title}</Text>
						</View>
					)
				}}
				heightForIndexPath={() => 50}
				renderIndexPath={(index) => {
					if (!this.state.dataSource.length) {
						return;
					}

					let sectionData = this.state.dataSource[index.section]
					let item = sectionData.items[index.row]
					return this.renderItem(item)
				}}
			/>
		)
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: Colors.white}}>
				{this.renderLargeList()}
				{this.renderIndexView()}
			</View>
		)
	}
}


//
