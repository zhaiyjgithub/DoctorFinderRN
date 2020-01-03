import React, {Component} from 'react';
import {Alert, Image, ImageBackground, SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../utils/Styles';
import {ScreenDimensions} from '../../utils/Dimensions';
import {Navigation} from 'react-native-navigation';
import Swiper from 'react-native-swiper';
import DoctorInfoItem from './view/DoctorInfoItem';
import {HTTP} from '../../utils/HttpTools';
import {API_Doctor} from '../../utils/API';
import {ErrorCode} from '../../utils/CustomEnums';
import ActionSheet from 'react-native-actionsheet';

const BannerScale = (375.0/190.0)

export default class HomePageViewController extends Component{
	constructor(props) {
		super(props)

		this.state = {
			hotSearchDoctors: []
		}

		this.setTopBarView(false)
		this.isHasShowTopBarSearchBar = false
	}

	componentDidMount() {
		HTTP.post(API_Doctor.getHotSearchDoctors, null).then((response) => {
			if (response.code === ErrorCode.Ok) {
				this.setState({hotSearchDoctors: response.data})
			}
		}).catch(() => {
			//
		})
	}

	setTopBarView(isShow) {
		if (isShow && isShow !== this.isHasShowTopBarSearchBar) {
			this.isHasShowTopBarSearchBar = true
			Navigation.mergeOptions(this.props.componentId, {
				topBar: {
					title: {
						component: {
							name: 'SearchBar',
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
		return(
			<View style={{
				backgroundColor: Colors.white,
				paddingVertical: 5,
			}}>
				<TouchableOpacity onPress={() => {
					this.showActionSheet()
				}} style={{
					width: ScreenDimensions.width - 32,
					height: 36,
					backgroundColor: Colors.searchBar,
					flexDirection: 'row',
					alignItems: 'center',
					marginLeft: 16,
					borderRadius: 6,
				}}>
					<Image source={require('../../../resource/image/home/Search.png')} style={{marginLeft: 10, marginRight: 10}}/>
					<Text style={{fontSize: 18, color: Colors.darkGray}}>{'Search'}</Text>
				</TouchableOpacity>
			</View>
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

	renderListFooter() {
		return(
			<React.Fragment>
				{this.renderSearchBar()}
				{this.renderBanner()}
				{this.renderSpecialty()}
			</React.Fragment>
		)
	}

	renderSpecialty() {
		let topSpecialtyListLine1 = [
			'Internal Medicine',
			'OB/GYN',
			'Pediatrics',
			'Cardiology',

		]

		let topSpecialtyListLine2 = [
			'Dermatology',
			'Nephrology',
			'Urology',
			'Ophthalmology',

		]

		let topSpecialtyListLine3 = [
			'Orthopedic Surgery',
			'Otolaryngology ENT',
			'Oncology',
			'More',
		]

		let containerWidth = (ScreenDimensions.width - 32 - 3*8)/4.0
		return(
			<View style={{backgroundColor: Colors.white, paddingBottom: 10,}}>
				<View style={{width: ScreenDimensions.width, backgroundColor: Colors.clear,
					justifyContent: 'center', height: 40
				}}>
					<Text style={{fontSize: 18, color: Colors.black,
						fontWeight: 'bold', marginLeft: 8,
					}}>{'Specialty'}</Text>
				</View>
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
								<Text  style={{maxWidth: containerWidth, fontSize: 14,
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
								<Text numberOfLines={2} style={{maxWidth: containerWidth, fontSize: 14,
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
								<Image style={{width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.blue}}/>
								<Text numberOfLines={2} style={{maxWidth: containerWidth, fontSize: 14,
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

					}},
			],
			{ cancelable: false }
		)
	}

	pushToDoctorInfoPage(item) {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'DoctorInfoViewController',
				passProps: {
					info: item,
				},
				options: {
					topBar: {
						title: {
							text: ''
						},
						backButton: {
							title: ''
						}
					},
				}
			}
		});
	}

	renderItem(item) {
		return(
			<DoctorInfoItem
				id = {item.ID}
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

	renderSectionHeader() {
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

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<SectionList
					renderItem={({item}) => this.renderItem(item)}
					sections={[{data: this.state.hotSearchDoctors}]}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					ListHeaderComponent={() => {
						return this.renderListFooter()
					}}

					renderSectionHeader={() => {
						return this.renderSectionHeader()
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
								paddingBottom: 20,
							}}>
								<Text style={{fontSize: 12, color: Colors.lightGray}}>{'Click \'Search\' and get more information.'}</Text>
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
