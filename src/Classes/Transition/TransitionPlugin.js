let PIXI = require('../../Library/pixi.js/src/index');
import ErrorHandler from '../ErrorHandler';


function prepareTransition(renderer){
    let bounds = this.getBounds();
    let texture = new PIXI.RenderTexture(renderer,renderer.width,renderer.height);
    let matrix = new PIXI.Matrix();
    matrix.tx = -bounds.x;
    matrix.ty = -bounds.y;
    texture.render(this,matrix,true,false);
    
    this.filters[0].setPreviousTexture(texture);
}

function startTransition(renderer, filter){
    let bounds = this.getBounds();
    let texture = new PIXI.RenderTexture(renderer,renderer.width,renderer.height);
    let matrix = new PIXI.Matrix();
    matrix.tx = -bounds.x;
    matrix.ty = -bounds.y;
    this.filters[0].setBlocked(true);
    texture.render(this,matrix,true,false);
    this.filters[0].startTransition(texture, filter);
    this.filters[0].setBlocked(false);
}

export function TransitionPlugin(obj){
    if(obj.prototype)   //class
    {
        obj.prototype.prepareTransition = prepareTransition;
        obj.prototype.startTransition = startTransition;
    }
    else    //object
    {
        obj.prepareTransition = prepareTransition;
        obj.startTransition = startTransition;
    }
}

