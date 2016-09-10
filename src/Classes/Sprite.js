var PIXI = require('../Library/pixi.js/src/index');
import { TransitionPlugin } from './Transition/TransitionPlugin'
import { TransitionFilter } from './Transition/TransitionFilter'
import Err from 'Classes/ErrorHandler';

/**
 * Class representing a Sprite.
 * @extends PIXI.Sprite
 */
class Sprite extends PIXI.Sprite {
    /**
     * Create a sprite.
     * It is a empty sprite, you should specify is content (use {@link Sprite#setFile}, for example) and call {@link Sprite#execSync}.
     */
	constructor(){
		super();
		this.zorder = 0;

        this.filters = [new TransitionFilter];

	}

	/**
     * Specify sprite image.
     * This method do not take effect until {@link Sprite#execSync} is called.
     * @param {string} filename
     * @returns {Sprite} - this
     */
	setFile(filename){
		this.filename = filename;
		return this;
	}

    /**
     * Specify sprite index.
     * This method do not take effect until {@link Sprite#execSync} is called.
     * @param {number} index - the id of sprite
     * @returns {Sprite} - this
     */
	setIndex(index){
		this.index = index;
		return this;
	}

    /**
     * Specify sprite area you wish to use in the sprite.
     * Usually you should not specify it, unless you wish to capture a part of the picture. <br>
     * This method do not take effect until {@link Sprite#execSync} is called.
     * @param {Array[]} index - the id of sprite
     * @returns {Sprite} - this
     */
	setRect(rect){
		this.m_rect = rect;
		return this;
	}

    /**
     * Load the sprite.
     */
	execSync(){
		let tex = PIXI.Texture.fromImage(this.filename);
		try {
			if(this.m_rect)
				tex = new PIXI.Texture(tex, new PIXI.Rectangle(this.m_rect[0],this.m_rect[1],this.m_rect[2],this.m_rect[3]));
		} catch (e) {
			Err.warn('Rectangle you specified may be larger than real size of image, rectangle has been ignored');
		}
		this.texture = tex;
	}

}

TransitionPlugin(Sprite);


export default Sprite;
