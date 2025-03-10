/*
  2025-03-10
  Author: https://github.com/bionboy
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void paint(inout vec4 canvas, vec4 brush, float pct) {
  if (pct <= 0.0) {
    return;
  }

  pct *= brush.a;

  if (length(canvas) > 0.0) {
    canvas = vec4(mix(canvas.rgb, brush.rgb, pct), 1);
  } else {
    canvas += vec4(brush.rgb, pct);
  }
}
void paint(inout vec4 canvas, vec3 brush, float pct) {
  paint(canvas, vec4(brush, pct), pct);
}

/*
  Circle function created Before Reading this section in TBOS
*/
void circleBR(in vec2 st, inout vec4 canvas, vec2 offset, float radius) {
  float d = distance(st, offset);
  float fromCenter = d / radius;
  // vec4 brush = vec4(0.2275, 0.1882, 0.7882, 1.0);
  vec4 brush = vec4(vec3(0.5843, 0.2745, 0.502), pow(fromCenter, 4.));

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
  vec4 brush = vec4(vec3(0.5843, 0.2745, 0.502), pow(fromCenter, 4.));
  // vec4 brush = vec4(vec3(0.5843, 0.2745, 0.502), .1);

  // canvas += brush * step(d, radius);
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
  vec4 brush = vec4(vec3(0.5843, 0.2745, 0.502), 1.);

  canvas += brush * radius / d;
  // canvas += brush * d / radius;

  // TODO: make it have the line that lens flares have too
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec4 canvas = vec4(0.0, 0.0, 1.0, 1.0);
  // vec4 canvas = vec4(0.0118, 0.1765, 0.0824, 0.813);

  bubble(st, canvas, vec2(.125, .825), .1);
  bubble(st, canvas, vec2(.125, .825), .1);
  bubble(st, canvas, vec2(.2, .75), .05);

  circleAR(st, canvas, vec2(.8, .8), .1);
  lensFlare(st, canvas, vec2(.80, .25), .3);

  // see `meta-balls.frag` for the metaBalls function

  gl_FragColor = canvas;
}