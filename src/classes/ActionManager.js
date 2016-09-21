import ErrorHandler from './ErrorHandler';

import Action from './Action';

const topNode = {
  type: 'parallel',
  actions: [],
  times: 1,
  currentTimes: 1,
};
let nodeStack = [topNode],
  currentActionList = topNode.actions,
  finished = true,
  forcedTarget = null;

let Resolve = null;

export function queue() {
  const map = {
    type: 'queue',
    actions: [],
    target: null,
    times: 1,
    currentTimes: 1,
  };
  nodeStack.push(map);
  currentActionList.push(map);
  currentActionList = map.actions;
}

export function parallel() {
  const map = {
    type: 'parallel',
    actions: [],
    target: null,
    times: 1,
    currentTimes: 1,
  };
  nodeStack.push(map);
  currentActionList.push(map);
  currentActionList = map.actions;
}

export function end({ target, times = 1 }) {
  if (nodeStack.length === 1) {
    ErrorHandler.warn('[ActionManager] there\'s no queue to end, ignored.');
    return false;
  }

  const map = nodeStack.pop();
  map.target = target;
  map.times = times;
  currentActionList = nodeStack[nodeStack.length - 1].actions;
  return !!(nodeStack.length - 1);
}

export function moveBy({ deltaX, deltaY, duration = 0, target, ease }) {
  const action = new Action.MoveByAction({
    duration,
    deltaX,
    deltaY,
    ease,
    target,
  });
  currentActionList.push(action);
}


export function moveTo({ targetX, targetY, duration = 0, target, ease }) {
  const action = new Action.MoveToAction({
    duration,
    targetX,
    targetY,
    ease,
    target,
  });
  currentActionList.push(action);
}

export function fadeTo({ targetOpacity, duration = 0, target, ease }) {
  const action = new Action.FadeToAction({
    duration,
    targetOpacity,
    ease,
    target,
  });
  currentActionList.push(action);
}

// deltaScaleX deltaScaleY 取值 [0-1]
export function scaleBy({ deltaScaleX, deltaScaleY, duration = 0, target, ease }) {
  const action = new Action.ScaleByAction({
    duration,
    deltaScaleX,
    deltaScaleY,
    ease,
    target,
  });
  currentActionList.push(action);
}

// targetScaleX targetScaleY 取值 [0-1]
export function scaleTo({ targetScaleX, targetScaleY, duration = 0, target, ease }) {
  const action = new Action.ScaleToAction({
    duration,
    targetScaleX,
    targetScaleY,
    ease,
    target,
  });
  currentActionList.push(action);
}

// deltaScaleX deltaScaleY 取值 [0-1]
export function rotateBy({ deltaRadians, duration = 0, target, ease }) {
  const action = new Action.RotateByAction({
    duration,
    deltaRadians,
    ease,
    target,
  });
  currentActionList.push(action);
}

// targetScaleX targetScaleY 取值 [0-1]
export function rotateTo({ targetRadians, duration = 0, target, ease }) {
  const action = new Action.RotateToAction({
    duration,
    targetRadians,
    ease,
    target,
  });
  currentActionList.push(action);
}

export function delay({ duration = 0 }) {
  const action = new Action.DelayAction({
    duration,
    target: null,
  });
  currentActionList.push(action);
}

export function remove({ target, _delete }) {
  const action = new Action.RemoveAction({
    target,
    _delete,
  });
  currentActionList.push(action);
}

export function visible({ target, visible }) {
  const action = new Action.VisibleAction({
    target,
    visible,
  });
  currentActionList.push(action);
}

export function tintTo({ targetColor, duration = 0, target, ease }) {
  const action = new Action.TintToAction({
    duration,
    targetColor,
    ease,
    target,
  });
  currentActionList.push(action);
}


export function tintBy({ deltaColor, duration = 0, target, ease }) {
  const action = new Action.TintByAction({
    duration,
    deltaColor,
    ease,
    target,
  });
  currentActionList.push(action);
}

export function start({ target, times = 1 }) {
  for (;;) {
    if (!end({}))
      break;
  }

  forcedTarget = target;
  // forcedTimes = times;
  topNode.times = times;
  finished = false;
}

export function update(time) {
  if (finished)
    return;

  let _finished = updateTransform(time, topNode.actions, 'parallel', forcedTarget, 1 || topNode.currentTimes);
  if (_finished && (topNode.currentTimes < topNode.times)) {
    resetTimes(topNode.actions);
    topNode.currentTimes++;
    _finished = false;
  }
  finished = _finished;
  if (finished && Resolve) {
    Resolve();
    Resolve = null;
  }
}

export function updateTransform(time, actionList, type = 'queue', target, times) {
  let _finished = true;
  for (const action of actionList) {
    if (action.type === 'queue') {
      _finished = updateTransform(time, action.actions, 'queue', action.target || target || forcedTarget, 1 || action.currentTimes) && _finished;
      if (_finished && (action.currentTimes < action.times * times)) {
        resetTimes(action.actions);
        action.currentTimes++;
        _finished = false;
      }
    }
    else if (action.type === 'parallel') {
      _finished = updateTransform(time, action.actions, 'parallel', action.target || target || forcedTarget, 1 || action.currentTimes) && _finished;
      if (_finished && (action.currentTimes < action.times * times)) {
        resetTimes(action.actions);
        action.currentTimes++;
        _finished = false;
      }
    }
    else
    {
      _finished = action.update(time, target || forcedTarget, times) && _finished;
    }
    if (!_finished && type === 'queue')
      break;
  }
  return _finished;
}

export function resetTimes(actionList) {
  for (const action of actionList) {
    if (action.type === 'queue' || action.type === 'parallel') {
      action.currentTimes = 1;
      resetTimes(action.actions);    // recursive
    }
    else {
      action.resetTimes();
    }
  }
}

export function wait() {
  return new Promise((resolve, reject) => {
    Resolve = resolve;
  });
}
