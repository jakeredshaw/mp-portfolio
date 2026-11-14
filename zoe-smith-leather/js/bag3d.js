// Interactive 3D view of the Newmarket Bag.
// The front and back are Zoe's own photographs, flattened onto a 3D model.
import * as THREE from 'three';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { RoundedBoxGeometry } from '../vendor/RoundedBoxGeometry.js';

const stage = document.getElementById('stage');
const canvas = document.getElementById('bag3d');

function supportsWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch (e) { return false; }
}

if (stage && canvas && supportsWebGL()) {
  // Build only when the section comes near the screen
  const lazy = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) { lazy.disconnect(); init(); }
  }, { rootMargin: '400px 0px' });
  lazy.observe(stage);
} else if (stage) {
  stage.classList.add('no-3d');
}

function leatherTexture(w, h, base, opts = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  // pebble grain
  for (let i = 0; i < w * h / 60; i++) {
    const x = Math.random() * w, y = Math.random() * h, r = 1.2 + Math.random() * 3.2;
    const l = Math.random() < .5 ? 255 : 0;
    g.fillStyle = `rgba(${l},${l * .85},${l * .7},${.035 + Math.random() * .05})`;
    g.beginPath(); g.ellipse(x, y, r, r * (.7 + Math.random() * .4), Math.random() * 3, 0, 7); g.fill();
  }
  if (opts.stitch) {
    g.strokeStyle = 'rgba(214,190,160,.55)'; g.lineWidth = 2; g.setLineDash([9, 7]);
    const m = opts.stitch; g.strokeRect(m, m, w - m * 2, h - m * 2);
  }
  if (opts.opening) {
    // the open top of the bag, seen from above
    const m = opts.opening;
    const grd = g.createLinearGradient(0, m, 0, h - m);
    grd.addColorStop(0, '#1e110c'); grd.addColorStop(.5, '#2c1810'); grd.addColorStop(1, '#1e110c');
    g.fillStyle = grd; g.beginPath(); g.roundRect(m, m, w - m * 2, h - m * 2, 16); g.fill();
    g.setLineDash([9, 7]); g.strokeStyle = 'rgba(214,190,160,.5)'; g.lineWidth = 2;
    g.beginPath(); g.roundRect(m - 14, m - 14, w - (m - 14) * 2, h - (m - 14) * 2, 20); g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function shadowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  grd.addColorStop(0, 'rgba(60,35,20,.42)'); grd.addColorStop(.55, 'rgba(60,35,20,.14)'); grd.addColorStop(1, 'rgba(60,35,20,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);

  scene.add(new THREE.HemisphereLight(0xfff7ec, 0x8a7562, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(2.5, 4, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe9d2, .8); rim.position.set(-3, 2, -4); scene.add(rim);

  // Proportions taken from the photographs
  const W = 1.6, H = 0.86, D = 0.5;
  const loader = new THREE.TextureLoader();
  const photo = src => { const t = loader.load(src, () => stage.classList.add('ready')); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

  const side = leatherTexture(256, 512, '#57281d', { stitch: 14 });
  const top = leatherTexture(1024, 320, '#5a2a1f', { opening: 46 });
  const bottom = leatherTexture(512, 256, '#3f1d15');
  const mat = (o) => new THREE.MeshStandardMaterial({ roughness: .78, metalness: 0, ...o });
  const materials = [
    mat({ map: side }), mat({ map: side }),          // right, left
    mat({ map: top }), mat({ map: bottom }),         // top, bottom
    mat({ map: photo('img/3d-front.jpg'), roughness: .9 }), // front
    mat({ map: photo('img/3d-back.jpg'), roughness: .9 }),  // back
  ];
  const bag = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 4, 0.025), materials);
  bag.add(body);

  // Buckled straps wrapping each end of the bag
  const strapMat = mat({ color: 0x7a4a2e, roughness: .55 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9a25a, metalness: .85, roughness: .3 });
  for (const s of [-1, 1]) {
    const strap = new THREE.Mesh(new RoundedBoxGeometry(0.02, 0.075, D + 0.02, 2, 0.008), strapMat);
    strap.position.set(s * (W / 2 + 0.008), H / 2 - 0.115, 0); bag.add(strap);
    const keeper = new THREE.Mesh(new RoundedBoxGeometry(0.03, 0.1, 0.05, 2, 0.008), mat({ color: 0x4e2a1a, roughness: .6 }));
    keeper.position.set(s * (W / 2 + 0.018), H / 2 - 0.115, 0.06); bag.add(keeper);
    const stud = new THREE.Mesh(new THREE.SphereGeometry(0.013, 16, 12), brass);
    stud.position.set(s * (W / 2 + 0.02), H / 2 - 0.115, -0.12); bag.add(stud);
  }

  // Two rolled tan handles, front and back
  const handleMat = mat({ color: 0x8e4526, roughness: .42 });
  const t = H / 2;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.34, t - 0.09, 0), new THREE.Vector3(-0.36, t + 0.12, 0),
    new THREE.Vector3(-0.33, t + 0.4, 0), new THREE.Vector3(-0.18, t + 0.62, 0),
    new THREE.Vector3(0, t + 0.67, 0), new THREE.Vector3(0.18, t + 0.62, 0),
    new THREE.Vector3(0.33, t + 0.4, 0), new THREE.Vector3(0.36, t + 0.12, 0),
    new THREE.Vector3(0.34, t - 0.09, 0),
  ]);
  const handleGeo = new THREE.TubeGeometry(curve, 96, 0.03, 16, false);
  for (const z of [D / 2 + 0.012, -D / 2 - 0.012]) {
    const h = new THREE.Mesh(handleGeo, handleMat); h.position.z = z; h.rotation.x = z > 0 ? -0.12 : 0.12; bag.add(h);
  }

  bag.position.y = -0.18;
  scene.add(bag);

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.5), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = bag.position.y - H / 2 - 0.002; scene.add(shadow);

  // Controls: drag to turn; vertical swipes on phones still scroll the page
  const controls = new OrbitControls(camera, canvas);
  canvas.style.touchAction = 'pan-y';
  controls.enableZoom = false; controls.enablePan = false;
  controls.enableDamping = true; controls.dampingFactor = .08; controls.rotateSpeed = .8;
  controls.minPolarAngle = 0.02; controls.maxPolarAngle = Math.PI / 2 + 0.05;
  controls.autoRotate = true; controls.autoRotateSpeed = 1.6;
  controls.target.set(0, 0.06, 0);

  let dist = 5;
  const sph = new THREE.Spherical(dist, 1.22, 0.55);
  const place = () => { camera.position.setFromSpherical(sph).add(controls.target); camera.lookAt(controls.target); };

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole bag in frame at any screen width
    dist = Math.max(4.6, 4.6 * (1.25 / camera.aspect));
    camera.updateProjectionMatrix();
    const s = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    s.radius = dist; camera.position.setFromSpherical(s).add(controls.target);
  }
  place(); resize();
  new ResizeObserver(resize).observe(stage);

  // View buttons
  const buttons = document.querySelectorAll('.v-controls button');
  let anim = null;
  const views = { front: [1.25, 0], side: [1.25, Math.PI / 2], back: [1.25, Math.PI], above: [0.03, 0] };
  const setActive = v => buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.view === v));
  function goTo(name) {
    controls.autoRotate = false;
    const from = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    let [phi, theta] = views[name];
    // turn the short way round
    while (theta - from.theta > Math.PI) theta -= Math.PI * 2;
    while (from.theta - theta > Math.PI) theta += Math.PI * 2;
    anim = { from, phi, theta, t0: performance.now() };
    setActive(name);
  }
  buttons.forEach(b => b.addEventListener('click', () => {
    if (b.dataset.view === 'spin') { anim = null; controls.autoRotate = true; setActive('spin'); }
    else goTo(b.dataset.view);
  }));
  controls.addEventListener('start', () => { anim = null; controls.autoRotate = false; setActive(null); });

  // Only draw while the section is on screen
  let visible = true;
  new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; if (visible) loop(); }).observe(stage);

  let raf = 0;
  function loop() {
    cancelAnimationFrame(raf);
    if (!visible) return;
    raf = requestAnimationFrame(loop);
    if (anim) {
      const k = Math.min((performance.now() - anim.t0) / 1100, 1), e = 1 - Math.pow(1 - k, 3);
      const s = new THREE.Spherical(dist, anim.from.phi + (anim.phi - anim.from.phi) * e, anim.from.theta + (anim.theta - anim.from.theta) * e);
      camera.position.setFromSpherical(s).add(controls.target);
      if (k === 1) anim = null;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  loop();
}
