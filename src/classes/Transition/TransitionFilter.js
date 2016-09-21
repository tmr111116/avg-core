const PIXI = require('../../library/pixi.js/src/index');
const DefaultShader = require('../../library/pixi.js/src/core/renderers/webgl/shaders/TextureShader');
import ErrorHandler from '../ErrorHandler';
const fs = require('fs');


const EmptyTexureShaderFragment = fs.readFileSync(__dirname + '/shaders/emptyTexture.frag', 'utf8');
const PrepareTransitionShaderFragment = fs.readFileSync(__dirname + '/shaders/prepareTransition.frag', 'utf8');
const EmptyTexureShaderVertex = fs.readFileSync(__dirname + '/shaders/emptyTexture.vert', 'utf8');
const PrepareTransitionShaderVertex = fs.readFileSync(__dirname + '/shaders/prepareTransition.vert', 'utf8');

export class TransitionFilter extends PIXI.AbstractFilter {
  constructor(args) {
    super(args);

    this.filter = null;
    this.start = false;
    this.block = false;

    this.m_resolve = null;

    this.filterType = 'Transition';

    this.emptyTextureShader = this.prepareTransitionShader = null;

    this.uniforms.texture = { type: 'sampler2D', value: null };
  }

  setPreviousTexture(texture) {
    this.uniforms.texture.value = texture;
  }

    /*
      说明：
        `texture`是将要变化到的图像
        `filter`变换用的Shader
    */
  startTransition(texture, filter) {
        // 判断当前是否处于pretrans状态
    if (!this.uniforms.texture.value)
        {
      ErrorHandler.error('[TransitionFilter] PreviousTexture must be provided.');
      return;
    }

    filter.setPreviousTexture(this.uniforms.texture.value);
    filter.setNextTexture(texture);
    this.uniforms.texture.value = null;
    this.filter = filter;
    this.start = true;

    return new Promise((resolve, reject) => {
      this.m_resolve = resolve;
    });
  }

  completeTransition() {
    this.start = false;
    this.filter = null;
    this.m_resolve && this.m_resolve();
    this.m_resolve = null;
  }

  setBlocked(bool = true) {
    this.block = bool;
  }

  applyFilter(renderer, input, output, clear) {
    if (this.start && this.filter) {
      const filter = this.filter;
      const finished = filter.update(Date.now());
      filter.applyFilter(renderer, input, output, clear);
      if (finished) {
        this.start = false;
        this.filter = null;
        this.m_resolve();
        this.m_resolve = null;
      }
    } else if (this.uniforms.texture.value) {
      super.applyFilter(renderer, input, output, clear);
    } else if (this.start) {
      ErrorHandler.error('[TransitionFilter] Filter must be provided.');
      this.start = false;
      this.m_resolve();
      this.m_resolve = null;
    } else {
      super.applyFilter(renderer, input, output, clear);
    }
  }

  getShader(renderer) {
    if (!this.emptyTextureShader)
      this.emptyTextureShader = new DefaultShader(renderer.shaderManager,
                EmptyTexureShaderVertex,
                EmptyTexureShaderFragment,
                this.uniforms,
                this.attributes
            );
    if (!this.prepareTransitionShader)
      this.prepareTransitionShader = new DefaultShader(renderer.shaderManager,
                PrepareTransitionShaderVertex,
                PrepareTransitionShaderFragment,
                this.uniforms,
                this.attributes
            );
        // console.log(this.uniforms.texture)
    if (this.block)
      return this.emptyTextureShader;

    if (this.uniforms.texture.value)
      return this.prepareTransitionShader;
    else
      return this.emptyTextureShader;
  }


  syncUniform(uniform) {
    ErrorHandler.warn("[TransitionFilter] Method syncUniform() should not be called, it's a bug!");
    super.syncUniform(uniform);
  }
}
