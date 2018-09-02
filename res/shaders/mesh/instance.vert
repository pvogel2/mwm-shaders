varying vec2 vUV;
attribute vec3 offset;
attribute vec4 orientation;

vec3 applyQuaternionToVector( vec4 q, vec3 v ){
	return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
}

void main() {
  vUV = uv;
  vec3 vPosition = applyQuaternionToVector( orientation, position );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + vPosition, 1.0 );
}
