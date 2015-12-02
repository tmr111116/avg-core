import AbstractAction from './AbstractAction';

export default class MoveByAction extends AbstractAction{
	constructor({target,duration,delay,deltaX,deltaY,ease}){
		super(duration,delay,target);
		
		this.deltaX = deltaX;
		this.deltaY = deltaY;
		// this.ease = ease;
		
	}
	
	updateTransform(progress,lastProgress,target){
		let deltaProgress = progress - lastProgress;
		target.x += this.deltaX * deltaProgress;
		target.y += this.deltaY * deltaProgress;
	}
	
	
}

