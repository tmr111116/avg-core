import { Component } from 'core/component';
import pixiLayer from 'Classes/Layer';
import { attachToSprite } from 'Classes/EventManager';

export class Layer extends Component {
    constructor({color, opacity, width, height, x=0, y=0, ...others}) {
        super({color, opacity, width, height, x, y, ...others});

        // this.index = null;
    }
    render() {
        // if (this.node) {
        //     return this.node;
        // } else {
            let sp = new pixiLayer();
            sp.setProperties(this.props);
            attachToSprite(sp);
            this.node = sp;
            return this;
        // }
    }
    update() {
        this.node.setProperties(this.props);
    }
    equals(obj) {
        return true;
    }
    destroy() {
        this.node.destroy();
    }
}
