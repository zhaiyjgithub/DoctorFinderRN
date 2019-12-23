import HomePageViewController from '../tabbar/home/HomePageViewController'
import SearchBar from  '../tabbar/home/view/SearchBar'
import HomePageTitleView from '../tabbar/home/view/HomePageTitleView'

import {Navigation} from 'react-native-navigation'
import {Colors} from '../utils/Styles';


Navigation.registerComponent('HomePageViewController', () => HomePageViewController);
Navigation.registerComponent('SearchBar', () => SearchBar);
Navigation.registerComponent('HomePageTitleView', () => HomePageTitleView);

Navigation.events().registerAppLaunchedListener(async () => {
	Navigation.setDefaultOptions({
		topBar: {
			background: {
				color: Colors.theme,
				drawBehind: false,
				leftButtonColor: Colors.white,
				rightButtonColor: Colors.white,
			},
			title: {
				color: Colors.white,
				fontWeight: 'bold',
				fontSize: 16,
			},
		}
	});

	Navigation.setRoot({
		root: {
			bottomTabs: {
				children: [{
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
								text: 'Tab 1',
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
									name: 'HomePageViewController',
									passProps: {
										text: 'This is tab 1'
									}
								}
							}],
							options: {
								bottomTab: {
									text: 'Tab 1',
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
