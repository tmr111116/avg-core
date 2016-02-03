precision mediump float;
uniform sampler2D previousTexture; 
uniform sampler2D nextTexture;
uniform float progress; 
uniform vec2 ratio; 
uniform vec2 origin; 
uniform float phase; 
uniform float drift; 
varying vec2 vTextureCoord; 

void main() 
{ 
	vec2 pos = vTextureCoord * ratio - origin; 
	float l = length(pos);
	float w = fract( - phase + l); 
	float rfw = sin(-6.283 * w) + sin(-12.566 * w - 2.0) / 5.0; 
	float rfw2 = rfw*rfw/1.19/1.19 * drift; 
	float dx = -rfw2 * pos.y / l; 
	float dy = rfw2 * pos.x / l; 
	vec2 pos2 = vTextureCoord + vec2(dx, dy); 
	gl_FragColor = mix(texture2D(previousTexture, pos2), texture2D(nextTexture, pos2), progress); 
} 