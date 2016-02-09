var PIXI = require('../Library/pixi.js/src/index');
import { TransitionPlugin } from './Transition/TransitionPlugin'
import { TransitionFilter } from './Transition/TransitionFilter'


/*
背景index 0
文字层index 1

*/

/** 
 * Class representing a TextWindow. <br>
 * @extends PIXI.Container
 */
class TextWindow extends PIXI.Container {
    constructor() {
        super();

        this.visible = false;
        this.zorder = 50;

        //文字层
        this.textCanvas = document.createElement('canvas');
        this.textContext = this.textCanvas.getContext('2d');
        this.textTexture = PIXI.Texture.fromCanvas(this.textCanvas);
        this.textTexture.trim = new PIXI.Rectangle();

        this.text = "";
        this.textIndex = 0;
        this.textRendering = false;

        this.style = {
            font: "sans-serif",
            size: 24,
            color: "#ffffff",
            bold: false,
            italic: false,
            strike: false,
            underline: false,
            shadow: false,
            shadowColor: "#000000",
            stroke: false,
            strokeColor: "#000000",
            xInterval: 0,
            yInterval: 12,
        }

        this.textSpeed = 20;    // 字/秒

        this.m_currentTextWidth = 0;
        this.m_currentTextHeight = 0;

        this.m_lastTime = 0;

        this.resolution = 1;

        this.textSprite = new PIXI.Sprite(this.textTexture);

        this.addChildAt(this.textSprite,this.children.length);


    }

    /** 
     * Specify index.
     * @param {number} index - the id of TextWindow
     * @returns {TextWindow} - this
     */
    setIndex(index){
        this.index = index;
        return this;
    }

    /** 
     * Specify background image.
     * Background can only be image or color, and cannot be both.
     * @param {string} filename
     * @returns {TextWindow} - this
     */
    setBackgroundFile(filename){
        this.removeChild(this.background);
        this.background && this.background.destroy();
        this.background = PIXI.Sprite.fromImage(filename);
        this.addChildAt(this.background,0);
        return this;
    }

    /** 
     * Specify background color.<br>
     * Background can only be image or color, and cannot be both.
     * @param {string} color
     * @returns {TextWindow} - this
     */
    setBackgroundColor(color){
        this.removeChild(this.background);
        this.background && this.background.destroy();
        this.background = new PIXI.Graphics();
        /*绘制*/
        let rect = this.textRectangle;
        this.background.beginFill(color,1.0).drawRect(rect[0],rect[1],rect[2],rect[3]);
        this.addChildAt(this.background,0);
        return this;
    }

    /** 
     * Specify background opacity of the textwindow.
     * @param {number} opacity - value between 0 - 1.0
     * @returns {TextWindow} - this
     */
    setOpacity(value){
        (this.background) && (this.background.alpha = value);
        return this;
    }

    /** 
     * Specify positon relative to its parent.
     * @param {Array} position - [x, y]
     * @returns {TextWindow} - this
     */
    setPosition(pos){
        this.x = pos[0];
        this.y = pos[1];
        return this;
    }

    /** 
     * Specify the area text can be rendered to.
     * @param {Array} position - [x, y, width, height]
     * @returns {TextWindow} - this
     */
    setTextRectangle(rect){
        this.textRectangle = rect;
        return this;
    }

    /** 
     * Specify intervals between letters.
     * @param {number} value
     * @returns {TextSprite} - this
     */
    setXInterval(value){
        this.style.xInterval = value;
        return this;
    }

    /** 
     * Specify intervals between lines.
     * @param {number} value
     * @returns {TextSprite} - this
     */
    setYInterval(value){
        this.style.yInterval = value;
        return this;
    }

    /** 
     * Show or hide textwindow.
     * @param {boolean} value
     * @returns {TextSprite} - this
     */
    setVisible(value){
        this.visible = !!value;
        return this;
    }
    
    /** 
     * @param {number} value
    */
    setTextSize(value){
        this.style.size = value;
    }

    /** 
     * @param {string} name
    */
    setTextFont(name){
        this.style.font = name;
    }

    /** 
     * @param {number} color
    */
    setTextColor(color){
        this.style.color = color;
    }

    /** 
     * @param {boolean} value
    */
    setTextBold(bool){
        this.style.bold = !!bool;
    }

    /** 
     * @param {boolean} value
    */
    setTextItalic(bool){
        this.style.italic = !!bool;
    }

    /** 
     * @param {boolean} value
    */
    setTextStrike(bool){
        this.style.strike = !!bool;
    }

    /** 
     * @param {boolean} value
    */
    setTextUnderline(bool){
        this.style.underline = !!bool;
    }

    /** 
     * @param {boolean} enable
     * @param {string} color
    */
    setTextShadow(bool,color){
        this.style.shadow = !!bool;
        this.style.shadowColor = color || this.style.shadowColor || '#000000';
    }

    /** 
     * @param {boolean} enable
     * @param {string} color
    */
    setTextStroke(bool,color){
        this.style.stroke = !!bool;
        this.style.strokeColor = color || this.style.strokeColor || '#000000';
    }

    /** 
     * Specify the speed of letters printing.
     * @param {number} value - letters per second.
    */
    setTextSpeed(value){
        this.textSpeed = value;
    }

    /** 
     * Clone a new TextWindow.
     * @returns {TextSprite} - clone object.
    */
    clone(){
        return clone(this);
    }

    /** 
     * @param {Object.Sprite} sprite
     * @param {boolean} follow - follow the last letter, or it is fixed.
     * @param {Array} [position] - must be defined if follow is false.
     */
    setTextCursor(sprite, follow, pos){
        this.textCursor = sprite;
        this.addChildAt(this.textCursor,this.children.length);
        this.textCursorFollow = !!follow;
        if(!follow) {
            sprite.x = pos[0];
            sprite.y = pos[1];
        }
    }

