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
	unknown: '',
	maleType: 0,
	femaleTye: 1,
}


const SearchBarType = {
	normal: 0,
	max: 1,
	min: 2
}

const SearchBarOverlayType = {
	specialty: 0,
	location: 1,
}

const DBKey = {
	userInfo: 'UserInfo'
}

const CollectionType = {
	doctor: 0,
	post: 1,
}

const EventName = {
	other: {
		segmentTab: 'segmentTab'
	}
}

export {
	PLATFORM,
	Language,
	ErrorCode,
	Gender,
	SearchBarType,
	SearchBarOverlayType,
	DBKey,
	CollectionType,
	EventName
}
