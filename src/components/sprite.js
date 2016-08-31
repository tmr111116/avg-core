import { Component } from 'core/component';
import pixiSprite from 'Classes/Sprite';
import { attachToSprite } from 'Classes/EventManager';

export class Sprite extends Component {
    constructor({file, rect, x=0, y=0}) {
        super({file, rect, x, y});

        // this.index = null;
    }
    render() {
        // if (this.node) {
        //     return this.node;
        // } else {
            let sp = new pixiSprite();
            sp.setFile(this.props.file).setRect(this.props.rect).execSync();
            attachToSprite(sp);
            this.node = sp;
            // SpriteManager.create(++Index, this.props.file, this.props.rect);
            // this.node = SpriteManager.fromIndex(Index);
            this.node.x = this.props.x;
            this.node.y = this.props.y;
            // this.index = Index;
            return this;
        // }
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
