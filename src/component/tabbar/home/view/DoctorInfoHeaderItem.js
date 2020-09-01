import React, {Component} from 'react';
import {Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';
import {Gender} from '../../../utils/CustomEnums';
import {FormatFirstChat, FormatPhone} from '../../../utils/Utils';

export default class DoctorInfoHeaderItem extends Component{

	static getDerivedStateFromProps(props, state) {
		if (props.id !== state.id) {
			return {
				id: props.id,
				info: props.info
			}
		}

		return null
	}

	constructor(props) {
		super(props)
		this.state = {
			id: props.id,
			info: props.info
		}
	}

	renderDefaultWhiteBlankView() {
		return(
			<View style={{position: 'absolute',
				left: 0, right: 0, bottom: 0,
				top: 74, backgroundColor: Colors.listBg,
			}}/>
		)
	}

	render() {
		let doctorInfo = this.state.info
		let doctorName = 'Dr. ' + doctorInfo.FullName + ' '
		let credential = doctorInfo.Credential
		let specialty = doctorInfo.Specialty
		let subSpecialty = doctorInfo.SubSpecialty

		let phone = doctorInfo.Phone
		let gender = doctorInfo.Gender

		let jobTitle = FormatFirstChat(doctorInfo.JobTitle)

		return(
			<View style={{
				width: ScreenDimensions.width,
				backgroundColor: Colors.theme,
				paddingBottom: 16,
				paddingTop: 16,
			}}>
				{this.renderDefaultWhiteBlankView()}
				<View style={{
					width: ScreenDimensions.width - 32,
					marginLeft: 16,
					borderRadius: 6,
					backgroundColor: Colors.white,
					flexDirection: 'row',
					padding: 8,
					justifyContent: 'space-between',
				}}>
					<View style={{alignItems: 'center'}}>
						<View  style={{width: 50, height: 50, borderRadius: 25,
							borderWidth: 2,
							borderColor: gender === Gender.male ? Colors.male : Colors.female,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: Colors.systemGray, overflow: 'hidden'}}>
							<Image source={require('../../../../resource/image/home/doctor_base.png')}
								   style={{width: 30, height: 30,}}
							/>
						</View>

						<TouchableOpacity onPress={() => {
							this.props.questionAction && this.props.questionAction()
						}} style={{width: 40, height: 40, justifyContent: 'center',
							alignItems: 'center', marginTop: 0}}>
							<Image source={require('../../../../resource/image/home/question.png')}
								   style={{width: 15, height: 15,}}
							/>
						</TouchableOpacity>
					</View>
					<View style={{
						width: ScreenDimensions.width - 32 - 16 - 10 - 50,
					}}>
						<Text style={{fontSize: 18, color: Colors.black,
							fontWeight: 'bold',
						}}>{doctorName}
							<Text style={{fontSize: 16, color: Colors.lightGray,
								fontWeight: 'bold'
							}}>{credential}</Text>
						</Text>

						<Text style={{fontSize: 16, color: Colors.lightGray,
							marginTop: 6,
						}}>{jobTitle}</Text>

						<Text style={{fontSize: 16, color: Colors.black,
							fontWeight: 'bold',
							marginTop: 6,
						}}>{specialty}</Text>

						{subSpecialty ? <Text style={{fontSize: 16, color: Colors.lightGray,}}>{subSpecialty}</Text> : null}

						<View style={{width: '100%',
							marginTop: 6,
						}}>
							<TouchableOpacity style={{width: '100%', flexDirection: 'row',
								alignItems: 'center', marginTop: 6,
							}}>
								<Image source={require('../../../../resource/image/home/phone.png')}/>
								<Text style={{fontSize: 16, color: Colors.blue,
									marginLeft: 8,
								}}>{phone}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		)
	}
}
