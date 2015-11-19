var PIXI = require('../Library/pixi.js/src/index');


/*
背景index 0
文字层index 1

*/

class TextWindow extends PIXI.Container {
	constructor() {
		super();

		this.visible = false;
		this.zorder = 50;
	}

	//属性修改
	setIndex(index){
		this.index = index;
		return this;
	}

	setBackgroundFile(filename){
		this.removeChild(this.background);
		this.background && this.background.destroy();
		this.background = new PIXI.Sprite.fromImage(filename);
		this.addChild(this.background,0);
		return this;
	}

	setBackgroundColor(color){
		this.removeChild(this.background);
		this.background && this.background.destroy();
		this.background = new PIXI.Graphics();
		/*绘制*/
		let rect = this.textRectangle;
		this.background.beginFill(color,1.0).drawRect(rect[0],rect[1],rect[2],rect[3]);
		this.addChild(this.background,0);
		return this;
	}

	setOpacity(value){
		(this.background) && (this.background.alpha = value);
		return this;
	}

	setPosition(pos){
		this.x = pos[0];
		this.y = pos[1];
		return this;
	}

	setTextRectangle(rect){
		this.textRectangle = rect;
		return this;
	}

	setXInterval(value){
		this.xInterval = value;
		return this;
	}

	setYInterval(value){
		this.yInterval = value;
		return this;
	}

	setVisible(value){
		this.visible = !!value;
	}

	clone(){
		return clone(this);
	}

	clearText(){

	}

}	

function clone(origin) {
	let originProto = Object.getPrototypeOf(origin);
	return Object.assign(Object.create(originProto), origin);
}

module.exports = TextWindow;