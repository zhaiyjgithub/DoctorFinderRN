const BaseUrl = "http://localhost:8090/"

const API_Doctor = {
	getHotSearchDoctors: 'Doctor/GetHotSearchDoctors',
	getDoctorInfoWithNpi: 'Doctor/GetDoctorInfoWithNpi',
	getRelatedDoctors: 'Doctor/GetRelatedDoctors',
	addCollection: 'Doctor/AddCollection',
	getCollectionStatus: 'Doctor/GetCollectionStatus',
	deleteCollection: 'Doctor/DeleteCollection',
	searchDoctorByPage: 'Doctor/SearchDoctorByPage',
}

const API_Post = {
	createPost: 'Post/CreatePost',
	uploadFile: 'Post/UploadFile',
	getPostByPage: 'Post/GetPostByPage',
	imgPost: 'Post/ImgPost/'
}

export {
	BaseUrl,
	API_Doctor,
	API_Post
}
