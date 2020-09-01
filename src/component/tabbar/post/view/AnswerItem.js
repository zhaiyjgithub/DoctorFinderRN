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

export default class AnswerItem extends Component{
	constructor(props) {
		super(props)
		this.state = {
			id: props.id,
			likes: props.likes,
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			id: props.id,
			likes: props.likes,
		})
	}

	shouldComponentUpdate(nextProps) {
		return (this.state.id !== nextProps.id ||
				this.state.likes !== nextProps.likes)
	}

	render() {
		let answerInfo = this.props.answerInfo
		let answerDate = CalcTimeStamp(answerInfo.AnswerDate)

		return(
			<View style={{width: '100%', backgroundColor: Colors.white}}>
				<View style={{flexDirection: 'row',
					backgroundColor: Colors.white,
					alignItems: 'center',
					marginTop: 8,
				}}>
					<Image source={require("../../../../resource/image/base/avatar.jpg")} style={{width: 25, height: 25, borderRadius: 4, marginLeft: 16,}}/>
					<View style={{ marginLeft: 8, justifyContent: 'space-between'}}>
						<Text style={{fontSize: 14, color: Colors.black, maxWidth: 120, textAlign: 'left'}}>{answerInfo.UserName}</Text>
						<Text style={{fontSize: 12, color: Colors.lightGray}}>{answerDate}</Text>
					</View>
				</View>

				<Text style={{
					color: Colors.black, fontSize: 14, marginRight: 16, marginTop: 8,
					marginBottom: 8, marginLeft: 16 + 25 + 8
				}}>{answerInfo.Description}</Text>

				<View style={{flexDirection: 'row', width: ScreenDimensions.width - (16 + 25 + 8 + 16),
					marginVertical: 8, alignItems: 'center', backgroundColor: Colors.white,
					marginLeft: 16 + 25 + 8
				}}>
					<TouchableOpacity onPress={() => {
						this.props.clickReply && this.props.clickReply()
					}} style={{flexDirection: 'row', alignItems: 'center', height: 20}}>
						<Image source={require('../../../../resource/image/post/reply.png')} style={{backgroundColor: Colors.white}}/>
						<Text style={{fontSize: 12, color: Colors.lightGray, marginLeft: 5,}}>{'Reply'}</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => {
						this.props.clickLike && this.props.clickLike()
					}} style={{flexDirection: 'row', alignItems: 'center', height: 20, marginLeft: 32}}>
						<Image source={require('../../../../resource/image/post/like.png')} style={{width: 15, height: 15, backgroundColor: Colors.white}}/>
						<Text style={{fontSize: 12, color: Colors.lightGray, marginLeft: 5,}}>{'Like (' + this.state.likes + ')'}</Text>
					</TouchableOpacity>
				</View>

				<View style={{position: 'absolute', left: 16 + 25 + 8, bottom: 0, right: 0, height: 1.0, backgroundColor: Colors.lineColor}}/>
			</View>
		)
	}
}
