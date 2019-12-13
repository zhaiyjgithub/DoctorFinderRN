import {Dimensions, Platform} from 'react-native'
import  ExtraDimensions from 'react-native-extra-dimensions-android'
import {PLATFORM} from "./../utils/CustomEnums";

const ScreenDimensions = {
	width: (PLATFORM.isIOS) ? Dimensions.get('window').width : ExtraDimensions.get('REAL_WINDOW_WIDTH'),
	height: (PLATFORM.isIOS) ? Dimensions.get('window').height : (ExtraDimensions.get('REAL_WINDOW_HEIGHT') - ExtraDimensions.get('STATUS_BAR_HEIGHT') - ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT'))
}

const NaviBarHeight = {
	height: PLATFORM.isIOS ? ((Platform.isPad) ? (parseInt(Platform.Version, 10) < 12 ? 64: 70) : (Dimensions.get('window').height < 812 ? 64 : 88) ) : 56,
}

const TabBar = {
	height: (PLATFORM.isIOS ? ((Dimensions.get('window').height < 812 ? 49 : 73)) : 56) //RNN - android MD: 56
}

export {
	ScreenDimensions,
	TabBar,
	NaviBarHeight
}
