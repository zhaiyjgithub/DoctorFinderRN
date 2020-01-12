import {
	Dimensions,
	Platform,
} from 'react-native';


const Language = {
	english: 'en',
	chinese: 'zh-Hans-CN',
	spanish: 'spanish',
};

const PLATFORM = {
	isIOS: Platform.OS === "ios",
	isAndroid: Platform.OS === "android",
	isPad: (Platform.OS && Platform.isPad),
	isIPhoneX: (Platform.OS === "ios" && !Platform.isPad && ((Dimensions.get('window').height) >=812))
};

const ErrorCode = {
	Ok: 0,
	Fail: 1,
}

const Gender = {
	male: 'M',
	female: 'F',
	unknown: ''
}

const SearchBarType = {
	normal: 0,
	max: 1,
	min: 2
}

const SearchBarOverlayType = {
	specialty: 0,
}

export {
	PLATFORM,
	Language,
	ErrorCode,
	Gender,
	SearchBarType,
	SearchBarOverlayType

}
