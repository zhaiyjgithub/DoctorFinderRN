import React, {Component} from 'react';
import {TextInput, View, TouchableOpacity, Image} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';
import {SearchBarType} from '../../../utils/CustomEnums';

export default class SearchBar extends Component {
	static defaultProps = {
		marginLeft: 18,
		type: SearchBarType.max,
		placeholder: '',
		searchContent: ''
	}

	constructor(props) {
		super(props)
		this.state = {
			searchContent: props.searchContent
		}
	}

	render() {
		let props = this.props
		const {placeholder, type, onSubmitEditing, filterAction} = this.props
		const {searchContent} = this.state
		if (type === SearchBarType.max) {
			let width = (ScreenDimensions.width - 32)
			return(
				<TextInput
					returnKeyType={'search'}
					clearButtonMode={'while-editing'}
					onChangeText={(text) => {
						this.setState({searchContent: text.trim() + ''})
					}}
					selectionColor = {Colors.theme}
					onSubmitEditing={() => {
						onSubmitEditing && onSubmitEditing(searchContent)
					}}
					value = {searchContent}
					underlineColorAndroid = {'transparent'}
					numberOfLines={1}
					placeholder = {placeholder}
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
		}else if (type === SearchBarType.min) {
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
						placeholder = {placeholder}
						placeholderTextColor={Colors.lightGray}
						onSubmitEditing = {(event) => {
							onSubmitEditing && onSubmitEditing(searchContent)
						}}
						onChangeText={(text) => {
							this.setState({searchContent: text.trim() + ''})
						}}
						value = {searchContent}
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
						filterAction && filterAction()
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
					backgroundColor: Colors.listBg,
					paddingVertical: 5,
				}}>
					<TextInput
						returnKeyType={'search'}
						clearButtonMode={'while-editing'}
						numberOfLines={1}
						underlineColorAndroid={'transparent'}
						placeholder = {placeholder}
						placeholderTextColor={Colors.lightGray}
						onSubmitEditing = {(event) => {
							onSubmitEditing && onSubmitEditing(searchContent)
						}}
						onChangeText={(text) => {
							this.setState({searchContent: text.trim() + ''})
						}}
						value = {searchContent}
						style={{
							width: ScreenDimensions.width - 32,
							height: 36,
							backgroundColor: Colors.white,
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
