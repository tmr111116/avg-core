import Err from './ErrorHandler';

export function attachToSprite(sprite) {
	sprite.interactive = true;
	sprite.on('click', handleEvent);
	sprite.on('tap', handleEvent);
	sprite.on('mousemove', handleEvent);
	sprite.on('mouseover', handleEvent);
	sprite.on('mouseout', handleEvent);
	sprite.on('mousedown', handleEvent);
	sprite.on('mouseup', handleEvent);
	sprite.on('touchstart', handleEvent);
	sprite.on('touchmove', handleEvent);
	sprite.on('touchend', handleEvent);
}

let Handler;
export function registerHandler(handler) {
	if (typeof handler === 'function')
		Handler = handler;
	else {
		Err.warn(`[EventManager] Event Handler must be a function, ignored.`);
	}
}

function handleEvent(evt) {
	let e = new EventData(evt);
	if (Handler) {
		Handler(e);
	} else {
		let defaultHandler = e.target['_on' + e.type];
		if (defaultHandler) {
			// if (e.type === 'mousemove') {
			// 	if (e.target.containsPoint(e.global)) {
			// 		console.log(1111)
			// 		defaultHandler(e);
			// 	}
			// } else {
				defaultHandler(e);
			// }
		}
	}
}

class EventData {
	constructor(evt) {
		this.type = evt.type;
		this.originalEvent = evt;
		this.index = evt.target.index;
		this.target = evt.target;
		this.global = {
			x: evt.data.global.x,
			y: evt.data.global.y
		}
		this.local = evt.target.toLocal(this.global);
		this.movement = {
			x: evt.data.originalEvent.movementX,
			y: evt.data.originalEvent.movementY
		};
	}
	stopPropagation() {
		this.originalEvent.stopped = true;
	}
}
