import {Version} from './Config';
import {HTTP} from './HttpTools';
import {API_Track, API_User} from './API';
import {DLogger} from './Utils';

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
		DLogger('action param: ' + JSON.stringify(param))
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
		DLogger('action param: ' + JSON.stringify(param))
	},
	uploadTrackEvents() {
		DLogger(JSON.stringify(this.actionEvents))
		DLogger(JSON.stringify(this.viewEvents))

		let param = {
			Actions: this.actionEvents,
			Views: this.viewEvents
		}

		HTTP.post(API_Track.addEvent, param).then((response) => {
			DLogger(response)
			this.actionEvents = []
			this.viewEvents = []
		}).catch((error) => {
			DLogger(error)
		})
	}
}

export {
	UserTrack
}
