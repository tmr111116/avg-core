let PIXI = require('../../Library/pixi.js/src/index');
import ErrorHandler from '../ErrorHandler';


function prepareTransition(renderer){
    this.updateTransform();
    let bounds = this.getBounds();
    // let bounds = getBoundsFromChildren(this);
    let texture = new PIXI.RenderTexture(renderer,renderer.width,renderer.height);
    if (this.visible) {
        let matrix = new PIXI.Matrix();
        // matrix.tx = -bounds.x;
        // matrix.ty = -bounds.y;
        texture.render(this,matrix,true,false);
    }
    document.body.appendChild(texture.getImage())
    document.body.appendChild(document.createTextNode('pretrans'))
    this.filters[0].setPreviousTexture(texture);
}

function startTransition(renderer, filter){
    this.updateTransform();
    let bounds = this.getBounds();
    // let bounds = getBoundsFromChildren(this);
    let texture = new PIXI.RenderTexture(renderer,renderer.width,renderer.height);
    this.filters[0].setBlocked(true);
    if (this.visible) {
        let matrix = new PIXI.Matrix();
        // matrix.tx = -bounds.x;
        // matrix.ty = -bounds.y;
        texture.render(this,matrix,true,false);
    }
    document.body.appendChild(texture.getImage())
    document.body.appendChild(document.createTextNode('trans'))
    let promise = this.filters[0].startTransition(texture, filter);
    this.filters[0].setBlocked(false);
    return promise;
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

function getBoundsFromChildren(parent) {
    let bounds = parent.getBounds();
    for (let child of parent.children) {
        let childBounds = getBoundsFromChildren(child);
        bounds.x = Math.min(bounds.x, childBounds.x);
        bounds.y = Math.min(bounds.y, childBounds.y);
        bounds.width = Math.max(bounds.width, childBounds.width);
        bounds.height = Math.max(bounds.height, childBounds.height);
    }
    return bounds;
}
