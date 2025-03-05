/*
  Based on an exercise from https://thebookofshaders.com/06/
*/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TAU 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

struct Polar {
  float r;
  float theta;
  vec2 center;
};

const float BORDER_RADIUS = 0.49;
const float BORDER_WIDTH = 0.02;
const float COLOR_DIVISIONS = 6.;

Polar polarFromCartesian(vec2 st) {
  vec2 center = vec2(0.5) - st;
  float radius = length(center) * 2.0;
  float theta = atan(center.y, center.x) + u_time * 1.3;

  return Polar(radius, theta, center);
}

void normalizeTheta(inout Polar p) {
  p.theta /= TAU;
  p.theta += .5;
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(in vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  vec2 mouse = u_mouse / u_resolution;
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec3 color = vec3(0.0);

  Polar polar = polarFromCartesian(st);

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
