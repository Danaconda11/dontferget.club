let E = module.exports

E.deep_freeze = obj => {
	let propNames = Object.getOwnPropertyNames(obj)
	propNames.forEach(name => {
		let prop = obj[name]
		if (typeof prop == 'object' && prop !== null) {
			E.deep_freeze(prop)
		}
	})
	return Object.freeze(obj)
}
