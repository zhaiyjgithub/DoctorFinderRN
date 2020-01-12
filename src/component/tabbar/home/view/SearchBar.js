import React, {Component} from 'react';
import {TextInput, View, TouchableOpacity, Image} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';
import {SearchBarType} from '../../../utils/CustomEnums';

export default class SearchBar extends Component {
	static defaultProps = {
		marginLeft: 18,
		type: SearchBarType.max
	}

	constructor(props) {
		super(props)
		this.state = {
			searchContent: props.searchContent
		}
	}

	render() {
		let props = this.props
		if (props.type === SearchBarType.max) {
			let width = (ScreenDimensions.width - 32)
			return(
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
						borderRadius: 6,
						fontSize: 16,
						color: Colors.black,
						paddingLeft: 8,
					}}>
				</TextInput>
			)
		}else if (this.props.type === SearchBarType.min) {
			let width = (ScreenDimensions.width - 60)
			return (
				<View style={{
					backgroundColor: Colors.clear,
					width: width,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}>
					<TextInput
						returnKeyType={'search'}
						selectionColor = {Colors.theme}
						clearButtonMode={'while-editing'}
						numberOfLines={1}
						underlineColorAndroid={'transparent'}
						placeholder = {'e.g. Dr. Fei or Pediatrics'}
						placeholderTextColor={Colors.lightGray}
						onSubmitEditing = {(event) => {
							this.props.onSubmitEditing && this.props.onSubmitEditing(this.state.searchContent)
						}}
						onChangeText={(text) => {
							this.setState({searchContent: text + ''})
						}}
						value = {this.state.searchContent}
						style={{
							width: width - 44 - 10,
							height: 36,
							backgroundColor: Colors.white,
							borderRadius: 6,
							fontSize: 16,
							paddingHorizontal: 8,
							color: Colors.black
						}} />

					<TouchableOpacity onPress={() => {
						this.props.filterAction && this.props.filterAction()
					}} style={{width: 44, height: 40,
						justifyContent: 'center', alignItems: 'center'
					}}>
						<Image source={require('../../../../resource/image/home/filter.png')}/>
					</TouchableOpacity>
				</View>
			)
		} else {
			return(
				<View style={{
					backgroundColor: Colors.white,
					paddingVertical: 5,
				}}>
					<TextInput
						returnKeyType={'search'}
						clearButtonMode={'while-editing'}
						numberOfLines={1}
						underlineColorAndroid={'transparent'}
						placeholder = {'e.g. Dr. Fei or Pediatrics'}
						placeholderTextColor={Colors.lightGray}
						onSubmitEditing = {(event) => {
							this.props.onSubmitEditing && this.props.onSubmitEditing(this.state.searchContent)
						}}
						onChangeText={(text) => {
							this.setState({searchContent: text + ''})
						}}
						value = {this.state.searchContent}
						style={{
							width: ScreenDimensions.width - 32,
							height: 36,
							backgroundColor: Colors.searchBar,
							marginLeft: 16,
							borderRadius: 6,
							paddingLeft: 8,
							fontSize: 16,
							color: Colors.black
						}} />
				</View>
			)
		}
	}
}
