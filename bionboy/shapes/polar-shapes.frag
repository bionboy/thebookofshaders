// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#include "../helpers/viewport.glsl"
#include "../helpers/polar.glsl"
#include "../helpers/paint.glsl"

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
  vec2 st = normalCoordinates(u_resolution);
  st = squareAspectRatio(st, u_resolution);

  vec2 mouse = u_mouse / u_resolution;
  vec4 canvas = vec4(0, 0, 0, 1);

  Polar p = polarFromCartesian(st);
  // normalizeTheta(p);
  p.theta += u_time * .2;

  Polar p2 = polarFromCartesian(st);
  p2.theta += u_time * .4;

  float f = cos(p.theta * 3.);
  // f = abs(cos(p.theta * 3.));
  // f = abs(cos(p.theta * 2.5)) * .5 + .3;
  // f = abs(cos(p.theta * 5.) * sin(p.theta * 3.)) * .8 + .1;
  // f = smoothstep(-.5, 1.5, cos(p.theta * 10.)) * 0.2 + 0.5;
  // f = sin(p.theta*4.) + sin(p.theta*u_time+3.);
  // paint(canvas, vec3(1. - smoothstep(f, f + 0.02, p.r)));

  float f1 = sin(p.theta * u_time * 1.1 + .1);
  float f2 = sin(p.theta * u_time * 1.2 + .2);
  float f3 = sin(p.theta * u_time * 1.3 + .3);
  // paint(canvas, vec3(1. - smoothstep(f1, f1 + 0.02, p.r), 1. - smoothstep(f2, f2 + 0.02, p.r), 1. - smoothstep(f3, f3 + 0.02, p.r)));

  f1 = cos(p.theta * 10.) * 0.2 + 0.5;
  f2 = cos(p2.theta * 10.) * 0.2 + 0.3;
  float g1 = 1. - smoothstep(f1, f1 + .02, p.r);
  float g2 = 1. - smoothstep(f2, f2 + .02, p2.r);
  // paint(canvas, vec3(g1 - g2));

  // paint(canvas, vec4(vec3(g1), p.r));
  // paint(canvas, vec4(vec3(g2), p2.r));

  paint(canvas, vec4(vec3(g1, 0, 0), g1));
  paint(canvas, vec4(vec3(0, 0, g2), g2));

  // paint(canvas, vec4(g1-g2));

  // paint(canvas, vec4(g2-g1-g1));

  // paint(canvas, plot(st, f1 - f2) * vec3(0, 1, 0));
  // paint(canvas, plot(st, f1) * vec3(0, 0, 1));
  // paint(canvas, plot(st, f2) * vec3(1, 0, 1));

  gl_FragColor = canvas;
}
