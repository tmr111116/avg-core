import { mountComponent, updateComponent, mergeComponent } from './core';

export class Component {
    constructor(props) {
        // super(props);

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
