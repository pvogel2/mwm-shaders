uniform sampler2D texture;
varying vec3 vColor;
varying vec3 vNormal;

void main() {
  vec4 inputSample = texture2D( texture, gl_PointCoord );
  vec3 halo = vNormal;//vec3(.1, .1, .1);
  //float l = cos(3.14 * (gl_PointCoord.x - 0.5));//length(vec2(cos(3.14 * (gl_PointCoord.x))*0.,1. + 0.*cos(3.14 * (gl_PointCoord.y))));
  float lx = cos(3.14 * (gl_PointCoord.x - 0.5));
  float ly = cos(3.14 * (gl_PointCoord.y - 0.5));

  float lxShift = gl_PointCoord.x * 2. - 1.;
  float lyShift = gl_PointCoord.y - 1.;
  float l = sqrt(3.*lxShift * lxShift + lyShift * lyShift * lyShift * lyShift * lyShift * lyShift / (vNormal.y *vNormal.y));
  vec3 coreColor = vec3(l*halo.x + vColor.x*(1.0-l), l*halo.y + vColor.y*(1.0-l), l*halo.z + vColor.z*(1.0-l));
  //vec3 coreColor = vec3(1., 1., 1.);
  gl_FragColor = vec4( vNormal, 1. - l );
}