    /** 
     * Specify the location that the next letter will be printed.
     * @param {boolean} follow - follow the last letter, or it is fixed.
     * @param {Array} [position] - must be defined if follow is false.
     */
    relocate({x,y}) {
        this.m_currentTextWidth = x || this.m_currentTextWidth;
        this.m_currentTextHeight = y || this.m_currentTextHeight;

        if(this.textCursor && this.textCursorFollow) {
                this.textCursor.x = this.m_currentTextWidth;
                this.textCursor.y = this.m_currentTextHeight;
            }
    }

    styleSwitch({i,b,s,u}){
        if(i) this.style.italic = !this.style.italic;
        if(b) this.style.bold = !this.style.bold;
        if(s) this.style.strike = !this.style.strike;
        if(u) this.style.underline = !this.style.underline;
    }



    //文字相关

    newline(){
        this.m_currentTextWidth = this.textRectangle[0];
        this.m_currentTextHeight += this.style.size*this.resolution + this.style.yInterval*this.resolution;
    }

    drawText(text){
        this.text = text;
        this.initTextRender();
    }

    clearText(){
        this.textCanvas.width = this.textCanvas.width;
    }

    initTextRender(){
        this.textCanvas.width = this.textRectangle[2] * this.resolution;
        this.textCanvas.height = this.textRectangle[3] * this.resolution;
        // this.textContext.clear();

        //文字样式设定
        this.textContext.textBaseline = 'top';
        { 
        let style = "";
        if(this.style.bold) style += "bold ";
        if(this.style.italic) style += "italic ";
        if(!style.length) style = "normal ";
        this.textContext.font = style + this.style.size*this.resolution + 'px ' + this.style.font;
        }
        this.textContext.fillStyle = (typeof this.style.color === 'number')?('#'+this.style.color.toString(16)):this.style.color;

        if(this.style.shadow) {
            this.textContext.shadowBlur = 0;
            this.textContext.shadowOffsetX = this.style.size*this.resolution/12*0.414;
            this.textContext.shadowOffsetY = this.style.size*this.resolution/12*0.414;
            this.textContext.shadowColor = (typeof this.style.shadowColor === 'number')?('#'+this.style.shadowColor.toString(16)):this.style.shadowColor;
        }

        if(this.style.stroke){
            this.textContext.strokeStyle = (typeof this.style.strokeColor === 'number')?('#'+this.style.strokeColor.toString(16)):this.style.strokeColor;
            this.textContext.lineWidth = this.style.size*this.resolution/24;
        }

        //状态重置
        this.textIndex = 0;
        this.textRendering = true;
        this.m_lastTime = Date.now();

        this.m_currentTextWidth = this.textRectangle[0]*this.resolution;
        this.m_currentTextHeight = this.textRectangle[1]*this.resolution;
    }



    updateTransform(){

        if(!this.textRendering){
            super.updateTransform();
            return;
        }

        let delta = Date.now() - this.m_lastTime;

        if(delta < 1000/this.textSpeed)
            return;

        this.m_lastTime = Date.now();

        var count = Math.floor(delta/1000 * this.textSpeed);

        if(this.textIndex+count>=this.text.length-1)
            count = this.text.length - this.textIndex;

        for (let i = this.textIndex; i < this.textIndex+count; i++) {
            //关闭光标（如果有）
            if(this.textCursor)
                this.textCursor.visible = false;
            //绘制文字，计算偏移
            this.textContext.fillText(this.text[i],this.m_currentTextWidth,this.m_currentTextHeight);
            if(this.style.stroke) this.textContext.strokeText(this.text[i],this.m_currentTextWidth,this.m_currentTextHeight);
            let width = this.textContext.measureText(this.text[i]).width;   //字号已经*this.resolution，无需再乘
            this.m_currentTextWidth += width + this.style.xInterval*this.resolution;
            if(this.m_currentTextWidth+width>=this.textRectangle[2]*this.resolution)
            {
                this.m_currentTextWidth = this.textRectangle[0];
                this.m_currentTextHeight += this.style.size*this.resolution + this.style.yInterval*this.resolution;
            }
        };

        this.textIndex += count;

        this.updateTexture();

        super.updateTransform();

        // stop condition
        if(this.textIndex>=this.text.length-1){
            this.textRendering = false;
            //移动光标（如果有）
            if(this.textCursor && this.textCursorFollow) {
                this.textCursor.x = this.m_currentTextWidth;
                this.textCursor.y = this.m_currentTextHeight;
            }
            if(this.textCursor)
                this.textCursor.visible = true; //恢复显示
        }

    }

    updateTexture(){
        let texture = this.textTexture;

        texture.baseTexture.hasLoaded = true;
        texture.baseTexture.resolution = this.resolution;
        texture.baseTexture.width = this.textCanvas.width / this.resolution;
        texture.baseTexture.height = this.textCanvas.height / this.resolution;
        texture.crop.width = texture._frame.width = this.textCanvas.width / this.resolution;
        texture.crop.height = texture._frame.height = this.textCanvas.height / this.resolution;
        texture.trim.x = 0;
        texture.trim.y = 0;
        texture.trim.width = texture._frame.width;
        texture.trim.height = texture._frame.height;
        this.textSprite._width = this.textCanvas.width / this.resolution;
        this.textSprite._height = this.textCanvas.height / this.resolution;
        texture.baseTexture.emit('update',  texture.baseTexture);

    }

}   

TransitionPlugin(TextWindow);

function clone(origin) {
    let originProto = Object.getPrototypeOf(origin);
    return Object.assign(Object.create(originProto), origin);
}

module.exports = TextWindow;