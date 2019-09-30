import HomePageViewController from '../HomePageViewController'
import {Navigation} from 'react-native-navigation'
import ExtraDimensions from 'react-native-extra-dimensions-android'



Navigation.registerComponent('HomePageViewController', () => HomePageViewController);

Navigation.events().registerAppLaunchedListener(async () => {
	// setDefaultOptions();

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
								// icon: require('../images/one.png'),
								testID: 'FIRST_TAB_BAR_BUTTON'
							}
						}
					}
				},
					{
						component: {
							name: 'HomePageViewController',
							passProps: {
								text: 'This is tab 2'
							},
							options: {
								bottomTab: {
									text: 'Tab 2',
									// icon: require('../images/two.png'),
									testID: 'SECOND_TAB_BAR_BUTTON'
								}
							}
						}
					}]
			}
		}
	});
});
