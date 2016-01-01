import AbstractAction from './AbstractAction';

export default class VisibleAction extends AbstractAction{
	constructor({target,visible}){
		super(0,target);
		
		this.visible = !!visible;
		
	}
	
	updateTransform(progress,lastProgress,target){
		target.visible = this.visible;
	}
	
	
}
