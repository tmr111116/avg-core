

import {ErrorHandler as Err} from '../ErrorHandler';

/*
* 抽象动作类
* 继承后必须重载 updateTransform(progress,target) 方法，用于更新绘制
* 返回 true 表示完成，返回 false 表示动作未完成
*/

export default class AbstractAction {
	constructor(duration,delay=0,target) {
		this.delay = 0;
		this.duration = duration;
		this.finished = false;
		this.target = target;
		this.times = 1;
	}
	
	initAction(time,target){
		this.startTime = time + this.delay;
	}
	
	reset(){
		this.startTime = null;
		this.finished = false;
	}
	
	update(time,target,times){
		if(this.finished)
			return true;
			
		if(!this.startTime){
			this.initAction(time,this.target || target);
			return false;
		}
		
		if(time - this.startTime < 0)
			return false;
		
		let progress = (time - this.startTime) / this.duration;
		
		if(progress >= 1){
			progress = 1;
			this.finished = true;
		}

		this.updateTransform(progress,this.target || target);
		
		if(this.finished && (this.times < times))
		{
			this.reset();
			this.times++;
		}
		
		return this.finished;

	}
	
	updateTransform(progress,target){
		
	}

}




