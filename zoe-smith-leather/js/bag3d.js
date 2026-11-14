// Interactive 3D view of the Newmarket Bag, built from Zoe's own photographs.
// Front, back, sides and belt are the real photos. The panels are shaped like
// soft leather (bulging, with a folded gusset) and the buckles, straps, tabs,
// horse-bit and rolled handles are raised in 3D.
import * as THREE from 'three';
import { OrbitControls } from '../vendor/OrbitControls.js';

const stage = document.getElementById('stage');
const canvas = document.getElementById('bag3d');

function supportsWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch (e) { return false; }
}

if (stage && canvas && supportsWebGL()) {
  const lazy = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) { lazy.disconnect(); init(); }
  }, { rootMargin: '400px 0px' });
  lazy.observe(stage);
} else if (stage) {
  stage.classList.add('no-3d');
}

// ---------- Measurements (taken from the photographs) ----------
const W = 1.6;          // width
const H = 0.9;          // body height
const DB = 0.4;         // depth at the base
const DT = 0.2;         // depth at the top: the sides taper
const TILT = Math.atan(((DB - DT) / 2) / H);
const HS = Math.hypot(H, (DB - DT) / 2);   // slanted height of front/back

// photo % (u across, v down) -> local face coordinates
const fx = u => (u / 100 - 0.5) * W;
const fy = v => (0.5 - v / 100) * HS;

