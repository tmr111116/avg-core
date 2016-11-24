precision highp float;
uniform sampler2D previousTexture;
uniform sampler2D nextTexture;
uniform sampler2D ruleTexture;
uniform float progress;
uniform float vague;
varying vec2 vTextureCoord;
void main()
{
  vec4 col = texture2D(previousTexture, vTextureCoord);
  vec4 col2 = texture2D(nextTexture, vTextureCoord);
  float b = texture2D(ruleTexture, vec2(vTextureCoord.x, 1.0 - vTextureCoord.y)).b;
  float phase = (1.0 + vague) * progress;
  b = smoothstep(phase - vague, phase, b);
  gl_FragColor = mix(col2, col, b);
}
