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
	AppState, TouchableOpacity, Image, Text, RefreshControl, SectionList, Keyboard, TextInput,
} from 'react-native';
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {Gender, PLATFORM} from '../../utils/CustomEnums';
import PostItem from './view/PostItem';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import {HTTP} from '../../utils/HttpTools';
import {API_Post, BaseUrl} from '../../utils/API';
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import LoadingFooter from '../../BaseComponents/LoadingFooter';

export default class PostDetailViewController extends Component{
	static defaultProps = {
		postInfo: null
	}
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			postInfo: props.postInfo,
			isSpinnerVisible: false,
			newAnswer: ''
		}
	}

	renderListFooter() {
		return(
			<LoadingFooter isTotal={this.state.isTotal}
						   isLoading={this.state.dataSource.length}
			/>
		)
	}

	renderAttachments(postInfo) {
		let size = (ScreenDimensions.width - 32 - 10)/2.0
		let imgUrl = BaseUrl + API_Post.imgPost +'?name='
		return(
			<View style={{width: ScreenDimensions.width, flexDirection: 'row', alignItems: 'center', marginTop: 8,
				paddingHorizontal: 16,
			}}>
				{postInfo.URLs.map((item ,index) => {
					return(
						<View key={index} style={{width: size, height: size, backgroundColor: Colors.systemGray,
							justifyContent: 'center', alignItems: 'center', marginRight: 10
						}}>
							<TouchableOpacity onPress={() => {
								//
							}} key={index} style={{width: size, height: size, backgroundColor: Colors.systemGray,
								justifyContent: 'center', alignItems: 'center',
							}}>
								<Image resizeMode={'cover'} style={{width: size, height: size}} source={{uri: imgUrl + item}}/>
							</TouchableOpacity>
						</View>
					)
				})}
			</View>
		)
	}

	renderAddAnswerView() {
		return(
			<View style={{
				backgroundColor: Colors.white,
				paddingVertical: 5,
				position: 'absolute',
				width: '100%',
				left: 0,
				height: 36 + 10 + (PLATFORM.isIPhoneX ? 34 : 0),
				bottom: 0
			}}>
				<TextInput
					returnKeyType={'send'}
					clearButtonMode={'while-editing'}
					// numberOfLines={1}
					underlineColorAndroid={'transparent'}
					placeholder = {'write your comment.'}
					placeholderTextColor={Colors.lightGray}
					onChangeText={(text) => {
						this.setState({newAnswer: text.trim() + ''})
					}}
					value = {this.state.newAnswer}
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

					<View style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1, backgroundColor: Colors.lineColor}}/>
			</View>
		)
	}

	renderHeader() {
		let postInfo = this.props.postInfo
		if (!postInfo) {
			return <View/>
		}
		return(
			<View style={{backgroundColor: Colors.white}}>
				<View style={{flexDirection: 'row', alignItems: 'center',
					justifyContent: 'space-between', width: '100%',marginTop: 20,
				}}>
					<View style={{flexDirection: 'row',
						 backgroundColor: Colors.white
					}}>
						<Image source={require("../../../resource/image/base/avatar.jpg")} style={{width: 50, height: 50, borderRadius: 6, marginLeft: 16,}}/>
						<View style={{ marginLeft: 8, justifyContent: 'space-between'}}>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Text style={{fontSize: 16, color: Colors.black, maxWidth: 120, textAlign: 'left'}}>{postInfo.UserName}</Text>
								<Text style={{marginLeft: 8, backgroundColor: Colors.systemGray, borderRadius: 10,
									paddingHorizontal: 5, paddingVertical: 3,
									color: Colors.green, fontWeight: 'bold',
								}}>{'tag'}</Text>
							</View>
							<Text style={{fontSize: 14, color: Colors.lightGray}}>{'2 day ago'}</Text>
						</View>
					</View>

					<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginRight: 16, minWidth: 30,}}>
						<Image source={require('../../../resource/image/post/like.png')} style={{width: 14, height: 14,}}/>
						<Text style={{fontSize: 14, color: Colors.lightGray, marginLeft: 3,}}>{postInfo.Likes}</Text>
					</TouchableOpacity>
				</View>


				<Text style={{fontSize: 20, color: Colors.black, fontWeight: 'bold',
					paddingHorizontal:16, marginTop: 8
				}}>{postInfo.Title}</Text>

				<Text style={{fontSize: 16, color: Colors.black,
					paddingHorizontal:16, marginTop: 8, marginBottom: 16
				}}>{postInfo.Description}</Text>

				{this.renderAttachments(postInfo)}

				{this.renderSectionHeader()}
			</View>
		)
	}

	renderSectionHeader(){
		return(
			<View style={{width: '100%', height: 30, flexDirection: 'row', alignItems: 'center',
				backgroundColor: Colors.systemGray, marginTop: 20,
			}}>
				<Text style={{fontSize: 14, color: Colors.black, marginLeft: 16,}}>{'32 replies'}</Text>
			</View>
		)
	}

	renderItem() {
		return <View />
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

					ListHeaderComponent={() => {
						return this.renderHeader()
					}}

					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							enabled = {true}
							onRefresh={() => {
								// this.refresh()
							}
							}
						/>
					}
					onEndReachedThreshold = {1}
					onEndReached = {() => {
						// this.loadMore()
					}}

					ListFooterComponent={() => {
						return this.renderListFooter()
					}}

				/>

				{this.renderAddAnswerView()}
				<LoadingSpinner visible={this.state.isSpinnerVisible} />
			</View>
		)
	}
}
