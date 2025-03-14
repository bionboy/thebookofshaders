/*
  2025-03-10
  Author: https://github.com/bionboy
*/

#ifdef GL_ES
precision mediump float;
#endif

#include "../helpers/paint.glsl"

#define CIRCLE_COLOR vec3(0.5843, 0.2745, 0.502)
// #define CIRCLE_COLOR vec3(0.1804, 0.4314, 0.1412)

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

void bubble(in vec2 st, inout vec4 canvas, vec2 offset, float radius) {
  circleBR(st, canvas, vec2(offset.x, offset.y + sin(u_time * 2.) * .05), radius);
}

/*
  Circle function created After Reading this section in TBOS
*/
void circleAR(in vec2 st, inout vec4 canvas, vec2 offset, float radius) {
  float d = distance(st, offset);
  float fromCenter = d / radius;
  vec4 brush = vec4(CIRCLE_COLOR, pow(fromCenter, 4.));
  // vec4 brush = vec4(vec3(0.5843, 0.2745, 0.502), .1);

  // canvas += brush * step(d, radius);
  paint(canvas, brush, step(d, radius));
  // canvas.a = brush.a;

  // fuzzy
  // canvas += brush * smoothstep(d - .02, d, radius); 
}

/*
  After Reading
*/
void lensFlare(in vec2 st, inout vec4 canvas, vec2 offset, float radius) {
  float d = distance(st, offset);
  vec4 brush = vec4(CIRCLE_COLOR, 1.);

  canvas += brush * radius / d;
  // canvas += brush * d / radius;

  // TODO: make it have the line that lens flares have too
}

/*
  Modified function from TBOS,
  this function avoids using anything that depends on `sqrt`
  ! NOTE: The radius isn't the same as the other functions, its way bigger for the same value...
  ! Probably because this isn't the radius!!!!
  I guess it depends on your reference, but this is confusing to me after writing the other code
*/
void circleEfficient(in vec2 st, inout vec4 canvas, in vec2 offset, in float radius) {
  vec2 dist = st - offset;

  float circle = 1. - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(dist, dist) * 4.0);

  paint(canvas, CIRCLE_COLOR, circle);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec4 canvas = vec4(0.0, 0.0, 1.0, 1.0);
  // vec4 canvas = vec4(0.0118, 0.1765, 0.0824, 0.813);

  bubble(st, canvas, vec2(.125, .825), .1);
  bubble(st, canvas, vec2(.125, .825), .1);
  bubble(st, canvas, vec2(.2, .75), .05);

  circleAR(st, canvas, vec2(.8, .8), .1);
  lensFlare(st, canvas, vec2(.22, .22), .2 + cos(u_time * 1.) * .02);

  float rEff = .01;
  circleEfficient(st, canvas, vec2(.8, .2), rEff);
  circleEfficient(st, canvas, vec2(.76, .15), rEff);
  circleEfficient(st, canvas, vec2(.84, .15), rEff);
  lensFlare(st, canvas, vec2(.8, .17), .02);

  gl_FragColor = canvas;
}