import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';
import MapView, {Marker} from 'react-native-maps';

export default class DoctorInfoAddressItem extends Component{
	static defaultProps = {
		title: '',
		desc: '',
		lat: 0,
		lng: 0,
	}

	render() {
		return(
			<View style={{
				width: ScreenDimensions.width,
				paddingBottom: 16,
			}}>
				<View style={{
					width: ScreenDimensions.width - 32,
					marginLeft: 16,
					borderRadius: 6,
					padding: 8,
					borderWidth: 1.0,
					borderColor: Colors.systemGray,
					backgroundColor: Colors.white
				}}>
					<Text style={{fontSize: 18, color: Colors.black,
						fontWeight: 'bold'
					}}>{this.props.title}</Text>

					<Text style={{fontSize: 14, color: Colors.black,
						width: '100%', marginTop: 8, lineHeight: 14*1.4
					}}>{this.props.desc}</Text>

					<View style={{width: '100%', height: 190, marginTop: 10}}>
						<MapView
							style = {{flex: 1}}
							initialRegion={{
								latitude: this.props.lat,
								longitude: this.props.lng,
								latitudeDelta: 0.0922/90,
								longitudeDelta: 0.0421/90,
							}}
						>
							<Marker
								coordinate={{
									latitude: this.props.lat,
									longitude: this.props.lng,
									latitudeDelta: 0.0922,
									longitudeDelta: 0.0421,
								}}
								title = {'Location'}
								description={this.props.desc}
							/>
						</MapView>
					</View>

					<TouchableOpacity onPress={() => {
						this.props.gotoRoute && this.props.gotoRoute()
					}} style={{width: 30, height: 30,
						position: 'absolute', top: 10, right: 10,
						justifyContent: 'center', alignItems: 'center'
					}}>
						<Image source={require('../../../../resource/image/home/navigator.png')} style={{width: 25, height: 25,}} />
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}
