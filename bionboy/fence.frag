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
  vec3 color = vec3((st.x + st.y) * .5 - .5);

  const int PLT_LEN = 10;

  vec3 colors[PLT_LEN];
  colors[0] = vec3(1.0, 0.0, 0.0);
  colors[1] = vec3(0.0, 1.0, 0.0);
  colors[2] = vec3(0.0, 0.0, 1.0);
  colors[3] = vec3(1.0, 0.0, 1.0);
  colors[4] = vec3(1.0, 1.0, 0.0);
  colors[5] = vec3(0.0, 1.0, 1.0);
  colors[6] = vec3(1.0, 1.0, 1.0);

  float plts[PLT_LEN];
  plts[0] = plot(st, st.x); // line
  plts[1] = plot(st, pow(st.x, 5.0)); // curve
  plts[2] = plot(st, smoothstep(0.2, 0.5, st.x) - smoothstep(0.5, 0.8, st.x)); // bump 
  plts[3] = plot(st, pow(st.x, abs(sin(u_time * 1.) + PI / 2.0))); // wiggle
  plts[4] = plot(st, mod(sin(u_time * 1.) + 1.0, 0.2) / 2.0, .05);
  plts[5] = plot(st, sinc(st.x, u_time * 2.) * .8 + .19);

  for (int i = 0; i < PLT_LEN; i++) {
    color += plts[i] * colors[i];
  }

  gl_FragColor = vec4(color, 1.0);
}