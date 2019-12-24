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
import {ScreenDimensions} from '../../utils/Dimensions';
import {Navigation} from 'react-native-navigation'
import Swiper from 'react-native-swiper'
import DoctorInfoItem from './view/DoctorInfoItem';

const BannerScale = (375.0/190.0)

export default class HomePageViewController extends Component{
	constructor(props) {
		super(props)

		this.setTopBarView(false)
		this.isHasShowTopBarSearchBar = false

		this.topSpecialtyList = [
			'Pediatrics',
			'Gastroenterology',
			'dermatology',
			'Gerontology',
			'orthopedics',
			'Oncology',
			'Ophthalmology',
			'Endocrinologists',
			'ENT-Otolaryngologists',
			'more'
		]
	}

	componentDidMount() {

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
			console.log(isShow + ' - ' + this.isHasShowTopBarSearchBar)
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
					this.setTopBarView(true)
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
			'Pediatrics',
			'Gastroenterology',
			'dermatology',
			'Gerontology',
			'orthopedics',
		]

		let topSpecialtyListLine2 = [
			'Pediatrics',
			'Gastroenterology',
			'dermatology',
			'Gerontology',
			'orthopedics',
		]

		return(
			<View style={{backgroundColor: Colors.white, paddingBottom: 10,}}>
				<View style={{width: ScreenDimensions.width, paddingHorizontal: 16,
					flexDirection: 'row',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
				}}>
					{topSpecialtyListLine1.map((item, index) => {
						return (
							<TouchableOpacity style={{
								width: 50, height: 50, borderRadius: 25,
								backgroundColor: Colors.red,
								marginTop: 10,
							}}>

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
							<TouchableOpacity style={{
								width: 50, height: 50, borderRadius: 25,
								backgroundColor: Colors.red,
								marginTop: 10,
							}}>
							</TouchableOpacity>
						)
					})}
				</View>
			</View>
		)
	}

	renderItem() {
		return(
			<DoctorInfoItem />
		)
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<SectionList
					renderItem={({item}) => this.renderItem(item)}
					sections={[{data: ['a', 'c']}]}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					ListHeaderComponent={() => {
						return this.renderListFooter()
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
							<View style={{width: ScreenDimensions.width, height: 104,}}/>
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
