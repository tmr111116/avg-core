import { Component } from 'core/component';
import pixiContainer from 'Classes/Container';
import { attachToSprite } from 'Classes/EventManager';

export class Container extends Component {
    constructor(...args) {
        super(...args);

        // this.index = null;
    }
    render() {
        // if (this.node) {
        //     return this.node;
        // } else {
            let sp = new pixiContainer();
            attachToSprite(sp);
            this.node = sp;
            return this;
        // }
    }
    update() {

    }
    equals(obj) {
        return true;
    }
    destroy() {
        this.node.destroy();
    }
}
