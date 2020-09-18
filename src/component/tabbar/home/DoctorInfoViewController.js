import React, {Component} from 'react';
import {Alert, Linking, SectionList, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../utils/Styles';
import {ScreenDimensions} from '../../utils/Dimensions';
import {Navigation} from 'react-native-navigation';
import DoctorInfoItem from './view/DoctorInfoItem';
import {HTTP} from '../../utils/HttpTools';
import {API_Doctor, API_User} from '../../utils/API';
import {CollectionType, PLATFORM} from '../../utils/CustomEnums';
import DoctorInfoHeaderItem from './view/DoctorInfoHeaderItem';
import DoctorInfoTextItem from './view/DoctorInfoTextItem';
import DoctorInfoAddressItem from './view/DoctorInfoAddressItem';
import {ShareTool} from '../../utils/ShareTool';
import ActionSheet from 'react-native-actionsheet';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import RouterEntry from '../../router/RouterEntry';

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
			},
			bottomTabs: {
				visible: false
			}
		};
	}

	constructor(props) {
		super(props)
		this.state = {
			doctorInfo: null,
			dataSource: [{section: 0, data: [
					{section: 0, type: MenuType.header},
					{section: 0, type: MenuType.summary},
					{section: 0, type: MenuType.language},
					{section: 0, type: MenuType.address},
					{section: 0, type: MenuType.education},
					{section: 0, type: MenuType.certification},
					{section: 0, type: MenuType.award},
					{section: 0, type: MenuType.memberShip},
					{section: 0, type: MenuType.affiliation},
					{section: 0, type: MenuType.clinic}
		]}],
		}

		this.navigationEventListener = Navigation.events().bindComponent(this);
		this.isCollected = false
	}

	componentDidMount() {
		const {info} = this.props
		if (info) {
			this.getDoctorInfoWithNpi(info.Npi)
			this.getRelatedDoctors()
			this.getCollectionStatus()
		}
	}

	componentWillUnmount() {
		this.navigationEventListener && this.navigationEventListener.remove()
	}

	componentDidAppear() {
		const {info} = this.props
		this.doctorName = 'Dr. ' + info.FirstName + ' ' + info.LastName
		if (this._offsetY > 40) {
			this.setTopBarTitle(this.doctorName)
		}else {
			this.setTopBarTitle('')
		}

	}

	componentDidDisappear() {
		//
	}

	navigationButtonPressed({ buttonId }) {
		if (buttonId === 'share') {
			const shareOptions = {
				title: 'Share file',
				url: 'http://www.google.com',
				failOnCancel: false,
				message: 'Your description...'
			}

			ShareTool(shareOptions)
		}else if (buttonId === 'star') {
			if (!UserInfo.Token) {
				this.showNotSignUpAlert()
				return
			}

			if (this.isCollected) {
				this.cancelCollection()
			}else {
				this.addCollection()
			}
		}
	}

	showNotSignUpAlert() {
		Alert.alert(
			'Not Sign In',
			'Oh... You are not sign in now. ',
			[
				{text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
				{text: 'Sign In', onPress: () => {
						RouterEntry.modalSignUp()
					}},
			],
			{ cancelable: false }
		)
	}

	getUserID() {
		return UserInfo.UserID
	}

	setTopBarButtons(isCollected) {
		Navigation.mergeOptions(this.props.componentId, {
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
						icon: isCollected ?   require('../../../resource/image/home/star_selected.png') : require('../../../resource/image/home/star.png'),
					},
				]
			}
		})
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

	getRelatedDoctors() {
		let info = this.props.info
		let doctorInfo = {
			Npi: info.Npi,
			Specialty: info.Specialty,
			City: info.City,
			State: info.State
		}
		HTTP.post(API_Doctor.getRelatedDoctors, doctorInfo).then((response) => {
			this.setState({dataSource: this.state.dataSource.concat({section: 1, data: response.data})})
		}).catch(() => {

		})
	}

	getCollectionStatus() {
		const {info} = this.props
		let param = {
			ObjectID: info.Npi,
			ObjectType: CollectionType.doctor,
			UserID: this.getUserID(),
		}

		HTTP.post(API_Doctor.getCollectionStatus, param).then((response) => {
			this.isCollected = response.data
			this.setTopBarButtons(this.isCollected)
		}).catch(() => {

		})
	}

	addCollection() {
		const {info} = this.props
		let param = {
			ObjectID: info.Npi,
			ObjectType: CollectionType.doctor,
			UserID: this.getUserID(),
		}

		HTTP.post(API_User.addFavorite, param).then((response) => {
			if (response.code === 0) {
				this.isCollected = true
				this.setTopBarButtons(this.isCollected)
			}else {

			}
		}).catch(() => {

		})
	}

	cancelCollection() {
		const {info} = this.props
		let param = {
			ObjectID: info.Npi,
			ObjectType: CollectionType.doctor,
			UserID: this.getUserID(),
		}

		HTTP.post(API_Doctor.deleteCollection, param).then((response) => {
			console.log(response)
			if (response.code === 0) {
				this.isCollected = false
				this.setTopBarButtons(this.isCollected)
			}
		}).catch(() => {

		})
	}

	showQuestionAlert() {
		Alert.alert(
			'Information is incorrect?',
			'Thank you very much for the feedback you can provide us and other users.',
			[
				{text: 'Cancel', onPress: () => {}, style: 'cancel'},
				{text: 'Feedback', onPress: () => {
						this.pushFeedbackViewController()
					}},
			],
			{ cancelable: false }
		)
	}

	pushFeedbackViewController() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'FeedbackViewController',
				passProps: {

				},
				options: BaseNavigatorOptions('Feedback')
			}
		});
	}

	pushToDoctorInfoPage(item) {
		this.setTopBarTitle('')
		Navigation.push(this.props.componentId, {
			component: {
				name: 'DoctorInfoViewController',
				passProps: {
					info: item
				},
				options: BaseNavigatorOptions
			}
		});
	}

	renderItem(item) {
		const {info} = this.props
		const {doctorInfo} = this.state
		if (!info) {
			return null
		}

		if (item.section === 0) {
			let type = item.type
			if (type !== MenuType.header && type !== MenuType.summary && !this.state.doctorInfo) {
				return null
			}

			if (type === MenuType.header) {
				return (
					<DoctorInfoHeaderItem
						id = {10}
						info = {info}
						questionAction = {() => {
							this.showQuestionAlert()
						}}
					/>
				)
			}else if (type === MenuType.summary) {
				return (
					<DoctorInfoTextItem
						title = {'Summary'}
						desc = {info.Summary}
					/>
				)
			}else if (type === MenuType.language) {
				return (
					<DoctorInfoTextItem
						title = {'Other Language'}
						desc = {doctorInfo.Lang.Lang}
					/>
				)
			}else if (type === MenuType.address) {
				if (!doctorInfo) {
					return null
				}

				let address = info.Address

				return (
					<DoctorInfoAddressItem
						title = {'Location'}
						desc = {address}
						lat = {doctorInfo.Geo.Lat}
						lng = {doctorInfo.Geo.Lng}
						gotoRoute = {() => {
							this.selectedAddress = info.Address +'\n' + info.City + ' '
								+ info.State + ' ' + info.Zip
							this.openMap()
						}}
					/>
				)
			}else if (type === MenuType.education) {
				if (!doctorInfo) {
					return null
				}

				return (
					<DoctorInfoTextItem
						title = {'Education & Training'}
						list = {doctorInfo.Education}
					/>
				)
			}else if (type === MenuType.certification) {
				if (!doctorInfo) {
					return null
				}

				return (
					<DoctorInfoTextItem
						title = {'Certifications & Licensure'}
						list = {doctorInfo.Certification}
					/>
				)
			}else if (type === MenuType.award) {
				if (!doctorInfo) {
					return null
				}

				return (
					<DoctorInfoTextItem
						title = {'Awards, Honors, & Recognition'}
						list = {doctorInfo.Award}
					/>
				)
			}else if (type === MenuType.memberShip) {
				if (!doctorInfo) {
					return null
				}

				return (
					<DoctorInfoTextItem
						title = {'Professional Memberships'}
						list = {this.state.doctorInfo.MemberShip}
					/>
				)
			}else if (type === MenuType.affiliation) {
				if (!doctorInfo) {
					return null
				}

				return (
					<DoctorInfoTextItem
						title = {'Professional Memberships'}
						list = {doctorInfo.Affiliation}
					/>
				)
			}else if (type === MenuType.clinic) {
				if (!doctorInfo) {
					return null
				}

				return (
					<DoctorInfoTextItem
						title = {'Clinical Trials'}
						list = {doctorInfo.Clinic}
					/>
				)
			}
		}else {
			return(
				<DoctorInfoItem
					id = {item.Npi}
					info = {item}
					didSelectedItem = {() => {
						this.pushToDoctorInfoPage(item)
					}}

					questionAction = {() => {
						this.showQuestionAlert()
					}}
				/>
			)
		}
	}

	renderRelateDoctorHeader() {
		const {dataSource} = this.state
		if (dataSource.length === 2 &&
			dataSource[1].data &&
			dataSource[1].data.length)
		return(
			<Text style={{width: ScreenDimensions.width, textAlign: 'center',
				fontSize: 16, color: '#202020', lineHeight: 16*1.4,
				paddingTop: 5, paddingBottom: 5,
				backgroundColor: Colors.listBg,
				fontWeight: 'bold'
			}}>
				{'Related doctors'}
			</Text>
		)
	}

	setTopBarTitle(title) {
		Navigation.mergeOptions(this.props.componentId, {
			topBar: {
				title: {
					text: title,
					fontWeight: 'bold',
				},
				backButton: {
					title: ''
				}
			}
		})
	}

	showActionSheet = () => {
		this._actionSheet.show()
	}

	openMap() {
		if (PLATFORM.isIOS) {
			this.showActionSheet()
		}else {
			let url = 'http://maps.google.com/maps?daddr=' + encodeURI(this.selectedAddress)
			Linking.openURL(url).catch(err => console.error('An error occurred', err))
		}
	}

	renderCallButton() {
		return(
			<TouchableOpacity style={{position: 'absolute', left: 30, width: ScreenDimensions.width - 60,
				height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center',
				bottom: PLATFORM.isIPhoneX ? 34 : 20, backgroundColor: Colors.theme
			}}>
				<Text style={{fontSize: 18, color: Colors.white, fontWeight: 'bold'}}>{'Request Now'}</Text>
			</TouchableOpacity>
		)
	}

	renderListFooter() {
		return(
			<View style={{width: ScreenDimensions.width, height: 60, alignItems: 'center'}} />
		)
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.listBg}}>
				<SectionList
					style={{flex: 1}}
					renderItem={({item}) => this.renderItem(item)}
					sections={this.state.dataSource}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}

					renderSectionHeader={({section}) => {
						if (section.section !== 0) {
							return this.renderRelateDoctorHeader()
						}
					}}

					ListFooterComponent={() => {
						return this.renderListFooter()
					}}

					onScroll={(event) => {
						this._offsetY = event.nativeEvent.contentOffset.y

						if (this._offsetY > 40) {
							this.setTopBarTitle(this.doctorName)
						}else {
							this.setTopBarTitle('')
						}
					}}
				/>

				{this.renderCallButton()}

				<ActionSheet
					ref={o => this._actionSheet = o}
					title={'Please select the map you need to navigate'}
					options={['Apple Map', 'Google Map', 'Cancel']}
					destructiveButtonIndex={2}
					onPress={(index) => {
						if (index === 0) {
							let url = 'http://maps.apple.com/?daddr=' + encodeURI(this.selectedAddress)
							Linking.openURL(url).catch(err => console.error('An error occurred', err))
						}else if (index === 1)  {
							let url = 'http://maps.google.com/maps?daddr=' + encodeURI(this.selectedAddress)
							Linking.openURL(url).catch(err => console.error('An error occurred', err))
						}
					}}
				/>
			</View>
		)
	}
}

const MenuType = {
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
