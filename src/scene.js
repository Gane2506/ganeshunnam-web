// WebGL stage: one GPU-animated point cloud that morphs between a noisy sphere (hero),
// an exploded cloud (about), a torus knot (work) and an orbit ring (contact).
// The CPU only updates a handful of uniforms per frame. All per-particle motion runs in the vertex shader.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LinearSRGBColorSpace,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Sphere,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import noise from './shaders/noise.glsl?raw';
import vertexShader from './shaders/particles.vert?raw';
import fragmentShader from './shaders/particles.frag?raw';

const MAX_DPR = 2;

const toColor = (hex) => new Color().setStyle(hex, LinearSRGBColorSpace);

function buildGeometry(count) {
  const sphere = new Float32Array(count * 3);
  const knot = new Float32Array(count * 3);
  const ring = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Fibonacci sphere: even distribution, no clumping at the poles
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const radius = 1.55 + (Math.random() - 0.5) * 0.08;
    sphere[i3] = Math.cos(theta) * r * radius;
    sphere[i3 + 1] = y * radius;
    sphere[i3 + 2] = Math.sin(theta) * r * radius;

    // (2,3) torus knot with a thin tube of jitter
    const t = (i / count) * Math.PI * 2;
    const p = 2;
    const q = 3;
    const kr = 1.1 + 0.45 * Math.cos(q * t);
    const tube = 0.16;
    knot[i3] = kr * Math.cos(p * t) + (Math.random() - 0.5) * tube;
    knot[i3 + 1] = kr * Math.sin(p * t) + (Math.random() - 0.5) * tube;
    knot[i3 + 2] = 0.45 * Math.sin(q * t) * 1.6 + (Math.random() - 0.5) * tube;

    // wide, slightly tilted orbit ring
    const a = Math.random() * Math.PI * 2;
    const rr = 2.4 + Math.pow(Math.random(), 2) * 1.6;
    ring[i3] = Math.cos(a) * rr;
    ring[i3 + 1] = (Math.random() - 0.5) * 0.08;
    ring[i3 + 2] = Math.sin(a) * rr;

    // random unit vector for the explosion direction
    const u = Math.random() * 2 - 1;
    const phi = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const i4 = i * 4;
    rand[i4] = Math.cos(phi) * s;
    rand[i4 + 1] = u;
    rand[i4 + 2] = Math.sin(phi) * s;
    rand[i4 + 3] = Math.random();
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(sphere, 3));
  geometry.setAttribute('aKnot', new BufferAttribute(knot, 3));
  geometry.setAttribute('aRing', new BufferAttribute(ring, 3));
  geometry.setAttribute('aRand', new BufferAttribute(rand, 4));
  // Positions are displaced on the GPU, so give frustum culling a sphere that contains the
  // widest exploded state instead of the rest pose that computeBoundingSphere() would measure.
  geometry.boundingSphere = new Sphere(new Vector3(), 8);
  return geometry;
}

export function createScene(canvas, { particles = 40000, state: stateIn = {} } = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0, 0, 7);

  const geometry = buildGeometry(particles);
  const material = new ShaderMaterial({
    vertexShader: vertexShader.replace('#include <noise>', noise),
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uExplode: { value: 0 },
      uMorph: { value: 0 },
      uRing: { value: 0 },
      uSize: { value: 26 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uMouse: { value: new Vector3(99, 99, 0) },
      uMouseForce: { value: 0 },
      uColorA: { value: toColor('#c6f432') },
      uColorB: { value: toColor('#2de2a6') },
    },
  });

  const points = new Points(geometry, material);
  points.frustumCulled = true;
  scene.add(points);

  // Scroll timelines tween these plain numbers; the frame loop copies them into uniforms.
  // The caller may pass its own object so timelines built before this module loaded keep driving it.
  const state = Object.assign(
    stateIn,
    { explode: 0, morph: 0, ring: 0, x: 0, y: 0, scale: 1, rotX: 0.2, camZ: 7, opacity: 1 },
    { ...stateIn },
  );

  const pointer = new Vector2(0, 0);
  const pointerSmooth = new Vector2(0, 0);
  const ndc = new Vector3();
  const dir = new Vector3();
  let mouseActive = 0;
  let running = true;
  let disposed = false;

  function setPointer(nx, ny) {
    pointer.set(nx, ny);
    mouseActive = 1;
  }

  // Returns [current, target] colour pairs for the caller to tween (keeps this module animation-agnostic).
  // Hex values are taken as-is (no sRGB→linear) because the shader writes them straight to the screen.
  function setPalette(a, b) {
    return [
      [material.uniforms.uColorA.value, toColor(a)],
      [material.uniforms.uColorB.value, toColor(b)],
    ];
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the object framed on portrait phones
    camera.fov = camera.aspect < 0.8 ? 62 : 45;
    camera.updateProjectionMatrix();
  }

  function render(timeSeconds) {
    if (!running || disposed) return;
    const u = material.uniforms;
    u.uTime.value = timeSeconds;
    u.uExplode.value = state.explode;
    u.uMorph.value = state.morph;
    u.uRing.value = state.ring;

    pointerSmooth.lerp(pointer, 0.06);
    points.position.set(state.x + pointerSmooth.x * 0.25, state.y + pointerSmooth.y * 0.18, 0);
    points.scale.setScalar(state.scale);
    points.rotation.x = state.rotX + pointerSmooth.y * -0.15;
    points.rotation.y = timeSeconds * 0.06 + pointerSmooth.x * 0.35;
    camera.position.z = state.camZ;
    canvas.style.opacity = state.opacity;

    // project the cursor onto the z = 0 plane for the repel force
    ndc.set(pointerSmooth.x, pointerSmooth.y, 0.5).unproject(camera);
    dir.copy(ndc).sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    u.uMouse.value.copy(camera.position).addScaledVector(dir, dist);
    u.uMouseForce.value += (mouseActive - u.uMouseForce.value) * 0.05;

    renderer.render(scene, camera);
  }

  function onVisibility() {
    running = !document.hidden;
  }
  document.addEventListener('visibilitychange', onVisibility);

  function dispose() {
    if (disposed) return;
    disposed = true;
    document.removeEventListener('visibilitychange', onVisibility);
    scene.remove(points);
    geometry.dispose();
    material.dispose();
    renderer.renderLists.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  resize();
  return {
    state,
    render,
    resize,
    setPointer,
    setPalette,
    pause: () => (running = false),
    resume: () => (running = !document.hidden),
    dispose,
  };
}
