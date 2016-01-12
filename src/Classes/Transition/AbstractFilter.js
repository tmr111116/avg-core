let PIXI = require('../Library/pixi.js/src/index');
import ErrorHandler from './ErrorHandler';

export default class AbstractFilter extends PIXI.AbstractFilter {
    constructor(args){
        super(args);
        
        this.startTime = 0;
        this.duration = 1000;
        
        this.finished = false;
        
    }
    
    setPreviousTexture(texture){
        this.uniforms.previousTexture = texture;
    }
    
    
    setNextTexture(texture){
        this.uniforms.nextTexture = texture;
    }
    
    update(time){
        if(!this.startTime)
        {
            this.startTime = time;
            return
        }
        
        if(time - this.startTime >= this.duration)
        {
            this.uniforms.progress = 1;
            this.finished = true;
            return
        }
        
        this.uniforms.progress = (time - this.startTime) / this.duration;
    }
    
}