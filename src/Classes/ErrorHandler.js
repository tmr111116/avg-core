

export default class ErrorHandler {
	constructor(args) {
		// code
	}

	static error (text){
		return console.log("Error: "+text+'.');
	}

	static warn (text){
		return console.log("Warning: "+text+'.');
	}
}



module.exports = ErrorHandler;