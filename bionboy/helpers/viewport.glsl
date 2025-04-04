vec2 normalizeCoordinates(in vec2 xy, in vec2 resolution) {
  return xy / resolution;
}

vec2 normalCoordinates(in vec2 resolution) {
  return gl_FragCoord.xy / resolution;
}

vec2 squareAspectRatio(in vec2 st, in vec2 resolution) {
  float ratio = min(resolution.x, resolution.y);
  st.x *= resolution.x / ratio;
  st.y *= resolution.y / ratio;
  return st;
}

vec2 squareAspectAndNormalize(in vec2 st, in vec2 resolution) {
  st = normalizeCoordinates(st, resolution);
  return squareAspectRatio(st, resolution);
}
