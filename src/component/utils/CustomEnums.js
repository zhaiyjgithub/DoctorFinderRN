import {
	Platform
} from 'react-native';

const Language = {
	english: 'en',
	chinese: 'zh-Hans-CN',
	spanish: 'spanish',
};

const PLATFORM = {
	isIOS: Platform.OS === "ios",
	isAndroid: Platform.OS === "android",
	isPad: (Platform.OS && Platform.isPad)
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

export {
	PLATFORM,
	Language,
	ErrorCode,
	Gender

}