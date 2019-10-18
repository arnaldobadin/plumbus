const Sync = {};

Sync.resolve = function(mission, executor, ...params) {
	return new Promise(
		(resolve, reject) => {
			const operator = (error, result) => {
				return resolve({error, result});
			}
			params.push(operator);
			return mission.apply(executor, params);
		}
	);
}

Sync.result = function(mission, executor, ...params) {
	return new Promise(
		(resolve, reject) => {
			const operator = (error, result) => {
				return resolve((!error && result));
			}
			params.push(operator);
			return mission.apply(executor, params);
		}
	);
}

Sync.wait = function(mission, executor, ...params) {
	return new Promise(
		(resolve, reject) => {
			const operator = (error, result) => {
				return resolve((error && new Error(error)) || result);
			}
			params.push(operator);
			return mission.apply(executor, params);
		}
	);
}

module.exports = Sync;