// Soft leather: the front and back panels swell outwards, most in the lower
// middle where the wool is, and not at all along the stitched edges.
const BULGE = 0.042;
function bulge(u, s) {               // u: 0..1 across, s: 0..1 bottom..top
  if (u <= 0 || u >= 1) return 0;
  const across = Math.pow(Math.sin(Math.PI * u), 0.55);
  const up = s >= 0.94 ? 0 : Math.pow(Math.sin(Math.PI * Math.min(s / 0.94, 1)), 0.7);
  return BULGE * across * up * (1 - 0.35 * s);
}
const bulgeLocal = (x, y) => bulge(x / W + 0.5, y / HS + 0.5);

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);

  scene.add(new THREE.HemisphereLight(0xfff7ec, 0x8a7562, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.55); key.position.set(2.5, 4, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe9d2, .9); rim.position.set(-3, 2.5, -4); scene.add(rim);

  let pending = 0;
  const loader = new THREE.TextureLoader();
  const photo = src => {
    pending++;
    const t = loader.load(src, () => { if (--pending === 0) stage.classList.add('ready'); });
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  };
  const texFront = photo('img/3d-front.jpg');
  const texBack = photo('img/3d-back.jpg');
  const texSide = photo('img/3d-side.jpg');
  const texBelt = photo('img/3d-belt.jpg');

  const leather = (o = {}) => new THREE.MeshStandardMaterial({ roughness: .8, metalness: 0, ...o });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd2a650, metalness: .9, roughness: .28 });
  const darkEdge = leather({ color: 0x3e1a12, roughness: .55 });
  // the photos double as a bump map, so the grain and wool pile catch the light
  const matFront = leather({ map: texFront, bumpMap: texFront, bumpScale: 1.2, roughness: .85 });
  const matBack = leather({ map: texBack, bumpMap: texBack, bumpScale: 1.2, roughness: .85 });
  const matSide = leather({ map: texSide, bumpMap: texSide, bumpScale: 1.4, roughness: .65 });

  const bag = new THREE.Group();

  // ---------- Body: soft panels built as fine grids ----------
  const parts = [];
  function grid(nu, nv, at, mat) {
    const pos = [], uv = [], idx = [];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const u = i / nu, v = j / nv, p = at(u, v);
      pos.push(p.x, p.y, p.z); uv.push(p.tu ?? u, p.tv ?? v);
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 2, d = a + nu + 1;
      idx.push(a, b, c, a, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat); bag.add(m); parts.push(m); return m;
  }
  const depthAt = s => DB + (DT - DB) * s;
  const zFace = (u, s) => depthAt(s) / 2 + bulge(u, s) * Math.cos(TILT);
  // front (viewed from the front: u left->right, s bottom->top)
  grid(48, 32, (u, s) => ({ x: (u - .5) * W, y: s * H, z: zFace(u, s) }), matFront);
  // back (viewed from behind)
  grid(48, 32, (u, s) => ({ x: (.5 - u) * W, y: s * H, z: -zFace(u, s) }), matBack);
  // sides: the gusset folds inwards, deeper towards the top, like the photo
  const pleat = (w, s) => 0.05 * Math.pow(1 - Math.abs(2 * w - 1), 1.6) * Math.pow(s, 1.3);
  for (const side of [1, -1]) {
    grid(16, 32, (w, s) => {
      // w: 0 at the front edge -> 1 at the back edge
      const z = (.5 - w) * depthAt(s);
      return { x: side * (W / 2 - pleat(w, s)), y: s * H, z, tu: w, tv: s };
    }, matSide);
    if (side < 0) flip(parts[parts.length - 1]);   // keep the left side facing outwards
  }
  function flip(mesh) {   // keep faces pointing outwards on the left side
    const ix = mesh.geometry.index.array;
    for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
    mesh.geometry.index.needsUpdate = true; mesh.geometry.computeVertexNormals();
  }

  // open top: a stitched leather rim round a dark opening
  {
    const tc = document.createElement('canvas'); tc.width = 1024; tc.height = 160;
    const tg = tc.getContext('2d');
    tg.fillStyle = '#5c2a1e'; tg.fillRect(0, 0, 1024, 160);
    for (let i = 0; i < 2600; i++) { const l = Math.random() < .5 ? 255 : 0; tg.fillStyle = `rgba(${l},${l * .85},${l * .7},.06)`; tg.beginPath(); tg.arc(Math.random() * 1024, Math.random() * 160, 1 + Math.random() * 2.5, 0, 7); tg.fill(); }
    const og = tg.createLinearGradient(0, 34, 0, 126); og.addColorStop(0, '#120806'); og.addColorStop(.5, '#24120c'); og.addColorStop(1, '#120806');
    tg.fillStyle = og; tg.beginPath(); tg.roundRect(26, 34, 972, 92, 30); tg.fill();
    tg.strokeStyle = 'rgba(220,195,165,.55)'; tg.setLineDash([8, 6]); tg.lineWidth = 2;
    tg.beginPath(); tg.roundRect(12, 18, 1000, 124, 34); tg.stroke();
    const tt = new THREE.CanvasTexture(tc); tt.colorSpace = THREE.SRGBColorSpace; tt.anisotropy = 8;
    // the rim sags very slightly in the middle, as soft leather does
    grid(32, 4, (u, w) => ({ x: (u - .5) * W, y: H - 0.012 * Math.sin(Math.PI * u), z: (w - .5) * -DT }), leather({ map: tt, roughness: .75 }));
  }
  // base
  grid(8, 4, (u, w) => ({ x: (u - .5) * W, y: 0.001, z: (w - .5) * DB }), leather({ color: 0x3a1a12 }));

  // ---------- Rolled leather piping along the edges ----------
  {
    const r = 0.012, x = W / 2, b = DB / 2, t = DT / 2;
    const line = pts => new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
    const rimY = u => H - 0.012 * Math.sin(Math.PI * u);
    const along = (z) => Array.from({ length: 17 }, (_, i) => { const u = i / 16; return [(u - .5) * W, rimY(u), z]; });
    const curves = [
      line([[-x, 0, b], [-x, H, t]]), line([[x, 0, b], [x, H, t]]),
      line([[-x, 0, -b], [-x, H, -t]]), line([[x, 0, -b], [x, H, -t]]),
      line([[-x, 0, b], [x, 0, b]]), line([[-x, 0, -b], [x, 0, -b]]),
      line([[-x, 0, b], [-x, 0, -b]]), line([[x, 0, b], [x, 0, -b]]),
      line(along(t)), line(along(-t)),
    ];
    for (const c of curves) bag.add(new THREE.Mesh(new THREE.TubeGeometry(c, 32, r, 10, false), darkEdge));
  }

  // ---------- Faces: groups that sit on the slanted front and back ----------
  function faceGroup(back) {
    const outer = new THREE.Group(); if (back) outer.rotation.y = Math.PI;
    const g = new THREE.Group();
    g.position.set(0, H / 2, (DB + DT) / 4);
    g.rotation.x = -TILT;
    outer.add(g); bag.add(outer);
    return g;
  }
  const front = faceGroup(false), back = faceGroup(true);

  // A raised leather piece cut to a shape, showing the real photo on its face,
  // and following the swell of the panel underneath it.
  function piece(group, mat, pts, depth, z = 0) {
    const s = new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(fx(u), fy(v))));
    const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: .003, bevelSize: .003, bevelSegments: 2, curveSegments: 6, steps: 1 });
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      uv.setXY(i, p.getX(i) / W + .5, p.getY(i) / HS + .5);
      p.setZ(i, p.getZ(i) + bulgeLocal(p.getX(i), p.getY(i)));
    }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat); m.position.z = z; group.add(m); return m;
  }
  const onFace = (u, v, z) => new THREE.Vector3(fx(u), fy(v), z + bulgeLocal(fx(u), fy(v)));
  const ellipsePts = (cu, cv, ru, rv, n = 28) => Array.from({ length: n }, (_, i) => {
    const a = i / n * Math.PI * 2; return [cu + Math.cos(a) * ru, cv + Math.sin(a) * rv];
  });

  // --- Front ---
  piece(front, matFront, [[42, 0], [60, 0], [60.5, 14], [59, 24], [56, 31], [51, 35.5], [46, 31], [43, 24], [41.5, 14]], .006);
  piece(front, matFront, [[48.3, 0], [53.7, 0], [53.7, 46.5], [51, 50.5], [48.3, 46.5]], .01, .01);
  { const k = new THREE.Mesh(new THREE.BoxGeometry(fx(55.4) - fx(47.2), fy(21.5) - fy(25.5), .026), gold);
    k.position.copy(onFace((47.2 + 55.4) / 2, 23.5, .03)); front.add(k); }
  piece(front, matFront, [[25.5, 0], [33, 0], [33.5, 10], [31, 19], [28.6, 23], [26, 19], [25, 10]], .012, .004);
  piece(front, matFront, [[67.5, 0], [75, 0], [75.3, 10], [73.5, 18.5], [71.2, 22.5], [68.6, 18.5], [67, 10]], .012, .004);
  piece(front, matFront, [[0, 8], [23, 8.5], [27.5, 14], [23.5, 19.5], [0, 19.5]], .01, .002);
  piece(front, matFront, [[100, 6], [78, 6.5], [74, 12], [77.5, 18], [100, 18]], .01, .002);
  piece(front, matFront, [[11.8, 6.5], [14.9, 6.5], [14.9, 20.5], [11.8, 20.5]], .012, .012);
  piece(front, matFront, [[86, 4.5], [89.2, 4.5], [89.2, 18.8], [86, 18.8]], .012, .012);
  for (const [u, v] of [[7, 11], [93.5, 10.5]]) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(.013, 16, 12), gold); s.position.copy(onFace(u, v, .02)); front.add(s);
  }
  // horse-bit
  piece(front, matFront, [[29.5, 61.8], [33, 59.2], [37.5, 59.5], [37.5, 64.5], [33, 64.5]], .008, .002);
  piece(front, matFront, [[74.5, 61.8], [71, 59.2], [66.5, 59.5], [66.5, 64.5], [71, 64.5]], .008, .002);
  for (const u of [39.6, 64.3]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(W * .043, .0075, 14, 48), gold);
    ring.position.copy(onFace(u, 63.6, .03)); front.add(ring);
  }
  {
    const pts = [[42.6, 66.5], [46.5, 69], [50, 71.2], [53.5, 69], [61.3, 66.5]].map(([u, v]) => onFace(u, v, .034));
    for (const c of [new THREE.CatmullRomCurve3(pts.slice(0, 3)), new THREE.CatmullRomCurve3(pts.slice(2))])
      front.add(new THREE.Mesh(new THREE.TubeGeometry(c, 24, .011, 12, false), gold));
    for (const p of [pts[0], pts[4]]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.016, 16, 12), gold); e.position.copy(p); front.add(e); }
    const j = new THREE.Mesh(new THREE.TorusGeometry(.012, .004, 10, 24), gold); j.position.copy(pts[2]); front.add(j);
  }

  // --- Back ---
  piece(back, matBack, [[45, 0], [61.5, 0], [61.5, 19.5], [45, 19.5]], .007);
  piece(back, matBack, [[50.3, 0], [56, 0], [56, 16], [50.3, 16]], .01, .008);
  piece(back, matBack, ellipsePts(53, 26.2, 4.7, 4.1), .009, .004);   // stamped Zoe Smith badge
  piece(back, matBack, [[27, 0], [35, 0], [35.5, 10], [33, 18], [31, 20.5], [29, 18], [26.5, 10]], .012, .004);
  piece(back, matBack, [[70, 0], [78, 0], [78.5, 10], [76, 18], [74, 20.5], [72, 18], [69.5, 10]], .012, .004);
  piece(back, matBack, [[0, 2.5], [11.5, 2.5], [11.5, 12.5], [0, 12.5]], .01, .002);
  piece(back, matBack, [[92.5, 4.5], [100, 4.5], [100, 12.5], [92.5, 12.5]], .01, .002);

  // ---------- Belts wrapping round each end, from the side photograph ----------
  {
    const beltMat = leather({ map: texBelt, bumpMap: texBelt, bumpScale: 1.4, roughness: .6 });
    const sTop = 1 - .065, sBot = 1 - .195;
    for (const side of [1, -1]) {
      const m = grid(16, 3, (w, k) => {
        const s = sBot + (sTop - sBot) * k;
        const d = depthAt(s) / 2 + .014;
        // the belt is pulled tight, so it bows only slightly round the end
        return { x: side * (W / 2 + .012 + 0.006 * Math.sin(Math.PI * w)), y: s * H, z: (.5 - w) * 2 * d, tu: side > 0 ? w : 1 - w, tv: k };
      }, beltMat);
      if (side < 0) flip(m);
      for (const s of [sTop, sBot]) {
        const d = depthAt(s) / 2 + .014;
        const c = new THREE.CatmullRomCurve3([-1, 0, 1].map(k => new THREE.Vector3(side * (W / 2 + .012 + (k === 0 ? .006 : 0)), s * H, k * d)));
        bag.add(new THREE.Mesh(new THREE.TubeGeometry(c, 12, .005, 8, false), leather({ color: 0x6b3a22 })));
      }
    }
  }

  // ---------- Rolled handles ----------
  // Sized from the front photograph: they leave the tabs about a fifth of the
  // way in from each end, stand almost upright, and arch to about four-fifths
  // of the body's height above the rim. Thick and round in the middle, they
  // flatten where they are stitched into the tabs.
  {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, 64);
    grd.addColorStop(0, '#6a2c15'); grd.addColorStop(.3, '#8f4424'); grd.addColorStop(.5, '#a8582f'); grd.addColorStop(.7, '#8f4424'); grd.addColorStop(1, '#6a2c15');
    g.fillStyle = grd; g.fillRect(0, 0, 1024, 64);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,230,200,${Math.random() * .05})`; g.fillRect(Math.random() * 1024, Math.random() * 64, 2 + Math.random() * 6, 1); }
    g.strokeStyle = 'rgba(60,25,12,.9)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 3); g.lineTo(1024, 3); g.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.set(4, 1);
    const handleMat = leather({ map: t, roughness: .38 });

    const top = H, rise = .71, R = .036;
    const half = W * .21;                  // tab centres sit at 29% and 71% of the width
    const path = [
      [-half, top - .1], [-half - .004, top + .02], [-half - .014, top + .16], [-half - .016, top + .32],
      [-half + .006, top + .48], [-half * .72, top + .61], [-half * .4, top + rise - .018], [0, top + rise],
      [half * .4, top + rise - .018], [half * .72, top + .61], [half - .006, top + .48], [half + .016, top + .32],
      [half + .014, top + .16], [half + .004, top + .02], [half, top - .1],
    ];
    for (const s of [1, -1]) {
      const zRim = s * (DT / 2 + .034);
      // the handles lean very slightly outwards, as they do in the photos
      const lean = .1;
      const curve = new THREE.CatmullRomCurve3(path.map(([x, y]) => {
        const above = Math.max(0, y - top);
        const below = Math.max(0, top - y);
        return new THREE.Vector3(x, y, zRim + s * (above / rise) * lean + s * below * Math.tan(TILT));
      }), false, 'centripetal');
      const segs = 200, radial = 20;
      const geo = new THREE.TubeGeometry(curve, segs, R, radial, false);
      // taper and flatten the ends where they go into the tabs
      const pos = geo.attributes.position, frames = curve.computeFrenetFrames(segs, false);
      for (let i = 0; i <= segs; i++) {
        const k = i / segs, c0 = curve.getPointAt(k);
        const e = Math.min(k, 1 - k) / 0.1;               // 0 at the ends, 1 after the first tenth
        const scaleR = e >= 1 ? 1 : .62 + .38 * e;
        const flat = e >= 1 ? 1 : .55 + .45 * e;          // squashed against the bag at the ends
        for (let j = 0; j <= radial; j++) {
          const vi = i * (radial + 1) + j;
          const v = new THREE.Vector3(pos.getX(vi), pos.getY(vi), pos.getZ(vi)).sub(c0);
          v.multiplyScalar(scaleR);
          v.z *= flat;
          pos.setXYZ(vi, c0.x + v.x, c0.y + v.y, c0.z + v.z);
        }
      }
      geo.computeVertexNormals();
      bag.add(new THREE.Mesh(geo, handleMat));
    }
  }

  bag.position.y = -0.84;
  scene.add(bag);

  // soft shadow
  {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(128, 128, 8, 128, 128, 128);
    grd.addColorStop(0, 'rgba(60,35,20,.45)'); grd.addColorStop(.5, 'rgba(60,35,20,.15)'); grd.addColorStop(1, 'rgba(60,35,20,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    sh.rotation.x = -Math.PI / 2; sh.position.y = bag.position.y - .002; scene.add(sh);
  }

  // ---------- Controls ----------
  const controls = new OrbitControls(camera, canvas);
  canvas.style.touchAction = 'pan-y';          // vertical swipes still scroll the page on phones
  controls.enableZoom = false; controls.enablePan = false;
  controls.enableDamping = true; controls.dampingFactor = .08; controls.rotateSpeed = .8;
  controls.minPolarAngle = 0.02; controls.maxPolarAngle = Math.PI / 2 + 0.05;
  controls.autoRotate = true; controls.autoRotateSpeed = 1.6;
  controls.target.set(0, 0, 0);

  let dist = 5;
  camera.position.setFromSpherical(new THREE.Spherical(dist, 1.3, 0.55));

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    dist = Math.max(4.7, 4.3 / camera.aspect);
    camera.updateProjectionMatrix();
    const s = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    s.radius = dist; camera.position.setFromSpherical(s).add(controls.target);
  }
  resize();
  new ResizeObserver(resize).observe(stage);

  const buttons = document.querySelectorAll('.v-controls button');
  let anim = null;
  const views = { front: [1.4, 0], side: [1.4, Math.PI / 2], back: [1.4, Math.PI], above: [0.03, 0] };
  const setActive = v => buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.view === v));
  function goTo(name) {
    controls.autoRotate = false;
    const from = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    let [phi, theta] = views[name];
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

  // draw only while on screen
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
