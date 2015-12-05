import AbstractAction from './AbstractAction';

export default class ScaleToAction extends AbstractAction{
	constructor({target,duration,delay,layerDelay,targetScaleX,targetScaleY,ease}){
		super(duration,delay,layerDelay,target);
		
		this.targetScaleX = targetScaleX;
		this.targetScaleY = targetScaleY;
		// this.ease = ease;
		
	}
	
	updateTransform(progress,lastProgress,target){
		let deltaProgress = progress - lastProgress;
		target.scale.x += (this.targetScaleX - target.scale.x)*deltaProgress/(1-lastProgress);
		target.scale.y += (this.targetScaleY - target.scale.y)*deltaProgress/(1-lastProgress);
	}
	
	
}