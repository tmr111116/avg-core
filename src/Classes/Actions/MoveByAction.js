import AbstractAction from './AbstractAction';

export default class MoveByAction extends AbstractAction {
  constructor({ target, duration, deltaX, deltaY, ease }) {
    super(duration, target);

    this.deltaX = deltaX;
    this.deltaY = deltaY;
    // this.ease = ease;
  }

  updateTransform(progress, lastProgress, target) {
    const deltaProgress = progress - lastProgress;
    target.x += this.deltaX * deltaProgress;
    target.y += this.deltaY * deltaProgress;
  }


}

