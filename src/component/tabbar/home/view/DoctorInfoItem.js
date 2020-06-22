import React, {Component} from 'react';
import {Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';
import {Gender} from '../../../utils/CustomEnums';
import {FormatFirstChat} from '../../../utils/Utils';

export default class DoctorInfoItem extends Component{
	constructor(props) {
		super(props)
		this.state = {
			id: props.id,
			info: props.info,
			isEdit: props.isEdit,
			isSelected: props.isSelected
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			id: props.id,
			info: props.info,
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
		let info = this.state.info
		let doctorName = 'Dr. ' + info.FullName + ' '
		let credential = info.Credential
		let specialty = info.Specialty
		let subSpecialty = info.SubSpectialty
		let address = info.Address
		let gender = info.Gender
		let distanceInMi = info.Distance ? (((info.Distance)*0.6213).toFixed(2) + 'mi') : ''
		let jobTitle = info.JobTitle ? FormatFirstChat(info.JobTitle) : ''
		let experience = ''
		if (info.YearOfExperience.length) {
			let years = info.YearOfExperience.split(', ')
			if (years.length === 1) {
				experience = years[0]
			}else if (years.length === 2) {
				let start = years[0]
				let end = years[1]

				if (end === '-1') {
					experience = start + '+'
				}else {
					experience = start + '-' + end
				}
			}
		}

		return(
			<View style={{
				width: ScreenDimensions.width,
				backgroundColor: Colors.listBg,
				paddingVertical: 8,
			}}>
				<TouchableOpacity  onPress={() => {
					this.props.clickSelectedButton && this.props.clickSelectedButton()
				}} style={{position: 'absolute', left: 0, top: 8, width: 60, bottom: 8,
					backgroundColor: Colors.white,
					justifyContent: 'center', alignItems: 'center',
				}}>
					<Image style={{width: 20, height: 20,}} source={this.state.isSelected ? require('../../../../resource/image/register/checkbox-selected.png') : require('../../../../resource/image/register/checkbox-unselected.png')}/>
				</TouchableOpacity>

				<View style={{flex: 1, width: ScreenDimensions.width,
					marginLeft: this.state.isEdit ? 60 : 0,
					backgroundColor: Colors.listBg,
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
							}}>{jobTitle}</Text>

							<Text style={{fontSize: 16, color: Colors.black,
								fontWeight: 'bold',
								marginTop: 6,
							}}>{specialty}</Text>

							{subSpecialty ? <Text style={{fontSize: 16, color: Colors.lightGray,}}>{subSpecialty}</Text> : null}

							<View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
								<Text style={{fontSize: 14, color: Colors.black,
									marginTop: 6,
									lineHeight: 14*1.4,
									width: '50%'
								}}>{address}</Text>

								<Text style={{fontSize: 16, color: Colors.lightGray, marginRight: 8}}>{distanceInMi}</Text>
							</View>

							{/*{experience.length ? }*/}
							<Text style={{fontSize: 16, color: Colors.black,
								fontWeight: 'bold',
								marginTop: 6,
							}}>{'Experience'}</Text>
							<Text style={{fontSize: 14, color: Colors.black,}}>{experience + ' years'}</Text>

						</View>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}
