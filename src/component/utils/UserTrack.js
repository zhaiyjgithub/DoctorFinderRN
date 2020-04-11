import {Version} from './Config';

const UserTrack = {
	actionEvents: [],
	viewEvents: [],
	trackAction(actionName) {
		let param = {
			platform: Platform.OS,
			lat: UserPosition.lat ? UserPosition.lat : 0,
			lng: UserPosition.lng ? UserPosition.lng : 0,
			userId: UserInfo.UserID ? UserInfo.UserID : 0,
			createdDate: (new Date()).toISOString(),
			name: actionName,
			appVersion: Version.Number
		}

		this.actionEvents.push(param)
		console.log('action param: ' + JSON.stringify(param))
	},
	trackView(viewName, beginTime, endTime) {
		let param = {
			platform: Platform.OS,
			lat: UserPosition.lat ? UserPosition.lat : 0,
			lng: UserPosition.lng ? UserPosition.lng : 0,
			userId: UserInfo.UserID ? UserInfo.UserID : 0,
			name: viewName,
			beginTime: beginTime,
			endTime: endTime,
			appVersion: Version.Number,
		}

		this.viewEvents.push(param)
		console.log('action param: ' + JSON.stringify(param))
	},
	uploadTrackEvents() {

	}
}

export {
	UserTrack
}
