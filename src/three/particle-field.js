/*
  Ganesh Unnam · persistent particle field (from the design system; runs on the site's three.js version)
  One instance for the whole site. Morphs between targets from shapes.js, retints, switches theme blending.

  const field = new ParticleField({ canvas, theme: 'dark' });
  field.setShape('torusKnot');                  // 1600ms morph, quart in-out, shape's own scatter
  field.setShape('exploded', { scrub: true });  // then field.setProgress(p) from scroll
  field.setTint('#B3A0FF');                     // retint over 1050ms, expo out
  field.setTheme('light');                      // fade 200ms, swap blending and palette, fade back 400ms
  field.setLayout({ x: 0.68, y: 0.5, scale: 1, opacity: 1, distance: 4.2, tilt: 0 }); // scene map values
*/
import * as THREE from 'three';
import { SHAPES, SCATTER } from './shapes.js';

const THEMES = {
  dark: { base: '#F2F0EA', tint: '#C6F432', light: 0 },
  light: { base: '#1A1922', tint: '#4A6600', light: 1 },
};
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutQuart = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);
const MAX_DELAY = 0.18;

const vert = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec4 aRand;           // xyz scatter direction, w delay
  uniform float uProgress, uScatter, uTime, uSize, uPixelRatio, uLight, uBreath, uShadow;
  uniform vec2 uResolution;
  varying float vDepth;
  float quart(float t) { return t < .5 ? 8. * t * t * t * t : 1. - pow(-2. * t + 2., 4.) / 2.; }
  void main() {
    float t = clamp((uProgress - aRand.w) / (1. - ${MAX_DELAY.toFixed(2)}), 0., 1.);
    float e = quart(t);
    vec3 p = mix(aFrom, aTo, e) + aRand.xyz * uScatter * sin(3.14159265 * t) * .6;
    p += uBreath * vec3(sin(uTime * .7 + p.y * 3.1), sin(uTime * .6 + p.z * 2.7), sin(uTime * .8 + p.x * 2.9));
    vec4 world = modelMatrix * vec4(p, 1.);
    vec4 mv = viewMatrix * world;
    vDepth = clamp((world.z / max(.001, length(modelMatrix[0].xyz)) + 1.3) / 2.6, 0., 1.);
    gl_Position = projectionMatrix * mv;
    float near = clamp(4.2 / -mv.z, .4, 1.6);
    float s = uLight > .5 ? mix(1.0, 2.4, vDepth) : mix(1.1, 2.6, vDepth);
    gl_PointSize = s * uSize * near * uPixelRatio;
    if (uShadow > .5) gl_Position.xy += vec2(1.5, -2.) * 2. / uResolution * gl_Position.w * uPixelRatio;
  }`;
const frag = /* glsl */ `
  uniform vec3 uBase, uTint, uShadowColor;
  uniform float uLight, uOpacity, uShadow;
  varying float vDepth;
  void main() {
    float r = length(gl_PointCoord - .5);
    float a = uLight > .5 ? smoothstep(.5, .42, r) : smoothstep(.5, .15, r);
    if (a < .01) discard;
    float k = vDepth * vDepth;
    vec3 c = mix(uBase, uTint, k);
    float alpha = uLight > .5 ? mix(.14, .9, vDepth) : mix(.2, .95, vDepth);
    if (uShadow > .5) { gl_FragColor = vec4(uShadowColor, .08 * a * uOpacity); return; }
    gl_FragColor = vec4(c, alpha * a * uOpacity);
  }`;

export class ParticleField {
  constructor({ canvas, theme = 'dark', count, pixelRatio, preserveDrawingBuffer = false, shadow = true, autoStart = true } = {}) {
    const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
    this.count = count || (coarse ? 14000 : (navigator.hardwareConcurrency || 8) < 6 ? 24000 : 42000);
    this.reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, preserveDrawingBuffer, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(pixelRatio || Math.min(2, window.devicePixelRatio || 1));
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    this.camera.position.set(0, 0, 4.2);

    const n = this.count, g = new THREE.BufferGeometry();
    this.cache = {};
    const start = this.target('sphere');
    const rand = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      let x = Math.random() * 2 - 1, y = Math.random() * 2 - 1, z = Math.random() * 2 - 1; const l = Math.hypot(x, y, z) || 1;
      rand[i * 4] = x / l; rand[i * 4 + 1] = y / l; rand[i * 4 + 2] = z / l; rand[i * 4 + 3] = Math.random() * MAX_DELAY;
    }
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(start), 3)); // bounding only
    g.setAttribute('aFrom', new THREE.BufferAttribute(new Float32Array(start), 3));
    g.setAttribute('aTo', new THREE.BufferAttribute(new Float32Array(start), 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);
    this.geometry = g;

    this.uniforms = {
      uProgress: { value: 1 }, uScatter: { value: 0 }, uTime: { value: 0 }, uSize: { value: 1 }, uPixelRatio: { value: this.renderer.getPixelRatio() },
      uLight: { value: 0 }, uBreath: { value: this.reduced ? 0 : 0.015 }, uShadow: { value: 0 }, uResolution: { value: new THREE.Vector2(1, 1) },
      uBase: { value: new THREE.Color() }, uTint: { value: new THREE.Color() }, uShadowColor: { value: new THREE.Color('#382a14') }, uOpacity: { value: 1 },
    };
    this.material = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: this.uniforms, transparent: true, depthWrite: false, depthTest: false });
    this.points = new THREE.Points(g, this.material);
    this.shadowUniforms = { ...this.uniforms, uShadow: { value: 1 } };
    this.shadowMaterial = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: this.shadowUniforms, transparent: true, depthWrite: false, depthTest: false });
    this.shadowPoints = new THREE.Points(g, this.shadowMaterial);
    this.shadowPoints.renderOrder = -1;
    this.group = new THREE.Group(); this.group.add(this.shadowPoints, this.points); this.scene.add(this.group);
    this.useShadow = shadow && !coarse;

    this.shape = 'sphere';
    this.morph = null; this.tween = {}; this.layout = { x: 0.5, y: 0.5, scale: 1, opacity: 1, distance: 4.2, tilt: 0 };
    this.rot = { y: 0, x: 0.38 }; this.pointer = { x: 0, y: 0, tx: 0, ty: 0 }; this.spin = 0.06;
    this.applyTheme(theme);
    this.resize();
    this._onResize = () => this.resize(); window.addEventListener('resize', this._onResize);
    this._onPointer = (e) => { this.pointer.tx = (e.clientX / innerWidth) * 2 - 1; this.pointer.ty = (e.clientY / innerHeight) * 2 - 1; };
    if (!this.reduced) window.addEventListener('pointermove', this._onPointer, { passive: true });
    this._onVis = () => { if (document.hidden) this.stop(); else if (this._wanted) this.start(); };
    document.addEventListener('visibilitychange', this._onVis);
    this.clock = performance.now();
    if (autoStart) this.start();
  }

  target(name) { if (!this.cache[name]) this.cache[name] = SHAPES[name](this.count); return this.cache[name]; }

  /* Copy where every point is now into aFrom, so a new morph starts from the current state. */
  freeze() {
    const from = this.geometry.attributes.aFrom.array, to = this.geometry.attributes.aTo.array, rand = this.geometry.attributes.aRand.array, P = this.uniforms.uProgress.value;
    for (let i = 0; i < this.count; i++) {
      const t = Math.min(1, Math.max(0, (P - rand[i * 4 + 3]) / (1 - MAX_DELAY))), e = easeInOutQuart(t);
      for (let j = 0; j < 3; j++) { const k = i * 3 + j; from[k] = from[k] + (to[k] - from[k]) * e; }
    }
  }

  setShape(name, { duration = 1600, scatter, scrub = false } = {}) {
    if (!SHAPES[name]) throw new Error('Unknown shape ' + name);
    this.freeze();
    this.geometry.attributes.aTo.array.set(this.target(name));
    this.geometry.attributes.aFrom.needsUpdate = true; this.geometry.attributes.aTo.needsUpdate = true;
    this.shape = name;
    this.uniforms.uScatter.value = scatter ?? SCATTER[name] ?? 0.3;
    this.uniforms.uProgress.value = 0;
    this.morph = scrub ? null : { t0: this.now(), d: this.reduced ? 0 : duration };
    if (this.reduced && !scrub) this.uniforms.uProgress.value = 1;
    this.requestRender();
  }
  /* Scroll-scrubbed progress for the pinned about section (0..1). */
  setProgress(p) { this.morph = null; this.uniforms.uProgress.value = Math.min(1, Math.max(0, p)); this.requestRender(); }

  tweenColor(key, hex, d) { const u = this.uniforms[key].value, from = u.clone(), to = new THREE.Color(hex); this.tween[key] = { from, to, t0: this.now(), d: this.reduced ? 0 : d }; this.requestRender(); }
  setTint(hex, d = 1050) { this.tweenColor('uTint', hex, d); }
  applyTheme(name) {
    const t = THEMES[name] || THEMES.dark; this.theme = name;
    this.uniforms.uLight.value = t.light; this.uniforms.uBase.value.set(t.base); this.uniforms.uTint.value.set(t.tint);
    this.material.blending = t.light ? THREE.NormalBlending : THREE.AdditiveBlending; this.material.needsUpdate = true;
    this.shadowPoints.visible = !!t.light && this.useShadow;
    this.requestRender();
  }
  setTheme(name, tint) {
    if (this.reduced) { this.applyTheme(name); if (tint) this.uniforms.uTint.value.set(tint); return; }
    this.fade = { from: this.uniforms.uOpacity.value, to: 0, t0: this.now(), d: 200, then: () => { this.applyTheme(name); if (tint) this.uniforms.uTint.value.set(tint); this.fade = { from: 0, to: this.layout.opacity, t0: this.now(), d: 400 }; } };
    this.requestRender();
  }
  setLayout(l) { Object.assign(this.layout, l); if (l.opacity !== undefined) this.fade = { from: this.uniforms.uOpacity.value, to: l.opacity, t0: this.now(), d: this.reduced ? 0 : 480 }; this.resize(); }

  resize() {
    const w = this.canvas.clientWidth || innerWidth, h = this.canvas.clientHeight || innerHeight;
    // setSize reallocates the drawing buffer, so only call it when the size really changed (layout tweens call this per frame)
    if (w !== this._w || h !== this._h) { this._w = w; this._h = h; this.renderer.setSize(w, h, false); }
    this.uniforms.uResolution.value.set(w, h);
    const L = this.layout;
    this.camera.aspect = w / h; this.camera.position.z = L.distance;
    // offset the projection so the object's centre lands at (x, y) of the canvas without moving the camera
    this.camera.setViewOffset(w, h, (0.5 - L.x) * w, (0.5 - L.y) * h, w, h);
    this.camera.updateProjectionMatrix();
    this.uniforms.uSize.value = Math.max(0.6, Math.min(1.2, h / 900)) * Math.sqrt(42000 / this.count);
    this.requestRender();
  }

  now() { return this._fixedTime ?? performance.now(); }
  start() { this._wanted = true; if (this._raf) return; const loop = () => { this._raf = requestAnimationFrame(loop); this.frame(); }; this._raf = requestAnimationFrame(loop); }
  stop() { cancelAnimationFrame(this._raf); this._raf = null; }
  requestRender() { if (!this._raf && !this._pending) { this._pending = true; requestAnimationFrame(() => { this._pending = false; this.frame(); }); } }

  frame(time) {
    const now = time ?? this.now(), dt = Math.min(0.05, (now - (this._last ?? now)) / 1000); this._last = now;
    if (this.morph) { const t = this.morph.d ? Math.min(1, (now - this.morph.t0) / this.morph.d) : 1; this.uniforms.uProgress.value = t; if (t >= 1) this.morph = null; }
    for (const k in this.tween) { const tw = this.tween[k], t = tw.d ? Math.min(1, (now - tw.t0) / tw.d) : 1; this.uniforms[k].value.copy(tw.from).lerp(tw.to, easeOutExpo(t)); if (t >= 1) delete this.tween[k]; }
    if (this.fade) { const f = this.fade, t = f.d ? Math.min(1, (now - f.t0) / f.d) : 1; this.uniforms.uOpacity.value = f.from + (f.to - f.from) * t; if (t >= 1) { this.fade = null; f.then && f.then(); } }
    this.uniforms.uTime.value = now / 1000;
    if (!this.reduced) {
      this.rot.y += this.spin * dt;
      this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.06; this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.06;
    }
    this.group.rotation.set(this.rot.x + this.layout.tilt + this.pointer.y * 0.25, this.rot.y + this.pointer.x * 0.25, 0);
    this.group.scale.setScalar(this.layout.scale);
    this.shadowUniforms.uOpacity = this.uniforms.uOpacity;
    this.renderer.render(this.scene, this.camera);
  }

  /* Deterministic render at a given time in ms (video capture, posters). */
  renderAt(ms) { this._fixedTime = ms; this.frame(ms); }
  dispose() {
    this.stop();
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('pointermove', this._onPointer);
    document.removeEventListener('visibilitychange', this._onVis);
    this.scene.remove(this.group);
    this.geometry.dispose();
    this.material.dispose();
    this.shadowMaterial.dispose();
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss(); // release the GPU context now rather than at garbage collection
  }
}
