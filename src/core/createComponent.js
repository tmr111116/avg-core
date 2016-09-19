'use strict';

export default function createComponent(name) {
  const ReactCanvasComponent = function (element) {
    this.node = null;
    this._mountImage = null;
    this._renderedChildren = null;
    this._mostRecentlyPlacedChild = null;
    this.construct(element);
  };
  ReactCanvasComponent.displayName = name;
  for (let i = 1, l = arguments.length; i < l; i++) {
    Object.assign(ReactCanvasComponent.prototype, arguments[i]);
  }

  return ReactCanvasComponent;
}
