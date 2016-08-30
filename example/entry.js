	require("./assets/css/style.css");
	import * as iceleaf from 'iceleaf';

	try {
	let view = require('./ui');
	iceleaf.render(view);

} catch (e) {
	alert(e)
}
