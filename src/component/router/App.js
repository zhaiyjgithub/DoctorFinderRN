import Storage from 'react-native-storage';
import {AsyncStorage, Text, TextInput} from 'react-native';
import {CacheDB} from '../utils/DBTool';
import {DBKey} from '../utils/CustomEnums';
import RouterEntry from './RouterEntry';
import {Navigation} from 'react-native-navigation';


Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

console.disableYellowBox = true; //隐藏yellow box

const storage = new Storage({
	// 最大容量，默认值1000条数据循环存储
	size: 1000,

	// 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
	// 如果不指定则数据只会保存在内存中，重启后即丢失
	storageBackend: AsyncStorage,

	// 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
	defaultExpires: null,

	// 读写时在内存中缓存数据。默认启用。
	enableCache: true,
})

global.STORAGE = storage
global.UserPosition = {lat: 40.746100, lng: -73.979920, city: 'New York', state: 'NY'}
global.UserInfo = {}

Navigation.events().registerAppLaunchedListener(async () => {
	CacheDB.load(DBKey.userInfo, (userInfo) => {
		if (userInfo) {
			global.UserInfo = userInfo
		}

		RouterEntry.homePage()
	}, (error) => {
		RouterEntry.homePage()
	})
})





