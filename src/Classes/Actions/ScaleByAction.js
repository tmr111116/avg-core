import AbstractAction from './AbstractAction';

export default class ScaleByAction extends AbstractAction {
  constructor({ target, duration, deltaScaleX, deltaScaleY, ease }) {
    super(duration, target);

    this.deltaScaleX = deltaScaleX;
    this.deltaScaleY = deltaScaleY;
    // this.ease = ease;
  }

  updateTransform(progress, lastProgress, target) {
    const deltaProgress = progress - lastProgress;
    target.scale.x += this.deltaScaleX * deltaProgress;
    target.scale.y += this.deltaScaleY * deltaProgress;
  }


}
