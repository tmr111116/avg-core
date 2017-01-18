precision mediump float;
uniform sampler2D previousTexture;
uniform sampler2D uSampler;
uniform float progress;
uniform float direction;  //0 for left(from left), 0.25 for right, 0.5 for top, 0.75 for down
uniform float num;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
void main()
{
  vec4 col = texture2D(previousTexture, vFilterCoord);
  vec4 col2 = texture2D(uSampler, vTextureCoord);
  if(direction < 0.1)
  {
    if(num * mod(vFilterCoord.x, 1.0 / num) < progress)
      col = col2;
  }
  else if(direction < 0.4)
  {
    if(1.0 - num * mod(vFilterCoord.x, 1.0 / num) < progress)
      col = col2;
  }
  else if(direction < 0.6)
  {
    if( num * mod(vFilterCoord.y, 1.0 / num) < progress)
      col = col2;
  }
  else
  {
    if(1.0 - num * mod(vFilterCoord.y, 1.0 / num) < progress)
      col = col2;
  }
  gl_FragColor = col;
}
