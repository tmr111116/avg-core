precision mediump float;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aColor;
uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
varying vec4 vColor;
void main(void){
   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;
   vTextureCoord = aTextureCoord ;
   vColor = vec4(aColor.rgb * aColor.a, aColor.a);
}
