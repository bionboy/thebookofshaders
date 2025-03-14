#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct, float d);
float plot(vec2 st, float pct) {
  return plot(st, pct, 0.005);
}
float plot(vec2 st, float pct, float d) {
  return smoothstep(pct - d, pct, st.y) - smoothstep(pct, pct + d, st.y);
}

/* https://iquilezles.org/articles/functions/ */
float sinc(float x, float k) {
  float a = PI * (k * x - 1.0);
  return sin(a) / a;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec4 color;
  color = vec4(vec3((st.x + st.y) * .5 - .5), 1.0);

  const int PLT_LEN = 7;

  vec4 colors[PLT_LEN];
  colors[0] = vec4(1.0, 0.0, 0.0, 1.0);
  colors[1] = vec4(0.0, 1.0, 0.0, 1.0);
  colors[2] = vec4(0.0, 0.0, 1.0, 1.0);
  colors[3] = vec4(1.0, 0.0, 1.0, 1.0);
  colors[4] = vec4(1.0, 1.0, 0.0, 1.0);
  colors[5] = vec4(0.0, 1.0, 1.0, 0.1);
  colors[6] = vec4(vec3(.3), 1);

  float plts[PLT_LEN];
  plts[0] = plot(st, st.x); // line
  plts[1] = plot(st, pow(st.x, 5.0)); // curve
  plts[2] = plot(st, smoothstep(0.2, 0.5, st.x) - smoothstep(0.5, 0.8, st.x)); // bump 
  plts[3] = plot(st, pow(st.x, abs(sin(u_time * 1.) + PI / 2.0))); // wiggle
  plts[4] = plot(st, sinc(st.x, mod(u_time, 10.) * 2.) * .8 + .19);
  plts[5] = plot(st, sin(st.x * 60. + u_time * 5.) *
    cos(st.x * 6. + u_time * 5.) * .1 + .8, clamp(cos(5. * u_time) * .1, .01, .1)); // sin wave
  plts[6] = plot(st, sin(st.x * 60. + u_time * 2.) * .3 + 0.01, smoothstep(.01, .1, (cos(50. * st.x) + 1.) / 2.)); // weird ghost wave

  for (int i = 0; i < PLT_LEN; i++) {
    // if (length(color) <= 0.01) {
    color += plts[i] * colors[i];
    // color = mix(color, colors[i], plts[i]);
    // }

  }

  // if (length(color) <= 1.0) {
  //   color = vec4(vec3((st.x + st.y) * .5 - .5), 1.);
  // }

  gl_FragColor = color;
}