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
 * 创建普通精灵
 * 此处rect与bke不同，默认值为null，bke默认值为[0,0,0,0]
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
 * 从编号获取精灵对象
 * @method fromIndex
 * @param  {Number}  index 精灵编号
 * @return {Sprite}        精灵对象
 */
export function fromIndex(index){
    return Sprites[index];
}

/**
 * 插入新精灵
 * @method insert
 * @param  {String} index  精灵编号
 * @param  {Sprite} sprite 精灵对象
 */
export function insert(index,sprite){
    sprite.index = index;
    Sprites[index] = sprite;
}

/**
 * 移除精灵
 * @method remove
 * @param  {Number} index 精灵编号
 */
export function remove(index, isDelete = true){
    let sp = fromIndex(index);
    if (!sp || !sp.parent)
        return Err.warn(`[SpriteManager] Sprite<${index}> does not exist, or it hasn't been added to screen, ignored.`);
    sp.parent.removeChild(sp);
    if (isDelete)
        delete Sprites[index];
}

// export function removeAll(index, isDelete = true, recursive = true) {
//     if (index===-1)
// }

/**
 * 设置精灵层叠次序，数字大的在上
 * @method setZorder
 * @param  {Number}  index 精灵编号
 * @param  {Number}  value 层叠值
 */
export function setZorder(index, zorder){
    let sprite = Sprites[index];
    if(!sprite)
        Err.warn("精灵(index="+index+")不存在");
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
