import * as SpriteManager from 'Classes/SpriteManager';
import * as ActionManager from 'Classes/ActionManager';
import TWMInit from 'Classes/TextWindowManager';
import fps from 'Utils/fps';
import Err from 'Classes/ErrorHandler';

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

export function mountComponent(el, realSelf) {
    // if (el === null || el === false) {
    //     return
    // }
    let parentNode = el.renderNode();
    if (!el.isMounted()) {
        bindEvents(el, realSelf);
        for (let childEl of el.props.children) {
            childEl.componentWillMount();
            let child = mountComponent(childEl, realSelf);
            parentNode.addChild(child);
            childEl.componentDidMount();
        }
    }
    return parentNode;
}

export function updateComponent(el, realSelf) {
    // if (el === null || el === false) {
    //     return
    // }
    if (!el._shouldUpdate) {
        return el.renderNode();
    }
    el.componentWillUpdate();
    let parentNode = el.renderNode();
    el.update();
    bindEvents(el, realSelf);
    parentNode.removeChildren();
    for (let childEl of el.props.children) {
        let isNativeComponent = childEl === childEl.render();
        !isNativeComponent && console.log(childEl)
        let child = updateComponent(isNativeComponent ? childEl : childEl.render(), realSelf);
        parentNode.addChild(child);
    }
    el.componentDidUpdate();
    return parentNode;
}

export function mergeComponent(prevElement, nextElement) {
    let prevChildrenElement = prevElement.props.children;
    let nextChildrenElement = nextElement.props.children;
    // console.log('prevChildrenElement:', prevChildrenElement)
    // console.log('nextChildrenElement:', nextChildrenElement)
    prevElement.componentWillReceiveProps(nextElement.props);
    prevElement._shouldUpdate = prevElement.shouldComponentUpdate(nextElement.props, nextElement.state);

    if (!prevElement._shouldUpdate) {
        return prevChildrenElement;
    }
    prevElement.props = nextElement.props;

    let mergeResult = [];
    let reservedIndexes = [];
    // let lastIndex = 0;
    // let iterator = nextChildrenElement.entries();
    // for (let [nextIndex, nextChildElement] of iterator) {
    for (let nextIndex = 0; nextIndex < nextChildrenElement.length; nextIndex++) {
        let nextChildElement = nextChildrenElement[nextIndex];

        let isNativeComponent = nextChildElement === nextChildElement.render();

        // if (!isNativeComponent) {
        //     nextChildElement = nextChildElement.render();
        // }

        // if (nextChildElement === null || nextChildElement === false) {
        //     continue;
        // }

        let nextName = nextChildElement.constructor.name;
        let prevIndex = null;
        let prevChildElement = prevChildrenElement.find((_prevChildElement, _prevIndex) => {
            // if (_prevChildElement === null || _prevChildElement === false) {
            //     return false;
            // }
            if (_prevChildElement.constructor.name === nextName
                && nextChildElement.equals(_prevChildElement)) {
                prevIndex = _prevIndex;
                return true
            } else {
                !isNativeComponent && console.log(2222, _prevChildElement)
                return false
            }
        })
        // !prevChildElement && console.log(nextChildElement)
        if (prevChildElement && prevIndex !== null) {
            // 如果不移除会导致一个旧组件被不同新组件find到
            prevChildrenElement.splice(prevIndex, 1);
            if (prevChildrenElement === nextChildrenElement) {
                // iterator = nextChildrenElement.entries();
                // if prevChildrenElement === nextChildrenElement, when prevChildrenElement was sliced,
                // nextChildrenElement too. So nextIndex should increase.
                nextIndex--;
            }

            if (isNativeComponent) {
                prevChildElement.props.children = mergeComponent(prevChildElement, nextChildElement);
            } else {
                console.log(prevChildElement.renderNode())
                prevChildElement.prevElement.props.children = mergeComponent(prevChildElement.prevElement, nextChildElement.render());
            }

            mergeResult.push(prevChildElement);
            reservedIndexes.push(prevIndex);
        } else {
            // console.log(nextChildElement)
            mergeResult.push(nextChildElement);
        }
    }
    // 删除已经删掉的
    for (let [i, prevChildElement] of prevChildrenElement.entries()) {
        if (reservedIndexes.includes(i)) {
            continue;
        } else {
            // prevChildElement.destroy();
            prevChildElement && destroyRecursive(prevChildElement);
        }
    }
    return mergeResult;
}

function destroyRecursive(el) {
    for (let child of el.props.children) {
        destroyRecursive(child);
    }
    el.componentWillUnmount();
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
    // console.log(tag.name, childrenElExpanded, childrenEl)

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
