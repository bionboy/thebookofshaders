#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.y / u_resolution.y;
  vec3 color = vec3(0.0);
  float d, d1, d2, d3;

  // Remap the space to -1. to 1.
  st = st * 2. - 1.;
  // Mirror the space in all quadrants
  st = abs(st);

  // float point = .3;
  vec2 point = u_mouse / u_resolution;
  // vec2 point = (u_mouse / u_resolution) * 2. - 1.;
  // point.x = clamp(point.x, 0., 1.);
  // point.y = clamp(point.y, 0., 1.);

  // Make the distance field
  // ? `length(st - point)` is equiv to `distance(st, point)`
  d1 = length(st - point);
  d2 = length(min(st - point, 0.));
  d3 = length(max(st - point, 0.));

  d = d1;
  // d = d2;
  // d = d3;

  // Visualize the distance field
  gl_FragColor = vec4(vec3(fract(d * 10.0)), 1.0);
  // sharper lines
  // gl_FragColor = vec4(vec3(step(0.5, fract(d * 20.0))), 1.0);

  // Drawing with the distance field
  // gl_FragColor = vec4(vec3( step(.3,d) ),1.0);
  // gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);
  // gl_FragColor = vec4(vec3( smoothstep(.3,.4,d)* smoothstep(.6,.5,d)) ,1.0);

  // trippy bro
  // gl_FragColor = vec4(vec3(fract(d1 * 3.0), fract(d2 * 4.0), fract(d3 * 5.0)), 1.0);
}