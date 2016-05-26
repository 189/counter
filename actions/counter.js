export function add(count){
	return {
		type : 'ADD',
		payload : count
	};
}

export function reduce(count){
	return {
		type : 'REDUCE',
		payload : count
	}
}