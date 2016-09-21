import React from 'react';
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import TextSprite from 'classes/TextSprite';

const RawText = createComponent('RawText', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new TextSprite();
  },
  mountNode(props) {
    const layer = this.node;
    const options = {
      color: 0xffffff,
      size: 24,
      font: 'sans-serif',
      width: -1,
      height: -1,
      xinterval: 0,
      yinterval: 3,
      extrachar: '...',
      bold: false,
      italic: false,
      strike: false,
      under: false,
      shadow: false,
      shadowcolor: 0x0,
      stroke: false,
      strokecolor: 0x0,
      ...props,
    };
    layer.setText(props.text || props.children || '').setAnchor(options.anchor)
    .setColor(options.color).setSize(options.size)
    .setFont(options.font)
    .setTextWidth(options.width)
    .setTextHeight(options.height)
    .setXInterval(options.xinterval)
    .setYInterval(options.yinterval)
    .setExtraChar(options.extrachar)
    .setBold(options.bold)
    .setItalic(options.italic)
    /* .setStrike(strike).setUnder(under) */
    .setShadow(options.shadow)
    .setShadowColor(options.shadowcolor)
    .setStroke(options.stroke)
    .setStrokeColor(options.strokecolor)
    .exec();
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    return layer;
  },
  updateNode(prevProps, props) {
    this.node.text = props.text || props.children || '';
    this.node.x = props.x || 0;
    this.node.y = props.y || 0;
    const options = {
      color: 0xffffff,
      size: 24,
      font: 'sans-serif',
      width: -1,
      height: -1,
      xinterval: 0,
      yinterval: 3,
      extrachar: '...',
      bold: false,
      italic: false,
      strike: false,
      under: false,
      shadow: false,
      shadowcolor: 0x0,
      stroke: false,
      strokecolor: 0x0,
      ...props,
    };
    this.node.setAnchor(options.anchor).setColor(options.color).setSize(options.size)
    .setFont(options.font)
    .setTextWidth(options.width)
    .setTextHeight(options.height)
    .setXInterval(options.xinterval)
    .setYInterval(options.yinterval)
    .setExtraChar(options.extrachar)
    .setBold(options.bold)
    .setItalic(options.italic)
    /* .setStrike(strike).setUnder(under) */
    .setShadow(options.shadow)
    .setShadowColor(options.shadowcolor)
    .setStroke(options.stroke)
    .setStrokeColor(options.strokecolor)
    .exec();
  },

});

export class Text extends React.Component {
  static displayName = 'Text';
  static propTypes = {
    text: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    children: React.PropTypes.any,
  }
  render() {
    return React.createElement(RawText, this.props, this.props.children);
  }
}

// module.exports = Text;
