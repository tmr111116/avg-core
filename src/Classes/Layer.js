var PIXI = require('../Library/pixi.js/src/index');
import { TransitionPlugin } from './Transition/TransitionPlugin'
import { TransitionFilter } from './Transition/TransitionFilter'

/**
 * Class representing a Layer.
 * @extends PIXI.Graphics
 */
class Layer extends PIXI.Container {
    /**
     * Create a sprite.
     * It is a empty sprite, you should specify is content (use {@link Sprite#setFile}, for example) and call {@link Sprite#execSync}.
     */
	constructor(){
		super();
		this.zorder = 0;

		this.background = new PIXI.Graphics();
		this.addChild(this.background);

		this.setProperties({});

        this.filters = [new TransitionFilter];

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
	setProperties({x, y, width, height, color, opacity: alpha}){
		this.x = x || this.x || 0;
		this.y = y || this.y || 0;
		this.rectWidth = width || this.rectWidth || 10;
		this.rectHeight = height || this.rectHeight || 10;
		this.fillColor = color || this.fillColor || 0x000000;
		this.fillAlpha = (alpha === 0) ? alpha : (this.fillAlpha || 1);
		this.background.clear();
		this.background.beginFill(this.fillColor, this.fillAlpha);
		this.background.drawRect(0, 0, this.rectWidth, this.rectHeight);
		this.background.endFill();
		return this;
	}

	removeChildren() {
		super.removeChildren();
		this.addChild(this.background);
	}

	destroy() {
		this.background.destroy();
		super.destroy();
	}

}

TransitionPlugin(Layer);


export default Layer;
