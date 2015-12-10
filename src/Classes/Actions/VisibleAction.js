import AbstractAction from './AbstractAction';

export default class VisibleAction extends AbstractAction{
	constructor({target,visible,delay,layerDelay}){
		super(0,delay,layerDelay,target);
		
		this.visible = !!visible;
		
	}
	
	updateTransform(progress,lastProgress,target){
		target.visible = this.visible;
	}
	
	
}
