const BaseNavigatorOptions = (title) => {
	return (
		{
			topBar: {
				title: {
					text: title ? title : ''
				},
				backButton: {
					title: ''
				}
			},
			bottomTabs: {
				visible: false,
				drawBehind: true,
			}
		}
	)
}

export {
	BaseNavigatorOptions
}
