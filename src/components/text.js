import { Component } from 'core/component';
import pixiTextSprite from 'Classes/TextSprite';
import { attachToSprite } from 'Classes/EventManager';

export class Text extends Component {
    constructor({text='', x=0, y=0, ...options}) {
        super({text, x, y, ...options});

        // this.index = null;
        this.prevElement = this;
    }
    render() {
        // if (this.node) {
        //     return this;
        // } else {
            let options = {
                color: 0xffffff,
                size: 24,
                font: "sans-serif",
                width: -1,
                height: -1,
                xinterval: 0,
                yinterval: 3,
                extrachar: "...",
                bold: false,
                italic: false,
                strike: false,
                under: false,
                shadow: false,
                shadowcolor: 0x0,
                stroke: false,
                strokecolor: 0x0,
                ...this.props
            }
            let textsprite = new pixiTextSprite();
            textsprite.setText(this.props.text).setColor(options.color).setSize(options.size).setFont(options.font)
               .setTextWidth(options.width).setTextHeight(options.height).setXInterval(options.xinterval).setYInterval(options.yinterval)
               .setExtraChar(options.extrachar).setBold(options.bold).setItalic(options.italic)/*.setStrike(strike).setUnder(under)*/
               .setShadow(options.shadow).setShadowColor(options.shadowcolor).setStroke(options.stroke).setStrokeColor(options.strokecolor)
               .exec();
            attachToSprite(textsprite);
            this.node = textsprite;
            // SpriteManager.createText(++Index, this.props.text, this.props);
            // this.node = SpriteManager.fromIndex(Index);
            this.node.x = this.props.x;
            this.node.y = this.props.y;
            // this.index = Index;
            return this;
        // }
    }
    update() {
        // console.log(this)
        this.node.text = this.props.text;
        this.node.x = this.props.x;
        this.node.y = this.props.y;
        let options = {
            color: 0xffffff,
            size: 24,
            font: "sans-serif",
            width: -1,
            height: -1,
            xinterval: 0,
            yinterval: 3,
            extrachar: "...",
            bold: false,
            italic: false,
            strike: false,
            under: false,
            shadow: false,
            shadowcolor: 0x0,
            stroke: false,
            strokecolor: 0x0,
            ...this.props
        }
        this.node.setColor(options.color).setSize(options.size).setFont(options.font)
           .setTextWidth(options.width).setTextHeight(options.height).setXInterval(options.xinterval).setYInterval(options.yinterval)
           .setExtraChar(options.extrachar).setBold(options.bold).setItalic(options.italic)/*.setStrike(strike).setUnder(under)*/
           .setShadow(options.shadow).setShadowColor(options.shadowcolor).setStroke(options.stroke).setStrokeColor(options.strokecolor)
           .exec();
    }
    equals(obj) {
        // 是否可以全部返回true？
        return true;
        // return obj.props.text === this.props.text;
    }
    destroy() {
        this.node.destroy();
    }
}
