/*
  2025-03-14
  Author: https://github.com/bionboy
*/

#ifdef GL_ES
precision mediump float;
#endif

#include "../helpers/viewport.glsl"
#include "../helpers/paint.glsl"
#include "../helpers/animateSteps.glsl"

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float box(in vec2 _st, in vec2 _size) {
  _size = vec2(0.5) - _size * 0.5;
  vec2 uv = smoothstep(_size, _size + vec2(0.001), _st);
  uv *= smoothstep(_size, _size + vec2(0.001), vec2(1.0) - _st);
  return uv.x * uv.y;
}

float cross(in vec2 _st, float _size) {
  float a = box(_st, vec2(_size, _size / 4.)) + box(_st, vec2(_size / 4., _size));
  return clamp(a, 0., 1.);
}

void seeCoordinatesMoving(inout vec2 st, inout vec4 canvas) {
  // To move the cross we move the space
  vec2 translate = vec2(cos(u_time), sin(u_time));
  st += translate * 0.25;

  // Show the coordinates of the space on the background
  canvas = vec4(st.x, st.y, 0.0, 1.);

  // Add the shape on the foreground
  canvas += vec4(vec3(cross(st, 0.25)), 1.);
}

void seeCoordinatesStill(inout vec2 st, inout vec4 canvas) {
  vec3 color = vec3(0.0);
  // copy coord for use with cross
  vec2 uv = st;

  vec2 translate = vec2(cos(u_time), sin(u_time));
  uv += translate * .25;

  // Show the coordinates of the space on the background
  color = vec3(st.x, st.y, 0.0);

  // Add the shape on the foreground
  color += vec3(cross(uv, 0.25));

  paint(canvas, color);
}

void fourCorners(inout vec2 st, inout vec4 canvas, bool smoothly) {
  vec3 color = vec3(0.0);

  float txScale = .7;
  // copy coord for use with cross
  vec2 uv = st;

  // change ref to bottom left and also starts us off in the right stop
  uv += .5 * txScale;

  // * jump in a square
  vec2 goTL = vec2(0, 1);
  vec2 goTR = vec2(1, 1);
  vec2 goBR = vec2(1, 0);
  vec2 goBL = vec2(0, 0);

  float stepCount = 4.;
  float modTime = mod(u_time, stepCount);

  // * slide in a square
  if (smoothly) {
    float slide = smoothstep(0., 1., fract(modTime));

    goTL = vec2(0., slide);
    goTR = vec2(slide, 1.);
    goBR = vec2(1., 1. - slide);
    goBL = vec2(1. - slide, 0.);
  }

  vec2 tx;
  if (modTime < 1.)
    tx = goTL;
  else if (modTime < 2.)
    tx = goTR;
  else if (modTime < 3.)
    tx = goBR;
  else
    tx = goBL;
  uv += tx * -txScale;

  // Show the coordinates of the space on the background
  // paint(canvas, vec4(st.x, st.y,0.5,.5));

  // Add the shape on the foreground
  float crosshair = (box(st, vec2(0.1)) - box(st, vec2(0.08)) + cross(st, 0.05));
  paint(canvas, vec3(0.051, 0.7176, 0.7176) * crosshair, crosshair);

  float cross = min(cross(uv, 0.25), 1.);
  // cross = clamp(cross, 0., 1.);
  paint(canvas, vec3(0.8941, 0.4902, 0.0235) * cross, cross);

}

void fourCorners(inout vec2 st, inout vec4 canvas) {
  fourCorners(st, canvas, true);
}

void displayInQuadrants(inout vec2 st, inout vec4 canvas) {
  // Create quadrant coordinates by scaling and translating
  vec2 q2 = st * 2.0 - vec2(.0, 1.0);       // Quadrant II (top-left)
  vec2 q3 = st * 2.0 - vec2(0.0, 0.0);      // Quadrant III (bottom-left)
  vec2 q1 = st * 2.0 - vec2(1.0, 1.0);      // Quadrant I (top-right)
  vec2 q4 = st * 2.0 - vec2(1.0, 0.0);      // Quadrant IV (bottom-right)

  // fourCorners in Quadrant II
  fourCorners(q2, canvas, false);

  // Place each animation in different quadrants
  animateTriangle(q1, canvas, u_time);
  animateSquare(q3, canvas, u_time);
  animateChaos(q4, canvas, u_time);
}

void displayOverlap(inout vec2 st, inout vec4 canvas) {
  animateTriangle(st, canvas, u_time);
  animateSquare(st, canvas, u_time);
  animateChaos(st, canvas, u_time);
}

void crazyTime(inout vec2 st, inout vec4 canvas) {
  for (int i = 0; i < 10; i++) {
    float scale = 1.;
    vec2 stt = st * scale - vec2(.5 * (scale - 1.));
    animateTriangle(stt, canvas, u_time + float(i) * .05);
  }
  for (int i = 0; i < 4; i++) {
    animateSquare(st, canvas, -u_time * float(i + 1) * .5);
  }
  for (int i = 0; i < 20; i++) {
    animateChaos(st, canvas, u_time + float(i) * .01);
  }
}

void main() {
  vec2 st = normalizeCoordinates(gl_FragCoord.xy, u_resolution);
  st = squareAspectRatio(st, u_resolution);
  vec4 canvas = vec4(0.0, 0.0, 0.0, 0.0);

  // displayInQuadrants(st, canvas);
  // displayOverlap(st, canvas);
  crazyTime(st, canvas);

  gl_FragColor = canvas;
}