import AbstractAction from './AbstractAction';

export default class RotateByAction extends AbstractAction {
  constructor({ target, duration, deltaRadians, ease }) {
    super(duration, target);

    this.deltaRadians = deltaRadians;
    // this.ease = ease;
  }

  updateTransform(progress, lastProgress, target) {
    const deltaProgress = progress - lastProgress;
    target.rotation += this.deltaRadians * deltaProgress;
  }


}

