const BaseUrl = "http://localhost:8090/"

const API_Doctor = {
	getHotSearchDoctors: 'Doctor/GetHotSearchDoctors',
	getDoctorInfoWithNpi: 'Doctor/GetDoctorInfoWithNpi',
	getRelatedDoctors: 'Doctor/GetRelatedDoctors',
	getCollectionStatus: 'Doctor/GetCollectionStatus',
	deleteCollection: 'Doctor/DeleteCollection',
	searchDoctorByPage: 'Doctor/SearchDoctorByPage',
}

const API_Post = {
	createPost: 'Post/CreatePost',
	uploadFile: 'Post/UploadFile',
	getPostByPage: 'Post/GetPostByPage',
	imgPost: 'Post/ImgPost/',
	addAnswerToPost: 'Post/AddAnswerToPost',
	addFavor: 'Post/AddFavor',
	addLikes: 'Post/AddLikes'
}

const API_Answer = {
	addAnswer: 'Answer/AddAnswer',
	getAnswerListByPage: 'Answer/GetAnswerListByPage',
	addAnswerLikes: 'Answer/AddAnswerLikes'
}

const API_Register = {
	signIn: 'Register/SignIn',
	sendVerificationCode: 'Register/SendVerificationCode',
	register: 'Register/Register',
	verifyEmail: 'Register/VerifyEmail',
	resetPassword: 'Register/ResetPassword',
	headerImg: 'Register/HeaderImg'

}

const API_User = {
	getUserInfo: 'User/GetUserInfo',
	updateUserInfo: 'User/UpdateUserInfo',
	getMyFavorite: 'User/GetMyFavorite',
	addFavorite: 'User/AddFavorite',
}



export {
	BaseUrl,
	API_Doctor,
	API_Post,
	API_Answer,
	API_Register,
	API_User
}
