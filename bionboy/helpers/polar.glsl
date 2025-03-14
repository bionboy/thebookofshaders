#define PI 3.14159265359
#define TAU 6.28318530718

struct Polar {
  float r;
  float theta;
  vec2 center;
};

Polar polarFromCartesian(vec2 st) {
  vec2 center = vec2(0.5) - st;
  float radius = length(center) * 2.0;
  float theta = atan(center.y, center.x);

  return Polar(radius, theta, center);
}

void normalizeTheta(inout Polar p) {
  p.theta /= TAU;
  p.theta += .5;
}