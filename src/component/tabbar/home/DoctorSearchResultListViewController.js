import React, {Component} from 'react';
import {Alert, Linking, SectionList, Text, View, RefreshControl, ActivityIndicator,
	Keyboard, TouchableOpacity, FlatList
} from 'react-native';
import {Colors} from '../../utils/Styles';
import {ScreenDimensions, TabBar} from '../../utils/Dimensions';
import {Navigation} from 'react-native-navigation';
import DoctorInfoItem from './view/DoctorInfoItem';
import {HTTP} from '../../utils/HttpTools';
import {API_Doctor} from '../../utils/API';
import {PLATFORM, SearchBarOverlayType, SearchBarType} from '../../utils/CustomEnums';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import SearchFilterOverlay from './view/SearchFilterOverlay';
import ListEmptyView from '../../BaseComponents/ListEmptyView';

export default class DoctorSearchResultListViewController extends Component{
	constructor(props) {
		super(props)
		this.setTopBar(props.searchContent)
		this.state = {
			dataSource: [],
			gender: 0,
			specialty: props.specialty ? props.specialty : '',
			city: UserPosition.city,
			State: UserPosition.state,
			searchContent: props.searchContent,
			isRefreshing: false,
			filterOverlayVisible: false,
			lastSpecialty: props.specialty ? props.specialty : '',
			lastCity: UserPosition.city,
			lastState: UserPosition.state,
			isTotal: false,
			isNoData: false,
		}

		this.page = 1
		this.pageSize = 30
		this.isScrollToTop = false
		this.onEndReachedCalledDuringMomentumInTrend = false
	}

	getUserID() {
		return UserInfo.UserID
	}

	componentDidMount() {
		this.refresh()
	}

	setTopBar(searchContent) {
		Navigation.mergeOptions(this.props.componentId, {
			topBar: {
				title: {
					component: {
						name: 'SearchBar',
						passProps: {
							type: SearchBarType.min,
							searchContent: searchContent,
							onSubmitEditing: (searchContent) => {
								this.setState({searchContent: searchContent.trim(), isRefreshing: true}, () => {
									this.refresh()
								})
							},
							filterAction: () => {
								Keyboard.dismiss()
								this.setState({filterOverlayVisible: true})
							}
						}
					}
				}
			}
		})
	}

	checkIsNumber(str) {
		let reg = /^[0-9]+.?[0-9]*$/;
		return reg.test(str)
	}
	searchDoctors(isRefresh) {
		const {searchContent} = this.state

		let name = searchContent.trim()
		let address = searchContent.trim()
		let zipCode = 0

		if (this.checkIsNumber(searchContent)) {
			name = ''
			address = ''
			zipCode = parseInt(searchContent)
		}

		let param = {
			Name: name,
			Gender: this.state.gender,
			Specialty: this.state.lastSpecialty,
			Address: address,
			City: this.state.lastCity,
			State: this.state.lastState,
			ZipCode: zipCode,
			Page: this.page,
			PageSize: this.pageSize,
			Platform: Platform.OS,
			UserID: this.getUserID()
		}

		if (isRefresh) {
			this.setState({isRefreshing: true})
		}

		HTTP.post(API_Doctor.searchDoctorES, param).then((response) => {
			let data = isRefresh ? response.data : this.state.dataSource.concat(response.data)
			this.setState({
				dataSource: data,
				isRefreshing: false ,
				isTotal: response.data.length < this.pageSize,
				isNoData: false,
			}, () => {
				if (this.isScrollToTop) {
					this.isScrollToTop = false
					this.scrollsToTop()
				}
			})
		}).catch(() => {
			this.isScrollToTop = true
			if (isRefresh) {
				this.setState({isRefreshing: false})
			}
		})
	}

	refresh() {
		this.page = 1
		this.searchDoctors(true)
	}

	loadMore() {
		this.page = this.page + 1
		this.searchDoctors(false)
	}

	scrollsToTop() {
		this._flatList && this._flatList.scrollToOffset({
			animated: true,
			offset: 0,
		})
	}

	renderHeader() {
		let header = 'Search drs: '
		if (this.state.searchContent.length) {
			header = header + '\'' + this.state.searchContent + '\''
		}

		if (this.state.searchContent.length && this.state.specialty.length) {
			header = header + ' of ' + this.state.specialty
		}else if (!this.state.searchContent.length && this.state.specialty.length) {
			header = header + this.state.specialty
		}

		if ((this.state.searchContent.length || this.state.specialty.length)) {
			if (this.state.city.length) {
				header = header + ' in ' + this.state.city + ' City, ' + this.state.State
			}else if (!this.state.city.length && this.state.State.length) {
				header = header + ' in ' + this.state.State
			}
		}else if (this.state.city.length || this.state.State.length) {
			if (this.state.city.length) {
				header = header + 'in ' + this.state.city + ' City, ' + this.state.State
			}else if (!this.state.city.length && this.state.State.length) {
				header = header + 'in ' + this.state.State
			}
		}else {
			header = ''
		}

		if (!header.length) {
			return null
		}else {
			return(
				<View style={{width: '100%', height: 25, justifyContent: 'center', backgroundColor: Colors.white}}>
					<Text numberOfLines={1} style={{width: ScreenDimensions.width - 32, marginLeft: 16,
						fontSize: 12, color: Colors.red, fontWeight: 'bold'
					}}>{header}</Text>
				</View>
			)
		}
	}

