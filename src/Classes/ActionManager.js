import ErrorHandler from './ErrorHandler';

import Action from './Action';

export default class ActionManager {
	constructor(args) {
		this.topNode = {type:'parallel',actions:[]};
		this.nodeStack = [];
		this.delayStack = [];
		this.currentActionList = this.topNode.actions;
		this.currentNodeType = 'parallel';
		this.currentDelay = 0;
		
		this.nodeStack.push(this.topNode);
		
		this.finished = true;
		
		this.forcedTarget = null;
	}

	static instance(){
		if(ActionManager._instance)
			return ActionManager._instance;
		else
		{
			ActionManager._instance = new ActionManager();
			return ActionManager._instance;
		}
		
		return ActionManager._instance;
	}

	static destroy(){
		ActionManager._instance = null;
	}
	
	queue(){
		let map = {
			type: 'queue',
			actions: [],
			target: null,
			times: null
		}
		this.nodeStack.push(map);
		this.currentNodeType = 'queue';
		this.delayStack.push(this.currentDelay);
		this.currentActionList.push(map);
		this.currentActionList = map.actions;
	}
	
	parallel(){
		let map = {
			type: 'parallel',
			actions: [],
			target: null,
			times: null
		}
		this.nodeStack.push(map);
		this.currentNodeType = 'parallel';
		this.delayStack.push(this.currentDelay);
		this.currentActionList.push(map);
		this.currentActionList = map.actions;
	}
	
	end({target,times}){
		if(this.nodeStack.length===1){
			ErrorHandler.error('【ActionManager】已到达最外层，此命令忽略。')
			return
		}
		
		let map = this.nodeStack.pop();
		map.target = target;
		map.times = times;
		this.currentNodeType = map.type;
		this.currentDelay = this.delayStack.pop();
		this.currentActionList = this.nodeStack[this.nodeStack.length-1].actions;
	}
	
	moveBy({deltaX,deltaY,duration=0,target,ease}){
		let action = new Action.MoveByAction({
			duration: duration,
			delay: this.currentDelay,
			deltaX: deltaX,
			deltaY: deltaY,
			ease: ease,
			target: target
		});
		if(this.currentNodeType==='queue') this.currentDelay += duration;
		this.currentActionList.push(action);
	}
	
	
	moveTo({targetX,targetY,duration=0,target,ease}){
		let action = new Action.MoveToAction({
			duration: duration,
			delay: this.currentDelay,
			targetX: targetX,
			targetY: targetY,
			ease: ease,
			target: target
		});
		if(this.currentNodeType==='queue') this.currentDelay += duration;
		this.currentActionList.push(action);
	}
	
	fadeTo({targetOpacity,duration=0,target,ease}){
		let action = new Action.FadeToAction({
			duration: duration,
			delay: this.currentDelay,
			targetOpacity: targetOpacity,
			ease: ease,
			target: target
		});
		if(this.currentNodeType==='queue') this.currentDelay += duration;
		this.currentActionList.push(action);
	}
	
	// deltaScaleX deltaScaleY 取值 [0-1]
	scaleBy({deltaScaleX,deltaScaleY,duration=0,target,ease}){
		let action = new Action.ScaleByAction({
			duration: duration,
			delay: this.currentDelay,
			deltaScaleX: deltaScaleX,
			deltaScaleY: deltaScaleY,
			ease: ease,
			target: target
		});
		if(this.currentNodeType==='queue') this.currentDelay += duration;
		this.currentActionList.push(action);
	}
	
	// targetScaleX targetScaleY 取值 [0-1]
	scaleTo({targetScaleX,targetScaleY,duration=0,target,ease}){
		let action = new Action.ScaleToAction({
			duration: duration,
			delay: this.currentDelay,
			targetScaleX: targetScaleX,
			targetScaleY: targetScaleY,
			ease: ease,
			target: target
		});
		if(this.currentNodeType==='queue') this.currentDelay += duration;
		this.currentActionList.push(action);
	}
	
	// deltaScaleX deltaScaleY 取值 [0-1]
	rotateBy({deltaRadians,duration=0,target,ease}){
		let action = new Action.RotateByAction({
			duration: duration,
			delay: this.currentDelay,
			deltaRadians: deltaRadians,
			ease: ease,
			target: target
		});
		if(this.currentNodeType==='queue') this.currentDelay += duration;
		this.currentActionList.push(action);
	}
	
	// targetScaleX targetScaleY 取值 [0-1]
	rotateTo({targetRadians,duration=0,target,ease}){
		let action = new Action.RotateToAction({
			duration: duration,
			delay: this.currentDelay,
			targetRadians: targetRadians,
			ease: ease,
			target: target
		});
		if(this.currentNodeType==='queue') this.currentDelay += duration;
		this.currentActionList.push(action);
	}
	
	start({target,times}){ 
		this.forcedTarget = target;
		this.forcedTimes = times;
		this.finished = false;
		
		console.log(this.topNode)
	}
	
	update(time){
		// console.log(this.finished)
		if(this.finished)
			return;
			
		this.finished = this.updateTransform(time,this.topNode.actions,'parallel',this.forcedTarget,this.forcedTimes);
	}
	
	updateTransform(time,actionList,type='parallel',target,times){
		//目前type无用，将来可用于优化
		let finished = true;
		for(let action of actionList){
			if(action.type === 'queue')
				finished = this.updateTransform(time,action.actions,'queue',action.target || target || this.forcedTarget, action.times || times || this.forcedTimes) && finished;
			else if(action.type === 'parallel')
				finished = this.updateTransform(time,action.actions,'parallel',action.target || target || this.forcedTarget, action.times || times || this.forcedTimes) && finished;
			else
			{
				finished = action.update(time,target || this.forcedTarget, times || this.forcedTimes) && finished;
			}
		}
		return finished;
	}


}

module.exports = ActionManager;