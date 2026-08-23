/**
 * WebGL2 shader sources for the black-hole background.
 *
 * The fragment shader traces each screen ray through a Schwarzschild-style
 * spacetime approximation. The disk is a physical y=0 plane, so gravitational
 * lensing can make its far side appear above and below the event horizon.
 */

export const BLACKHOLE_VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

export const BLACKHOLE_FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uRes;

out vec4 fragColor;

// Geometrised units: the Schwarzschild radius is 1.0.
const float HORIZON = 1.0;
const float PHOTON_SPHERE = 1.5;
const float DISK_IN = 1.72;
const float DISK_OUT = 5.4;
const float FOV = 1.62;
const int STEPS = 240;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(cell);
  float b = hash(cell + vec2(1.0, 0.0));
  float c = hash(cell + vec2(0.0, 1.0));
  float d = hash(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 starLayer(vec3 direction, vec2 scale, float threshold, vec3 tint) {
  vec2 sphere = vec2(
    atan(direction.z, direction.x),
    asin(clamp(direction.y, -1.0, 1.0))
  );
  vec2 grid = sphere * scale;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float seed = hash(cell);
  float star = step(threshold, seed) * smoothstep(0.22, 0.0, length(local));
  float brightness = 0.18 + 1.55 * hash(cell * 7.13);
  return tint * star * brightness;
}

vec3 background(vec3 direction) {
  vec2 sphere = vec2(
    atan(direction.z, direction.x),
    asin(clamp(direction.y, -1.0, 1.0))
  );
  vec3 stars = starLayer(direction, vec2(34.0, 18.0), 0.965, vec3(1.0));
  stars += starLayer(direction, vec2(75.0, 39.0), 0.985, vec3(0.58, 0.72, 1.0)) * 0.55;
  stars += starLayer(direction, vec2(13.0, 7.0), 0.992, vec3(1.0, 0.42, 0.16)) * 0.35;

  // A faint, irregular galactic band keeps the background from looking empty.
  float galacticLatitude = sphere.y + 0.18 * sin(sphere.x * 1.7);
  float galaxy = exp(-pow(galacticLatitude * 5.0, 2.0));
  vec3 nebula = vec3(0.028, 0.018, 0.055) * galaxy;
  nebula += vec3(0.012, 0.022, 0.05) * noise(sphere * 4.0) * galaxy;
  return stars + nebula;
}

vec3 diskEmission(vec3 hit, vec3 rayDirection, float time) {
  float radius = length(hit.xz);
  float radius01 = clamp((radius - DISK_IN) / (DISK_OUT - DISK_IN), 0.0, 1.0);
  float temperature = 1.0 - radius01;
  float angle = atan(hit.z, hit.x);

  // Differential rotation: inner material completes an orbit faster.
  float angularSpeed = 0.9 / pow(max(radius, DISK_IN), 1.5);
  float flowAngle = angle - time * angularSpeed;
  float turbulence = noise(vec2(flowAngle * 3.2, radius * 2.6));
  turbulence = mix(0.28, 1.0, pow(turbulence, 0.72));

  // Hot blue-white inner disk, cooler orange outer disk.
  vec3 hot = vec3(0.76, 0.88, 1.18);
  vec3 cool = vec3(1.0, 0.25, 0.035);
  vec3 colour = mix(cool, hot, pow(temperature, 1.35));

  // Keplerian orbital velocity and relativistic Doppler beaming.
  vec3 orbitalDirection = normalize(cross(vec3(0.0, 1.0, 0.0), hit));
  float beta = min(0.68, sqrt(0.5 / radius));
  float gamma = inversesqrt(max(1.0 - beta * beta, 0.05));
  float lineOfSight = dot(orbitalDirection, -rayDirection);
  float doppler = 1.0 / max(gamma * (1.0 - beta * lineOfSight), 0.08);

  // Gravitational redshift at the emission point.
  float redshift = sqrt(max(1.0 - HORIZON / radius, 0.0));
  float radialFade = smoothstep(DISK_IN, DISK_IN + 0.16, radius)
                   * (1.0 - smoothstep(DISK_OUT - 0.9, DISK_OUT, radius));
  float radialPower = 0.32 + 1.18 * pow(temperature, 0.65);
  float radiance = turbulence * radialPower * radialFade;

  // D^3 is the relativistic specific-intensity beaming approximation.
  return colour * radiance * pow(doppler, 3.0) * (0.3 + 0.7 * redshift);
}

void main() {
  vec2 screen = gl_FragCoord.xy / uRes;
  vec2 ndc = screen * 2.0 - 1.0;
  ndc.x *= uRes.x / uRes.y;

  // Fixed observer angle: the disk remains physically stable while its gas
  // rotates. A small inclination exposes the lensed far side of the disk.
  vec3 camera = vec3(0.0, 2.55, 8.2);
  vec3 forward = normalize(-camera);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, forward);
  vec3 rayDirection = normalize(forward * FOV + right * ndc.x + up * ndc.y);

  vec3 position = camera;
  vec3 velocity = rayDirection;
  vec3 diskLight = vec3(0.0);
  float closestRadius = length(position);
  bool captured = false;

  // The Schwarzschild null-geodesic approximation uses the ray's conserved
  // angular momentum. Unlike a generic force field, radial rays do not bend.
  vec3 angularMomentum = cross(position, velocity);
  float angularMomentum2 = dot(angularMomentum, angularMomentum);

  for (int step = 0; step < STEPS; step++) {
    float radius2 = dot(position, position);
    float radius = sqrt(radius2);
    closestRadius = min(closestRadius, radius);

    if (radius <= HORIZON) {
      captured = true;
      break;
    }

    // Smaller steps near the photon sphere preserve the thin ring and avoid
    // tunnelling through the horizon; larger steps keep distant rays cheap.
    float stepSize = clamp(0.018 * radius, 0.006, 0.075);

    // Integrate through a thin, optically-light disk instead of sampling only
    // an exact plane crossing. This removes aliasing and gives the far side a
    // smooth lensed glow above and below the shadow.
    float diskRadius = length(position.xz);
    if (diskRadius > DISK_IN && diskRadius < DISK_OUT) {
      float outerness = clamp((diskRadius - DISK_IN) / (DISK_OUT - DISK_IN), 0.0, 1.0);
      float thickness = mix(0.025, 0.12, sqrt(outerness));
      float verticalDensity = exp(-pow(position.y / thickness, 2.0));
      diskLight += diskEmission(position, normalize(velocity), uTime)
                 * verticalDensity * stepSize * 1.65;
    }

    // Schwarzschild spatial geodesic: -3 h^2 r / (2 |r|^5).
    float radius5 = radius2 * radius2 * radius;
    vec3 acceleration = -1.5 * angularMomentum2 * position / radius5;
    velocity += acceleration * stepSize;
    position += velocity * stepSize;
  }

  vec3 colour = diskLight;
  if (!captured) {
    colour += background(normalize(velocity)) * 0.85;

    // Rays with a closest approach near the photon sphere form the thin ring
    // around the shadow. The disk contributes most of the visible light; this
    // is only the unresolved high-frequency part of that ring.
    float photonRing = exp(-pow((closestRadius - PHOTON_SPHERE) * 7.0, 2.0));
    colour += vec3(1.0, 0.62, 0.25) * photonRing * 0.075;
  }

  // ACES-like tone mapping keeps the hot side detailed instead of clipping it
  // into a flat white strip.
  vec3 mapped = colour * 1.18;
  mapped = (mapped * (2.51 * mapped + 0.03))
         / (mapped * (2.43 * mapped + 0.59) + 0.14);
  colour = clamp(mapped, 0.0, 1.0);
  colour = pow(max(colour, 0.0), vec3(1.0 / 2.2));
  fragColor = vec4(colour, 1.0);
}
`;
