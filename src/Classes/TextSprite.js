var PIXI = require('../Library/pixi.js/src/index');
var Err = require('./ErrorHandler');
import { TransitionPlugin } from './Transition/TransitionPlugin'
import { TransitionFilter } from './Transition/TransitionFilter'

@TransitionPlugin
class TextSprite extends PIXI.Text {
	constructor(args) {
		super("",{
			font: 'normal 24px sans-serif',
			fill: 0xffffff,
		});

		this.m_style = {};
		this.zorder = 0;
        this.filters = [new TransitionFilter];
	}

	setIndex(index){
		this.index = index;
		return this;
	}

	setText(text){
		this.text = text;
		return this;
	}

	setColor(color){
		//this.color = color;
		this.m_style.fill = color;
		return this;
	}

	setSize(size){
		let yInterval = this.m_style.lineHeight-this.m_fontSize;
		this.m_fontSize = size;
		this.m_style.font = this.m_fontStyle + this.m_fontSize + 'px ' + this.m_font;
		this.setYInterval(yInterval);
		this.m_style.dropShadowDistance = this.m_fontSize/12;
		return this;
	}

	setFont(font){
		this.m_font = font;
		this.m_style.font = this.m_fontStyle + this.m_fontSize + 'px ' + this.m_font;
		return this;
	}

	setTextWidth(value){
		//this.textWidth = value;
		this.m_style.wordWrap = (value===-1)?false:true;
		this.m_style.wordWrapWidth = value;
		return this;
	}

	setTextHeight(value){
		this.m_style.wordWrapHeight = value;
		return this;
	}

	setXInterval(value){
		this.m_style.xInterval = value;
		return this;
	}

	setYInterval(value){
		this.m_style.lineHeight = value + this.m_fontSize;
		return this;
	}

	setExtraChar(str){
		this.m_style.wordWrapChar = str;
		return this;
	}

	setBold(bool){
		this.m_bold = bool;
		this.m_fontStyle = "";
		if(this.m_bold)
			this.m_fontStyle += "bold ";
		if(this.m_italic)
			this.m_fontStyle += "italic ";
		if(!this.m_bold&&!this.m_italic)
			this.m_fontStyle = "normal ";
		this.m_style.font = this.m_fontStyle + this.m_fontSize + 'px ' + this.m_font;
		return this;
	}

	setItalic(bool){
		this.m_italic = bool;
		this.m_fontStyle = "";
		if(this.m_bold)
			this.m_fontStyle += "bold ";
		if(this.m_italic)
			this.m_fontStyle += "italic ";
		if(!this.m_bold&&!this.m_italic)
			this.m_fontStyle = "normal ";
		this.m_style.font = this.m_fontStyle + this.m_fontSize + 'px ' + this.m_font;
		return this;
	}

	// setStrike(bool){
	// 	this.strike = bool;
	// 	return this;
	// }

	// setUnder(bool){
	// 	this.m_under = bool;
	// 	return this;
	// }

	setShadow(bool){
		this.m_style.dropShadow = bool;
		return this;
	}

	setShadowColor(color){
		this.m_style.dropShadowColor = color;
		return this;
	}

	setStroke(bool){
		this.stroke = bool;
		return this;
	}

	setStrokeColor(color){
		this.strokeColor = color;
		return this;
	}

	exec(){
		this.style = this.m_style;
	}




	
}

TransitionPlugin(TextSprite);

module.exports = TextSprite;