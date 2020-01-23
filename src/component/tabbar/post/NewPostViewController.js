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

export default class NewPostViewController extends Component{

	renderSpeprateLine() {
		return(
			<View style={{width: ScreenDimensions.width - 20, height: 1, backgroundColor: Colors.lineColor,
			}}/>
		)
	}

	renderImagePiker() {
		let size = (ScreenDimensions.width - 40 - 30)/4.0
		let images = [0, 1, 2, 3]
		return(
			<View style={{width: ScreenDimensions.width, flexDirection: 'row', alignItems: 'center', marginTop: 15,
				paddingHorizontal: 20, justifyContent: 'space-between'
			}}>
				{images.map((value ,index) => {
					return(
						<View key={index} style={{width: size, height: size, backgroundColor: Colors.systemGray, borderRadius: 6,
							justifyContent: 'center', alignItems: 'center',
						}}>
							<TouchableOpacity onPress={() => {
								Keyboard.dismiss()

							}} key={index} style={{width: size, height: size, backgroundColor: Colors.systemGray, borderRadius: 6,
								justifyContent: 'center', alignItems: 'center',
							}}>
								<Image style={{width: size/2.0, height: size/2.0}} source={require('../../../resource/image/post/add.png')}/>
							</TouchableOpacity>

							<TouchableOpacity style={{position: 'absolute', right: -5, top: -5, width: 20, height: 20,
							}}>
								<Image source={require('../../../resource/image/post/delete.png')} style={{width: 20, height: 20,}}/>
							</TouchableOpacity>
						</View>
					)
				})}
			</View>
		)
	}

	renderCameraKitView() {
		return(
			<Modal
				animationType={"fade"}
				transparent={true}
				visible={true}
				onRequestClose={() => {

				}}
				onShow={() => {

				}}
				onDismiss={() => {
				}}
			>

				<TouchableOpacity activeOpacity={1} onPress={() => {
					Keyboard.dismiss()
				}} style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center',
					alignItems: 'center'
				}}>
					<View style={{width: ScreenDimensions.width, backgroundColor: Colors.white,
						borderRadius: 6, overflow: 'hidden'
					}}>
						<CameraKitGalleryView
							ref={gallery => this.gallery = gallery}
							style={{flex: 1, marginTop: 20}}
							minimumInteritemSpacing={10}
							minimumLineSpacing={10}
							columnCount={3}
							onTapImage={event => {
								// event.nativeEvent.selected - ALL selected images ids
							}}
						/>
					</View>
				</TouchableOpacity>

			</Modal>
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

					{this.renderSpeprateLine()}
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

				{this.renderCameraKitView()}
			</TouchableOpacity>
		)
	}
}
