import React, {Component} from 'react';
import {Alert, Linking, SectionList, Text, View, RefreshControl, ActivityIndicator,
	Keyboard, TouchableOpacity
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

export default class DoctorSearchResultListViewController extends Component{
	constructor(props) {
		super(props)
		this.setTopBar(props.searchContent)

		this.state = {
			dataSource: [],
			gender: 0,
			specialty: '',
			city: 'BIRMINGHAM',
			State: 'AL',
			searchContent: props.searchContent,
			isRefreshing: true,
			filterOverlayVisible: false,
			lastSpecialty: '',
			lastCity: 'BIRMINGHAM',
			lastState: 'AL',
			isTotal: false,
			isNoData: false,
		}

		this.page = 1
		this.pageSize = 30
		this.isScrollToTop = false
	}

	componentDidMount() {
		setTimeout(() => {
			this.refresh()
		}, 800)
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
								this.setState({searchContent: searchContent, isRefreshing: true}, () => {
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

	searchDoctors(isRefresh) {
		const genderType = ['', 'M', 'F']
		let param = {
			LastName: this.state.searchContent,
			FirstName: this.state.searchContent,
			Gender: genderType[this.state.gender],
			Specialty: this.state.lastSpecialty,// (this.state.lastSpecialty && this.state.lastSpecialty.length ? this.state.lastSpecialty : this.state.searchContent),
			City: this.state.lastCity,
			State: this.state.lastState,
			Page: this.page,
			PageSize: this.pageSize
		}

		if (isRefresh) {
			this.setState({isRefreshing: true})
		}

		HTTP.post(API_Doctor.searchDoctorByPage, param).then((response) => {
			if (isRefresh) {
				this.setState({isRefreshing: false})
			}

			if (!response) {
				return;
			}

			if (isRefresh) {
				this.setState({dataSource: response.data, isRefreshing: false ,
					isTotal: response.data < this.pageSize,
					isNoData: false,
				}, () => {
					if (this.isScrollToTop) {
						this.isScrollToTop = false
						this.scrollsToTop()
					}
				})
			}else {
				this.setState({dataSource: this.state.dataSource.concat(response.data),
					isTotal: response.data < this.pageSize,
					isNoData: false,
				})
			}
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
		this._sectionList && this._sectionList.scrollToLocation({
			animated: true,
			itemIndex: 0,
			sectionIndex: 0,
			viewOffset: 0,
			viewPosition: 0,
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
				<View style={{width: '100%', height: 25, justifyContent: 'center', backgroundColor: Colors.systemGray}}>
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
		if (this.state.isTotal) {
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
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<SectionList
					ref={(o) => {
						this._sectionList = o
					}}
					style={{flex: 1, backgroundColor: Colors.systemGray}}
					renderItem={({item}) => this.renderItem(item)}
					sections={[{data: this.state.dataSource}]}
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
					onEndReachedThreshold = {1}
					onEndReached = {() => {
						this.loadMore()
					}}

					ListFooterComponent={() => {
						return this.renderListFooter()
					}}

					renderSectionHeader={() => {
						return(this.renderHeader())
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
