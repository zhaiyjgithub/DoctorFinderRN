import React, {Component} from 'react'
import {
	FlatList,
	View,
	StyleSheet,
	Platform,
	Alert,
	DeviceEventEmitter,
	NativeModules,
	Animated,
	Linking,
	ScrollView,
	AppState, TouchableOpacity, Image, Text, SectionList,
	ImageBackground
} from 'react-native'
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions} from '../../utils/Dimensions';
import {Navigation} from 'react-native-navigation'
import Swiper from 'react-native-swiper'
import DoctorInfoItem from './view/DoctorInfoItem';
import {HTTP} from '../../utils/HttpTools';
import {API_Doctor} from '../../utils/API';
import {ErrorCode} from '../../utils/CustomEnums';
import DoctorInfoHeaderItem from './view/DoctorInfoHeaderItem';
import DoctorInfoTextItem from './view/DoctorInfoTextItem';
import DoctorInfoAddressItem from './view/DoctorInfoAddressItem';

export default class DoctorInfoViewController extends Component{
	static defaultProps = {
		info: null
	}

	static options(passProps) {
		return {
			topBar: {
				rightButtons: [
					{
						id: 'share',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						icon: require('../../../resource/image/home/share.png'),
					},
					{
						id: 'star',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						icon: require('../../../resource/image/home/star.png'),
					},
				]
			}
		};
	}


	constructor(props) {
		super(props)
		this.state = {
			doctorInfo: null
		}

		this.dataSource = [
			menuType.header,
			menuType.summary,
			menuType.language,
			menuType.address,
			menuType.education,
			menuType.certification,
			menuType.award,
			menuType.memberShip,
			menuType.affiliation,
			menuType.clinic
		]

		this.navigationEventListener = Navigation.events().bindComponent(this);
	}

	componentDidMount() {
		this.props.info && this.getDoctorInfoWithNpi(this.props.info.Npi)
	}

	componentWillUnmount() {
		this.navigationEventListener && this.navigationEventListener.remove();
	}

	navigationButtonPressed({ buttonId }) {
		alert(buttonId)
	}


	getDoctorInfoWithNpi(npi) {
		let param = {
			Npi: npi
		}

		HTTP.post(API_Doctor.getDoctorInfoWithNpi, param).then((response) => {
			this.setState({doctorInfo: response.data})
		}).catch(() => {

		})
	}

	renderItem(type) {
		if (!this.props.info) {
			return null
		}

		if (type !== menuType.header && type !== menuType.summary && !this.state.doctorInfo) {
			return null
		}

		if (type === menuType.header) {
			return (
				<DoctorInfoHeaderItem
					id = {10}
					info = {this.props.info}
				/>
			)
		}else if (type === menuType.summary) {
			return (
				<DoctorInfoTextItem
					title = {'Summary'}
					desc = {this.props.info.Summary}
				/>
			)
		}else if (type === menuType.language) {
			return (
				<DoctorInfoTextItem
					title = {'Other Language'}
					desc = {this.state.doctorInfo.Lang.Lang}
				/>
			)
		}else if (type === menuType.address) {
			if (!this.state.doctorInfo) {
				return null
			}

			let address = this.props.info.Address +'\n' + this.props.info.City + ' City\n'
				+ this.props.info.State + ' ' + this.props.info.Zip

			return (
				<DoctorInfoAddressItem
					title = {'Address'}
					desc = {address}
					lat = {this.state.doctorInfo.Geo.Lat}
					lng = {this.state.doctorInfo.Geo.Lng}
				/>
			)
		}else if (type === menuType.education) {
			if (!this.state.doctorInfo) {
				return null
			}

			return (
				<DoctorInfoTextItem
					title = {'Education & Training'}
					list = {this.state.doctorInfo.Education}
				/>
			)
		}else if (type === menuType.certification) {
			if (!this.state.doctorInfo) {
				return null
			}

			return (
				<DoctorInfoTextItem
					title = {'Certifications & Licensure'}
					list = {this.state.doctorInfo.Certification}
				/>
			)
		}else if (type === menuType.award) {
			if (!this.state.doctorInfo) {
				return null
			}

			return (
				<DoctorInfoTextItem
					title = {'Awards, Honors, & Recognition'}
					list = {this.state.doctorInfo.Award}
				/>
			)
		}else if (type === menuType.memberShip) {
			if (!this.state.doctorInfo) {
				return null
			}

			return (
				<DoctorInfoTextItem
					title = {'Professional Memberships'}
					list = {this.state.doctorInfo.MemberShip}
				/>
			)
		}else if (type === menuType.affiliation) {
			if (!this.state.doctorInfo) {
				return null
			}

			return (
				<DoctorInfoTextItem
					title = {'Professional Memberships'}
					list = {this.state.doctorInfo.Affiliation}
				/>
			)
		}else if (type === menuType.clinic) {
			if (!this.state.doctorInfo) {
				return null
			}

			return (
				<DoctorInfoTextItem
					title = {'Clinical Trials'}
					list = {this.state.doctorInfo.Clinic}
				/>
			)
		}
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<FlatList
					style={{flex: 1}}
					renderItem={({item}) => this.renderItem(item)}
					data={this.dataSource}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					// ListHeaderComponent={() => {
					// 	return this.renderListFooter()
					// }}


					// onScroll={(event) => {
					// 	let y = event.nativeEvent.contentOffset.y
					//
					// 	if (y > 46) {
					// 		this.setTopBarView(true)
					// 	}else {
					// 		this.setTopBarView(false)
					// 	}
					//
					// }}
					// ListFooterComponent={() => {
					// 	return (
					// 		<View style={{width: ScreenDimensions.width,
					// 			justifyContent: 'center', alignItems: 'center',
					// 			paddingBottom: 20,
					// 		}}>
					// 			<Text style={{fontSize: 12, color: Colors.lightGray}}>{'Click \'Search\' and get more information.'}</Text>
					// 		</View>
					// 	)
					// }}
				/>
			</View>
		)
	}
}

const menuType = {
	header: 0,
	summary: 1,
	language: 2,
	address: 3,
	education: 4,
	certification: 5,
	award: 6,
	memberShip: 7,
	affiliation: 8,
	clinic: 9,
}
