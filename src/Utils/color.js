import {ErrorHandler as Err} from '../Classes/ErrorHandler';

class Color{
	constructor(value){
		if(typeof value === 'string'){
			if(value.length === 7){
				this.r = parseInt(value.slice(1,3));
				this.g = parseInt(value.slice(3,5));
				this.b = parseInt(value.slice(5,7));
			}
			else if(value.length === 4){
				this.r = parseInt(value[1]+value[1],16);
				this.g = parseInt(value[2]+value[2],16);
				this.b = parseInt(value[3]+value[3],16);
			}
			else{
				Err.error("该字符串["+value+"]不能表示一个正确的颜色值");
			}
		}
		else if(typeof value === 'number'){
			this.b = value%256;
			this.g = value&65536/256 << 0;
			this.r = value/65536 << 0;
		}
	}
	
	toNumber(){
		return this.r*65535 + this.g*256 + this.b;
	}
	
	toString(){
		let strR = (this.r*65536).toString(16);
		if(strR.length === 1) strR = '0' + strR;
		let strG = (this.g*256).toString(16);
		if(strG.length === 1) strG = '0' + strG;
		let strB = (this.b).toString(16);
		if(strB.length === 1) strB = '0' + strB;
		return '#'+strR+strG+strB;
	}
	
}