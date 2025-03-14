/*
  2025-03-14
  Author: https://github.com/bionboy
*/

#ifdef GL_ES
precision mediump float;
#endif

#include "helpers/viewport.glsl"

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
  vec2 st = normalizeCoordinates(gl_FragCoord.xy, u_resolution);
  st = squareAspectRatio(st, u_resolution);
  vec4 canvas = vec4(0.0, 0.0, 0.0, 1.0);

  gl_FragColor = canvas;
}