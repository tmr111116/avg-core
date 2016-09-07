import { Component, Shadow } from 'core/component';
import pixiSprite from 'Classes/Sprite';
import { insert, fromIndex } from 'Classes/SpriteManager';
import { attachToSprite } from 'Classes/EventManager';

export class Sprite extends Component {
    constructor({file, rect, x=0, y=0, ...others}) {
        super({file, rect, x, y, ...others});

        // this.index = null;
        // this.prevElement = this;
        this.shadow = null;
        this.node = null;
    }
    renderNode() {
        let sp = new pixiSprite();
        sp.setFile(this.props.file).setRect(this.props.rect).execSync();
        attachToSprite(sp);

        sp.x = this.props.x;
        sp.y = this.props.y;

        insert(this.props.index, sp);

        return sp;
    }
    render() {
        // console.log(this)
        let sp = new Shadow('sprite', this.props, this.renderNode.bind(this), this.update.bind(this));
        this.shadow = sp;
        return this;
    }
    update() {
        // this.node.file = this.props.file;
        let node = fromIndex(this.props.index);
        node.x = this.props.x;
        node.y = this.props.y;
    }
    equals(obj) {
        return obj.props.file === this.props.file;
    }
    destroy() {
        this.node.destroy();
    }
}
