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
					{section: 0, name: "Allergy & Immunology"},
					{section: 0, name: "Audiologist"},
					{section: 0, name: "Anesthesiology"},]
			},
			{section: 1, header: 'C', data: [
					{section: 1, name: "Colon & Rectal Surgery"},
					{section: 1, name: "Chiropractor"},]
			},
				{section: 2, header: 'D', data: [
						{section: 2, name: "Dermatology"},
					]
				},
				{section: 3, header: 'E', data: [
						{section: 4, name: "Emergency Medicine"},
					]
				},
				{section: 1, header: 'F', data: [
						{section: 0, name: "Family Medicine"},
					]
				},
				{section: 1, header: 'G', data: [
						{section: 0, name: "General Practice"},
					]
				},
				{section: 1, header: 'H', data: [
						{section: 0, name: "Hospitalist"},
					]
				},
				{section: 1, header: 'I', data: [
						{section: 0, name: "Independent Medical Examiner"},
						{section: 0, name: "Internal Medicine"},
					]
				},
				{section: 1, header: 'M', data: [
						{section: 0, name: "Medical Genetics"},
					]
				},
				{section: 1, header: 'N', data: [
						{section: 0, name: "Neurological Surgery"},
						{section: 0, name: "Neuromusculoskeletal Medicine, Sports Medicine"},
						{section: 0, name: "Neuromusculoskeletal Medicine & OMM"},
						{section: 0, name: "Nuclear Medicine"},
					]
				},
				{section: 1, header: 'O', data: [
						{section: 0, name: "Otolaryngology"},
						{section: 0, name: "Oral & Maxillofacial Surgery"},
						{section: 0, name: "Optometrist"},
						{section: 0, name: "Orthopaedic Surgery"},
						{section: 0, name: "Obstetrics & Gynecology"},
						{section: 0, name: "Ophthalmology"},
					]
				},
				{section: 1, header: 'P', data: [
						{section: 0, name: "Plastic Surgery"},
						{section: 0, name: "Phlebology"},
						{section: 0, name: "Psychiatry & Neurology"},
						{section: 0, name: "Pediatrics"},
						{section: 0, name: "Podiatrist"},
						{section: 0, name: "Preventive Medicine"},
						{section: 0, name: "Pain Medicine"},
						{section: 0, name: "Pathology"},
						{section: 0, name: "Physical Medicine & Rehabilitation"},
					]
				},
				{section: 1, header: 'R', data: [
						{section: 0, name: "Radiology"},
					]
				},
				{section: 1, header: 'S', data: [
						{section: 0, name: "Surgery"},
					]
				},
				{section: 1, header: 'T', data: [
						{section: 0, name: "Thoracic Surgery (Cardiothoracic Vascular Surgery)"},
						{section: 0, name: "Transplant Surgery"},
					]
				},
				{section: 1, header: 'U', data: [
						{section: 0, name: "Urology"},
					]
				},
			],
			selectedSpecialty: props.selectedSpecialty
		}

		this.reloadDataSource(this.state.dataSource)
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
			this.props.didSelectedSpecialty && this.props.didSelectedSpecialty('')
			Navigation.dismissModal(this.props.componentId);
		}
	}

	reloadDataSource(dataSource) {
		for (let section = 0; section < dataSource.length; section ++) {
			dataSource.section = section

			let data = dataSource[section]
			if (data.length) {
				dataSource.header = data[0].substr(0, 1).toUpperCase()

				for (let row = 0; row < data.length; row ++) {
					data[row].section = row
				}
			}

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

	renderItem(item) {
		let isSelected = (item.name === this.state.selectedSpecialty)
		return(
			<TouchableOpacity onPress={() => {
				this.props.didSelectedSpecialty && this.props.didSelectedSpecialty(item.name)
				Navigation.dismissModal(this.props.componentId)
			}} style={{width: '100%', paddingHorizontal: 16, height: 50,
				flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
			}}>
				<Text style={{fontSize: 16, color: isSelected ? Colors.theme : Colors.black,}}>{item.name}</Text>
				{isSelected ? this.renderRightArrowImage() : null}
				{this.renderLineView()}
			</TouchableOpacity>
		)
	}

	renderSectionHeader(header) {
		return(
			<View style={{justifyContent: 'center', paddingHorizontal: 8, height: 20,
				backgroundColor: Colors.systemGray,
			}}>
				<Text style={{fontSize: 14, color: Colors.black, fontWeight: 'bold'}}>{header}</Text>
			</View>
		)
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: Colors.white}}>
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
