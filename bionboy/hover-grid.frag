#ifdef GL_ES
precision mediump float;
#endif

// #define BG_COLOR vec4(0, 0, 0, 1)
#define BG_COLOR vec4(0, 0, 0, 0)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void paint(inout vec4 canvas, vec4 brush, float pct, bool direct) {
  if (pct <= 0.0) {
    return;
  }

  if (direct == true) {
    canvas = brush;
    return;
  }

  pct *= brush.a;

  if (length(canvas) > 0.0) {
    canvas = vec4(mix(canvas.rgb, brush.rgb, pct), 1);
  } else {
    // canvas += vec4(brush.rgb, pct);
  }

  if (canvas == BG_COLOR) {
    // inverse
    // canvas = vec4(1) - brush;
  }
}
void paint(inout vec4 canvas, vec4 brush, float pct) {
  paint(canvas, brush, pct, false);
}
void paint(inout vec4 canvas, vec3 brush, float pct) {
  paint(canvas, vec4(brush, pct), pct, false);
}

// Before Reading

void gridScaled(inout vec2 st, inout vec4 color) {
  float divisionSize = 0.025;
  float lineWidth = 0.0025;
  vec2 mod = vec2(mod(st.x, divisionSize), mod(st.y, divisionSize));
  if (length(mod.x) < lineWidth) {
    paint(color, vec4(1., 0.4, 0.0, 1.0), 1.0, true);
  }
  if (length(mod.y) < lineWidth) {
    paint(color, vec4(1., 0.2, 0.0, 1.0), 1.0, true);
  }

  // Center lines
  const int coordsLen = 5;
  vec2 coords[coordsLen];
  coords[0] = vec2(.5);
  coords[1] = vec2(.25);
  coords[2] = vec2(.25, .75);
  coords[3] = vec2(.75, .25);
  coords[4] = vec2(.75);

  for (int i = 0; i < coordsLen; i++) {
    vec2 coord = coords[i];
    if ((length(st.x - coord.x) < lineWidth) ||
      (length(st.y - coord.y) < lineWidth)) {
      paint(color, vec4(1., .15, 0., 0.5), 1.0, true);
    }
  }
}

void gridAbsolute(inout vec2 st, inout vec4 color) {
  float x = gl_FragCoord.x, y = gl_FragCoord.y;
  float divisionSize = 50.;
  float lineWidth = 3.;
  if (mod(x, divisionSize) < lineWidth)
    paint(color, vec4(0.5, 0.5, 0.7, 1.), 1.0, true);
  if (mod(y, divisionSize) < lineWidth)
    paint(color, vec4(0.5, 0.7, 0.5, 1.), 1.0, true);
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

float timeWiggle(in float speed, in float amplitude, in float offset) {
  return (sin(u_time * speed + offset) + 1.0) / 2.0 * amplitude;
}

float timeWiggle(in float speed, in float amplitude) {
  return timeWiggle(speed, amplitude, 0.0);
}

void hoverGrid(inout vec2 st, inout vec2 mouse, inout vec4 canvas, int variant) {
  vec4 c = vec4(1, .5, 0, 1);

  if (variant == 0) {
    gridScaled(st, canvas);
  } else if (variant == 1) {
    gridAbsolute(st, canvas);
  } else {
    return;
  }

  vec2 size = vec2(.5 + timeWiggle(4., .01));
  vec2 offset = mouse - size.x / 2.;
  rectangleResuable(st, canvas, size, offset, .2, vec4(c.rrb, .8));
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec2 mouse = u_mouse / u_resolution;
  vec4 canvas = BG_COLOR;

  if (sin(u_time * .25) <= 0.) {
    hoverGrid(st, mouse, canvas, 0);
  } else {
    hoverGrid(st, mouse, canvas, 1);
  }

  gl_FragColor = canvas;
}