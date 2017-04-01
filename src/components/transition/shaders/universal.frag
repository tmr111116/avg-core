precision mediump float;
uniform sampler2D previousTexture;
uniform sampler2D uSampler;
uniform sampler2D ruleTexture;
uniform float progress;
uniform float vague;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
void main()
{
  vec4 col = texture2D(previousTexture, vFilterCoord);
  vec4 col2 = texture2D(uSampler, vTextureCoord);
  float b = texture2D(ruleTexture, vec2(vFilterCoord.x, 1.0 - vFilterCoord.y)).b;
  float phase = (1.0 + vague) * progress;
  b = smoothstep(phase - vague, phase, b);
  gl_FragColor = mix(col2, col, b);
}
