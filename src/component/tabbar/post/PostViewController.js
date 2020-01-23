import React, {Component} from 'react'
import {
	FlatList,
	View,
	StyleSheet,
	Platform,
	Alert,
	DeviceEventEmitter,
	NativeModules,
	Animated,
	Linking,
	ScrollView,
	AppState, TouchableOpacity, Image, Text, RefreshControl, SectionList,
} from 'react-native';
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions} from '../../utils/Dimensions';
import {Gender, PLATFORM} from '../../utils/CustomEnums';

export default class PostViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			dataSource: ['a', 'c']
		}
	}

	renderItem() {
		return(
			<View style={{
				width: ScreenDimensions.width,
				paddingBottom: 16,
			}}>
				<TouchableOpacity onPress={() => {
					this.props.didSelectedItem && this.props.didSelectedItem()
				}} style={{
					width: ScreenDimensions.width - 32,
					marginLeft: 16,
					borderRadius: 6,
					backgroundColor: Colors.white,
				}}>
					<View style={{flexDirection: 'row', alignItems: 'center', width: ScreenDimensions.width - 32, marginTop: 8, justifyContent: 'space-between'}}>
						<View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8}}>
							<Image style={{width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.blue}}/>
							<Text numberOfLines={1} style={{fontSize: 14, color: Colors.black, marginLeft: 5, maxWidth: 150,}}>{'Simth09sdfsfsfsdfsdfsdf0234'}</Text>
							<Text style={{marginLeft: 8, backgroundColor: Colors.systemGray, borderRadius: 10,
								paddingHorizontal: 5, paddingVertical: 3,
								color: Colors.green, fontWeight: 'bold',
							}}>{'tag'}</Text>
						</View>

						<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginRight: 8}}>
							<Image style={{width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.red}}/>
							<Text style={{fontSize: 14, color: Colors.lightGray, marginLeft: 5,}}>{'19'}</Text>
						</TouchableOpacity>
					</View>

					<Text numberOfLines={1} style={{marginVertical: 16, fontSize: 20, fontWeight: 'bold', color: Colors.black,
						width: '100%', paddingHorizontal: 8,
					}}>{'Title'}</Text>

					<View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8, width: '100%', marginTop: 8, marginBottom: 8}}>
						<Image style={{width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.red}}/>
						<Text style={{fontSize: 14, color: Colors.lightGray, marginLeft: 5,}}>{'19'}</Text>

						<Text numberOfLines={1} style={{fontSize: 14, color: Colors.lightGray, marginLeft: 8, width: ScreenDimensions.width - 32 - 16 - 50,
							textAlign: 'left',
						}}>{'6 minutes * reply by Zack'}</Text>
					</View>

				</TouchableOpacity>
			</View>
		)
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<FlatList
					style={{flex: 1}}
					renderItem={({item}) => this.renderItem(item)}
					data={this.state.dataSource}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}

					// ListFooterComponent={() => {
					// 	return this.renderListFooter()
					// }}
				/>
			</View>
		)
	}
}
