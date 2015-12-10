import AbstractAction from './AbstractAction';

export default class DelayAction extends AbstractAction{
	constructor({target,duration,delay,layerDelay}){
		super(duration,delay,layerDelay,target);
		
	}
	
	updateTransform(progress,lastProgress,target){
	}
	
	
}
