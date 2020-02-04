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
	render() {
		return(
			<View style={{width: '100%', backgroundColor: Colors.white}}>
				<View style={{flexDirection: 'row',
					backgroundColor: Colors.white,
					alignItems: 'center',
					marginTop: 8,
				}}>
					<Image source={require("../../../../resource/image/base/avatar.jpg")} style={{width: 25, height: 25, borderRadius: 4, marginLeft: 16,}}/>
					<View style={{ marginLeft: 8, justifyContent: 'space-between'}}>
						<Text style={{fontSize: 14, color: Colors.black, maxWidth: 120, textAlign: 'left'}}>{"User Name"}</Text>
						<Text style={{fontSize: 12, color: Colors.lightGray}}>{'2 day ago'}</Text>
					</View>
				</View>

				<Text style={{
					color: Colors.black, fontSize: 14, marginRight: 16, marginTop: 8,
					marginBottom: 8, marginLeft: 16 + 25 + 8
				}}>{'3rd comment'}</Text>

				<View style={{flexDirection: 'row', width: ScreenDimensions.width - (16 + 25 + 8 + 16),
					marginVertical: 8, alignItems: 'center', backgroundColor: Colors.white,
					marginLeft: 16 + 25 + 8
				}}>
					<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', height: 20}}>
						<Image style={{width: 15, height: 15, backgroundColor: Colors.red}}/>
						<Text style={{fontSize: 12, color: Colors.lightGray, marginLeft: 5,}}>{'Reply'}</Text>
					</TouchableOpacity>

					<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', height: 20, marginLeft: 32}}>
						<Image style={{width: 15, height: 15, backgroundColor: Colors.red}}/>
						<Text style={{fontSize: 12, color: Colors.lightGray, marginLeft: 5,}}>{'Like'}</Text>
					</TouchableOpacity>
				</View>

				<View style={{position: 'absolute', left: 16 + 25 + 8, bottom: 0, right: 0, height: 1.0, backgroundColor: Colors.lineColor}}/>
			</View>
		)
	}
}
