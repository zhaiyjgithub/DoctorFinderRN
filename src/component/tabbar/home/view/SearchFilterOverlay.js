import React, {Component} from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	Animated,
	Modal,
	Easing, SectionList, TextInput,
} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions, StatusBar} from '../../../utils/Dimensions';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {PLATFORM, SearchBarOverlayType} from '../../../utils/CustomEnums';

const MainViewWidth = (ScreenDimensions.width - 60)

export default class SearchFilterOverlay extends Component{
	static defaultProps = {
		searchContent: '',
		specialty: '',
		gender: 0,
		city: '',
		State: '',
	}
	constructor(props) {
		super(props)
		this.state = {
			isVisible: props.isVisible,
			searchContent: props.searchContent,
			specialty: props.specialty,
			gender: props.gender,
			city: props.city,
			State: props.State,
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			isVisible: props.isVisible,
			searchContent: props.searchContent,
			specialty: props.specialty,
			gender: props.gender,
			city: props.city,
			State: props.State,
		})
	}

	dismiss() {
		this.props.dismiss && this.props.dismiss()
	}

	renderLineView() {
		return(
			<View style={{position: 'absolute', height: 1.0, left: 0, right: 0, bottom: 0, backgroundColor: Colors.lineColor}}/>
		)
	}

	renderRightArrowImage() {
		return(
			<Image source={require('../../../../resource/image/base/right_arrow.png')} style={{width: 8, height: 13, marginLeft: 8}}/>
		)
	}

	renderSearchBarView() {
		let width = MainViewWidth - 16
		return(
			<View style={{marginTop: 8, height: 50, justifyContent: 'center'}}>
				<TextInput
					returnKeyType={'search'}
					clearButtonMode={'while-editing'}
					onChangeText={(text) => {
						this.setState({searchContent: text + ''})
					}}
					selectionColor = {Colors.theme}
					onSubmitEditing={() => {
						this.props.onSubmitEditing && this.props.onSubmitEditing(this.state.searchContent)
					}}
					value = {this.state.searchContent}
					underlineColorAndroid = {'transparent'}
					numberOfLines={1}
					placeholder = {'e.g. Dr. Fei or Pediatrics'}
					placeholderTextColor={Colors.lightGray}
					style={{
						width: width,
						height: 36,
						backgroundColor: Colors.white,
						fontSize: 16,
						marginLeft: 8,
						color: Colors.black,
					}}>
				</TextInput>

				<View style={{height: 1.0, width: width, marginLeft: 8, backgroundColor: Colors.lineColor}}/>
			</View>
		)
	}

	renderSpecialtyView() {
		let width = MainViewWidth - 16
		return(
			<TouchableOpacity onPress={() => {
				this.props.didSelectedItem && this.props.didSelectedItem(SearchBarOverlayType.specialty)
			}} style={{height: 50, marginTop: 8, flexDirection: 'row', alignItems: 'center',
				width: width, marginLeft: 8,
				justifyContent: 'space-between',}}>
				<Text style={{fontSize: 16, color: Colors.black, fontWeight: 'bold'}}>{'Specialty'}</Text>

				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',

				}}>
					<Text style={{maxWidth: MainViewWidth - 16 - 48 - 8, textAlign: 'right',
						fontSize: 16, color: Colors.lightBlack,
					}}>{this.state.specialty}</Text>
					{this.renderRightArrowImage()}
				</View>

				{this.renderLineView()}
			</TouchableOpacity>
		)
	}

	handleIndexChange() {

	}

	renderGenderView() {
		let width = MainViewWidth - 16
		return(
			<View style={{height: 50, marginTop: 8, flexDirection: 'row', alignItems: 'center',
				width: width, marginLeft: 8,
				justifyContent: 'space-between',}}>

				<Text style={{fontSize: 16, color: Colors.black, fontWeight: 'bold'}}>{'Gender'}</Text>

				<View>
					<SegmentedControlTab
						tabsContainerStyle={{width: 150, height: 30}}
						values={["All", "Male", "Female"]}
						selectedIndex={this.state.selectedIndex}
						onTabPress={this.handleIndexChange}
					/>
				</View>

				{this.renderLineView()}
			</View>
		)
	}

	renderCityLocationView() {
		let width = MainViewWidth - 16
		return(
			<View style={{height: 50, marginTop: 8, flexDirection: 'row', alignItems: 'center',
				width: width, marginLeft: 8,
				justifyContent: 'space-between',}}>
				<Text style={{fontSize: 16, color: Colors.black, fontWeight: 'bold'}}>{'City'}</Text>

				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',

				}}>
					<Text style={{maxWidth: MainViewWidth - 16 - 48 - 8, textAlign: 'right',
						fontSize: 16, color: Colors.lightBlack,}}>{'New York'}</Text>
					{this.renderRightArrowImage()}
				</View>

				{this.renderLineView()}
			</View>
		)
	}

	renderStateLocationView() {
		let width = MainViewWidth - 16
		return(
			<View style={{height: 50, marginTop: 8, flexDirection: 'row', alignItems: 'center',
				width: width, marginLeft: 8,
				justifyContent: 'space-between',}}>
				<Text style={{fontSize: 16, color: Colors.black, fontWeight: 'bold'}}>{'State'}</Text>

				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',

				}}>
					<Text style={{maxWidth: MainViewWidth - 16 - 48 - 8, textAlign: 'right',
						fontSize: 16, color: Colors.lightBlack,}}>{'AL'}</Text>
					{this.renderRightArrowImage()}
				</View>

				{this.renderLineView()}
			</View>
		)
	}

	renderActionButtonView() {
		return(
			<View style={{flexDirection: 'row', height: 50,
				backgroundColor: Colors.bottom_bar,
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


			</View>
		)
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

				<View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center',
					alignItems: 'center'
				}}>
					<View style={{width: MainViewWidth, backgroundColor: Colors.white,
						borderRadius: 6, overflow: 'hidden'
					}}>
						{this.renderSearchBarView()}
						{this.renderSpecialtyView()}
						{this.renderGenderView()}
						{this.renderCityLocationView()}
						{this.renderStateLocationView()}
						{this.renderActionButtonView()}

					</View>
				</View>

			</Modal>
		)
	}
}

const ListType = {
	specialty: 0,
	city: 1,
	state: 2,
}
