var PIXI = require('../Library/pixi.js/src/index');
var Err = require('./ErrorHandler');
import { TransitionPlugin } from './Transition/TransitionPlugin'
import { TransitionFilter } from './Transition/TransitionFilter'

/** 
 * Class representing a TextSprite. <br>
 * default font style is `normal 24px sans-serif`
 * @extends PIXI.Text
 */
class TextSprite extends PIXI.Text {
	constructor() {
		super("",{
			font: 'normal 24px sans-serif',
			fill: 0xffffff,
		});

		this.m_style = {};
		this.zorder = 0;
        this.filters = [new TransitionFilter];
	}

    /** 
     * Specify sprite index. 
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {number} index - the id of sprite
     * @returns {TextSprite} - this
     */
	setIndex(index){
		this.index = index;
		return this;
	}

    /** 
     * Specify text content. 
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {string} text
     * @returns {TextSprite} - this
     */
	setText(text){
		this.text = text;
		return this;
	}

    /** 
     * Specify text color. 
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {string} color - any valid color, like `red` `#ff6600`.
     * @returns {TextSprite} - this
     */
	setColor(color){
		//this.color = color;
		this.m_style.fill = color;
		return this;
	}

    /** 
     * Specify text size. 
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {number} size
     * @returns {TextSprite} - this
     */
	setSize(size){
		let yInterval = this.m_style.lineHeight-this.m_fontSize;
		this.m_fontSize = size;
		this.m_style.font = this.m_fontStyle + this.m_fontSize + 'px ' + this.m_font;
		this.setYInterval(yInterval);
		this.m_style.dropShadowDistance = this.m_fontSize/12;
		return this;
	}

    /** 
     * Specify text font. 
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {string} font - the name of font
     * @returns {TextSprite} - this
     */
	setFont(font){
		this.m_font = font;
		this.m_style.font = this.m_fontStyle + this.m_fontSize + 'px ' + this.m_font;
		return this;
	}

    /** 
     * Specify text width, the max width value before it is wrapped.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {number} value
     * @returns {TextSprite} - this
     */
	setTextWidth(value){
		//this.textWidth = value;
		this.m_style.wordWrap = (value===-1)?false:true;
		this.m_style.wordWrapWidth = value;
		return this;
	}

    /** 
     * Specify text height, the max height value before it is hidden.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {number} value
     * @returns {TextSprite} - this
     */
	setTextHeight(value){
		this.m_style.wordWrapHeight = value;
		return this;
	}

    /** 
     * Specify intervals between letters.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {number} value
     * @returns {TextSprite} - this
     */
	setXInterval(value){
		this.m_style.xInterval = value;
		return this;
	}

    /** 
     * Specify intervals between lines.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {number} value
     * @returns {TextSprite} - this
     */
	setYInterval(value){
		this.m_style.lineHeight = value + this.m_fontSize;
		return this;
	}

    /** 
     * Specify ellipsis string when text is ellipsised.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {string} text
     * @returns {TextSprite} - this
     */
	setExtraChar(str){
		this.m_style.wordWrapChar = str;
		return this;
	}

    /** 
     * Enable or disable bold style.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {boolean} enable
     * @returns {TextSprite} - this
     */
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

    /** 
     * Enable or disable italic style.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {boolean} enable
     * @returns {TextSprite} - this
     */
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

    /** 
     * Enable or disable text shadow.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {boolean} enable
     * @returns {TextSprite} - this
     */
	setShadow(bool){
		this.m_style.dropShadow = bool;
		return this;
	}

    /** 
     * Specify shadow color.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {string} color
     * @returns {TextSprite} - this
     */
	setShadowColor(color){
		this.m_style.dropShadowColor = color;
		return this;
	}

    /** 
     * Enable or disable text stroke.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {boolean} enable
     * @returns {TextSprite} - this
     */
	setStroke(bool){
		this.stroke = bool;
		return this;
	}

    /** 
     * Specify stroke color.
     * This method do not take effect until {@link TextSprite#exec} is called.
     * @param {string} color
     * @returns {TextSprite} - this
     */
	setStrokeColor(color){
		this.strokeColor = color;
		return this;
	}

    /** 
     * apply style changes. 
     */
	exec(){
		this.style = this.m_style;
	}




	
}

TransitionPlugin(TextSprite);

module.exports = TextSprite;