import { mountComponent, markAndGetInnerElement, updateComponent, mergeComponent, diffComponent, patchComponent } from './core';

export class Component {
    constructor(props) {
        // super(props);

        this.props = Object.assign(this.getDefaultProps(), props);
        this.props.children = props.children || [];
        this.state = {};

        // this.parent = null;
        this.node = null;
        this._mounted = false;
        this._shouldUpdate = true;
    }
    setState(state) {
        // this.componentWillReceiveProps(nextElement.props);
        // this._shouldUpdate = this.shouldComponentUpdate(nextElement.props, nextElement.state);
        // let prevElement = this.render();
        let prevShadow = mountComponent(...markAndGetInnerElement(this, this.props.index));
        Object.assign(this.state, state);
        if (this._shouldUpdate) {
            // let nextElement = this.render();
            let nextShadow = mountComponent(...markAndGetInnerElement(this, this.props.index));
            let diffResult = diffComponent(prevShadow, nextShadow);
            console.log(diffResult)
        } else {

        }
        // 这里 state被提前合并，导致 shouldComponentUpdate 获取不到之前的state
        // Object.assign(this.state, state);
        // console.log(state)
        // let nextElement = this.render();
        // if (this.prevElement) {
        //     this.componentWillReceiveProps(nextElement.props);
        //     this._shouldUpdate = this.shouldComponentUpdate(nextElement.props, nextElement.state);
        //     if (this._shouldUpdate) {
        //         let mergeResult = mergeComponent(this.prevElement, nextElement);
        //         this.prevElement.props.children = mergeResult;
        //         this.componentWillUpdate();
        //         updateComponent(this.prevElement, this);
        //         this.componentDidUpdate();
        //     }
        // }

    }
    getDefaultProps() {
        return {

        }
    }
    componentWillMount() {

    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    componentWillUpdate() {

    }
    componentDidUpdate() {

    }
    componentWillUnmount() {

    }
    isMounted() {
        return this._mounted;
    }
    // 返回的应该是 Component实例，也就是虚拟节点
    render() {
        return this;
    }
    update() {
    }
    // 判断是否相同
    equals() {
        return true;
    }
    destroy() {
        this.node.destroy();
    }
}

export class Shadow {
    constructor(name, props, toNode, update) {
        this.name = name;
        this.props = props;
        this.children = [];
        this.toNode = toNode;
        this.update = update;
    }
    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }
    removeChild(child) {
        if (child.parent === this) {
            child.parent = null;
            let childIndex = this.children.findIndex(_child => _child === child);
            this.children.splice(childIndex, 1);
        }
    }
    removeChildren() {
        for (let child of this.children) {
            child.parent = null;
        }
        this.children = [];
    }
    destroy() {
        for (let child of this.children) {
            child.destroy();
        }
        this.parent = null;
    }
}
