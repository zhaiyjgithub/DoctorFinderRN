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

export default class DoctorInfoViewController extends Component{
	static defaultProps = {
		info: null
	}

	constructor(props) {
		super(props)

		this.dataSource = [
			'q',
		]
	}

	componentDidMount() {
		// Navigation.mergeOptions(this.props.componentId, {
		// 	topBar: {
		// 		rightButtons: [
		// 			{
		// 				id: 'buttonOne',
		// 				text: 'Button one',
		// 				enabled: true,
		// 				disableIconTint: false,
		// 				color: Colors.white,
		// 				disabledColor: 'black',
		// 				testID: 'buttonOneTestID',
		// 				fontFamily: 'Helvetica',
		// 				fontSize: 16,
		// 				fontWeight: 'regular', // Available on iOS only, will ignore fontFamily style and use the iOS system fonts instead. Supported weights are: 'regular', 'bold', 'thin', 'ultraLight', 'light', 'medium', 'semibold', 'heavy' and 'black'.
		// 				// Android only
		// 				showAsAction: 'ifRoom', // See below for details.
		// 				// iOS only
		// 				systemItem: 'done', // Sets a system bar button item as the icon. Matches UIBarButtonSystemItem naming. See below for details.
		// 			}
		// 		]
		// 	}
		// })
	}

	renderItem(item) {
		return (
			<DoctorInfoHeaderItem
				id = {10}
				info = {this.props.info}
			/>
		)
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.white}}>
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
