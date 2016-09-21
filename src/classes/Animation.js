var PIXI = require('../Library/pixi.js/src/index');
var Err = require('./ErrorHandler');
import { TransitionPlugin } from './Transition/TransitionPlugin';
import { TransitionFilter } from './Transition/TransitionFilter';
import { getTexture } from 'Classes/Preloader';

@TransitionPlugin
class Animation extends PIXI.Sprite {
    constructor(args) {
        super(args);
        this.type = 'horizontal';
        this.textures = [];
        this.filters = [new TransitionFilter];

        this.row = 1;
        this.column = 1;
        this.interval = 33;
        this.loopType = 'forward';    //for horizontal & vertical
        this.loop = true; //only for multifiles
        this.delay = 0; //记录每次的delay值

        this.currentFrame = -1; //当前帧，为-1是因为后面要++
        this.currentRow = 0;    //水平精灵图用
        this.currentColumn = 0; //垂直精灵图用

        this.m_lastTime = 0;
        this.m_delay = 0;   //用于delay计数
        this.m_delta = 1;   //用于loopType，bouns时会变成1 -1切换
        this.playing = false;
    }

    // methods

    setType(type){
        this.type = type;
        return this;
    }
    setFile(file){
        this.filename = file;
        return this;
    }
    setIndex(index){
        this.index = index;
        return this;
    }
    setFrame(frame){
        this.frame = frame;
        return this;
    }
    setRow(row){
        this.row = row;
        return this;
    }
    setColumn(column){
        this.column = column;
        return this;
    }
    setInterval(interval){
        this.interval = interval;
        return this;
    }
    setLoopType(loopType){
        this.loopType = loopType;
        if(loopType==='none')
            this.loop = false;
        else
            this.loop = true;
        return this;
    }
    setLoop(loop){
        this.loop = loop;
        return this;
    }
    setDelay(delay){
        this.delay = delay;
        return this;
    }

    exec(){
        if(!this.index || !this.filename){
            Err.error('参数不足');
            return;
        }

        switch(this.type)
        {
            case 'horizontal':
                this.textures = Animation.loadHorizontal(this.filename,this.frame,this.row);
                break;
            case 'vertical':
                this.textures = Animation.loadVertical(this.filename,this.frame,this.column);
                break;
            case 'multifiles':
                this.textures = Animation.loadMultifiles(this.filename);
                this.frame = this.textures.length;
                break;
        }
        this.m_lastTime = Date.now();
        this.playing = true;
    }

    start(){
        this.playing = true;
    }

    cell(frame){
        this.playing = false;
        this.texture = this.textures[frame];
    }

    stop(){
        this.playing = false;
    }

    updateTransform(){
        if(!this.playing){
            super.updateTransform();
            return;
        }
        let delta = Date.now() - this.m_lastTime;
        if(delta < this.interval)
            return;
        this.m_lastTime = Date.now();
        if(this.m_delay>0){
            this.m_delay-=delta;
            if(this.m_delay<=0)
                this.m_delay = 0;
            else
                return;
        }

        this.currentFrame+=this.m_delta;

        switch(this.type){
            case 'horizontal':
                if(this.currentFrame>=this.frame||this.currentFrame<0){
                    this.currentRow+=this.m_delta;
                    if((this.currentRow>=this.row||this.currentRow<0) && this.loop)
                    {
                        if(this.loopType==='forward'){
                            this.currentFrame = 0;
                            this.currentRow = 0;
                        }
                        else{
                            this.m_delta = -this.m_delta;
                            this.currentFrame += this.m_delta*2;
                            this.currentRow += this.m_delta;
                        }
                        if(this.delay) this.m_delay = this.delay;
                    }
                    else if(this.currentRow>=this.row)
                        this.playing = false;
                }
                this.texture = this.textures[this.currentFrame+this.currentRow*this.frame];
                break;
            case 'vertical':
                if(this.currentFrame>=this.frame||this.currentFrame<0){
                    this.currentColumn+=this.m_delta;
                    if((this.currentColumn>=this.column||this.currentColumn<0) && this.loop)
                    {
                        if(this.loopType==='forward'){
                            this.currentFrame = 0;
                            this.currentColumn = 0;
                        }
                        else{
                            this.m_delta = -this.m_delta;
                            this.currentFrame += this.m_delta*2;
                            this.currentColumn += this.m_delta;
                        }
                        if(this.delay) this.m_delay = this.delay;
                    }
                    else if(this.currentColumn>=this.column)
                        this.playing = false;
                    else// if(this.loop)
                        this.texture = this.textures[this.currentFrame];
                    break;
                }
                this.texture = this.textures[this.currentFrame+this.currentColumn*this.frame];
                break;
            case 'multifiles':
                if((this.currentFrame>=this.frame||this.currentFrame<0) && this.loop)
                {
                    if(this.loopType==='forward')
                        this.currentFrame = 0;
                    else{
                        this.m_delta = -this.m_delta;
                        this.currentFrame += this.m_delta*2;
                    }
                    if(this.delay) this.m_delay = this.delay;
                }
                else if(this.currentFrame>=this.frame){
                    this.playing = false;
                    break;
                }
                this.texture = this.textures[this.currentFrame];
                break;
        }
        super.updateTransform();
    }



    static loadHorizontal(file,frame,row=1){
        let tex = getTexture(file);
        let textures = [];
        tex.update();
        let deltaX = tex.width/frame;
        let deltaY = tex.height/row;
        for (var j = 0; j < row; j++)
            for (var i = 0; i < frame; i++)
                textures.push(new PIXI.Texture(tex, new PIXI.Rectangle(deltaX*i,deltaY*j,deltaX,deltaY)));
        return textures;
    }
    static loadVertical(file,frame,column=1){
        let tex = getTexture(file);
        let textures = [];
        let deltaX = tex.width/column;
        let deltaY = tex.height/frame;
        for (var i = 0; i < column; i++)
            for (var j = 0; j < frame; j++)
                textures.push(new PIXI.Texture(tex, new PIXI.Rectangle(deltaX*i,deltaY*j,deltaX,deltaY)));
        return textures;
    }
    static loadMultifiles(files){
        let textures = [];
        for (var i = 0; i < files.length; i++) {
            let tex = getTexture(files[i]);
            textures.push(tex);
        };
        return textures;
    }


}

TransitionPlugin(Animation);

module.exports = Animation;
