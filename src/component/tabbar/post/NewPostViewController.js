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
	AppState, TouchableOpacity, Image, Text, RefreshControl, SectionList, TextInput,
	Keyboard, Modal,
} from 'react-native';
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {Gender, PLATFORM} from '../../utils/CustomEnums';
import {CameraKitGalleryView} from 'react-native-camera-kit'
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';

export default class NewPostViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			title: '',
			description: '',
			imageObjs: [{selectedId: '', uri: '', type: ImageMenuType.add}]
		}
	}

	pushToGalleryPage() {
		let selectedEventMap = new Map()
		this.state.imageObjs.forEach((item, index) => {
			if (item.selectedId.length) {
				selectedEventMap.set(item.selectedId, item.uri)
			}
		})

		Navigation.push(this.props.componentId, {
			component: {
				name: 'GalleryViewController',
				passProps: {
					selectedEventMap : selectedEventMap,
					doneSelected: (imageMap) => {
						let imageUrls = []
						for (let [key, item] of imageMap) {
							imageUrls.push({selectedId: key, uri: item, type: ImageMenuType.image})
						}

						if (imageUrls.length < 4) {
							imageUrls.push({selectedId: '', uri: '', type: ImageMenuType.add})
						}

						this.setState({imageObjs: imageUrls})
					}
				},
				options: BaseNavigatorOptions('Gallery')
			}
		})
	}

	renderLine() {
		return(
			<View style={{width: ScreenDimensions.width - 20, height: 1, backgroundColor: Colors.lineColor,
			}}/>
		)
	}

	deleteItem(delItem) {
		let list = this.state.imageObjs.filter((item, index) => {
			return item.selectedId !== delItem.selectedId
		})

		let isHasAddItem = false

		for (let i = 0; i < list.length; i ++) {
			let item = list[i]
			if (item.type === ImageMenuType.add) {
				isHasAddItem = true
				break
			}
		}
		if (!isHasAddItem) {
			list.push({selectedId: '', uri: '', type: ImageMenuType.add})
		}

		this.setState({imageObjs: list})
	}

	renderImagePiker() {
		let size = (ScreenDimensions.width - 40 - 30)/4.0
		return(
			<View style={{width: ScreenDimensions.width, flexDirection: 'row', alignItems: 'center', marginTop: 15,
				paddingHorizontal: 20,
			}}>
				{this.state.imageObjs.map((item ,index) => {
					return(
						<View key={index} style={{width: size, height: size, backgroundColor: Colors.systemGray, borderRadius: 6,
							justifyContent: 'center', alignItems: 'center', marginRight: (index  < 3) ? 10 : 0
						}}>
							<TouchableOpacity onPress={() => {
								Keyboard.dismiss()
								if (item.type === ImageMenuType.add) {
									this.pushToGalleryPage()
								}
							}} key={index} style={{width: size, height: size, backgroundColor: Colors.systemGray, borderRadius: 6,
								justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
							}}>
								<Image style={{width: item.type === ImageMenuType.add ? size/2.0 : size, height: item.type === ImageMenuType.add ? size/2.0 : size}} source={item.type === ImageMenuType.add ? require('../../../resource/image/post/add.png') :
									{uri: item.uri}
								}/>
							</TouchableOpacity>

							{item.type !== ImageMenuType.add ? <TouchableOpacity onPress={() => {
								this.deleteItem(item)
							}} style={{position: 'absolute', right: -5, top: -5, width: 20, height: 20, backgroundColor: Colors.white
							}}>
								<Image source={require('../../../resource/image/post/delete.png')} style={{width: 20, height: 20,}}/>
							</TouchableOpacity> : null}
						</View>
					)
				})}
			</View>
		)
	}

	render() {
		let buttonHeight = ScreenDimensions.width*(60.0/375)

		return(
			<TouchableOpacity activeOpacity={1} onPress={() => {
				Keyboard.dismiss()
			}} style={{flex: 1, backgroundColor: Colors.white, }}>
				<Text style={{fontSize: 14, color: Colors.red, width: ScreenDimensions.width - 40, marginLeft: 20,
					marginTop: 15, fontWeight: 'bold'
				}}>{'Please enter something meaningful.'}</Text>

				<View style={{marginLeft: 20}}>
					<TextInput
						numberOfLines={2}
						onChangeText={(text) => {
							this.setState({account: text.trim() + ''})
						}}
						selectionColor = {Colors.theme}
						underlineColorAndroid = {'transparent'}
						placeholder = {'Title'}
						placeholderTextColor={Colors.lightGray}
						style={{width: ScreenDimensions.width - 40, marginTop: 0,
							height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 18,
							color: Colors.black, backgroundColor: Colors.white
						}}/>

					{this.renderLine()}
				</View>

				<TextInput
					multiline={true}
					clearButtonMode={'while-editing'}
					onChangeText={(text) => {
						this.setState({account: text.trim() + ''})
					}}
					selectionColor = {Colors.theme}
					underlineColorAndroid = {'transparent'}
					numberOfLines={1}
					placeholder = {'Description'}
					placeholderTextColor={Colors.lightGray}
					style={{width: ScreenDimensions.width - 40, marginTop: 15,
						height: 200, textAlign: 'left', paddingLeft: 8, fontSize: 16,
						color: Colors.lightBlack, marginLeft: 20, textAlignVertical: 'top', backgroundColor: Colors.systemGray, borderRadius: 4,
					}}/>

				{this.renderImagePiker()}

			</TouchableOpacity>
		)
	}
}


const ImageMenuType = {
	add: 0,
	image: 1,
}
