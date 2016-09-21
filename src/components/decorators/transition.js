import { CrossFadeFilter } from 'classes/Transition/Filters';

export function transition(target, name, descriptor) {
  let method = descriptor.value;
  descriptor.value = async function(params, flags, name) {
    let node = this.node;
    let layer;
    try {
      layer = node._reactInternalInstance._renderedComponent.node;
    } catch (e) {
      layer = node;
    }

    if (flags.includes('trans') || params.trans) {
      params.trans = params.trans || 'crossfade';
      let renderer = PIXI.currentRenderer;
      layer.prepareTransition(renderer);
      let { promise, ...otherRets } = method.call(this, params, flags, name);
      await promise;
      promise = layer.startTransition(renderer, new CrossFadeFilter(params.duration));
      const clickCallback = layer.completeTransition.bind(layer);
      return { promise, ...otherRets, clickCallback };
    } else {
      return method.call(this, params, flags, name);
    }
  }
}
