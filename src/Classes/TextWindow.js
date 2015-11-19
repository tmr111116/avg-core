var PIXI = require('../Library/pixi.js/src/index');


/*
背景index 0
文字层index 1

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
            xInterval: 0,
            yInterval: 12,
        }

        this.textSpeed = 50;    // 字/秒

        this.m_currentTextWidth = 0;
        this.m_currentTextHeight = 0;

        this.m_lastTime = 0;

        this.resolution = 1;

        this.textSprite = new PIXI.Sprite(this.textTexture);

        this.addChildAt(this.textSprite,this.children.length);


    }

    //属性修改
    setIndex(index){
        this.index = index;
        return this;
    }

    setBackgroundFile(filename){
        this.removeChild(this.background);
        this.background && this.background.destroy();
        this.background = new PIXI.Sprite.fromImage(filename);
        this.addChildAt(this.background,0);
        return this;
    }

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

    setOpacity(value){
        (this.background) && (this.background.alpha = value);
        return this;
    }

    setPosition(pos){
        this.x = pos[0];
        this.y = pos[1];
        return this;
    }

    setTextRectangle(rect){
        this.textRectangle = rect;
        return this;
    }

    setXInterval(value){
        this.style.xInterval = value;
        return this;
    }

    setYInterval(value){
        this.style.yInterval = value;
        return this;
    }

    setVisible(value){
        this.visible = !!value;
    }

    clone(){
        return clone(this);
    }


    //文字相关


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

        this.textContext.textBaseline = 'top';
        this.textContext.font = 'normal ' + this.style.size*this.resolution + 'px ' + this.style.font;
        this.textContext.fillStyle = this.style.color.replace('0x',"#");

        this.textIndex = 0;
        this.textRendering = true;

        this.m_lastTime = Date.now();
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

        var count = (delta/1000 * this.textSpeed) << 0;
        for (let i = this.textIndex; i < this.textIndex+count; i++) {
            this.textContext.fillText(this.text[i],this.m_currentTextWidth,this.m_currentTextHeight);
            let width = this.textContext.measureText(this.text[i]).width;
            this.m_currentTextWidth += width + this.style.xInterval;
            if(this.m_currentTextWidth+width>=this.textRectangle[2])
            {
                this.m_currentTextWidth = 0;
                this.m_currentTextHeight += this.style.size + this.style.yInterval;
            }
        };

        this.textIndex += count;

        this.updateTexture();

        super.updateTransform();

        // stop condition
        if(this.textIndex>=this.text.length-1)
            this.textRendering = false;

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

function clone(origin) {
    let originProto = Object.getPrototypeOf(origin);
    return Object.assign(Object.create(originProto), origin);
}

module.exports = TextWindow;