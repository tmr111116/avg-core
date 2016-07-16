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
    window.stage = stage;

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
    let instance = mountComponent(el);
    SpriteManager.getStage().addChild(instance);
    el.componentDidMount();
}

function mountComponent(el) {
    let parent = el.getInstance();
    bindEvents(el);
    for (let childEl of el.children) {
        let child = mountComponent(childEl);
        parent.addChild(child);
    }
    return parent;
}

export function createElement(tag, params, ...childrenEl) {
    let el;
    params = params || {};
    params.children = childrenEl;
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
    // 这时 params 应该已经挂载到 el.props

    // 处理子对象
    let childrenElExpanded = [];
    if (childrenEl instanceof Array) {
        for (let childEl of childrenEl) {
            if (childEl instanceof Array) {
                childrenElExpanded = childrenElExpanded.concat(childEl);
            } else {
                childrenElExpanded.push(childEl);
            }
        }
    } else if (childrenEl){
        childrenElExpanded = [childrenEl];
    }

    /*
     * 区分原生组件和自定义组件。
     * 原生组件的子组件（childrenEl）直接渲染为子节点（children）
     * 自定义组件的子节点渲染由内部控制，子组件全部放置到 props
     */
    if (typeof tag === 'string') {
        el.children = childrenElExpanded
    } else {
        el.children = [];
        el.props.children = childrenElExpanded;
    }

    return el;
}

function bindEvents(el) {
    let obj = el.getInstance();
    let keys = Object.keys(el.props);
    for (let key of keys) {
        if (/^on[A-Z]/.test(key)) {
            obj[key.replace(/^on/, '').toLowerCase()] = el.props[key];
        }
    }
}


export class Component {
    constructor(props) {
        this.props = props || {};
        this.state = {};

        this.instance = null;
    }
    setState(state) {
        Object.assign(this.state, state);
    }
    componentWillMount() {

    }
    componentDidMount() {

    }
    componentWillUpdate() {

    }
    componentDidUpdate() {

    }
    getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = mountComponent(this.render());
            return this.instance;
        }
    }
    render() {
        return this;
    }
    update() {

    }
}


class SpriteComponent extends Component {
    constructor({file, rect, x=0, y=0}) {
        super({file, rect, x, y});

        this.index = null;
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

        this.index = null;
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
