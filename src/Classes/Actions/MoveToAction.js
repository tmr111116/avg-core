import AbstractAction from './AbstractAction';

export default class MoveToAction extends AbstractAction{
	constructor({target,duration,targetX,targetY,ease}){
		super(duration,target);
		
		this.targetX = targetX;
		this.targetY = targetY;
		// this.ease = ease;
		
	}
	
	updateTransform(progress,lastProgress,target){
		let deltaProgress = progress - lastProgress;
		target.x += (this.targetX - target.x)*deltaProgress/(1-lastProgress);
		target.y += (this.targetY - target.y)*deltaProgress/(1-lastProgress);
	}
	
	
}