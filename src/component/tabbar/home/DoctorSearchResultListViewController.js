import React, {Component} from 'react';
import {Alert, Linking, FlatList, Text, View, RefreshControl} from 'react-native';
import {Colors} from '../../utils/Styles';
import {ScreenDimensions} from '../../utils/Dimensions';
import {Navigation} from 'react-native-navigation';
import DoctorInfoItem from './view/DoctorInfoItem';
import {HTTP} from '../../utils/HttpTools';
import {API_Doctor} from '../../utils/API';
import {PLATFORM} from '../../utils/CustomEnums';

export default class DoctorSearchResultListViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
		}
	}

	renderItem(item) {

	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<FlatList
					style={{flex: 1, backgroundColor: Colors.systemGray}}
					renderItem={({item}) => this.renderItem(item)}
					data={this.state.dataSource}
					keyExtractor = {(item,index) =>{
						return 'key' + item.key + index
					}}
					refreshControl={
						<RefreshControl
							refreshing={false}
							enabled = {true}
							onRefresh={() => {

								}
							}
						/>
					}
					onEndReachedThreshold = {1}
					onEndReached = {() => {

					}}
					ListFooterComponent = {() => {
						return(
							<View />
						)
					}}
				/>
			</View>
		)
	}
}
