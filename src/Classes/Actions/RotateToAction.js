import AbstractAction from './AbstractAction';

export default class RotateToAction extends AbstractAction{
	constructor({target,duration,delay,targetRadians,ease}){
		super(duration,delay,target);
		
		this.targetRadians = targetRadians;
		// this.ease = ease;
		
	}
	
	updateTransform(progress,lastProgress,target){
		let deltaProgress = progress - lastProgress;
		target.rotation += (this.targetRadians - target.rotation)*deltaProgress/(1-lastProgress);
	}
	
	
}

