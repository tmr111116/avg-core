import AbstractAction from './AbstractAction';

export default class DelayAction extends AbstractAction{
	constructor({target,duration}){
		super(duration,target);
		
	}
	
	updateTransform(progress,lastProgress,target){
	}
	
	
}
