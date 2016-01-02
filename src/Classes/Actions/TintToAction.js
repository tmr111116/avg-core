import AbstractAction from './AbstractAction';
import Color from '../../Utils/color.js';

export default class TintToAction extends AbstractAction{
	constructor({target,duration,targetColor,ease}){
		super(duration,target);

		this.targetColor = new Color(targetColor);
		// this.ease = ease;
		
	}
	
	updateTransform(progress,lastProgress,target){
		let deltaProgress = progress - lastProgress;
		let co = deltaProgress/(1-lastProgress);
		let currentColor = new Color((typeof target.tint !== 'undefined')?target.tint:0xffffff);
		currentColor.r += (this.targetColor.r - currentColor.r)*co;
		currentColor.g += (this.targetColor.g - currentColor.g)*co;
		currentColor.b += (this.targetColor.b - currentColor.b)*co;
		target.tint = currentColor.toNumber();
	}
	
	
}
