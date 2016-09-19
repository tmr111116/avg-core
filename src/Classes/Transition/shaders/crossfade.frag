precision mediump float;
uniform sampler2D previousTexture;
uniform sampler2D nextTexture;
uniform float progress;
varying vec2 vTextureCoord;
void main()
{
  vec4 col = texture2D(previousTexture, vTextureCoord);
  vec4 col2 = texture2D(nextTexture, vTextureCoord);
  gl_FragColor = mix(col, col2, progress);
}