attribute float size;
attribute vec3 color;
varying vec3 vColor;
varying vec3 vNormal;
varying float distToCamera;

void main() {
  vColor = color;
  vNormal = normalize((projectionMatrix * modelViewMatrix * vec4( normal, 0.0 )).xyz);
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  distToCamera = -mvPosition.z;
  gl_PointSize = size / distToCamera;
  gl_Position = projectionMatrix * mvPosition;
}
