import React, {Component} from 'react';
import {Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';
import {Gender} from '../../../utils/CustomEnums';
import {CalcTimeStamp} from '../../../utils/Utils';
import {API_Post, BaseUrl} from '../../../utils/API';

export default class PostItem extends Component{
	constructor(props) {
		super(props)
		this.state = {
			postInfo: props.postInfo,
			id: props.id,
			isEdit: props.isEdit,
			isSelected: props.isSelected
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			postInfo: props.postInfo,
			id: props.id,
			isEdit: props.isEdit,
			isSelected: props.isSelected
		})
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps.id !== this.state.id || nextProps.isEdit !== this.state.isEdit ||
			nextProps.isSelected !== this.state.isSelected
		)
	}

	render() {
		let postInfo = this.state.postInfo

		let answerTitle = ''
		if (postInfo.AnswerCount) {
			let lastAnswerDate = postInfo.LastAnswerDate
			answerTitle = ' ' + CalcTimeStamp(lastAnswerDate) + ' - Last rely by ' + postInfo.LastAnswerName
		}

		let imgPostUrlPrefix = BaseUrl + API_Post.imgPost +'?name='
		return(
			<View style={{
				width: ScreenDimensions.width,
				paddingVertical: 8,
			}}>
				<TouchableOpacity onPress={() => {
					this.props.clickSelectedButton && this.props.clickSelectedButton()
				}} style={{position: 'absolute', left: 0, top: 8, width: 60, bottom: 8,
					backgroundColor: Colors.white,
					justifyContent: 'center', alignItems: 'center',
				}}>
					<Image style={{width: 20, height: 20,}} source={this.state.isSelected ? require('../../../../resource/image/register/checkbox-selected.png') : require('../../../../resource/image/register/checkbox-unselected.png')}/>
				</TouchableOpacity>

				<View style={{flex: 1, width: ScreenDimensions.width,
					marginLeft: this.state.isEdit ? 60 : 0,
					backgroundColor: Colors.systemGray,
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
								<Text numberOfLines={1} style={{fontSize: 14, color: Colors.black, marginLeft: 5, maxWidth: 150,}}>{postInfo.UserName}</Text>
								<Text style={{marginLeft: 8, backgroundColor: Colors.systemGray, borderRadius: 10,
									paddingHorizontal: 5, paddingVertical: 3,
									color: Colors.green, fontWeight: 'bold',
								}}>{'tag'}</Text>
							</View>

							<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginRight: 8}}>
								<Image source={require('../../../../resource/image/post/like.png')} style={{width: 14, height: 14,}}/>
								<Text style={{fontSize: 14, color: Colors.lightGray, marginLeft: 3,}}>{postInfo.Likes}</Text>
							</TouchableOpacity>
						</View>

						{/*<Text style={{fontSize: 12, color: Colors.lightGray, marginLeft: 8, marginTop: 8,}}>*/}
						{/*	{CalcTimeStamp(postInfo.PostDate)}*/}
						{/*</Text>*/}

						<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8}}>
							<Text numberOfLines={1} style={{fontSize: 20, fontWeight: 'bold', color: Colors.black,
								width: ScreenDimensions.width - 32 - (postInfo.URLs.length ? 50 : 0), paddingHorizontal: 8, backgroundColor: Colors.white
							}}>{postInfo.Title}</Text>

							{postInfo.URLs.length ? <Image source={{uri: (imgPostUrlPrefix + postInfo.URLs[0])}} style={{width: 30, height: 30, backgroundColor: Colors.red ,marginRight: 10}}/> : null}
						</View>

						<View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8, width: '100%', marginTop: 8, marginBottom: 8}}>
							<Image source={require('../../../../resource/image/post/chat.png')} style={{width: 14, height: 14,}}/>
							<Text style={{fontSize: 14, color: Colors.lightGray, marginLeft: 3,}}>{postInfo.AnswerCount}</Text>

							<Text numberOfLines={1} style={{fontSize: 14, color: Colors.lightGray, marginLeft: 8, width: ScreenDimensions.width - 32 - 16 - 50,
								textAlign: 'left',
							}}>{answerTitle}</Text>
						</View>

					</TouchableOpacity>
				</View>
			</View>
		)
	}
}
