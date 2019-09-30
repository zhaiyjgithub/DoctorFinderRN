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
	AppState, TouchableOpacity, Image, Text, RefreshControl
} from 'react-native'

export default class HomePageViewController extends Component{
	render() {
		return(
			<View style={{flex: 1, backgroundColor: 'yellow'}}/>
		)
	}
}
