import AbstractAction from './AbstractAction';

export default class MoveByAction extends AbstractAction{
	constructor({target,duration,delay,deltaX,deltaY,ease}){
		super(duration,delay,target);
		
		this.deltaX = deltaX;
		this.deltaY = deltaY;
		// this.ease = ease;
		
	}
	
	initAction(time,target){
		super.initAction(time,target);
		
		this.originX = target.x;
		this.originY = target.y;
		
	}
	
	updateTransform(progress,target){
		target.x = this.originX + this.deltaX * progress;
		target.y = this.originY + this.deltaY * progress;
	}
	
	
}

