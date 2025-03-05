#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void paint(inout vec4 outColor, vec3 inColor, float pct);
void paint(inout vec4 outColor, vec4 inColor, float pct);

// Before Reading

void gridScaled(inout vec2 st, inout vec4 color) {
  float divisionSize = 0.05;
  float lineWidth = 0.003;
  vec2 mod = vec2(mod(st.x, divisionSize), mod(st.y, divisionSize));
  if (length(mod.x) < lineWidth) {
    paint(color, vec3(1., 0.4, 0.0), 1.0);
  }
  if (length(mod.y) < lineWidth) {
    paint(color, vec3(1., 0.2, 0.0), 1.0);
  }

  // Center lines
  // vec3 centerLineColor = vec3(.7, .3, .7);
  // if (length(st.x - 0.5) < lineWidth) {
  //   paint(color, centerLineColor, 1.0);
  // }
  // if (length(st.y - 0.5) < lineWidth) {
  //   paint(color, centerLineColor, 1.0);
  // }
}

void gridAbsolute(inout vec2 st, inout vec4 color) {
  float x = gl_FragCoord.x, y = gl_FragCoord.y;
  float divisionSize = 50.;
  float lineWidth = 3.;
  if (mod(x, divisionSize) < lineWidth)
    paint(color, vec3(0.5, 0.5, 0.7), 1.0);
  if (mod(y, divisionSize) < lineWidth)
    paint(color, vec3(0.5, 0.7, 0.5), 1.0);
}

void rectangleAbsolute(inout vec2 st, inout vec4 color) {
  float x = gl_FragCoord.x, y = gl_FragCoord.y;
  vec2 offset = vec2(10., 10.);
  vec2 size = vec2(80., 80.);

  if ((offset.x < x && x < offset.x + size.x) &&
    (offset.y < y && y < offset.y + size.y)) {
    paint(color, vec3(1.0, 0.0, 0.0), 1.0);
  }
}

// During Reading

void rectangleCentered(inout vec2 st, inout vec4 color) {
  float size = 0.85;
  float pct = 1.;

  vec2 bl = step(vec2(1. - size), st);
  pct = bl.x * bl.y;

  vec2 tr = step(vec2(1. - size), 1.0 - st);
  pct *= tr.x * tr.y;

  paint(color, vec3(1.0, 0.5, 0.0), pct);
}

void rectangleCenteredSmooth(inout vec2 st, inout vec4 color) {
  float size = 0.80;
  float edgeWidth = 0.05;
  vec2 edge = vec2(1. - size);

  vec2 bl = smoothstep(edge, edge + vec2(edgeWidth), st);
  float pct = bl.x * bl.y;

  vec2 tr = smoothstep(edge, edge + vec2(edgeWidth), 1.0 - st);
  pct *= tr.x * tr.y;

  paint(color, vec3(1.0, 0.7, 0.0), pct);
}

void rectangleCenteredFloor(inout vec2 st, inout vec4 color) {
  float size = 0.70;

  vec2 bl = floor(st + size);
  float pct = bl.x * bl.y;

  vec2 tr = floor(1.0 - st + size);
  pct *= tr.x * tr.y;

  paint(color, vec4(1.0, 1.0, 0.0, .3), pct);
}

void rectangleResuable(in vec2 st, inout vec4 canvas, vec2 size, vec2 offset, float blur, vec4 color) {
  blur = max(blur, 0.000001);

  vec2 start = offset;
  vec2 end = vec2(1. - size - offset);

  vec2 bl = smoothstep(start, start + vec2(blur), st);
  float pct = bl.x * bl.y;

  vec2 tr = smoothstep(end, end + vec2(blur), 1.0 - st);
  pct *= tr.x * tr.y;

  paint(canvas, color, pct);
}

// After Reading

void paint(inout vec4 canvas, vec3 brush, float pct) {
  paint(canvas, vec4(brush, pct), pct);
}

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

float timeWiggle(in float speed, in float amplitude, in float offset) {
  return (sin(u_time * speed + offset) + 1.0) / 2.0 * amplitude;
}

float timeWiggle(in float speed, in float amplitude) {
  return timeWiggle(speed, amplitude, 0.0);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec4 canvas = vec4(0, 0, 0, 1);

  vec4 c = vec4(1, .5, 0, 1);

  gridScaled(st, canvas);
  // gridAbsolute(st, canvas);

  rectangleCentered(st, canvas);
  rectangleAbsolute(st, canvas);
  rectangleCenteredSmooth(st, canvas);
  rectangleCenteredFloor(st, canvas);

  for (int i = 0; i < 40; i++) {
    vec2 offset = vec2(0. + float(i) * .018);
    vec2 size = vec2(.005 + float(i) * .01);
    offset.y += timeWiggle(2., .05, float(i) * .5);
    rectangleResuable(st, canvas, size, offset, 0.05, vec4(c.gbb, 0.1)); // orange
  }

  vec2 size = vec2(.3, .15 + timeWiggle(1., .09));
  vec2 offset = vec2(0.35, .35 + timeWiggle(2., .01));
  rectangleResuable(st, canvas, size, offset, .02, vec4(c.rrb, .8));

  rectangleResuable(st, canvas, vec2(.2), vec2(.15, .65), 0.11, c.rrba); //  yellow shine
  // rectangleResuable(st, canvas, vec2(.2), vec2(.6), .1, c.ggra); // purple

  gl_FragColor = canvas;
}