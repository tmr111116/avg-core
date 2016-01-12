let PIXI = require('../../Library/pixi.js/src/index');
import ErrorHandler from '../ErrorHandler';


function prepareTransition(renderer){
    let bounds = this.getBounds();
    let texture = new PIXI.RenderTexture(renderer,renderer.width,renderer.height);
    let matrix = new PIXI.Matrix();
    matrix.tx = -bounds.x;
    matrix.ty = -bounds.y;
    texture.render(this,matrix,true,false);
    // console.log(bounds)
    // console.log(matrix)
    // console.log(renderer)
    this.filters[0].setPreviousTexture(texture);
    
    console.log(texture.getBase64())
}

function startTransition(renderer, filter){
    this.filters[0].startTransition(this.generateTexture(renderer), filter);
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

