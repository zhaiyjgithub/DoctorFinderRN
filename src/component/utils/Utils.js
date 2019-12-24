
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

export {
	FormatPhone
}
