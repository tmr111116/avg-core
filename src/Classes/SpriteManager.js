import PIXI from '../Library/pixi.js/src/index';

import Sprite from './Sprite';
import TextSprite from './TextSprite';
import TextWindow from './TextWindow';
import { TransitionPlugin } from './Transition/TransitionPlugin';
import { TransitionFilter } from './Transition/TransitionFilter';
import Err from './ErrorHandler';

let Sprites = [];
let Renderer = null;
let Stage = null;
let textWindowOptions = {
    currentIndex: -2
}

export function init() {
    Renderer = new PIXI.WebGLRenderer(1280, 720);
    Stage = new PIXI.Container();

    insert(-1, Stage);

    // Transition Support
    Stage.filters = [new TransitionFilter];
    TransitionPlugin(Stage);

    // let tw = new TextWindow();
    // tw.setIndex(textWindowOptions.currentIndex);
    // insert(textWindowOptions.currentIndex,tw);
    // this.textwindow(0x0,1.0,[0,0],[0,0,1180,620],0,12);
    // this.stage.addChild(tw);
    // setZorder(-2, 50);

    return Renderer.view;
}

export function getStage() {
    return Stage;
}
export function getRenderer() {
    return Renderer;
}

/**
 * create a normal sprite
 * argument `rect` there is different from this in BKEngine,
 * 		for it default to `null`, instead of [0,0,0,0] in BKEngine.
 * @method create
 * @param  {Number} index [description]
 * @param  {String} file  [description]
 * @param  {Rectangle} rect  [description]
 */
export function create(index, file, rect) {
    let sp = new Sprite();
    sp.setFile(file).setIndex(index).setRect(rect).execSync();
    insert(index, sp);
}

export function createText(index, text, options) {
    options = {
        color: 0xffffff,
        size: 24,
        font: "sans-serif",
        width: -1,
        height: -1,
        xinterval: 0,
        yinterval: 3,
        extrachar: "...",
        bold: false,
        italic: false,
        strike: false,
        under: false,
        shadow: false,
        shadowcolor: 0x0,
        stroke: false,
        strokecolor: 0x0,
        ...options
    }
    let textsprite = new TextSprite();
    textsprite.setIndex(index).setText(text).setColor(options.color).setSize(options.size).setFont(options.font)
       .setTextWidth(options.width).setTextHeight(options.height).setXInterval(options.xinterval).setYInterval(options.yinterval)
       .setExtraChar(options.extrachar).setBold(options.bold).setItalic(options.italic)/*.setStrike(strike).setUnder(under)*/
       .setShadow(options.shadow).setShadowColor(options.shadowcolor).setStroke(options.stroke).setStrokeColor(options.strokecolor)
       .exec();
    insert(index, textsprite);
}

/**
 * set a sprite as another sprite's child
 * @method addto
 * @param  {Number} sourceIndex the sprite will be add to parent
 * @param  {Number} targetIndex the parent sprite
 * @param  {Number} zorder    greater will be above, default to 0
 * @param  {Point} pos      coordinate relative to parent sprite, default to [0,0]
 * @param  {Number} alpha     range 0~1, default to 1.0
 */
export function addto(sourceIndex, targetIndex, zorder=0, pos=[0,0], alpha=1) {
    let source = fromIndex(sourceIndex);
    let target = fromIndex(targetIndex);
    if (!source || !target)
        return Err.warn('[SpriteManager] source or target does not exist, ignored.');
    source.x = pos[0];
    source.y = pos[1];
    source.alpha = alpha;
    target.addChild(source);
    setZorder(sourceIndex, zorder);
}

/**
 * get a sprite from index
 * @method fromIndex
 * @param  {Number}  index
 * @return {Sprite}
 */
export function fromIndex(index){
    return Sprites[index];
}

/**
 * get current active TextWindow.
 * @method currentTextWindow
 * @return {Sprite}          TextWindow Sprite
 */
