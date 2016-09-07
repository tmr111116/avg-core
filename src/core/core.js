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

// 总的渲染入口
export function render(el, parentNode) {
    if (!Initialed) {
        init();
    }
    el.componentWillMount();
    let shadow = mountComponent(...markAndGetInnerElement(el, '$'));
    (parentNode || SpriteManager.getStage()).addChild(shadowToNode(shadow));
    el.componentDidMount();
}

// 将虚拟节点树递归转化为实际的精灵节点树
function shadowToNode(parentShadow) {
    let parentNode = parentShadow.toNode();
    for (let childShadow of parentShadow.children) {
        let childNode = shadowToNode(childShadow);
        parentNode.addChild(childNode);
    }
    return parentNode;
}

//
export function markAndGetInnerElement(el, rootId) {
    let elRendered = el.render();
    if (el !== elRendered) {
        el.props.index = `${rootId}`;
    }
    elRendered.props.index = `${rootId}`;
    return [elRendered, rootId];
}


// “挂载”，输入元素树，输出虚拟节点树
// 两次 render： 第一次 render 从自定义元素获取内置元素，第二次触发内置元素的render
//              若第一次时已经是内置元素，render 可看做是幂等的
export function mountComponent(el, parentid) {
    if (!parentid) {
        throw 'need parentid';
    }
    let parentEl = el.render();
    let parentShadow = parentEl.shadow;
    parentEl.props.index = `${parentid}`;
    parentShadow.props.index = `${parentid}`;
    if (!parentEl.isMounted()) {
        // bindEvents(el, realSelf);
        for (let [i, childEl] of parentEl.props.children.entries()) {
            childEl.componentWillMount();
            let childShadow = mountComponent(...markAndGetInnerElement(childEl, `${parentid}.${i}`));
            parentShadow.addChild(childShadow);
            childEl.componentDidMount();
        }
        parentEl._mounted = true;
    }
    return parentShadow;
}

function shadowEqual(a, b) {
    if (!a || !b) {
        return false;
    }
    if (a.constructor.name === 'Shadow' && b.constructor.name === 'Shadow' ) {
        return a.name === b.name;
    } else {
        return false;
    }
}

// 对比，将两颗虚拟节点树进行对比，返回结果
// 只对比本身和第一层 children
export function diffComponent(prevShadow, nextShadow) {
    let diffResult = [];

    if (!shadowEqual(prevShadow, nextShadow)) {
        // prevShadow.result = ['REMOVE_NODE'];
        diffResult.push({
            action: 'REMOVE',
            shadow: prevShadow
        });
        diffResult.push({
            action: 'INSERT',
            parent: prevShadow.parent,
            shadow: nextShadow
        });
        return diffResult;   // 需要完全重绘
    }



    let prevChildrenShadow = prevShadow.children.slice();
    let nextChildrenShadow = nextShadow.children.slice();

    // let reservedIndexes = [];
    // let lastIndex = 0;
    // let iterator = nextChildrenElement.entries();
    // for (let [nextIndex, nextChildElement] of iterator) {
    for (let nextIndex = 0; nextIndex < nextChildrenShadow.length; nextIndex++) {
        let nextChildShadow = nextChildrenShadow[nextIndex];

        // let isNativeComponent = nextChildShadow === nextChildShadow.render();

        // let nextName = nextChildShadow.constructor.name;

        // 尝试寻找新虚拟节点是否在当前虚拟节点树中存在
        let prevIndex = null;
        let prevChildShadow = prevChildrenShadow.find((_prevChildShadow, _prevIndex) => {
            if (shadowEqual(_prevChildShadow, nextChildShadow)) {
                prevIndex = _prevIndex;
                return true
            } else {
                return false
            }
        });

        // 找到了
        if (prevChildShadow && prevIndex !== null) {

            // 此处可以优化，如实际上不需要移动的情况
            prevChildShadow.props = nextChildShadow.props;
            diffResult.push({
                action: 'MOVE',
                parent: prevShadow,
                shadow: prevChildShadow,
                from: prevIndex,
                to: nextIndex
            });


            // 递归
            let childDiffResult = diffComponent(prevChildShadow, nextChildShadow);
            diffResult.concat(childDiffResult);

            // 如果不移除会导致一个旧组件被不同新组件find到
            prevChildrenShadow[prevIndex] = null;
            // prevShadow.removeChild(prevChildShadow);
            // mergeResult.push(prevChildShadow);
            // reservedIndexes.push(prevIndex);
        } else {
            diffResult.push({
                action: 'INSERT',
                parent: prevShadow,
                shadow: nextChildShadow
            });

            // mergeResult.push(nextChildShadow);
        }
    }

    for (let prevChildShadow of prevChildrenShadow) {
        if (prevChildShadow) {
            diffResult.push({
                action: 'REMOVE',
                shadow: prevChildShadow
            });
        }
    }

    return diffResult;
}

// 根据对比结果，将新的更改应用到实际的精灵节点树
export function patchComponent() {

}

// 自顶向下进行更新，递归进行 diff-patch 操作
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
    if (!el.prevElement) {
        console.log(el.prevElement);
        mountComponent(el);
        console.log(el.prevElement)
    }
    for (let childEl of el.prevElement.props.children) {
        // let isNativeComponent = childEl === childEl.render();
        // !isNativeComponent && console.log(childEl)
        // console.log(childEl)
        // console.log(childEl.constructor.name, childEl.props.children)
        // childEl.constructor.name === 'SpriteWithText' && console.log(childEl.prevElement)
        console.log(childEl)
        let child = updateComponent(childEl, realSelf);
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
                // !isNativeComponent && console.log(2222, _prevChildElement)
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
                // console.log(prevChildElement.renderNode())
                // !prevChildElement.prevElement && prevChildElement.renderNode.call(prevChildElement);
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
    // console.log(el.constructor.name, childrenElExpanded)
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
