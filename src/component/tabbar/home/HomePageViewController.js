import React, {Component} from 'react';
import {Alert, Image, ImageBackground, SectionList, StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';
import {Colors} from '../../utils/Styles';
import {ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {Navigation} from 'react-native-navigation';
import Swiper from 'react-native-swiper';
import DoctorInfoItem from './view/DoctorInfoItem';
import {HTTP} from '../../utils/HttpTools';
import {API_Doctor} from '../../utils/API';
import {ErrorCode, SearchBarType} from '../../utils/CustomEnums';
import SearchBar from './view/SearchBar';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import Permissions from 'react-native-permissions'
import GeoLocation from "@react-native-community/geolocation";
import {UserTrack} from '../../utils/UserTrack';
import {DLogger} from '../../utils/Utils';
import {MapAppKey} from '../../../conf/Conf';

const BannerScale = (375.0/190.0)

export default class HomePageViewController extends Component{
	constructor(props) {
		super(props)

		this.state = {
			dataSource: [{section: 0, data: [{section: 0,}]}],
		}
		this.addGlobalScreenEventListener()

		this.setTopBarView(false)
		this.isHasShowTopBarSearchBar = false
	}

	componentDidMount() {
		this.checkLocationPermission()
		this.getHotSearchDoctors()
	}

	componentWillUnmount() {
		this.screenEventListener && this.screenEventListener.remove()
		this.screenEventListener = null

		this.ScreenDisappearListener && this.ScreenDisappearListener.remove()
		this.ScreenDisappearListener = null
	}

	checkLocationPermission() {
		Permissions.check('location')
		.then(response => {
			switch (response) {
				case 'authorized':
					this.updateUserPosition()
					break;
				case 'denied':
					break;
				case 'restricted':
					break;
				case 'undetermined':
					this.requestLocationPermission();
					break;
				default:
					break;
			}
		}).catch(() => {
			this.requestLocationPermission();
		});
	}

	requestLocationPermission() {
		Permissions.request('location')
		.then(response => {
			switch (response) {
				case 'authorized':
					this.updateUserPosition()
					break;
				default:
					break
			}
		}).catch(() => {
		});
	}

	updateUserPosition() {
		this.getCurrentPosition((info) => {
			if (info && info.coords) {
				UserPosition.lat = info.coords.latitude
				UserPosition.lng = info.coords.longitude

				this.reverseCoordToAddress(UserPosition.lat, UserPosition.lng)
			}
		})
	}

	getCurrentPosition(onSuccess, onError, error3) {
		GeoLocation.getCurrentPosition(
			(position) => onSuccess(position),
			(err) => {
				if (err.code === 3 && !error3) {
					this.getCurrentPosition(onSuccess, onError, true);
				} else {
					onError && onError(err);
				}
			},
			{ enableHighAccuracy: !error3, timeout: 1000 },
		)
	}

	reverseCoordToAddress(lat, lng) {
		//'http://www.mapquestapi.com/geocoding/v1/reverse?key=lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24&location=40.7461,-74.0&includeRoadMetadata=false&includeNearestIntersection=false'
		let url = 'http://www.mapquestapi.com/geocoding/v1/reverse?key=' + MapAppKey +  '&location=' + lat + ',' + lng  + '&includeRoadMetadata=false&includeNearestIntersection=false'
		fetch(url, {
			credentials: 'include',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			return response.json()
		}).then((data) => {
			console.log(JSON.stringify(data))
			if (data && data.results.length) {
				let locations = data.results[0].locations
				if (locations && locations.length) {
					let location = locations[0]
					let state = location.adminArea3
					let city = location.adminArea4

					UserPosition.city = city
					UserPosition.state = state
				}
			}
		}).catch((error) => {
			console.log(error)
		})
	}

	addGlobalScreenEventListener() {
		// Subscribe
		this.beginTime = (new Date()).toISOString()

		this.ScreenDisappearListener = Navigation.events().registerComponentDidDisappearListener(({ componentId, componentName }) => {
			DLogger('Did Disappear: ' + componentId + ' - ' + componentName + ' - ')
			this.endTime = (new Date()).toISOString()

			DLogger(this.beginTime + ' - ' + this.endTime)
			UserTrack.trackView(componentName, this.beginTime, this.endTime)

			UserTrack.uploadTrackEvents()
		});

		this.screenEventListener = Navigation.events().registerComponentDidAppearListener(({ componentId, componentName, passProps }) => {
			DLogger('Did Appear: ' + componentId + ' - ' + componentName + ' - ')

			this.currentComponentName = componentName
			this.beginTime = (new Date()).toISOString()
		});
	}

	getHotSearchDoctors() {
		HTTP.post(API_Doctor.getHotSearchDoctors, null).then((response) => {
			if (response.code === ErrorCode.Ok) {
				let list = response.data.map((item, index) => {
					return Object.assign({section: 1}, item)
				})

				this.setState({dataSource: this.state.dataSource.concat({section: 1, data: list})})
			}
		}).catch(() => {
			//
		})
	}

	goToSearch(searchContent = '', specialty = '') {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'DoctorSearchResultListViewController',
				passProps: {
					searchContent: searchContent ? searchContent : '',
					specialty: specialty
				},
				options: BaseNavigatorOptions()
			}
		});
	}

	setTopBarView(isShow) {
		if (isShow && isShow !== this.isHasShowTopBarSearchBar) {
			this.isHasShowTopBarSearchBar = true
			Navigation.mergeOptions(this.props.componentId, {
				topBar: {
					title: {
						component: {
							name: 'SearchBar',
							passProps:{
								type: SearchBarType.max,
								placeholder: 'e.g. Smith',
								onSubmitEditing: (searchContent) => {
									this.goToSearch(searchContent, '')
								}
							}
						}
					}
				}
			});
		} else {
			if (isShow === false && isShow !== this.isHasShowTopBarSearchBar) {
				this.isHasShowTopBarSearchBar = false
				Navigation.mergeOptions(this.props.componentId, {
					topBar: {
						title: {
							component: {
								name: 'HomePageTitleView',
								passProps: {
									title: 'Find a Doctor'
								}
							}
						}
					}
				});
			}
		}
	}

	renderSearchBar() {
		return (
			<SearchBar
				type = {SearchBarType.normal}
				placeholder={'e.g. Smith'}
				onSubmitEditing={(searchContent) => {
					this.goToSearch(searchContent, '')
				}}
			/>
		)
	}

	renderBanner() {
		return (
			<Swiper style={{}}
					height={(ScreenDimensions.width/BannerScale)}
					showsButtons={false}
					autoplay={true}
					activeDotColor ={Colors.listBg}
			>
				<ImageBackground source={require('../../../resource/image/banner.png')} style={styles.Banner}>
					<Text style={{fontSize:  24, color: Colors.white, fontWeight: 'bold'}}>Hello Swiper</Text>
				</ImageBackground>
				<ImageBackground source={require('../../../resource/image/banner.png')} style={styles.Banner}>
					<Text style={{fontSize:  24, color: Colors.white, fontWeight: 'bold'}}>Hello Swiper</Text>
				</ImageBackground>

				<ImageBackground source={require('../../../resource/image/banner.png')} style={styles.Banner}>
					<Text style={{fontSize:  24, color: Colors.white, fontWeight: 'bold'}}>Hello Swiper</Text>
				</ImageBackground>
			</Swiper>
		)
	}

	renderListHeader() {
		return(
			<View>
				{this.renderSearchBar()}
				{this.renderBanner()}
			</View>
		)
	}

	didSelectSpecialty(specialty) {
		let eventName = this.currentComponentName + '-' + 'specialty' + '-' + specialty
		UserTrack.trackAction(eventName)

		if (specialty === 'More') {
			this.pushToSpecialtyListPage()
		}else {
			this.goToSearch('', specialty)
		}
	}

	pushToSpecialtyListPage() {
		Navigation.showModal({
			stack: {
				children: [{
					component: {
						name: 'SpecialtyViewController',
						passProps: {
							selectedSpecialty: this.state.specialty,
							didSelectedSpecialty: (specialty) => {
								setTimeout(() => {
									this.goToSearch('', specialty)
								}, 600)
							}
						},
						options: BaseNavigatorOptions('Specialty')
					}
				}]
			}
		});
	}

	renderSpecialty() {
		let list = [
			'Family Medicine',
			'Pediatrics',
			'Obstetrics & Gynecology',
			'Dermatology',
			"Psychiatry",
			"Ophthalmology",
			"Otolaryngology (ENT)",
			"Gastroenterology",
			'More',
		]

		return(
			<View style={{padding: 8, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: Colors.white}}>
				{list.map((item, index) => {
					return(
						<TouchableOpacity onPress={() => {
							this.didSelectSpecialty(item)
						}} key={index} style={{borderRadius: 15, borderWidth: 1.0, borderColor: Colors.theme,
							marginRight: 8, height: 30, justifyContent: 'center', marginBottom: 8, backgroundColor: Colors.listBg
						}}>
							<Text style={{fontSize: 16, color: Colors.theme, paddingHorizontal: 8, fontWeight: 'bold'}}>{item}</Text>
						</TouchableOpacity>
					)
				})}
			</View>
		)
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
		Navigation.push(this.props.componentId, {
			component: {
				name: 'DoctorInfoViewController',
				passProps: {
					info: item,
				},
				options: BaseNavigatorOptions()
			}
		})
	}

	renderItem(item) {
		if (item.section === 0) {
			return this.renderSpecialty()
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

	renderSectionHeader(section) {
		if (section === 0) {
			return (
				<View style={{width: ScreenDimensions.width, backgroundColor: Colors.listBg,
					justifyContent: 'center', height: 40,
				}}>
					<Text style={{fontSize: 18, color: Colors.black,
						fontWeight: 'bold', marginLeft: 8,
					}}>{'Specialty'}</Text>
				</View>
			)
		}else {
			return (
				<View style={{width: ScreenDimensions.width, backgroundColor: Colors.listBg,
					justifyContent: 'center', height: 40,
				}}>
					<Text style={{fontSize: 18, color: Colors.black,
						fontWeight: 'bold', marginLeft: 8,
					}}>{'Pop Doctors'}</Text>
				</View>
			)
		}

	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.listBg}}>
				<SectionList
					renderItem={({item}) => this.renderItem(item)}
					sections={this.state.dataSource}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					ListHeaderComponent={() => {
						return this.renderListHeader()
					}}

					renderSectionHeader={({section}) => {
						return this.renderSectionHeader(section.section)
					}}

					onScroll={(event) => {
						const y = event.nativeEvent.contentOffset.y

						if (y > 46) {
							this.setTopBarView(true)
						}else {
							this.setTopBarView(false)
						}

					}}
					ListFooterComponent={() => {
						const {dataSource} = this.state
						if (dataSource.length > 1 && dataSource[1].data.length) {
							return (
								<View style={{width: ScreenDimensions.width,
									justifyContent: 'center', alignItems: 'center',
									paddingBottom: TabBar.height,
								}}>
									<Text style={{fontSize: 14, color: Colors.lightGray}}>{'Click \'Search bar\' and get more information.'}</Text>
								</View>
							)
						}

						return null
					}}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	BannerContainer: {

	},
	Banner: {
		alignItems: 'center',
		justifyContent: 'center',
		width: ScreenDimensions.width,
		height: (ScreenDimensions.width)/BannerScale
	}
})
