const Sync = function() {}

Sync.wait = function(mission, executor, ...params) {
	params = params || [];
	return new Promise(
		(resolve, reject) => {
			let operator = (error, result) => {
				return resolve({error, result});
			}
			params.push(operator);
			return mission.apply(executor, params);
		}
	);
}

module.exports = Sync;