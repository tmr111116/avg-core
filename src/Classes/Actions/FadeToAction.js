import AbstractAction from './AbstractAction';

export default class FadeToAction extends AbstractAction {
  constructor({ target, duration, targetOpacity, ease }) {
    super(duration, target);

    this.targetOpacity = targetOpacity;
    // this.ease = ease;
  }

  updateTransform(progress, lastProgress, target) {
    const deltaProgress = progress - lastProgress;
    target.alpha += (this.targetOpacity - target.alpha) * deltaProgress / (1 - lastProgress);
  }


}
