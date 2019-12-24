import React, {Component} from 'react';
import {Text,
	View,
	Image,
	ImageBackground
} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';

export default class DoctorInfoItem extends Component{
	render() {
		return(
			<View style={{
				width: ScreenDimensions.width,
				backgroundColor: Colors.systemGray,
				paddingBottom: 16,
			}}>
				<View style={{
					width: ScreenDimensions.width - 32,
					marginLeft: 16,
					borderRadius: 6,
					backgroundColor: Colors.white,
					flexDirection: 'row',
					padding: 8,
					justifyContent: 'space-between'
				}}>
					<View  style={{width: 50, height: 50, borderRadius: 25,
						borderWidth: 2,
						borderColor: Colors.female,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: Colors.systemGray, overflow: 'hidden'}}>
						<Image source={require('../../../../resource/image/home/doctor_base.png')}
							   style={{width: 30, height: 30,}}
						/>
					</View>
					<View style={{
						width: ScreenDimensions.width - 32 - 16 - 10 - 50,
					}}>
						<Text style={{fontSize: 18, color: Colors.black,
							fontWeight: 'bold',
						}}>{'Dr. WILLIAM MASSEY '}
							<Text style={{fontSize: 16, color: Colors.lightGray,
								fontWeight: 'bold'
							}}>{'MD'}</Text>
						</Text>

						<Text style={{fontSize: 16, color: Colors.lightGray,
							marginTop: 6,
						}}>{'Physician'}</Text>

						<Text style={{fontSize: 16, color: Colors.black,
							fontWeight: 'bold',
							marginTop: 6,
						}}>{'Allergy & Immunology'}</Text>
						<Text style={{fontSize: 16, color: Colors.lightGray,
						}}>{'Asthma & Allergic Conditions'}</Text>

						<Text style={{fontSize: 14, color: Colors.black,
							marginTop: 6,
							lineHeight: 14*1.4
						}}>{'100 PILOT MEDICAL DR \n BIRMINGHAM City \n AL 35235' }</Text>
					</View>


				</View>


			</View>
		)
	}
}
