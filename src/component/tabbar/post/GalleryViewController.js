import {Keyboard, Text, TouchableOpacity, View, Image} from 'react-native';
import {ScreenDimensions} from '../../utils/Dimensions';
import {Colors} from '../../utils/Styles';
import {CameraKitGalleryView, CameraKitGallery} from 'react-native-camera-kit';
import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {ShareTool} from '../../utils/ShareTool';


const Max_Image_Numbers = 4

export default class GalleryViewController extends Component{
	static options(passProps) {
		return {
			topBar: {
				rightButtons: [
					{
						id: 'done',
						enabled: true,
						text: 'Done'
					}
				]
			}
		};
	}

	constructor(props) {
		super(props)
		this.state = {
			selectedImages: []
		}
		this.imageEventMap = new Map()
		this.navigationEventListener = Navigation.events().bindComponent(this);
	}

	componentWillUnmount() {
		this.navigationEventListener && this.navigationEventListener.remove();
	}

	navigationButtonPressed({ buttonId }) {
		if (buttonId === 'done') {
			let imageUrls = []
			for (let [key, item] of this.imageEventMap) {
				imageUrls.push({selectedId: key, uri: item})
			}
			console.log(imageUrls)
				// this.props.DoneSelected && this.props.DoneSelected(imageUrls)
				// Navigation.pop(this.props.componentId);
		}
	}

	async onTapImage(event,isSelected, selectedId) {
		if (this.state.selectedImages.length < 4) {
			if (!this.imageEventMap.get(selectedId)) {
				const image = await CameraKitGallery.getImageForTapEvent(event.nativeEvent)
				this.imageEventMap.set(selectedId, image.imageUri)
				this.setState({selectedImages: this.state.selectedImages.concat([selectedId])})
			}else {
				if (isSelected) {
					const image = await CameraKitGallery.getImageForTapEvent(event.nativeEvent)
					this.imageEventMap.set(selectedId, image.imageUri)
					this.setState({selectedImages: this.state.selectedImages.concat([selectedId])})
				}else {
					this.imageEventMap.delete(selectedId)

					let images =  this.state.selectedImages.filter((item, index) => {
						return item !== selectedId
					})

					this.setState({selectedImages: images})
				}
			}
		}else if (this.state.selectedImages.length === 4 && !isSelected) {
			this.imageEventMap.delete(selectedId)

			let images =  this.state.selectedImages.filter((item, index) => {
				return item !== selectedId
			})

			this.setState({selectedImages: images})
		}else {
			this.gallery.refreshGalleryView(this.state.selectedImages)
			alert('max number 4')
		}
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.white, marginTop: 10,
				marginLeft: 10, marginRight: 10,
			}}>
					<CameraKitGalleryView
						ref={gallery => this.gallery = gallery}
						style={{flex: 1}}
						minimumInteritemSpacing={10}
						minimumLineSpacing={10}
						columnCount={3}
						selectedImages={this.state.selectedImages}
						getUrlOnTapImage={true}
						selection={{
							selectedImage: require('../../../resource/image/post/select.png'),
						}}
						// selectedImageIcon={require('../../../resource/image/post/select.png')}
						onTapImage={event => this.onTapImage(event, event.nativeEvent.isSelected, event.nativeEvent.selectedId)}
					/>
			</View>
		)
	}
}