export function currentTextWindow() {
    return Sprite[textWindowOptions.currentIndex];
}

/**
 * insert a sprite
 * @method insert
 * @param  {String} index
 * @param  {Sprite} sprite
 */
export function insert(index,sprite){
    sprite.index = index;
    Sprites[index] = sprite;
}

/**
 * remove a sprite from its parent (and screen).
 * @method remove
 * @param  {Number} index
 */
export function remove(index, isDelete = true){
    let sp = fromIndex(index);
    if (!sp || !sp.parent)
        return Err.warn(`[SpriteManager] Sprite<${index}> does not exist, or it hasn't been added to screen, ignored.`);
    sp.parent.removeChild(sp);
    if (isDelete)
        delete Sprites[index];
}

/**
 * remove all children from a sprite
 * @method removeAll
 * @param  {Number}  index
 * @param  {Boolean} isDelete if true, the texture of the sprite will be deleted from memory, default to true
 * @param  {Boolean} isRecursive whether remove all children of each child, default to true.
 */
export function removeAll(index, isDelete = true, isRecursive = true) {
    let parent = fromIndex(index);
    if (!parent)
        return Err.warn(`[SpriteManager] Sprite<${index}> does not exist, ignored.`);
    removeRecursive(parent, isDelete);
}

function removeRecursive(children, isDelete, isRecursive){
    for (let child of children) {
        SpriteManager.remove(child, isDelete);
        if (isRecursive && child.children.length)
            removeRecursive(child.children);
    };
}

/**
 * prepare a transition of a sprite, any change of the sprite will not take effect until `.applyTransition()` is called.
 * @method prepareTransition
 * @param  {[type]}          index [description]
 * @return {[type]}                [description]
 */
export function prepareTransition(index) {
    let sprite = fromIndex(index);
    if (!sprite)
        return Err.warn(`[SpriteManager] Sprite<${index}> does not exist, ignored.`);
    sprite.prepareTransition(Renderer);
}

/**
 * apply a transition of a sprite.
 * @method applyTransition
 * @param  {Number}             index
 * @param  {AbstractFilter}     filter filter instance.
 * @return  {Promise}
 */
export function applyTransition(index, filter) {
    let sprite = fromIndex(index);
    if (!sprite)
        return Err.warn(`[SpriteManager] Sprite<${index}> does not exist, ignored.`);
    return sprite.startTransition(Renderer, filter);
}

/**
 * set z-order of sprites, greater will be above.
 * @method setZorder
 * @param  {Number}  index
 * @param  {Number}  value
 */
export function setZorder(index, zorder){
    let sprite = Sprites[index];
    if(!sprite)
        Err.warn(`[SpriteManager] Sprite<${index}> does not exist, ignored.`);
    else{
        if(sprite.zorder!=0 && sprite.zorder===zorder)
            return;
        sprite.zorder = zorder;
        if(sprite.parent)
            sprite.parent.children.sort(function(a,b) {
                a.zorder = a.zorder || 0;
                b.zorder = b.zorder || 0;
                return a.zorder - b.zorder
            });
    }
}

export function setAnchor(index, anchor) {
    let sprite = fromIndex(index);
    if(typeof anchor === 'string')
        switch(anchor){
            case 'center': anchor = [0.5,0.5]; break;
            case 'topleft': anchor = [0,0]; break;
            case 'topright': anchor = [1,0]; break;
            case 'topcenter': anchor = [0.5,0]; break;
            case 'leftcenter': anchor = [0,0.5]; break;
            case 'rightcenter': anchor = [1,0.5]; break;
            case 'bottomcenter': anchor = [0.5,1]; break;
            case 'bottomleft': anchor = [0,1]; break;
            case 'bottomright': anchor = [1,1]; break;
            default: anchor = [0,0]; break;
        }
    sprite.anchor = new PIXI.Point(set[0],set[1]);
}
