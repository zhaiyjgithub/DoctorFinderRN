import React, {Component} from 'react';
import {Text,
	View,
	Image,
	TouchableOpacity,
	Animated,
	Modal
} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {PLATFORM} from '../../../utils/CustomEnums';

const MainViewWidth = 220

export default class SearchFilterOverlay extends Component{
	constructor(props) {
		super(props)
		this.state = {
			isVisible: props.isVisible,
			selectedIndex: 0
		}

		this._mainViewMarginRight = new Animated.Value(-MainViewWidth)
	}

	componentWillReceiveProps(props) {
		this.setState({
			isVisible: props.isVisible
		})
	}

	componentDidMount() {
		// this.openWithAnimation()
	}

	dismiss() {
		this.closeWithAnimation(() => {
			this.props.dismiss && this.props.dismiss()
		})
	}

	openWithAnimation() {
		Animated.timing(this._mainViewMarginRight, {
			toValue:0,
			duration: 1000
		}).start();
	}

	closeWithAnimation(cb) {
		Animated.timing(this._mainViewMarginRight, {
			toValue: -MainViewWidth,
			duration: 10
		}).start(() => {
			cb && cb()
		});
	}

	handleSegmentChanged(index) {
		this.setState({selectedIndex: index})
	}

	render() {
		return(
			<Modal
				animationType={"fade"}
				transparent={true}
				visible={this.state.isVisible}
				onRequestClose={() => {

				}}
				onShow={() => {

				}}
				onDismiss={() => {
				}}
			>

				<TouchableOpacity activeOpacity={1.0} onPress={() => {
					this.dismiss()
				}} style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',  flexDirection: 'row-reverse'}}>
					<View style={{width: ScreenDimensions.width*0.62, backgroundColor: Colors.white}}>
						<View style={{width: ScreenDimensions.width*0.62 - 16, marginLeft: 8,
							marginTop: 44,
						}}>
							<SegmentedControlTab
								tabStyle={{width: '100%',
								}}
								values={["First", "Second", "Third"]}
								selectedIndex={this.state.selectedIndex}
								onTabPress={(index) => {
									this.handleSegmentChanged(index)
								}}
							/>
						</View>

						<View style={{flex: 1}}></View>

						<View style={{flexDirection: 'row', height: 50 + (PLATFORM.isIPhoneX ? 34 : 0),
							backgroundColor: Colors.bottom_bar
						}}>
							<TouchableOpacity style={{width: '50%', height: 50,
								justifyContent: 'center', alignItems: 'center'
							}}>
								<Text style={{fontSize: 16, color: Colors.red}}>{'Reset'}</Text>
							</TouchableOpacity>

							<TouchableOpacity style={{width: '50%', height: 50, backgroundColor: Colors.red,
								justifyContent: 'center', alignItems: 'center'
							}}>
								<Text style={{fontSize: 16, color: Colors.white}}>{'Confirm'}</Text>
							</TouchableOpacity>

							<View style={{position: 'absolute', left: 0, top: 0, right: 0, height: 1.0,
								backgroundColor: Colors.systemGray
							}}/>

							<View style={{position: 'absolute', left: 0, top: 50, right: 0, height: 1.0,
								backgroundColor: Colors.systemGray
							}}/>
						</View>
					</View>
				</TouchableOpacity>

			</Modal>
		)
	}
}
