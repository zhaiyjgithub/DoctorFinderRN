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
	AppState, TouchableOpacity, Image, Text, SectionList
} from 'react-native'
import {Colors} from '../../utils/Styles';
import {ScreenDimensions} from '../../utils/Dimensions';
import {Navigation} from 'react-native-navigation'

const BannerScale = (375.0/190.0)

export default class HomePageViewController extends Component{
	constructor(props) {
		super(props)

		this.setTopBarView(false)
		this.isHasShowTopBarSearchBar = false
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
		let bannerHeight = ScreenDimensions.height/(BannerScale)
		return(
			<View>

			</View>
		)
	}

	renderItem() {
		return(
			<Text>{'test'}</Text>
		)
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.white}}>
				<SectionList
					renderItem={({item}) => this.renderItem(item)}
					sections={[{data: ['a', 'c']}]}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					ListHeaderComponent={() => {
						return this.renderSearchBar()
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
