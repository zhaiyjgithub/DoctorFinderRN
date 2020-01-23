import React, {Component} from 'react';
import {Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';
import {Gender} from '../../../utils/CustomEnums';

export default class PostItem extends Component{
	constructor(props) {
		super(props)
		this.state = {
			postInfo: props.postInfo,
			id: props.id
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			postInfo: props.postInfo,
			id: props.id
		})
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.id !== nextProps.id
	}

	render() {
		return(
			<View style={{
				width: ScreenDimensions.width,
				paddingBottom: 16,
			}}>
				<TouchableOpacity onPress={() => {
					this.props.didSelectedItem && this.props.didSelectedItem()
				}} style={{
					width: ScreenDimensions.width - 32,
					marginLeft: 16,
					borderRadius: 6,
					backgroundColor: Colors.white,
				}}>
					<View style={{flexDirection: 'row', alignItems: 'center', width: ScreenDimensions.width - 32, marginTop: 8, justifyContent: 'space-between'}}>
						<View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8}}>
							<Image source={require('../../../../resource/image/base/avatar.jpg')} style={{width: 14, height: 14, borderRadius: 2, overflow: 'hidden'}}/>
							<Text numberOfLines={1} style={{fontSize: 14, color: Colors.black, marginLeft: 5, maxWidth: 150,}}>{'Simth09sdfsfsfsdfsdfsdf0234'}</Text>
							<Text style={{marginLeft: 8, backgroundColor: Colors.systemGray, borderRadius: 10,
								paddingHorizontal: 5, paddingVertical: 3,
								color: Colors.green, fontWeight: 'bold',
							}}>{'tag'}</Text>
						</View>

						<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginRight: 8}}>
							<Image source={require('../../../../resource/image/post/like.png')} style={{width: 14, height: 14,}}/>
							<Text style={{fontSize: 14, color: Colors.lightGray, marginLeft: 3,}}>{'19'}</Text>
						</TouchableOpacity>
					</View>

					<Text numberOfLines={1} style={{marginVertical: 16, fontSize: 20, fontWeight: 'bold', color: Colors.black,
						width: '100%', paddingHorizontal: 8,
					}}>{'Title'}</Text>

					<View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8, width: '100%', marginTop: 8, marginBottom: 8}}>
						<Image source={require('../../../../resource/image/post/chat.png')} style={{width: 14, height: 14,}}/>
						<Text style={{fontSize: 14, color: Colors.lightGray, marginLeft: 3,}}>{'19'}</Text>

						<Text numberOfLines={1} style={{fontSize: 14, color: Colors.lightGray, marginLeft: 8, width: ScreenDimensions.width - 32 - 16 - 50,
							textAlign: 'left',
						}}>{'6 minutes * reply by Zack'}</Text>
					</View>

				</TouchableOpacity>
			</View>
		)
	}
}
