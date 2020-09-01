const CacheDB = {
	load: (key, response, error) => {
		STORAGE.load({
			key: key,
			autoSync: true,
			syncInBackground: true,
		}).then(ret => {
			response && response(ret)
		}).catch((err) => {
			error && error(err)
		})
	},
	save:(key, obj) => {
		STORAGE.save({
			key: key,
			data: obj
		})
	},
	remove: (key) => {
		STORAGE.remove({
			key: key
		})
	}
}

export {
	CacheDB
}
