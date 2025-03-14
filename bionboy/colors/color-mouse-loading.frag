/*
  Based on an exercise from https://thebookofshaders.com/06/
*/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TAU 6.28318530718

#include "helpers/polar.glsl"
#include "helpers/colors.glsl"

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

const float BORDER_RADIUS = 0.49;
const float BORDER_WIDTH = 0.02;
const float COLOR_DIVISIONS = 6.;

void main() {
  vec2 mouse = u_mouse / u_resolution;
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec3 color = vec3(0.0);

  Polar polar = polarFromCartesian(st);
  polar.theta += u_time * 1.3;

  // twist color segments
  float twist = -pow(polar.r * 6., .5) * 0.5;
  polar.theta += twist;

  // normalize only after twisting
  normalizeTheta(polar);

  // segment the rainbow
  polar.theta = floor(polar.theta * COLOR_DIVISIONS) / COLOR_DIVISIONS;

  // create circle map
  bool circle = length(polar.center) < BORDER_RADIUS;

  // color wheel
  color = hsb2rgb(vec3(polar.theta, 1, 1));

  // create border
  if (abs(length(polar.center) - BORDER_RADIUS) < BORDER_WIDTH) {
    color = vec3(0.0);
  }

  gl_FragColor = vec4(color, circle);
}
