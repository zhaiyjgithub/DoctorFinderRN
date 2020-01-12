import React, {Component} from 'react';
import {Alert, Linking, SectionList, Text, View, RefreshControl} from 'react-native';
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
		this.state = {
			dataSource: [],
			specialty: '',
			city: 'BIRMINGHAM',
			province: 'AL',
			searchContent: props.searchContent,
			isRefreshing: false,
			filterOverlayVisible: false
		}

		this.page = 1
		this.pageSize = 30

		this.setTopBar(props.searchContent)
	}

	componentDidMount() {
		this.searchDoctors(this.state.searchContent)

	}

	setTopBar(searchContent) {
		Navigation.mergeOptions(this.props.componentId, {
			topBar: {
				title: {
					component: {
						name: 'SearchBar',
						passProps:{
							type: SearchBarType.min,
							searchContent: searchContent,
							onSubmitEditing: (searchContent) => {
								this.setState({searchContent: searchContent, isRefreshing: true}, () => {
									this.searchDoctors(true)
								})
							},
							filterAction: () => {
								this.setState({filterOverlayVisible: true})
								// this.showOverlay()
							}
						}
					}
				}
			}
		});
	}

	searchDoctors(isRefresh) {
		let param = {
			LastName: this.state.searchContent,
			FirstName: '',
			Specialty: this.state.specialty,
			City: this.state.city,
			State: this.state.province,
			Page: this.page,
			PageSize: this.pageSize
		}

		HTTP.post(API_Doctor.searchDoctorByPage, param).then((response) => {
			if (!response) {
				return;
			}

			if (response.data && !response.data.length) {
				return;
			}

			if (isRefresh) {
				this.setState({dataSource: response.data, isRefreshing: false})
			}else {
				this.setState({dataSource: this.state.dataSource.concat(response.data)})
			}
		}).catch(() => {

		})
	}

	renderHeader() {
		let header = ''
		if (this.state.searchContent.length) {
			header = 'Search drs: ' + this.state.searchContent
		}

		if (this.state.specialty.length) {
			header = header + ' ' + this.state.specialty
		}

		if (header.length >=2) {
			header = header + ' in ' + this.state.city + ' City, ' + this.state.province
		}else {
			header = 'Drs in ' + this.state.city + ' City, ' + this.state.province
		}

		return(
			<View style={{width: '100%', height: 25, justifyContent: 'center', backgroundColor: Colors.systemGray}}>
				<Text numberOfLines={1} style={{width: ScreenDimensions.width - 32, marginLeft: 16,
					fontSize: 12, color: Colors.lightGray,
				}}>{header}</Text>
			</View>
		)
	}

	showQuestionAlert() {
		Alert.alert(
			'Information is incorrect?',
			'Thank you very much for the feedback you can provide us and other users.',
			[
				{text: 'Cancel', onPress: () => {}, style: 'cancel'},
				{text: 'Feedback', onPress: () => {

					}},
			],
			{ cancelable: false }
		)
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
							//
						},
						options: BaseNavigatorOptions('Specialty')
					}
				}]
			}
		});
	}

	renderItem(item) {
		return(
			<DoctorInfoItem
				id = {item.ID}
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

	render() {
		return(
			<View style={{flex: 1, backgroundColor: Colors.systemGray}}>
				<SectionList
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
									this.searchDoctors(true)
								}
							}
						/>
					}
					onEndReachedThreshold = {1}
					onEndReached = {() => {

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
					didSelectedItem={(type) => {
						if (type === SearchBarOverlayType.specialty) {
							this.pushToSpecialtyListPage()
						}
					}}
				/>
			</View>
		)
	}
}
