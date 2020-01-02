import Share from 'react-native-share';

const ShareTool =(options) => {
	Share.open(options)
	.then((res) => { console.log(res) })
	.catch((err) => { err && console.log(err); });
}

export {
	ShareTool
}



