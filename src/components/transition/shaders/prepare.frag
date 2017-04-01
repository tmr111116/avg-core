precision mediump float;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

uniform sampler2D previousTexture;
uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = texture2D(previousTexture, vFilterCoord);
}
