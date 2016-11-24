precision highp float;
uniform sampler2D previousTexture;
uniform sampler2D nextTexture;
uniform float progress;
uniform float direction;  //0 for left(from left), 0.25 for right, 0.5 for top, 0.75 for down
uniform float num;  //0.1 for up(from up), 0.4 for down, 0.6 for left, 0.9 for right
varying vec2 vTextureCoord;
void main()
{
  vec4 col=texture2D(previousTexture, vTextureCoord);
  vec4 col2=texture2D(nextTexture, vTextureCoord);
  if(direction<0.1)
  {
    if(num*mod(vTextureCoord.x,1.0/num)<progress)
      col=col2;
  }
  else if(direction<0.4)
  {
    if(1.0-num*mod(vTextureCoord.x,1.0/num)<progress)
      col=col2;
  }
  else if(direction<0.6)
  {
    if(num*mod(vTextureCoord.y,1.0/num)<progress)
      col=col2;
  }
  else
  {
    if(1.0-num*mod(vTextureCoord.y,1.0/num)<progress)
      col=col2;
  }
  gl_FragColor = col;
}
