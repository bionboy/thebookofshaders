/*
  Adapted from:
    If you intend to reuse this shader, please add credits to 'Danilo Guanabara'
    http://www.pouet.net/prod.php?which=57245
    https://www.shadertoy.com/view/XsXXDn
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

#define TIME_SCALE 0.5

void main() {
  vec2 res = u_resolution.xy;
  float t = u_time;
  vec3 color;
  float len, z = t * TIME_SCALE;

  for (int i = 0; i < 3; i++) {
    vec2 st = gl_FragCoord.xy / res;
    vec2 uv = st;

    // Center the coordinates
    st -= .5;

    // Adjust the x coordinate to match the aspect ratio
    st.x *= res.x / res.y;

    // shift z for each color channel slightly
    z += .07 + u_mouse.x / res.x;

    // IDK ???
    len = length(st);
    uv += st / len * (sin(z) + 1.) * abs(sin(len * 9. - z - z));
    color[i] = .01 / length(mod(uv, 1.) - .5);
  }

  gl_FragColor = vec4(color / len, t);
}