precision mediump float;
uniform sampler2D previousTexture;
uniform sampler2D uSampler;
uniform float progress;
uniform float currentTime;
uniform vec2 count;
uniform vec2 origin;
uniform float speed;
uniform float maxDrift;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

void main()
{
  float phase = speed * currentTime / 1000.;
  float drift = sin(3.142 * progress) * maxDrift / 1000.;

  vec2 pos = vFilterCoord * count - origin;
  float l = length(pos);
  float w = fract( - phase + l);
  float rfw = sin(-6.283 * w) + sin(-12.566 * w - 2.0) / 5.0;
  float rfw2 = rfw * rfw / 1.19 / 1.19 * drift;
  float dx = -rfw2 * pos.y / l;
  float dy = rfw2 * pos.x / l;
  vec2 pos2 = vFilterCoord + vec2(dx, dy);

  vec2 pos_tex = vTextureCoord * count - origin;
  float l_tex = length(pos_tex);
  float w_tex = fract( - phase + l_tex);
  float rfw_tex = sin(-6.283 * w_tex) + sin(-12.566 * w_tex - 2.0) / 5.0;
  float rfw2_tex = rfw_tex * rfw_tex / 1.19 / 1.19 * drift;
  float dx_tex = -rfw2_tex * pos_tex.y / l_tex;
  float dy_tex = rfw2_tex * pos_tex.x / l_tex;
  vec2 pos2_tex = vTextureCoord + vec2(dx_tex, dy_tex);

  gl_FragColor = mix(texture2D(previousTexture, pos2), texture2D(uSampler, pos2_tex), progress);
}
