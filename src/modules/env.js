// Capability flags computed once, read everywhere.
const mq = (q) => window.matchMedia(q).matches;

export const reducedMotion = mq('(prefers-reduced-motion: reduce)');
export const finePointer = mq('(hover: hover) and (pointer: fine)');
export const isMobile = mq('(max-width: 760px)');
export const saveData = Boolean(navigator.connection?.saveData);

// WebGL2 on a real GPU. Software rasterisers (SwiftShader, llvmpipe) can run the scene but burn the CPU,
// so those visitors get the static poster instead.
export function canFastWebGL() {
  if (new URLSearchParams(location.search).has('forcegl')) return true; // QA on software-GL machines
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}
