#ifndef ANIMATE_STEPS_GLSL
#define ANIMATE_STEPS_GLSL

#include "paint.glsl"

#define ANIMATE_STEPS_ARRAY_SIZE 10

float _box(in vec2 _st, in vec2 _size) {
  _size = vec2(0.5) - _size * 0.5;
  vec2 uv = smoothstep(_size, _size + vec2(0.001), _st);
  uv *= smoothstep(_size, _size + vec2(0.001), vec2(1.0) - _st);
  return uv.x * uv.y;
}

float _cross(in vec2 _st, float _size) {
  float thickness = 20.;
  float a = _box(_st, vec2(_size, _size / thickness)) + _box(_st, vec2(_size / thickness, _size));
  return clamp(a, 0., 1.);
}

vec2 animateCoordsViaSteps(inout vec2 st, inout vec4 canvas, vec4 steps[ANIMATE_STEPS_ARRAY_SIZE], int stepCount, float time, vec4 brush) {
  vec3 color = vec3(0.0);

  float txScale = .7;
  // copy coord for use with cross
  vec2 uv = st;

  // change ref to bottom left and also starts us off in the right stop
  uv += .5 * txScale;

  float modTime = mod(time, float(stepCount));
  float slide = smoothstep(0., 1., fract(modTime));

  vec4 now, prev;
  for (int i = 1; i < ANIMATE_STEPS_ARRAY_SIZE; i++) {
    if (modTime < float(i + 0)) {
      now = steps[i];
      prev = steps[i - 1];

      // calculate transition between position, angle, and scale
      vec4 tx = prev + slide * (now - prev);

      // move coords to origin
      uv -= vec2(0.5);

      // translate
      uv += tx.xy * -txScale;

      // rotate
      float angle = tx.z;
      mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      uv *= rotationMatrix;

      // scale
      float scale = 1. / tx.w;
      mat2 scaleMat = mat2(scale, 0., 0., scale);
      uv *= scaleMat;

      // put coords back to center
      uv += vec2(0.5);

      break;
    }
  }

  return uv;
}

/* positions and angle override */
vec2 animateCoordsViaSteps(inout vec2 st, inout vec4 canvas, vec3 steps[ANIMATE_STEPS_ARRAY_SIZE], int stepCount, float time, vec4 brush) {
  // TODO(25-03-16): is there a better way to convert to vec3? I did this while having no internet access
  vec4 stepsMod[ANIMATE_STEPS_ARRAY_SIZE];
  for (int i = 0; i < ANIMATE_STEPS_ARRAY_SIZE; i++) {
    stepsMod[i] = vec4(steps[i].x, steps[i].y, steps[i].z, 1);
  }
  return animateCoordsViaSteps(st, canvas, stepsMod, stepCount, time, brush);
}

/* positions only override */
vec2 animateCoordsViaSteps(inout vec2 st, inout vec4 canvas, vec2 steps[ANIMATE_STEPS_ARRAY_SIZE], int stepCount, float time, vec4 brush) {
  // TODO(25-03-16): is there a better way to convert to vec3? I did this while having no internet access
  vec4 stepsMod[ANIMATE_STEPS_ARRAY_SIZE];
  for (int i = 0; i < ANIMATE_STEPS_ARRAY_SIZE; i++) {
    stepsMod[i] = vec4(steps[i].x, steps[i].y, 0, 1.);
  }
  return animateCoordsViaSteps(st, canvas, stepsMod, stepCount, time, brush);
}

void animateSteps(inout vec2 st, inout vec4 canvas, vec2 steps[ANIMATE_STEPS_ARRAY_SIZE], int stepCount, float time, vec4 brush) {
  vec2 uv = animateCoordsViaSteps(st, canvas, steps, stepCount, time, brush);
  float c = min(_cross(uv, 0.25), 1.);
  paint(canvas, brush * c, c);
}

void animateSteps(inout vec2 st, inout vec4 canvas, vec2 steps[ANIMATE_STEPS_ARRAY_SIZE], int stepCount, float time) {
  vec4 brush = vec4(0.8941, 0.4902, 0.0235, 1.0);
  animateSteps(st, canvas, steps, stepCount, time, brush);
}

void animateTriangle(inout vec2 st, inout vec4 canvas, float time) {
  vec2 steps[ANIMATE_STEPS_ARRAY_SIZE];
  steps[0] = vec2(0, 0);
  steps[1] = vec2(.5, 1);
  steps[2] = vec2(1, 0);
  steps[3] = steps[0];
  animateSteps(st, canvas, steps, 3, time, vec4(0.6627, 0.8941, 0.0235, 1.0));
}

void animateSquare(inout vec2 st, inout vec4 canvas, float time) {
  vec2 steps[ANIMATE_STEPS_ARRAY_SIZE];
  steps[0] = vec2(0, 0);
  steps[1] = vec2(0, 1);
  steps[2] = vec2(1, 1);
  steps[3] = vec2(1, 0);
  steps[4] = vec2(0, 0);
  animateSteps(st, canvas, steps, 4, time, vec4(1.0, 0.5647, 0.4431, 1.0));
}

void animateChaos(inout vec2 st, inout vec4 canvas, float time) {
  vec2 steps[ANIMATE_STEPS_ARRAY_SIZE];
  for (int i = 0; i < ANIMATE_STEPS_ARRAY_SIZE - 1; i++) {
    steps[i] = vec2((sin(time * float(i)) + 1.) / 2., (cos(time * float(i)) + 1.) / 2.);
  }
  steps[ANIMATE_STEPS_ARRAY_SIZE - 1] = vec2(0, 0);
  // animateSteps(st, canvas, steps, ANIMATE_STEPS_ARRAY_SIZE, time);
  animateSteps(st, canvas, steps, ANIMATE_STEPS_ARRAY_SIZE, time, vec4(vec3(sin(time * 5.) * .5), 1.0));
}

#endif // ANIMATE_STEPS_GLSL