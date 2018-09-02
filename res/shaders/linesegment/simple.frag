precision mediump float;

varying vec4 vColor;
varying vec2 vUV;
uniform sampler2D texture;

void main() {
  vec4 inputSample = texture2D( texture, vUV );
  gl_FragColor = vec4( inputSample.xyz, inputSample.a );
  //gl_FragColor = vec4(vUV.x * 1., vUV.y * 1., 1., 1.0);
}
