import { mountComponent, updateComponent, mergeComponent } from './core';

export class Component {
    constructor(props) {
        // super(props);

        this.props = Object.assign(this.getDefaultProps(), props);
        this.props.children = props.children || [];
        this.state = {};

        this.node = null;
        this._mounted = false;
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
    getDefaultProps() {
        return {

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
    componentWillUnmount() {

    }
    renderNode() {
        if (this.node) {
            return this.node;
        }
        else {
            this.prevElement = this.render.call(this);
            this.node = mountComponent(this.prevElement, this, this.prevElement === this);
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
