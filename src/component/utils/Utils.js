
const FormatPhone = (phone) => {
	let formatedPhone = phone
	if (phone && phone.length >= 10) {
		let header = phone.substr(0, 3)
		let middle = phone.substr(3, 3)
		let last = phone.substr(6, 4)

		formatedPhone = '(' + header + ')' + middle + '-' + last
	}

	return formatedPhone
}

const CalcTimeStamp = (dateString) => {
	let lastDate = new Date(dateString)

	let timeStamp = ((new Date()).getTime() - lastDate.getTime())/1000

	if (timeStamp < 59) {
		return 'A moment before'
	}else if (timeStamp < 3600) {
		return parseInt(timeStamp/60) + ' minutes before'
	}else if (timeStamp < (3600*24)) {
		return parseInt(timeStamp/3600) + ' hours before'
	}else  {
		let year = lastDate.getFullYear()
		let month = lastDate.getMonth() + 1
		let day = lastDate.getDate()
		let hour = lastDate.getHours()
		let min = lastDate.getMinutes()

		if (month < 10) {
			month = '0' + month
		}

		if (day < 10) {
			day = '0' + day
		}

		if (hour < 10) {
			hour = '0' + hour
		}

		if (min < 10) {
			min = '0' + min
		}

		if (timeStamp < (3600*24*4)) {
			return parseInt(timeStamp/(3600*24)) + ' days before'
		}

		return hour + ':' + min + ' ' + month + '/' + day + '/' + year
	}
}

export {
	FormatPhone,
	CalcTimeStamp
}
