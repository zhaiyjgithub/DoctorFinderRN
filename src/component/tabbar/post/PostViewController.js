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
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {Gender, PLATFORM} from '../../utils/CustomEnums';
import PostItem from './view/PostItem';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';

export default class PostViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			dataSource: ['a', 'c']
		}
	}

	renderItem() {
		return(
			<PostItem />
		)
	}

	renderHeader() {
		return(
			<View style={{width: '100%', height: 16, backgroundColor: Colors.clear}}/>
		)
	}

	renderFabButton() {
		return(
			<TouchableOpacity onPress={() => {
				this.pushToNewPostPage()
			}} style={{position: 'absolute', right: 16, bottom: TabBar.height + 32, backgroundColor: Colors.theme,
				borderRadius: 25, width: 50, height: 50, justifyContent: 'center', alignItems: 'center',
				shadowRadius: 8,
				shadowColor: Colors.theme,
				shadowOpacity: 0.5,
				shadowOffset: {width: 0, height: 0},
				elevation: 2,
			}}>
				<Image source={require('../../../resource/image/post/add.png')} style={{width: 25, height: 25, }}/>
			</TouchableOpacity>
		)
	}

	pushToNewPostPage() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'NewPostViewController',
				passProps: {

				},
				options: BaseNavigatorOptions('New Post')
			}
		})
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<FlatList
					style={{flex: 1}}
					renderItem={({item}) => this.renderItem(item)}
					data={this.state.dataSource}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}

					ListHeaderComponent={() => {
						return this.renderHeader()
					}}
				/>

				{this.renderFabButton()}
			</View>
		)
	}
}
