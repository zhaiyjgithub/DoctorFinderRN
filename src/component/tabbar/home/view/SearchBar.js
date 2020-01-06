import React, {Component} from 'react';
import {TextInput, View} from 'react-native';
import {Colors} from '../../../utils/Styles';
import {ScreenDimensions} from '../../../utils/Dimensions';

export default class SearchBar extends Component {
	static defaultProps = {
		marginLeft: 18,
		isTitleView: true
	}

	constructor(props) {
		super(props)
		this.state = {
			searchContent: ''
		}
	}

	render() {
		let width = (ScreenDimensions.width - 32)
		let props = this.props

		if (props.isTitleView) {
			return(
				<TextInput
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
		}else {
			return(
				<View style={{
					backgroundColor: Colors.white,
					paddingVertical: 5,
				}}>
					<TextInput
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
