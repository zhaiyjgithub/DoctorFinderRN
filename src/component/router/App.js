import HomePageViewController from '../tabbar/home/HomePageViewController'
import SearchBar from  '../tabbar/home/view/SearchBar'
import HomePageTitleView from '../tabbar/home/view/HomePageTitleView'
import PostViewController from '../tabbar/post/PostViewController'
import MineViewController from '../tabbar/mine/MineViewController'
import DoctorInfoViewController from '../tabbar/home/DoctorInfoViewController'
import DoctorSearchResultListViewController from '../tabbar/home/DoctorSearchResultListViewController'
import SpecialtyViewController from '../tabbar/home/SpecialtyViewController'
import StateListViewController from '../tabbar/home/StateListViewController'
import CityListViewController from '../tabbar/home/CityListViewController'
import SearchFilterOverlay from '../tabbar/home/view/SearchFilterOverlay'
//SearchFilterOverlay

import {Navigation} from 'react-native-navigation'
import {Colors} from '../utils/Styles';
import {Text, TextInput} from 'react-native';


Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

console.disableYellowBox = true; //隐藏yellow box



Navigation.registerComponent('HomePageViewController', () => HomePageViewController);
Navigation.registerComponent('SearchBar', () => SearchBar);
Navigation.registerComponent('HomePageTitleView', () => HomePageTitleView);
Navigation.registerComponent('PostViewController', () => PostViewController);
Navigation.registerComponent('MineViewController', () => MineViewController);
Navigation.registerComponent('DoctorInfoViewController', () => DoctorInfoViewController)
Navigation.registerComponent('DoctorSearchResultListViewController', () => DoctorSearchResultListViewController);
Navigation.registerComponent('SpecialtyViewController', () => SpecialtyViewController);
Navigation.registerComponent('StateListViewController', () => StateListViewController);
Navigation.registerComponent('CityListViewController', () => CityListViewController);
Navigation.registerComponent('SearchFilterOverlay', () => SearchFilterOverlay);
//

Navigation.events().registerAppLaunchedListener(async () => {
	Navigation.setDefaultOptions({
		statusBar: {
			visible: true,
			style: 'light'
		},
		topBar: {
			background: {
				color: Colors.theme,
			},
			noBorder: true,
			drawBehind: false,
			leftButtonColor: Colors.white,
			rightButtonColor: Colors.white,
			title: {
				color: Colors.white,
				fontWeight: 'bold',
				fontSize: 16,
			},
			backButton: {
				color: Colors.white,
				title: ''
			}
		},
		bottomTabs: {
			visible: true,
			drawBehind: true,
		}
	});

	Navigation.setRoot({
		root: {
			bottomTabs: {
				children: [
					{
					stack: {
						children: [{
							component: {
								name: 'HomePageViewController',
								passProps: {
									text: 'This is tab 1'
								}
							}
						}],
						options: {
							bottomTab: {
								text: 'Finder',
								icon: require('../../resource/image/doctor.png'),
								testID: 'FIRST_TAB_BAR_BUTTON'
							}
						}
					}
				},
					{
						stack: {
							children: [{
								component: {
									name: 'PostViewController',
									passProps: {
										text: 'This is tab 1'
									}
								}
							}],
							options: {
								bottomTab: {
									text: 'Post',
									icon: require('../../resource/image/doctor.png'),
									testID: 'FIRST_TAB_BAR_BUTTON'
								}
							}
						}
					},
					{
						stack: {
							children: [{
								component: {
									name: 'MineViewController',
									passProps: {
										text: 'This is tab 1'
									}
								}
							}],
							options: {
								bottomTab: {
									text: 'Mine',
									icon: require('../../resource/image/doctor.png'),
									testID: 'FIRST_TAB_BAR_BUTTON'
								}
							}
						}
					}
					]
			}
		}
	});
});
