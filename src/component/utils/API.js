const BaseUrl = "http://localhost:8090/"

const API_Doctor = {
	getHotSearchDoctors: 'Doctor/GetHotSearchDoctors',
	getDoctorInfoWithNpi: 'Doctor/GetDoctorInfoWithNpi',
	getRelatedDoctors: 'Doctor/GetRelatedDoctors',
	addCollection: 'Doctor/AddCollection',
	getCollectionStatus: 'Doctor/GetCollectionStatus',
	deleteCollection: 'Doctor/DeleteCollection'
}

export {
	BaseUrl,
	API_Doctor
}
