/*
  25-03-12
  Author: https://github.com/bionboy
*/

#ifdef GL_ES
precision mediump float;
#endif

#include "../helpers/paint.glsl"

// #define CIRCLE_COLOR vec3(0.5843, 0.2745, 0.502)
#define CIRCLE_COLOR vec3(0.1804, 0.4314, 0.1412)

// #define CANVAS_COLOR vec4(0.0, 0.0, 1.0, 1.0)
#define CANVAS_COLOR vec4(0.0118, 0.1765, 0.0824, 0.813)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

/*
  Circle function created Before Reading this section in TBOS
*/
void circleBR(in vec2 st, inout vec4 canvas, vec2 offset, float radius) {
  float d = distance(st, offset);
  float fromCenter = d / radius;
  // vec4 brush = vec4(0.2275, 0.1882, 0.7882, 1.0);
  vec4 brush = vec4(CIRCLE_COLOR, pow(fromCenter, 4.));

  if (d <= radius) {
    paint(canvas, brush, 1.0);
  }
}

void circleBYODistance(in vec2 st, inout vec4 canvas, float radius, in float _distance) {
  float d = _distance;
  float fromCenter = d / radius;
  // vec4 brush = vec4(0.2275, 0.1882, 0.7882, 1.0);
  vec4 brush = vec4(CIRCLE_COLOR, pow(fromCenter, 4.));

  if (d <= radius) {
    paint(canvas, brush, 1.0);
  }
}

void multiDistanceExercise(in vec2 st, inout vec4 canvas, float radius) {
  float d;
  float r = 0.023;

  float wiggle = sin(u_time * 1.) * .01;

  d = distance(st, vec2(10. * wiggle + 0.7, .4)) + distance(st, vec2(.4, 0.7 + wiggle * 10.));
  circleBYODistance(st, canvas, r * 25., d);

  d = distance(st, vec2(0.4)) * distance(st, vec2(0.6) + wiggle);
  circleBYODistance(st, canvas, r, d);

  d = min(distance(st, vec2(0.4) - wiggle), distance(st, vec2(0.6 + wiggle)));
  circleBYODistance(st, canvas, r, d);

  d = max(distance(st, vec2(0.35) + wiggle), distance(st, vec2(0.6) + wiggle));
  circleBYODistance(st, canvas, r * 11., d);

  d = pow(distance(st, vec2(0.3) + wiggle * 2.), distance(st, vec2(0.5)));
  circleBYODistance(st, canvas, r * 25., d);

  d = pow(distance(st, vec2(0.9) + wiggle), distance(st, vec2(1.)));
  circleBYODistance(st, canvas, r * 25., d);
}
void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec4 canvas = CANVAS_COLOR;

  // vec2 offset = vec2(.5, .5);
  // float d = distance(st, offset);
  // d += distance(st, vec2( //
  // offset.x * (1. + sin(2. * (u_time + 1.)) * .1),  // 
  // offset.y * (1. + sin(u_time) * .1)) //
  // ); //
  // circleBYODistance(st, canvas, vec2(.5, .5), .1, d);
  // d = distance(st, vec2(
  //   offset.x * (1. + sin(2. * (u_time + 1.)) * .1),  //
  //   offset.y * (1. + sin(u_time) * .1)) //
  // );
  // circleBYODistance(st, canvas, vec2(.5, .5), .1, d);
  multiDistanceExercise(st, canvas, .1);

  // see `meta-balls.frag` for the metaBalls function

  gl_FragColor = canvas;
}