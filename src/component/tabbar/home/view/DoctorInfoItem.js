import React, {Component} from 'react';
import {Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';
import {Gender} from '../../../utils/CustomEnums';

export default class DoctorInfoItem extends Component{

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

	render() {
		let doctorName = 'Dr. ' + this.state.info.FirstName + ' ' + this.state.info.LastName + ' '
		let credential = this.state.info.Credential
		let specialty = this.state.info.Specialty
		let subSpecialty = this.state.info.SubSpectialty
		let address = this.state.info.Address +'\n' + this.state.info.City + ' City\n'
			+ this.state.info.State + ' ' + this.state.info.Zip

		let gender = this.state.info.Gender

		return(
			<View style={{
				width: ScreenDimensions.width,
				backgroundColor: Colors.systemGray,
				paddingBottom: 16,
			}}>
				<TouchableOpacity onPress={() => {
					this.props.didSelectedItem && this.props.didSelectedItem()
				}} style={{
					width: ScreenDimensions.width - 32,
					marginLeft: 16,
					borderRadius: 6,
					backgroundColor: Colors.white,
					flexDirection: 'row',
					padding: 8,
					justifyContent: 'space-between'
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
						}}>{'Physician'}</Text>

						<Text style={{fontSize: 16, color: Colors.black,
							fontWeight: 'bold',
							marginTop: 6,
						}}>{specialty}</Text>

						{subSpecialty ? <Text style={{fontSize: 16, color: Colors.lightGray,}}>{subSpecialty}</Text> : null}

						<Text style={{fontSize: 14, color: Colors.black,
							marginTop: 6,
							lineHeight: 14*1.4
						}}>{address}</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}
