import { CrossFadeFilter } from 'Classes/Transition/Filters';

export function transition(layerName) {
	return (target, name, descriptor) => {
		let method = descriptor.value;
		descriptor.value = async function(params, flags, name) {
			let layer;
			try {
				layer = this.refs[layerName]._reactInternalInstance._renderedComponent.node;
			} catch (e) {
				layer = this.refs[layerName];
			}

			if (flags.includes('trans') || params.trans) {
				params.trans = params.trans || 'crossfade';
				let renderer = PIXI.currentRenderer;
				layer.prepareTransition(renderer);
				let { promise, ...otherRets } = method.call(this, params, flags, name);
				await promise;
				promise = layer.startTransition(renderer, new CrossFadeFilter(params.duration));
				return { promise, ...otherRets };
			} else {
				return method.call(this, params, flags, name);
			}
		}
	}
}
