#ifndef ANIMATE_STEPS_GLSL
#define ANIMATE_STEPS_GLSL

#include "paint.glsl"

#define MAX_ANIMATE_STEPS 10

float boxx(in vec2 _st, in vec2 _size) {
  _size = vec2(0.5) - _size * 0.5;
  vec2 uv = smoothstep(_size, _size + vec2(0.001), _st);
  uv *= smoothstep(_size, _size + vec2(0.001), vec2(1.0) - _st);
  return uv.x * uv.y;
}

float cursor(in vec2 _st, float _size) {
  float thickness = 20.;
  float a = boxx(_st, vec2(_size, _size / thickness)) + boxx(_st, vec2(_size / thickness, _size));
  return clamp(a, 0., 1.);
}

void animateSteps(inout vec2 st, inout vec4 canvas, vec2 steps[MAX_ANIMATE_STEPS], int stepCount, float time, vec4 brush) {
  vec3 color = vec3(0.0);

  float txScale = .7;
  // copy coord for use with cross
  vec2 uv = st;

  // change ref to bottom left and also starts us off in the right stop
  uv += .5 * txScale;

  float modTime = mod(time, float(stepCount));
  float slide = smoothstep(0., 1., fract(modTime));

  for (int i = 0; i < MAX_ANIMATE_STEPS; i++) {
    if (modTime < float(i + 1)) {
      vec2 now = steps[i];
      vec2 prev = i > 0 ? steps[i - 1] : vec2(0.0);

      vec2 txBetween = vec2(prev.x + slide * (now.x - prev.x), prev.y + slide * (now.y - prev.y));
      uv += txBetween * -txScale;
      break;
    }
  }

  float cross = min(cursor(uv, 0.25), 1.);
  paint(canvas, brush * cross, cross);
}

void animateSteps(inout vec2 st, inout vec4 canvas, vec2 steps[MAX_ANIMATE_STEPS], int stepCount, float time) {
  vec4 brush = vec4(0.8941, 0.4902, 0.0235, 1.0);
  animateSteps(st, canvas, steps, stepCount, time, brush);
}

void animateTriangle(inout vec2 st, inout vec4 canvas, float time) {
  vec2 steps[MAX_ANIMATE_STEPS];
  steps[0] = vec2(.5, 1);
  steps[1] = vec2(1, 0);
  steps[2] = vec2(0, 0);
  animateSteps(st, canvas, steps, 3, time, vec4(0.6627, 0.8941, 0.0235, 1.0));
}

void animateSquare(inout vec2 st, inout vec4 canvas, float time) {
  vec2 steps[MAX_ANIMATE_STEPS];
  steps[0] = vec2(0, 1);
  steps[1] = vec2(1, 1);
  steps[2] = vec2(1, 0);
  steps[3] = vec2(0, 0);
  animateSteps(st, canvas, steps, 4, time, vec4(1.0, 0.5647, 0.4431, 1.0));

}

void animateChaos(inout vec2 st, inout vec4 canvas, float time) {
  vec2 steps[MAX_ANIMATE_STEPS];
  for (int i = 0; i < MAX_ANIMATE_STEPS - 1; i++) {
    steps[i] = vec2((sin(time * float(i)) + 1.) / 2., (cos(time * float(i)) + 1.) / 2.);
  }
  steps[MAX_ANIMATE_STEPS - 1] = vec2(0, 0);
  // animateSteps(st, canvas, steps, MAX_ANIMATE_STEPS, time);
  animateSteps(st, canvas, steps, MAX_ANIMATE_STEPS, time, vec4(vec3(sin(time * 5.) * .5), 1.0));
}

#endif // ANIMATE_STEPS_GLSL