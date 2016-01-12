let PIXI = require('../../Library/pixi.js/src/index');
let DefaultShader = require('../../Library/pixi.js/src/core/renderers/webgl/shaders/TextureShader');
import ErrorHandler from '../ErrorHandler';
let fs = require('fs');


const EmptyTexureShaderFragment = fs.readFileSync(__dirname + '/shaders/emptyTexture.frag','utf8');
const PrepareTransitionShaderFragment = fs.readFileSync(__dirname + '/shaders/prepareTransition.frag','utf8');
const EmptyTexureShaderVertex = fs.readFileSync(__dirname + '/shaders/emptyTexture.vert','utf8');
const PrepareTransitionShaderVertex = fs.readFileSync(__dirname + '/shaders/prepareTransition.vert','utf8');

export class TransitionFilter extends PIXI.AbstractFilter {
    constructor(args) {
        super(args);
        
        this.filter = null;
        this.start = false;
        
        this.filterType = 'Transition';
        
        this.emptyTextureShader = this.prepareTransitionShader = null;
        
        this.uniforms.texture = {type: 'sampler2D', value: null};
        
    }
    
    setPreviousTexture(texture){
        this.uniforms.texture.value = texture;
    }
    
    startTransition(texture, filter){
        if(!this.uniforms.texture)
        {
            ErrorHandler.error("TransitionFilter: PreviousTexture must be set.");
            return
        }
        
        filter.setPreviousTexture(this.uniforms.texture);
        filter.setNextTexture(texture);
        this.uniforms.texture = null;
        this.filter = filter;
        this.start = true;
    }
    
    applyFilter(renderer, input, output, clear){
        
        if(this.start && this.filter)
        {
            let filter = this.filter;
            filter.update(Date.now());
            filter.applyFilter(renderer, input, output, clear);
        }
        else if(this.uniforms.texture)
        {
            super.applyFilter(renderer, input, output, clear);
        }
        else if(this.start)
        {
            ErrorHandler.error("TransitionFilter: Filter must be set.");
            this.start = false;
        }
        else
            super.applyFilter(renderer, input, output, clear);
        
    }
    
    getShader(renderer){
        
        if(!this.emptyTextureShader)
            this.emptyTextureShader = new DefaultShader(renderer.shaderManager,
                EmptyTexureShaderVertex,
                EmptyTexureShaderFragment,
                this.uniforms,
                this.attributes
            );
        if(!this.prepareTransitionShader)
            this.prepareTransitionShader = new DefaultShader(renderer.shaderManager,
                PrepareTransitionShaderVertex,
                PrepareTransitionShaderFragment,
                this.uniforms,
                this.attributes
            );
        // console.log(this.uniforms.texture)
        
        if(this.uniforms.texture)
            return this.prepareTransitionShader;
        else
            return this.emptyTextureShader;
    }
    
    
    syncUniform(uniform){
        ErrorHandler.warn("TransitionFilter: method syncUniform() should not be called, it's a bug!");
        super.syncUniform(uniform);
    }
}
