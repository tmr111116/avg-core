import AbstractAction from './AbstractAction';
import Color from '../../Utils/color.js';

export default class TintByAction extends AbstractAction{
	constructor({target,duration,deltaColor,ease}){
		super(duration,target);
		
		this.deltaColor = new Color(deltaColor);
		// this.ease = ease;
        
        // fix (this.deltaColor.r * deltaProgress < 0) will result in
        // no change of tint value, because of floor.
        this._deltaCache = {
            r: 0,
            g: 0,
            b: 0
        }
		
	}
	
	updateTransform(progress,lastProgress,target){
		let deltaProgress = progress - lastProgress;
        let currentColor = new Color((typeof target.tint !== 'undefined')?target.tint:0xffffff);
		
        currentColor.r += this.deltaCache('r', this.deltaColor.r * deltaProgress);
		currentColor.g += this.deltaCache('g', this.deltaColor.g * deltaProgress);
		currentColor.b += this.deltaCache('b', this.deltaColor.b * deltaProgress);
		target.tint = currentColor.toNumber();
	}
	
    // channel: r g b, string
	deltaCache(channel,delta){
        this._deltaCache[channel] += delta;
        let value = this._deltaCache[channel] << 0;  //get integer
        this._deltaCache[channel] -= value;  // decline integer
        return value;
    }
    
}
