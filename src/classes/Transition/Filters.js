const fs = require('fs');
import AbstractFilter from './AbstractFilter';
const PIXI = require('pixi.js');
import { getTexture } from 'classes/Preloader';

const commonVertex = fs.readFileSync(__dirname + '/shaders/common.vert', 'utf8');

export class CrossFadeFilter extends AbstractFilter {
  constructor(duration = 1000) {
    super(commonVertex,
        fs.readFileSync(__dirname + '/shaders/crossfade.frag', 'utf8'));

    this.duration = duration;
  }
}
export class UniversalFilter extends AbstractFilter {
  constructor(ruleFile, vague = 64, duration = 1000) {
    const ruleTexture = getTexture(ruleFile);

    super(commonVertex,
        fs.readFileSync(__dirname + '/shaders/universal.frag', 'utf8'),
      {
        vague: { type: '1f', value: vague },
        ruleTexture: { type: 'sampler2D', value: ruleTexture },
      });

    this.duration = duration;
  }
}
export class ShutterFilter extends AbstractFilter {
  constructor(direction = 0, num = 16, duration = 1000) {
    super(commonVertex,
        fs.readFileSync(__dirname + '/shaders/shutter.frag', 'utf8'),
      {
        direction: { type: '1f', value: direction },
        num: { type: '1f', value: num },
      });

    this.duration = duration;
  }
}
export class RippleFilter extends AbstractFilter {
  constructor(ratio, origin, phase, drift, duration = 1000) {
    super(commonVertex,
        fs.readFileSync(__dirname + '/shaders/shutter.frag', 'utf8'),
      {
        ratio: { type: '2f', value: {
          x: ratio.x,
          y: ratio.y,
        } },
        origin: { type: '2f', value: {
          x: origin.x,
          y: origin.y,
        } },
        phase: { type: '1f', value: phase },
        drift: { type: '1f', value: drift },
      });

    this.duration = duration;
  }
}
