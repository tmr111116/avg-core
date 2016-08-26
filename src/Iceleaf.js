import React from 'react';

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
    let node = mountComponent(el);
    SpriteManager.getStage().addChild(node);
    el.componentDidMount();
}

function mountComponent(el, realSelf) {
    let parentNode = el.renderNode();
    bindEvents(el, realSelf);
    for (let childEl of el.props.children) {
        childEl.componentWillMount();
        let child = mountComponent(childEl, realSelf);
        parentNode.addChild(child);
        childEl.componentDidMount();
    }
    return parentNode;
}

function updateComponent(el, realSelf) {
    let parentNode = el.renderNode();
    el.update();
    bindEvents(el, realSelf);
    parentNode.removeChildren();
    for (let childEl of el.props.children) {
        childEl.componentWillUpdate();
        let child = updateComponent(childEl, realSelf);
        parentNode.addChild(child);
        childEl.componentDidUpdate();
    }
    return parentNode;
}

function mergeComponent(prevElement, nextElement) {
    let prevChildrenElement = prevElement.props.children;
    let nextChildrenElement = nextElement.props.children;
    prevElement.props = nextElement.props;
    let mergeResult = [];
    let reservedIndexes = [];
    // let lastIndex = 0;
    for (let [nextIndex, nextChildElement] of nextChildrenElement.entries()) {
        let nextName = nextChildElement.constructor.name;
        let prevIndex = null;
        let prevChildElement = prevChildrenElement.find((_prevChildElement, _prevIndex) => {
            if (_prevChildElement.constructor.name === nextName
                && nextChildElement.equals(_prevChildElement)) {
                prevIndex = _prevIndex;
                return true
            } else {
                return false
            }
        })
        if (prevChildElement && prevIndex !== null) {
            // 如果不移除会导致一个旧组件被不同新组件find到
            prevChildrenElement.splice(prevIndex, 1);
            prevChildElement.props.children = mergeComponent(prevChildElement, nextChildElement);
            mergeResult.push(prevChildElement);
            reservedIndexes.push(prevIndex);
        } else {
            mergeResult.push(nextChildElement);
        }
    }
    // 删除已经删掉的
    for (let [i, prevChildElement] of prevChildrenElement.entries()) {
        if (reservedIndexes.includes(i)) {
            continue;
        } else {
            // prevChildElement.destroy();
            destroyRecursive(prevChildElement);
        }
    }
    return mergeResult;
}

function destroyRecursive(el) {
    for (let child of el.props.children) {
        destroyRecursive(child);
    }
    el.destroy();
}

function getChildrenIndex(parent) {
    let indexArray = [];
    for (let child of parent.children) {
        if (child.children.length)
            indexArray.concat(getIndex(child));
        else {
            indexArray.push(child.index);
        }
    }
    return indexArray;
}

export function createElement(tag, params, ...childrenEl) {
    let el;
    params = params || {};
    // params.children = childrenEl;
    if (typeof tag === 'string') {
        Err.error(`[Iceleaf] You cannot use HTML tag '${tag}'.`);
        // switch (tag.toLowerCase()) {
        //     // case 'layer': el = new LayerComponent(params);break;
        //     case 'sprite': el = new SpriteComponent(params);break;
        //     case 'text': el = new TextSpriteComponent(params);break;
        //     default: Err.error(`[Iceleaf] Unknown element '${tag}'.`);break;
        // }
        //
        // el.name = tag.toLowerCase();
    }
    else {
        el = new tag(params);
    }
    // 这时 params 应该已经挂载到 el.props

    // 处理子对象
    let childrenElExpanded = [];
    if (childrenEl instanceof Array) {
        for (let childEl of childrenEl) {
            // 成员有可能是一个null，比如 {state ? xx : null} ，过滤掉
            if (!childEl) continue;
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
        // el.children = childrenElExpanded
        Err.error(`[Iceleaf] You cannot use HTML tag '${tag}'.`);
    } else {
        // el.children = [];
        el.props.children = childrenElExpanded;
    }

    return el;
}

function bindEvents(el, realSelf) {
    let obj = el.renderNode();
    obj.buttonMode = false;
    let keys = Object.keys(el.props);
    for (let key of keys) {
        if (/^on[A-Z]/.test(key)) {
            if (key === 'onClick') {
                obj.buttonMode = true;
            }
            obj['_on' + key.replace(/^on/, '').toLowerCase()] = el.props[key].bind(realSelf || el);
        }
    }
}


export class Component extends React.Component{
    constructor(props) {
        super(props);

        this.props = props || {};
        this.props.children = props.children || [];
        this.state = {};

        this.node = null;
    }
    setState(state) {
        Object.assign(this.state, state);
        let nextElement = this.render();
        if (this.prevElement) {
            let mergeResult = mergeComponent(this.prevElement, nextElement);
            this.prevElement.props.children = mergeResult;
            this.componentWillUpdate();
            updateComponent(this.prevElement, this);
            this.componentDidUpdate();
        }

    }
    componentWillMount() {

    }
    componentDidMount() {

    }
    componentWillUpdate() {

    }
    componentDidUpdate() {

    }
    renderNode() {
        if (this.node) {
            return this.node;
        }
        else {
            this.prevElement = this.render.call(this);
            this.node = mountComponent(this.prevElement, this);
            return this.node;
        }
    }
    // 返回的应该是 Component实例，也就是虚拟节点
    render() {
        return this;
    }
    update() {
        if (this.node) {
            for (let child of this.prevElement.props.children) {
                child.update();
            }
        } else {
            this.renderNode();
        }
    }
    // 判断是否相同
    equals() {
        return false;
    }
    destroy() {
        this.node.destroy();
    }
}


export class Sprite extends Component {
    constructor({file, rect, x=0, y=0}) {
        super({file, rect, x, y});

        this.index = null;
    }
    renderNode() {
        if (this.node) {
            return this.node;
        } else {
            SpriteManager.create(++Index, this.props.file, this.props.rect);
            this.node = SpriteManager.fromIndex(Index);
            this.node.x = this.props.x;
            this.node.y = this.props.y;
            this.index = Index;
            return this.node;
        }
    }
    update() {
        // this.node.file = this.props.file;
        this.node.x = this.props.x;
        this.node.y = this.props.y;
    }
    equals(obj) {
        return obj.props.file === this.props.file;
    }
    destroy() {
        this.node.destroy();
    }
}
export class Text extends Component {
    constructor({text, x=0, y=0, ...options}) {
        super({text, x, y, ...options});

        this.index = null;
    }
    renderNode() {
        if (this.node) {
            return this.node;
        } else {
            SpriteManager.createText(++Index, this.props.text, this.props);
            window.node = this.node = SpriteManager.fromIndex(Index);
            this.node.x = this.props.x;
            this.node.y = this.props.y;
            this.index = Index;
            return this.node;
        }
    }
    update() {
        // console.log(this)
        this.node.text = this.props.text;
        this.node.x = this.props.x;
        this.node.y = this.props.y;
    }
    equals(obj) {
        // 是否可以全部返回true？
        return true;
        // return obj.props.text === this.props.text;
    }
    destroy() {
        this.node.destroy();
    }
}
