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
	AppState, TouchableOpacity, Image, Text, RefreshControl, SectionList,
} from 'react-native';
import {ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {Colors} from '../../utils/Styles';
import RouterEntry from '../../router/RouterEntry';
import {CacheDB} from '../../utils/DBTool';
import {DBKey} from '../../utils/CustomEnums';

export default class MineViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [{data:[
				{title: 'Email', type: ItemType.email},

				]},

				{data:[
						{title: 'My track', type: ItemType.track},
						{title: 'My favorite', type: ItemType.favor},
						{title: 'My post', type: ItemType.post},
					]},

				{data:[
						{title: 'Reset password', type: ItemType.resetPassword},
						{title: 'Feedback', type: ItemType.feedback},
						{title: 'About', type: ItemType.about},
					]},
			]
		}
	}

	didSelectedItem(type) {
		switch (type) {
			case ItemType.signOut:
				this.showSignOutAlert()

				break
			default: ;
		}
	}

	showSignOutAlert() {
		Alert.alert(
			'Do you want to sign out?',
			'Sign out.',
			[
				{text: 'Cancel', onPress: () => {
						// this.signOut()
					}, style: 'cancel'},
				{text: 'Okay', onPress: () => {
						this.signOut()
					}, style: 'cancel'},
			],
			{ cancelable: false }
		)
	}

	signOut() {
		CacheDB.remove(DBKey.userInfo)
		RouterEntry.guide()
	}

	renderListHeader() {
		return(
			<View style={{width: '100%', backgroundColor: Colors.red, height: 92,}}>
				<View style={{position: 'absolute', left: 0, right: 0, top: 0, height: 16 + 30, backgroundColor: Colors.theme}}/>
				<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 16 + 30, backgroundColor: Colors.systemGray}}/>

				<TouchableOpacity style={{position: 'absolute', left: 16, top: 16, width: 60, height: 60,
					borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: Colors.white,
					backgroundColor: Colors.white, overflow: 'hidden'
				}}>
					<Image source={require('../../../resource/image/base/avatar.jpg')} style={{width: 60, height: 60,}}/>
				</TouchableOpacity>

				<Text numberOfLines={1} style={{position: 'absolute', left: 16 + 60 + 8, bottom: 16 + 30, width: (ScreenDimensions.width - (16 + 60 + 8 + 8)),
						fontSize: 20, fontWeight: 'bold', color: Colors.white
					}}>{'Zack'}</Text>
			</View>
		)
	}

	renderItem(item) {
		return(
			<TouchableOpacity onPress={() => {

			}} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
				backgroundColor: Colors.white
			}}>
				<Text style={{fontSize: 18, color: Colors.black, marginLeft: 16}}>
					{item.title}
				</Text>

				<Image source={require('../../../resource/image/base/right_arrow.png')} style={{width: 8, height: 14, marginRight: 16,}}/>

				<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.0, backgroundColor: Colors.lineColor}}/>
			</TouchableOpacity>
		)
	}

	renderListSectionHeader() {
		return(
			<View style={{height: 16, backgroundColor: Colors.systemGray}}>
				<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.0, backgroundColor: Colors.lineColor}}/>
			</View>
		)
	}

	renderListFooter() {
		let item = {title: 'Sign out', type: ItemType.signOut}
		return (
			<View style={{width: ScreenDimensions.width,
				paddingBottom: TabBar.height + 16,
			}}>
				{this.renderListSectionHeader()}

				<TouchableOpacity onPress={() => {
					this.didSelectedItem(ItemType.signOut)
				}} style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
					backgroundColor: Colors.white
				}}>
					<Text style={{fontSize: 18, color: Colors.red, marginLeft: 16}}>
						{item.title}
					</Text>
					<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.0, backgroundColor: Colors.lineColor}}/>
				</TouchableOpacity>
			</View>
		)
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.white}}>
				<View style={{width: '100%', height: ScreenDimensions.height/2.0, backgroundColor: Colors.theme,
					position: 'absolute', left: 0, top: 0,
				}}/>
				<View style={{flex: 1, backgroundColor: Colors.clear}}>
					<SectionList
						style={{flex: 1, backgroundColor: Colors.systemGray}}
						renderItem={({item}) => this.renderItem(item)}
						sections={this.state.dataSource}
						stickySectionHeadersEnabled={false}
						keyExtractor={(item, index) => {
							return 'key' + item.key + index
						}}
						ListHeaderComponent={() => {
							return this.renderListHeader()
						}}

						renderSectionHeader={({section}) => {
							return this.renderListSectionHeader()
						}}

						ListFooterComponent={() => {
							return this.renderListFooter()
						}}
					/>
				</View>
			</View>
		)
	}
}

const ItemType = {
	email: 0,
	track: 1,
	favor: 2,
	post: 3,
	resetPassword: 4,
	feedback: 5,
	about: 6,
	signOut: 7,
}
