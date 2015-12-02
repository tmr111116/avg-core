import AbstractAction from './AbstractAction';

export default class RotateByAction extends AbstractAction{
	constructor({target,duration,delay,deltaRadians,ease}){
		super(duration,delay,target);
		
		this.deltaRadians = deltaRadians;
		// this.ease = ease;
		
	}
	
	updateTransform(progress,lastProgress,target){
		let deltaProgress = progress - lastProgress;
		target.rotation += this.deltaRadians * deltaProgress;
	}
	
	
}

