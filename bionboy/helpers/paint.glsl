#ifndef PAINT_GLSL
#define PAINT_GLSL

/*
  PAINT
*/

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
    canvas += vec4(brush.rgb, pct);
  }
}

void paint(inout vec4 canvas, vec4 brush, float pct) {
  paint(canvas, brush, pct, false);
}
void paint(inout vec4 canvas, vec4 brush) {
  paint(canvas, brush, 1.0, false);
}

void paint(inout vec4 canvas, vec3 brush, float pct) {
  paint(canvas, vec4(brush, pct), pct, false);
}
void paint(inout vec4 canvas, vec3 brush) {
  paint(canvas, vec4(brush, 1.0), 1.0, false);
}

/*
  PLOT
*/

float plot(vec2 st, float pct, float d) {
  return smoothstep(pct - d, pct, st.y) - smoothstep(pct, pct + d, st.y);
}
float plot(vec2 st, float pct) {
  return plot(st, pct, 0.005);
}

#endif // PAINT_GLSL