	showQuestionAlert() {
		Alert.alert(
			'Information is incorrect?',
			'Thank you very much for the feedback you can provide us and other users.',
			[
				{text: 'Cancel', onPress: () => {}, style: 'cancel'},
				{text: 'Feedback', onPress: () => {
						this.pushFeedbackViewController()
					}},
			],
			{ cancelable: false }
		)
	}

	pushFeedbackViewController() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'FeedbackViewController',
				passProps: {

				},
				options: BaseNavigatorOptions('Feedback')
			}
		});
	}

	pushToDoctorInfoPage(item) {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'DoctorInfoViewController',
				passProps: {
					info: item,
				},
				options: BaseNavigatorOptions()
			}
		})
	}

	pushToSpecialtyListPage() {
		Navigation.showModal({
			stack: {
				children: [{
					component: {
						name: 'SpecialtyViewController',
						passProps: {
							selectedSpecialty: this.state.specialty,
							didSelectedSpecialty: (specialty) => {
								this.setState({specialty: specialty})
							}
						},
						options: BaseNavigatorOptions('Specialty')
					}
				}]
			}
		});
	}

	pushToStateListPage() {
		Navigation.showModal({
			stack: {
				children: [{
					component: {
						name: 'StateListViewController',
						passProps: {
							selectedState: this.state.State,
							selectedCity: this.state.city,
							didSelectedState: (state) => {
								this.setState({State: state})
							},
							didSelectedCity: (city) => {
								this.setState({city: city})
							}
						},
						options: BaseNavigatorOptions('State')
					}
				}]
			}
		});
	}

	renderItem(item) {
		return(
			<DoctorInfoItem
				id = {item.Npi}
				info = {item}
				didSelectedItem = {() => {
					this.pushToDoctorInfoPage(item)
				}}
				questionAction = {() => {
					this.showQuestionAlert()
				}}
			/>
		)
	}

	renderListFooter() {
		if (this.state.dataSource.length && this.state.isTotal) {
			return(
				<View style={{width: ScreenDimensions.width, height: 44, alignItems: 'center'}}>
					<Text style={{fontSize: 14, color: Colors.lightGray,}}>{'No more data...'}</Text>
				</View>
			)
		}else if (this.state.dataSource.length) {
			return(
				<View style={{width: ScreenDimensions.width,alignItems: 'center'}}>
					<ActivityIndicator color={Colors.theme}/>
					<Text style={{fontSize: 14, color: Colors.lightGray, marginTop: 8}}>{'Loading data...'}</Text>
				</View>
			)
		}else {
			return (<View />)
		}
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.listBg}}>
				{this.renderHeader()}
				<FlatList
					ref={(o) => {
						this._flatList = o
					}}
					style={{flex: 1, backgroundColor: Colors.listBg}}
					renderItem={({item}) => this.renderItem(item)}
					data={this.state.dataSource}
					keyExtractor = {(item,index) =>{
						return 'key' + item.key + index
					}}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							enabled = {true}
							onRefresh={() => {
									this.refresh()
								}
							}
						/>
					}
					onEndReachedThreshold = {0.1}
					onEndReached = {() => {
						if (!this.onEndReachedCalledDuringMomentumInTrend) {
							this.loadMore()
							this.onEndReachedCalledDuringMomentumInTrend = true;
						}
					}}
					onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentumInTrend = false; }}
					ListFooterComponent={() => {
						return this.renderListFooter()
					}}

					ListEmptyComponent={() => {
						return(
							<ListEmptyView />
						)
					}}
				/>

				<SearchFilterOverlay
					isVisible={this.state.filterOverlayVisible}
					dismiss={() => {
						this.setState({filterOverlayVisible: false})
					}}
					cancel = {() => {
						this.setState({
							filterOverlayVisible: false,
							specialty: this.state.lastSpecialty,
							city: this.state.lastCity,
							State: this.state.lastState,
						})
					}}
					confirm = {(newSearchContent, gender) => {
						this.setState({
							filterOverlayVisible: false,
							searchContent: newSearchContent,
							gender: gender,
							lastSpecialty: this.state.specialty,
							lastCity: this.state.city,
							lastState: this.state.State,
						}, () => {
							this.isScrollToTop = true
							this.refresh()
						})
					}}
					searchContent = {this.state.searchContent}
					gender = {this.state.gender}
					specialty = {this.state.specialty}
					State = {this.state.State}
					city = {this.state.city}
					didSelectedItem={(type) => {
						if (type === SearchBarOverlayType.specialty) {
							this.pushToSpecialtyListPage()
						}else if (type === SearchBarOverlayType.location){
							this.pushToStateListPage()
						}
					}}
				/>
			</View>
		)
	}
}
