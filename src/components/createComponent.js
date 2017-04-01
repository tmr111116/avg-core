export default function createComponent(name) {
  function ReactAVGComponent(element) {
    this.node = null;
    // this._mountImage = null;
    this._renderedChildren = null;
    this._mostRecentlyPlacedChild = null;
    this.construct(element);
  }

  ReactAVGComponent.displayName = name;
  for (let i = 1, l = arguments.length; i < l; i++) {
    Object.assign(ReactAVGComponent.prototype, arguments[i]);
  }

  return ReactAVGComponent;
}
