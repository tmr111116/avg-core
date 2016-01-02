import {ErrorHandler as Err} from '../Classes/ErrorHandler';

export default class Color{
	constructor(value){
		if(typeof value === 'string'){
			if(value.length === 7){
				this._r = parseInt(value.slice(1,3));
				this._g = parseInt(value.slice(3,5));
				this._b = parseInt(value.slice(5,7));
			}
			else if(value.length === 4){
				this._r = parseInt(value[1]+value[1],16);
				this._g = parseInt(value[2]+value[2],16);
				this._b = parseInt(value[3]+value[3],16);
			}
			else{
				Err.error("该字符串["+value+"]不能表示一个正确的颜色值");
			}
		}
		else if(typeof value === 'number'){
			this._b = value%256;
			this._g = (value%65536/256) << 0;
			this._r = (value/65536) << 0;
		}
	}
    
    set r(value){
        this._r = (value - 1) % 0xff + 1;
    }
    
    set g(value){
        this._g = (value - 1) % 0xff + 1;
    }
    
    set b(value){
        this._b = (value - 1) % 0xff + 1;
    }
    
    get r(){
        return this._r;
    }
    
    get g(){
        return this._g;
    }
    
    get b(){
        return this._b;
    }
	
	toNumber(){
		return ((this._r<<0)*65536 + (this._g<<0)*256 + this._b<<0);
	}
	
	toString(){
		let strR = (this._r*65536).toString(16);
		if(strR.length === 1) strR = '0' + strR;
		let strG = (this._g*256).toString(16);
		if(strG.length === 1) strG = '0' + strG;
		let strB = (this._b).toString(16);
		if(strB.length === 1) strB = '0' + strB;
		return '#'+strR+strG+strB;
	}
	
}