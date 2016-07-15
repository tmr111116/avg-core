import * as SpriteManager from 'Classes/SpriteManager';
import * as SoundManager from 'Classes/SoundManager';
import * as ActionManager from 'Classes/ActionManager';
import {registerHandler} from 'Classes/EventManager';
import * as Flow from 'Classes/Flow';
import TWMInit from 'Classes/TextWindowManager';
import fps from 'Utils/fps';
import Err from './Classes/ErrorHandler';

import {CrossFadeFilter} from 'Classes/Transition/Filters';

let Initialed = false;
let Index = 0;

function init() {
	let viewNode = SpriteManager.init();
	const TextWindowManager = TWMInit(SpriteManager);
	document.body.appendChild(viewNode);

	let stage = SpriteManager.getStage();
	let renderer = SpriteManager.getRenderer();

	fps.installFPSView(stage);
	update();

	function update(time) {
		window.requestAnimationFrame(update.bind(this));
		renderer.render(stage);
		ActionManager.update(time);
	}
}

export function render(el) {
	if (!Initialed) {
		init()
	}
	el.componentWillMount();
	SpriteManager.getStage().addChild(el.getInstance());
	el.componentDidMount();
}

export function createElement(tag, params, ...childrenEl) {
	let el;
	if (typeof tag === 'string') {
		switch (tag.toLowerCase()) {
			// case 'layer': el = new LayerComponent(params);break;
			case 'sprite': el = new SpriteComponent(params);break;
			case 'text': el = new TextSpriteComponent(params);break;
			default: Err.error(`[Iceleaf] Unknown element '${tag}'.`);break;
		}

		el.name = tag.toLowerCase();
	}
	else {
		el = new tag(params);
	}
	bindEvents(el, params);

	// 处理子对象
	if (childrenEl) {
		let parent = el.getInstance();
		if (childrenEl instanceof Array) {
			for (let childEl of childrenEl) {
				childEl.componentWillMount();
				parent.addChild(childEl.getInstance());
				childEl.componentDidMount();
			}
		} else {
			let childEl = childrenEl;
			childEl.componentWillMount();
			parent.addChild(childEl.getInstance());
			childEl.componentDidMount();
		}
	}
	return el;
}

function bindEvents(el, params) {
	params = params || {};
	let obj = el.getInstance();
	let keys = Object.keys(params);
	for (let key of keys) {
		if (/^on[A-Z]/.test(key)) {
			obj[key.replace(/^on/, '').toLowerCase()] = params[key];
		}
	}
}


export class Component {
	constructor(props) {
		this.props = props || {};
		this.state = {};
	}
	getInstance() {
		return this.render().instance;
	}
	componentWillMount() {

	}
	componentDidMount() {

	}
	componentWillUpdate() {

	}
	componentDidUpdate() {

	}
	render() {
		return this;
	}
}
// class LayerElement {
// 	constructor({file, rect, x, y}) {
// 		this.file = file;
// 		this.rect = rect;
// 		this.x = x || 0;
// 		this.y = y || 0;
//
// 		this._instance = null;
// 		this._index = null;
// 	}
// 	render() {
// 		if (this._instance) {
// 			return this._instance
// 		} else {
// 			SpriteManager.create(++Index, this.file, this.rect);
// 			this._instance = SpriteManager.fromIndex(Index);
// 			this._instance.x = this.x;
// 			this._instance.y = this.y;
// 			this._index = Index;
// 			return this._instance;
// 		}
// 	}
// }
class SpriteComponent extends Component {
	constructor({file, rect, x=0, y=0}) {
		super({file, rect, x, y});

		this.instance = null;
		this.index = null;
	}
	getInstance() {
		return this.render().instance;
	}
	render() {
		if (this.instance) {
			return this
		} else {
			SpriteManager.create(++Index, this.props.file, this.props.rect);
			this.instance = SpriteManager.fromIndex(Index);
			this.instance.x = this.props.x;
			this.instance.y = this.props.y;
			this.index = Index;
			return this
		}
	}
}
class TextSpriteComponent extends Component {
	constructor({text, x=0, y=0, ...options}) {
		super({text, x, y, ...options});

		this.instance = null;
		this.index = null;
	}
	getInstance() {
		return this.render().instance;
	}
	render() {
		if (this.instance) {
			return this;
		} else {
			SpriteManager.createText(++Index, this.props.text, this.props);
			this.instance = SpriteManager.fromIndex(Index);
			this.instance.x = this.props.x;
			this.instance.y = this.props.y;
			this.index = Index;
			return this;
		}
	}
}
