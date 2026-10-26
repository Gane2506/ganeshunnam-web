uniform float uTime;
uniform float uExplode;   // 0 = solid shape, 1 = scattered cloud
uniform float uMorph;     // 0 = sphere, 1 = torus knot
uniform float uRing;      // 0 = current shape, 1 = flat orbit ring
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uMouse;      // cursor in world space
uniform float uMouseForce;
uniform vec3 uColorA;
uniform vec3 uColorB;

attribute vec3 aKnot;
attribute vec3 aRing;
attribute vec4 aRand;     // xyz: unit scatter direction, w: 0..1 seed

varying vec3 vColor;
varying float vAlpha;

#include <noise>

mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

void main() {
  vec3 p = mix(position, aKnot, smoothstep(0.0, 1.0, uMorph));
  p = mix(p, aRing, smoothstep(0.0, 1.0, uRing));

  float n = snoise(p * 0.9 + vec3(0.0, uTime * 0.12, uTime * 0.05));
  p += normalize(p + 1e-4) * n * 0.22 * (1.0 - uExplode * 0.6);

  // explosion: each particle flies along its own direction, swirling as it goes
  float e = uExplode * uExplode * (3.0 - 2.0 * uExplode);
  p += aRand.xyz * e * (2.2 + aRand.w * 4.0);
  p.xz *= rot(e * (0.6 + aRand.w) + uTime * 0.03);

  vec4 world = modelMatrix * vec4(p, 1.0);
  vec3 d = world.xyz - uMouse;
  float f = smoothstep(1.6, 0.0, length(d)) * uMouseForce;
  world.xyz += normalize(d + 1e-4) * f * 0.7;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.45 + aRand.w * 0.9) * (1.0 + f * 1.5) / -mv.z;

  vColor = mix(uColorA, uColorB, clamp(n * 0.5 + 0.5 + (aRand.w - 0.5) * 0.4, 0.0, 1.0));
  vAlpha = (0.55 + 0.45 * aRand.w) * (1.0 - e * 0.35);
}
