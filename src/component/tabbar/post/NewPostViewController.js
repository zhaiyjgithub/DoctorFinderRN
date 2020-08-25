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
import {ShareTool} from '../../utils/ShareTool';
import RNFetchBlob from 'rn-fetch-blob';
import {HTTP} from '../../utils/HttpTools';
import {API_Post, BaseUrl} from '../../utils/API';
import Spinner from 'react-native-spinkit'
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import SimpleToast from 'react-native-simple-toast';

export default class NewPostViewController extends Component{
	static options(passProps) {
		return {
			topBar: {
				rightButtons: [
					{
						id: 'send',
						enabled: true,
						disableIconTint: false,
						color: Colors.white,
						icon: require('../../../resource/image/mine/send.png'),
					},
				]
			},
			bottomTabs: {
				visible: false
			}
		};
	}
	constructor(props) {
		super(props)
		this.state = {
			title: '',
			description: '',
			imageObjs: [{selectedId: '', uri: '', type: ImageMenuType.add}],
			isSpinnerVisible: false
		}

		this.navigationEventListener = Navigation.events().bindComponent(this);
	}

	componentWillUnmount() {
		this.navigationEventListener && this.navigationEventListener.remove();
	}

	navigationButtonPressed({ buttonId }) {
		if (buttonId === 'send') {
			this.createNewPost()
		}
	}

	showSpinner() {
		this.setState({isSpinnerVisible: true})
	}

	hideSpinner() {
		this.setState({isSpinnerVisible: false})
	}

	pushToGalleryPage() {
		let selectedEventMap = new Map()
		this.state.imageObjs.forEach((item, index) => {
			if (item.selectedId.length) {
				selectedEventMap.set(item.selectedId, item.uri)
			}
		})

		Keyboard.dismiss()
		setTimeout(() => {
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
		}, 600)
	}

	createNewPost() {
		if (!this.state.title.length) {
			SimpleToast.showWithGravity("Your title text can`t be empty!", SimpleToast.LONG, SimpleToast.CENTER)
			return
		}

		if (!this.state.description.length) {
			SimpleToast.showWithGravity("Your description text can`t be empty!", SimpleToast.LONG, SimpleToast.CENTER)
			return
		}

		let files = []
		let imageUriCount = 0

		for (let i = 0; i < this.state.imageObjs.length; i ++) {
			let item = this.state.imageObjs[i]
			if (item.type !== ImageMenuType.add) {
				imageUriCount = imageUriCount + 1
			}
		}

		if (imageUriCount) {
			for (let i = 0; i < this.state.imageObjs.length; i ++) {
				let item = this.state.imageObjs[i]
				if (item.type !== ImageMenuType.add) {
					this.convertUriToBase64Data(item.uri, (err, base64Data) => {
						if (!err) {
							let ext = 'jpg'
							let filePaths = item.uri.split('.')
							ext = filePaths[filePaths.length - 1]

							files.push({
								Ext: ext,
								Base64Data: base64Data
							})
						}

						if ((i + 1) >= imageUriCount) {
							let param = {
								UserID: 1,
								Type: 0,
								Title: this.state.title,
								Description: this.state.description,
								Files: files
							}

							this.postUpload(param)
						}
					})
				}
			}
		}else {
			let param = {
				UserID: 1,
				Type: 0,
				Title: this.state.title,
				Description: this.state.description,
				Files: files
			}

			this.postUpload(param)
		}
	}

	convertUriToBase64Data(imageFileUrl, cb) {
		let fs = imageFileUrl
		if (PLATFORM.isIOS) {
			fs = fs.replace("file://", "")
		}

		RNFetchBlob.fs.readFile(fs, "base64").then((base64Data) => {
			cb && cb(null, base64Data)
		}).catch((error) => {
			cb && cb(error, null)
		})
	}

	postUpload(param) {
		this.showSpinner()
		HTTP.post(API_Post.createPost, param).then((response) => {
			this.hideSpinner()

			Keyboard.dismiss()
			SimpleToast.showWithGravity("Create successfully", SimpleToast.LONG, SimpleToast.CENTER)

			setTimeout(() => {
				Navigation.pop(this.props.componentId)
				this.props.refreshPostListCB && this.props.refreshPostListCB()
			}, 1000)
		}).catch((error) => {
			SimpleToast.show("Create fail", SimpleToast.LONG, SimpleToast.CENTER)
			this.hideSpinner()
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
							this.setState({title: text.trim() + ''})
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
						this.setState({description: text.trim() + ''})
					}}
					ref = {(o) => {
						this._descTextInput = o
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

				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</TouchableOpacity>
		)
	}
}

// 11

const ImageMenuType = {
	add: 0,
	image: 1,
}
