const PIXI = require('pixi.js');
import ErrorHandler from '../ErrorHandler';


function prepareTransition(renderer) {
  this.updateTransform();
  // const bounds = this.getBounds();
  // let bounds = getBoundsFromChildren(this);
  const baseTexture = new PIXI.BaseRenderTexture(renderer.width, renderer.height);
  const texture = new PIXI.RenderTexture(baseTexture);
  if (this.visible) {
    renderer.render(this, texture);
  }
  // document.body.appendChild(texture.getImage());
  // document.body.appendChild(document.createTextNode('pretrans'));
  this.filters[0].setPreviousTexture(texture);
}

function startTransition(renderer, filter) {
  this.updateTransform();
  // const bounds = this.getBounds();
  // let bounds = getBoundsFromChildren(this);
  const baseTexture = new PIXI.BaseRenderTexture(renderer.width, renderer.height);
  const texture = new PIXI.RenderTexture(baseTexture);
  this.filters[0].setBlocked(true);
  if (this.visible) {
    renderer.render(this, texture);
  }
  // document.body.appendChild(texture.getImage());
  // document.body.appendChild(document.createTextNode('trans'));
  const promise = this.filters[0].startTransition(texture, filter);
  this.filters[0].setBlocked(false);
  return promise;
}

function completeTransition() {
  this.filters[0].completeTransition();
}

export function TransitionPlugin(obj) {
  if (obj.prototype) {   // class
    obj.prototype.prepareTransition = prepareTransition;
    obj.prototype.startTransition = startTransition;
    obj.prototype.completeTransition = completeTransition;
  } else {                // object
    obj.prepareTransition = prepareTransition;
    obj.startTransition = startTransition;
    obj.completeTransition = completeTransition;
  }
}

// function getBoundsFromChildren(parent) {
//   const bounds = parent.getBounds();
//   for (const child of parent.children) {
//     const childBounds = getBoundsFromChildren(child);
//     bounds.x = Math.min(bounds.x, childBounds.x);
//     bounds.y = Math.min(bounds.y, childBounds.y);
//     bounds.width = Math.max(bounds.width, childBounds.width);
//     bounds.height = Math.max(bounds.height, childBounds.height);
//   }
//   return bounds;
// }
