const PIXI = require('../library/pixi.js/src/index');
import { TransitionPlugin } from './Transition/TransitionPlugin';
import { TransitionFilter } from './Transition/TransitionFilter';

/**
 * Class representing a Container.
 * @extends PIXI.Graphics
 */
class Container extends PIXI.Container {
    /**
     * Create a sprite.
     * It is a empty sprite, you should specify is content (use {@link Sprite#setFile}, for example) and call {@link Sprite#execSync}.
     */
  constructor() {
    super();
    this.zorder = 0;

    this.filters = [new TransitionFilter()];
  }

    /**
     * Specify sprite index.
     * This method do not take effect until {@link Sprite#execSync} is called.
     * @param {number} index - the id of sprite
     * @returns {Sprite} - this
     */
  setIndex(index) {
    this.index = index;
    return this;
  }


}

TransitionPlugin(Container);


export default Container;
