import ErrorHandler from './ErrorHandler';

import Action from './Action';

export default class ActionManager {
	constructor(args) {
		this.topNode = {type:'parallel',actions:[],times:1,currentTimes:1};
		this.nodeStack = [];
		this.currentActionList = this.topNode.actions;
		this.currentNodeType = 'parallel';
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
			times: 1,
			currentTimes: 1
		}
		this.nodeStack.push(map);
		this.currentNodeType = 'queue';
		this.currentActionList.push(map);
		this.currentActionList = map.actions;
	}
	
	parallel(){
		let map = {
			type: 'parallel',
			actions: [],
			target: null,
			times: 1,
			currentTimes: 1
		}
		this.nodeStack.push(map);
		this.currentNodeType = 'parallel';
		this.currentActionList.push(map);
		this.currentActionList = map.actions;
	}
	
	end({target,times=1}){
		if(this.nodeStack.length===1){
			ErrorHandler.error('【ActionManager】已到达最外层，此命令忽略。')
			return false;
		}
		
		let map = this.nodeStack.pop();
		map.target = target;
		map.times = times;
		this.currentNodeType = map.type;
		this.currentActionList = this.nodeStack[this.nodeStack.length-1].actions;
		return !!(this.nodeStack.length-1);
	}
	
	moveBy({deltaX,deltaY,duration=0,target,ease}){
		let action = new Action.MoveByAction({
			duration: duration,
			deltaX: deltaX,
			deltaY: deltaY,
			ease: ease,
			target: target
		});
		this.currentActionList.push(action);
	}
	
	
	moveTo({targetX,targetY,duration=0,target,ease}){
		let action = new Action.MoveToAction({
			duration: duration,
			targetX: targetX,
			targetY: targetY,
			ease: ease,
			target: target
		});
		this.currentActionList.push(action);
	}
	
	fadeTo({targetOpacity,duration=0,target,ease}){
		let action = new Action.FadeToAction({
			duration: duration,
			targetOpacity: targetOpacity,
			ease: ease,
			target: target
		});
		this.currentActionList.push(action);
	}
	
	// deltaScaleX deltaScaleY 取值 [0-1]
	scaleBy({deltaScaleX,deltaScaleY,duration=0,target,ease}){
		let action = new Action.ScaleByAction({
			duration: duration,
			deltaScaleX: deltaScaleX,
			deltaScaleY: deltaScaleY,
			ease: ease,
			target: target
		});
		this.currentActionList.push(action);
	}
	
	// targetScaleX targetScaleY 取值 [0-1]
	scaleTo({targetScaleX,targetScaleY,duration=0,target,ease}){
		let action = new Action.ScaleToAction({
			duration: duration,
			targetScaleX: targetScaleX,
			targetScaleY: targetScaleY,
			ease: ease,
			target: target
		});
		this.currentActionList.push(action);
	}
	
	// deltaScaleX deltaScaleY 取值 [0-1]
	rotateBy({deltaRadians,duration=0,target,ease}){
		let action = new Action.RotateByAction({
			duration: duration,
			deltaRadians: deltaRadians,
			ease: ease,
			target: target
		});
		this.currentActionList.push(action);
	}
	
	// targetScaleX targetScaleY 取值 [0-1]
	rotateTo({targetRadians,duration=0,target,ease}){
		let action = new Action.RotateToAction({
			duration: duration,
			targetRadians: targetRadians,
			ease: ease,
			target: target
		});
		this.currentActionList.push(action);
	}
	
	delay({duration=0}){
		let action = new Action.DelayAction({
			duration: duration,
			target: null,
			layerDelay: this.currentLayerDelay
		});
		this.currentActionList.push(action);
	}
	
	remove({target,_delete}){
		let action = new Action.RemoveAction({
			target: target,
			_delete: _delete,
			layerDelay: this.currentLayerDelay
		});
		this.currentActionList.push(action);
	}
	
	visible({target,visible}){
		let action = new Action.VisibleAction({
			target: target,
			visible: visible,
			layerDelay: this.currentLayerDelay
		});
		this.currentActionList.push(action);
	}
	
	tintTo({targetColor,duration=0,target,ease}){
		let action = new Action.TintToAction({
			duration: duration,
			targetColor: targetColor,
			ease: ease,
			target: target
		});
		if(this.currentNodeType==='queue') this.currentLayerDelay += duration;
		this.currentActionList.push(action);
	}
	
	
	tintBy({deltaColor,duration=0,target,ease}){
		let action = new Action.TintByAction({
			duration: duration,
			deltaColor: deltaColor,
			ease: ease,
			target: target
		});
		if(this.currentNodeType==='queue') this.currentLayerDelay += duration;
		this.currentActionList.push(action);
	}
	
	start({target,times=1}){ 
		for(;;){
			if (!this.end({}))
				break;
		}
		
		this.forcedTarget = target;
		//this.forcedTimes = times;
		this.topNode.times = times;
		this.finished = false;
	}
	
	update(time){
		// console.log(this.finished)
		if(this.finished)
			return;
		
		let finished = this.updateTransform(time,this.topNode.actions,'parallel',this.forcedTarget,1||this.topNode.currentTimes);
		if(finished && (this.topNode.currentTimes < this.topNode.times)){
            this.resetTimes(this.topNode.actions);
			this.topNode.currentTimes++;
			finished = false;
		}
		this.finished = finished;
	}
	
	updateTransform(time,actionList,type='queue',target,times){
		let finished = true;
		for(let action of actionList){
			if(action.type === 'queue'){
				finished = this.updateTransform(time,action.actions,'queue',action.target || target || this.forcedTarget,1||action.currentTimes) && finished;
				if(finished && (action.currentTimes < action.times*times)){
                    this.resetTimes(action.actions);
					action.currentTimes++;
					finished = false;
				}
			}
			else if(action.type === 'parallel'){
				finished = this.updateTransform(time,action.actions,'parallel',action.target || target || this.forcedTarget,1||action.currentTimes) && finished;
				if(finished && (action.currentTimes < action.times*times)){
                    this.resetTimes(action.actions);
					action.currentTimes++;
					finished = false;
				}
			}
			else
			{
				finished = action.update(time,target || this.forcedTarget, times) && finished;
			}
			if(!finished && type==='queue')
				break;
		}

		return finished;
	}

    resetTimes(actionList){
        for(let action of actionList){
            if(action.type==='queue' || action.type==='parallel'){
                action.currentTimes = 1;
                this.resetTimes(action.actions);
            }
            else{
                action.resetTimes();
            }
        }
    }

}

module.exports = ActionManager;