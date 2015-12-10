import AbstractAction from './AbstractAction';
import Color from '../../Utils/color.js';

export default class TintToAction extends AbstractAction{
	constructor({target,duration,delay,layerDelay,targetColor,ease}){
		super(duration,delay,layerDelay,target);

		this.targetColor = new Color(targetColor);
		// this.ease = ease;
		
	}
	
	updateTransform(progress,lastProgress,target){
		let deltaProgress = progress - lastProgress;
		let currentColor = new Color(target.tint);
		currentColor.r += (this.targetColor.r - currentColor.r)*deltaProgress/(1-lastProgress);
		currentColor.g += (this.targetColor.g - currentColor.g)*deltaProgress/(1-lastProgress);
		currentColor.b += (this.targetColor.b - currentColor.b)*deltaProgress/(1-lastProgress);
		target.tint = currentColor.toNumber();
	}
	
	
}
