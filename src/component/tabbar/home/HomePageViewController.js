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

const BannerScale = (375.0/190.0)

export default class HomePageViewController extends Component{
	constructor(props) {
		super(props)

		this.state = {
			dataSource: [{section: 0, data: [{section: 0,}]}],
		}

		this.setTopBarView(false)
		this.isHasShowTopBarSearchBar = false
	}

	componentDidMount() {
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

	goToSearch(searchContent) {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'DoctorSearchResultListViewController',
				passProps: {
					searchContent: searchContent ? searchContent : ''
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
								onSubmitEditing: (searchContent) => {
									this.goToSearch(searchContent)
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
				onSubmitEditing={(searchContent) => {
					this.goToSearch(searchContent)
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
					activeDotColor ={Colors.systemGray}
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
		if (specialty === 'More') {

		}
	}
	// 儿科
	// 手术
	// 皮肤科
	// 止痛药
	// 家庭医学
	// 骨科
	// 内科
	// 耳鼻喉科
	// 过敏与免疫学
	// 眼科
	// 泌尿科

	renderSpecialty() {
		let topSpecialtyListLine1 = [
			'Pediatrics',
			'Surgery',
			'Dermatology',
			'Pain Medicine',
		]

		let topSpecialtyListLine2 = [
			'Family Medicine',
			'Orthopaedic',
			'Internal Medicine',
			'Obstetrics & Gynecology',

		]

		let topSpecialtyListLine3 = [
			'Allergy & Immunology',
			'Chiropractor',
			'Urology',
			'More',
		]

		let containerWidth = (ScreenDimensions.width - 32 - 3*8)/4.0
		return(
			<View style={{backgroundColor: Colors.white, paddingBottom: 10,}}>
				<View style={{width: ScreenDimensions.width, paddingHorizontal: 16,
					flexDirection: 'row',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
				}}>
					{topSpecialtyListLine1.map((item, index) => {
						return (
							<TouchableOpacity key={index} style={{
								width: containerWidth,
								marginTop: 10,
								alignItems: 'center'
							}}>
								<Image style={{width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.blue}}/>
								<Text  style={{maxWidth: containerWidth, fontSize: 12,
									marginTop: 8,
									textAlign: 'center',
									color: Colors.black}}>{item}</Text>
							</TouchableOpacity>
						)
					})}
				</View>

				<View style={{width: ScreenDimensions.width, paddingHorizontal: 16,
					flexDirection: 'row',
					justifyContent: 'space-between',
					flexWrap: 'wrap'
				}}>
					{topSpecialtyListLine2.map((item, index) => {
						return (
							<TouchableOpacity key={index} style={{
								width: containerWidth,
								marginTop: 10,
								alignItems: 'center'
							}}>
								<Image style={{width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.blue}}/>
								<Text numberOfLines={2} style={{maxWidth: containerWidth, fontSize: 12,
									marginTop: 8,
									textAlign: 'center',
									color: Colors.black}}>{item}</Text>
							</TouchableOpacity>
						)
					})}
				</View>

				<View style={{width: ScreenDimensions.width, paddingHorizontal: 16,
					flexDirection: 'row',
					justifyContent: 'space-between',
					flexWrap: 'wrap'
				}}>
					{topSpecialtyListLine3.map((item, index) => {
						return (
							<TouchableOpacity key={index} style={{
								width: containerWidth,
								marginTop: 10,
								alignItems: 'center'
							}}>
								<Image source={require('../../../resource/image/home/fei.png')} style={{width: 25, height: 25,}}/>
								<Text numberOfLines={2} style={{maxWidth: containerWidth, fontSize: 12,
									marginTop: 8,
									textAlign: 'center',
									color: Colors.black}}>{item}</Text>
							</TouchableOpacity>
						)
					})}
				</View>
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
				<View style={{width: ScreenDimensions.width, backgroundColor: Colors.systemGray,
					justifyContent: 'center', height: 40,
				}}>
					<Text style={{fontSize: 18, color: Colors.black,
						fontWeight: 'bold', marginLeft: 8,
					}}>{'Specialty'}</Text>
				</View>
			)
		}else {
			return (
				<View style={{width: ScreenDimensions.width, backgroundColor: Colors.systemGray,
					justifyContent: 'center', height: 40,
				}}>
					<Text style={{fontSize: 18, color: Colors.black,
						fontWeight: 'bold', marginLeft: 8,
					}}>{'Hot search'}</Text>
				</View>
			)
		}

	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
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
						let y = event.nativeEvent.contentOffset.y

						if (y > 46) {
							this.setTopBarView(true)
						}else {
							this.setTopBarView(false)
						}

					}}
					ListFooterComponent={() => {
						return (
							<View style={{width: ScreenDimensions.width,
								justifyContent: 'center', alignItems: 'center',
								paddingBottom: TabBar.height,
							}}>
								<Text style={{fontSize: 12, color: Colors.lightGray}}>{'Click \'Search bar\' and get more information.'}</Text>
							</View>
						)
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
