import { mountComponent, updateComponent, mergeComponent } from './core';

export class Component {
    constructor(props) {
        // super(props);

        this.props = Object.assign(this.getDefaultProps(), props);
        this.props.children = props.children || [];
        this.state = {};

        this.node = null;
        this._mounted = false;
        this._shouldUpdate = true;
    }
    setState(state) {
        // 这里 state被提前合并，导致 shouldComponentUpdate 获取不到之前的state
        Object.assign(this.state, state);
        let nextElement = this.render();
        if (this.prevElement) {
            if (this.prevElement === this) {
                let mergeResult = mergeComponent(this, nextElement);
                this.props.children = mergeResult;
                updateComponent(this, this);
            } else {
                this.componentWillReceiveProps(nextElement.props);
                this._shouldUpdate = this.shouldComponentUpdate(nextElement.props, nextElement.state);
                if (this._shouldUpdate) {
                    let mergeResult = mergeComponent(this.prevElement, nextElement);
                    this.prevElement.props.children = mergeResult;
                    this.componentWillUpdate();
                    updateComponent(this.prevElement, this);
                    this.componentDidUpdate();
                }
            }
        }

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
    renderNode() {
        if (this.node) {
            return this.node;
        }
        else {
            this.prevElement = this.render.call(this);
            this.node = mountComponent(this.prevElement, this);
            this._mounted = true;
            return this.node;
        }
    }
    isMounted() {
        return this._mounted;
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
