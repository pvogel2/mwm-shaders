varying vec4 vColor;
varying vec2 vUV;

void main() {
  vColor = vec4( color, 1.0 );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  vUV = uv;
}
