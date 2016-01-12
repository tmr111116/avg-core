var PIXI = require('../Library/pixi.js/src/index');
import { TransitionPlugin } from './Transition/TransitionPlugin'
import { TransitionFilter } from './Transition/TransitionFilter'

@TransitionPlugin
class Sprite extends PIXI.Sprite {
	constructor(){
		super();
		this.zorder = 0;
        
        this.filters = [new TransitionFilter];
        
	}

	//methods
	setFile(filename){
		this.filename = filename;
		return this;
	}

	setIndex(index){
		this.index = index;
		return this;
	}

	setRect(rect){
		this.m_rect = rect;
		return this;
	}

	execSync(){
		let tex = PIXI.Texture.fromImage(this.filename);
		if(this.m_rect)
			tex = new PIXI.Texture(tex, new PIXI.Rectangle(this.m_rect[0],this.m_rect[1],this.m_rect[2],this.m_rect[3]));
		this.texture = tex;
	}

}

TransitionPlugin(Sprite);







module.exports = Sprite;