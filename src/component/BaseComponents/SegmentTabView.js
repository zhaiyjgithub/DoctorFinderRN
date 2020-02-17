import React, {Component} from 'react';
import {Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
import {Colors} from '../utils/Styles';
import Spinner from "react-native-spinkit";
import SegmentedControlTab from 'react-native-segmented-control-tab';

export default class SegmentTabView extends Component{
	static defaultProps = {
		menus: [],
		tabWidth: 180
	}

	constructor(props) {
		super(props)
		this.state = {
			selectedIndex: 0
		}
	}

	render() {
		return(
			<SegmentedControlTab
				tabsContainerStyle = {{
					height: 32, width: 180,
				}}
				values={this.props.menus}
				onTabPress={(index) => {
					this.setState({selectedIndex: index})
					this.props.handleIndexChange && this.props.handleIndexChange(index)
				}
				}
				selectedIndex={this.state.selectedIndex}
				tabTextStyle = {{color: Colors.white}}
				tabStyle = {{borderColor: Colors.white, backgroundColor: Colors.theme}}
				activeTabStyle = {{backgroundColor: Colors.white}}
				activeTabTextStyle={{ color: Colors.theme }}
				/>
		)
	}
}





