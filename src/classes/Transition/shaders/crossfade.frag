precision mediump float;
uniform sampler2D previousTexture;
uniform sampler2D uSampler;
uniform float progress;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
void main()
{
  vec4 col = texture2D(previousTexture, vFilterCoord);
  vec4 col2 = texture2D(uSampler, vTextureCoord);
  gl_FragColor = mix(col, col2, progress);
}
