precision mediump float;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

uniform sampler2D uSampler;
uniform sampler2D texture;

void main(void)
{
    gl_FragColor = texture2D(texture, vFilterCoord);
}
