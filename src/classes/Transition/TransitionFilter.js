const PIXI = require('pixi.js');
// const DefaultShader = require('pixi.js/src/core/renderers/webgl/shaders/TextureShader');
import ErrorHandler from '../ErrorHandler';


const EmptyTexureShaderFragment = require(__dirname + '/shaders/emptyTexture.frag');
const PrepareTransitionShaderFragment = require(__dirname + '/shaders/prepareTransition.frag');
const EmptyTexureShaderVertex = require(__dirname + '/shaders/emptyTexture.vert');
const PrepareTransitionShaderVertex = require(__dirname + '/shaders/prepareTransition.vert');

export class TransitionFilter extends PIXI.Filter {
  constructor(args) {
    super(EmptyTexureShaderVertex, EmptyTexureShaderFragment, {
      // texture: { type: 'sampler2D', value: PIXI.Texture.EMPTY },
    });

    // this.glShaderKey = 'transition';
    this.padding = 0;

    this.filter = null;
    this.start = false;
    this.block = false;

    this.m_resolve = null;

    this.filterType = 'Transition';

    this.emptyTextureShader = this.prepareTransitionShader = null;
  }

  setPreviousTexture(texture) {
    this.uniformData.texture = { type: 'sampler2D', value: texture };
    this.uniforms.texture = texture;
  }

    /*
      说明：
        `texture`是将要变化到的图像
        `filter`变换用的Shader
    */
  startTransition(texture, filter) {
    // 判断当前是否处于pretrans状态
    if (!this.uniforms.texture) {
      ErrorHandler.error('[TransitionFilter] PreviousTexture must be provided.');
      return;
    }

    filter.setPreviousTexture(this.uniforms.texture);
    filter.setNextTexture(texture);
    delete this.uniformData.texture;
    delete this.uniforms.texture;
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

  apply(filterManager, input, output, clear) {
    this.applyShader();
    if (this.start && this.filter) {
      const filter = this.filter;

      const matrix = new PIXI.Matrix();
      filterManager.calculateNormalizedScreenSpaceMatrix(matrix);
      filter.uniforms.filterMatrix = matrix;
      filter.uniformData.filterMatrix = { type: 'mat3', value: matrix };

      const finished = filter.update(Date.now());
      filterManager.applyFilter(filter, input, output, clear);
      if (finished) {
        this.start = false;
        this.filter = null;
        this.m_resolve();
        this.m_resolve = null;
      }
    } else if (this.uniforms.texture) {
      filterManager.applyFilter(this, input, output, clear);
    } else if (this.start) {
      ErrorHandler.error('[TransitionFilter] Filter must be provided.');
      this.start = false;
      this.m_resolve();
      this.m_resolve = null;
    } else {
      filterManager.applyFilter(this, input, output, clear);
    }
  }

  // applyFilter(renderer, input, output, clear) {
  //   if (this.start && this.filter) {
  //     const filter = this.filter;
  //     const finished = filter.update(Date.now());
  //     filter.applyFilter(renderer, input, output, clear);
  //     if (finished) {
  //       this.start = false;
  //       this.filter = null;
  //       this.m_resolve();
  //       this.m_resolve = null;
  //     }
  //   } else if (this.uniforms.texture.value) {
  //     super.applyFilter(renderer, input, output, clear);
  //   } else if (this.start) {
  //     ErrorHandler.error('[TransitionFilter] Filter must be provided.');
  //     this.start = false;
  //     this.m_resolve();
  //     this.m_resolve = null;
  //   } else {
  //     super.applyFilter(renderer, input, output, clear);
  //   }
  // }

  applyShader() {
    // if (!this.emptyTextureShader)
    //   this.emptyTextureShader = new DefaultShader(renderer.shaderManager,
    //             EmptyTexureShaderVertex,
    //             EmptyTexureShaderFragment,
    //             this.uniforms,
    //             this.attributes
    //         );
    // if (!this.prepareTransitionShader)
    //   this.prepareTransitionShader = new DefaultShader(renderer.shaderManager,
    //             PrepareTransitionShaderVertex,
    //             PrepareTransitionShaderFragment,
    //             this.uniforms,
    //             this.attributes
    //         );
        // console.log(this.uniforms.texture)
    this.glShaders = [];
    if (this.block) {
      this.vertexSrc = EmptyTexureShaderVertex;
      this.fragmentSrc = EmptyTexureShaderFragment;
    }

    if (this.uniforms.texture) {
      this.vertexSrc = PrepareTransitionShaderVertex;
      this.fragmentSrc = PrepareTransitionShaderFragment;
    } else {
      this.vertexSrc = EmptyTexureShaderVertex;
      this.fragmentSrc = EmptyTexureShaderFragment;
    }
  }


  syncUniform(uniform) {
    ErrorHandler.warn("[TransitionFilter] Method syncUniform() should not be called, it's a bug!");
    super.syncUniform(uniform);
  }
}
