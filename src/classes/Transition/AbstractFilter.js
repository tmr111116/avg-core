const PIXI = require('pixi.js');
import ErrorHandler from '../ErrorHandler';

export default class AbstractFilter extends PIXI.Filter {
  constructor(vertex, frag, uniforms) {
    const _uniforms = {
      previousTexture: { type: 'sampler2D', value: PIXI.Texture.EMPTY },
      nextTexture: { type: 'sampler2D', value: PIXI.Texture.EMPTY },
      progress: { type: '1f', value: 0 },
    };

    super(vertex, frag, Object.assign(_uniforms, uniforms));

    this.startTime = 0;
    this.duration = 5000;

    this.finished = false;
  }

  setPreviousTexture(texture) {
    this.uniformData.previousTexture.value = texture;
    this.uniforms.previousTexture = texture;
  }


  setNextTexture(texture) {
    this.uniformData.nextTexture.value = texture;
    this.uniforms.nextTexture = texture;
  }

    // 返回false说明转场未完成，返回true说明完成
  update(time) {
    // 第一次执行.update()时初始化
    if (!this.startTime) {
      this.startTime = time;
      return false;
    }

    // 判断转场是否完成
    if (time - this.startTime >= this.duration) {
      this.uniformData.progress.value = 1;
      this.uniforms.progress = 1;
      this.finished = true;
      return true;
    }

    this.uniformData.progress.value = (time - this.startTime) / this.duration;
    this.uniforms.progress = (time - this.startTime) / this.duration;
    return false;
  }

}
