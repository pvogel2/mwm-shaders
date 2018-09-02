uniform sampler2D texture;
varying vec3 vColor;
varying vec3 vNormal;

void main() {
  vec4 inputSample = texture2D( texture, gl_PointCoord );
  vec3 halo = vNormal;
  float lx = gl_PointCoord.x - .5;
  float ly = gl_PointCoord.y - .5;

  float lxShift = lx;
  float lyShift = ly;
  float l = sqrt(lxShift * lxShift + lyShift * lyShift);
  vec3 coreColor = vec3(l*halo.x + vColor.x*(1.0-l), l*halo.y + vColor.y*(1.0-l), l*halo.z + vColor.z*(1.0-l));
  //vec3 coreColor = vec3(1., 1., 1.);
  gl_FragColor = vec4( vNormal, min(.0, ly)/ly - l );
}
