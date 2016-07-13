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
	sprite.on('touchEnd', handleEvent);
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
	}
}

class EventData {
	constructor(evt) {
		this.type = evt.type;
		this.index = evt.target.index;
		this.target = evt.target;
		this.global = {
			x: evt.data.global.x,
			y: evt.data.global.y
		}
		this.local = evt.target.toLocal(this.global);

		this._stopPropagation = evt.stopPropagation;
	}
	stopPropagation() {
		this._stopPropagation();
	}
}
