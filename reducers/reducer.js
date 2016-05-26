export default function(state, action){
	switch(action.type){
		case 'ADD':
			return { count : action.payload };
		case 'REDUCE' :
			return { count : action.payload };
		default : 
			return { count : 0 };

	}
}