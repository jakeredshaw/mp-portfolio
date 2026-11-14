// Interactive 3D view of the Newmarket Bag, built from Zoe's own photographs.
// Front, back, sides and belt are the real photos; buckles, straps, tabs,
// the horse-bit and the handles are raised in 3D on top of them.
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
const H = 0.9;          // height of the body
const DB = 0.4;         // depth at the base
const DT = 0.2;         // depth at the top (the sides taper)
const TILT = Math.atan(((DB - DT) / 2) / H);
const HS = Math.hypot(H, (DB - DT) / 2);   // slanted height of front/back

// photo % (u across, v down) -> local face coordinates
const fx = u => (u / 100 - 0.5) * W;
const fy = v => (0.5 - v / 100) * HS;

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);

  scene.add(new THREE.HemisphereLight(0xfff7ec, 0x8a7562, 1.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(2.5, 4, 4); scene.add(key);
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
  const darkEdge = leather({ color: 0x3e1a12, roughness: .6 });
  const matFront = leather({ map: texFront, roughness: .85 });
  const matBack = leather({ map: texBack, roughness: .85 });
  const matSide = leather({ map: texSide, roughness: .7 });

  const bag = new THREE.Group();

  // ---------- Body: a tapered box, narrower at the top ----------
  {
    const pos = [], uv = [], groups = [];
    const quad = (a, b, c, d, ua, ub, uc, ud, mat) => {
      const start = pos.length / 3;
      for (const p of [a, b, c, a, c, d]) pos.push(...p);
      for (const t of [ua, ub, uc, ua, uc, ud]) uv.push(...t);
      groups.push([start, 6, mat]);
    };
    const x = W / 2, b = DB / 2, t = DT / 2;
    // front, back, right, left, top, bottom (corners counter-clockwise from outside)
    quad([-x, 0, b], [x, 0, b], [x, H, t], [-x, H, t], [0, 0], [1, 0], [1, 1], [0, 1], 0);
    quad([x, 0, -b], [-x, 0, -b], [-x, H, -t], [x, H, -t], [0, 0], [1, 0], [1, 1], [0, 1], 1);
    quad([x, 0, b], [x, 0, -b], [x, H, -t], [x, H, t], [0, 0], [1, 0], [1, 1], [0, 1], 2);
    quad([-x, 0, -b], [-x, 0, b], [-x, H, t], [-x, H, -t], [1, 0], [0, 0], [0, 1], [1, 1], 2);
    quad([-x, H, t], [x, H, t], [x, H, -t], [-x, H, -t], [0, 0], [1, 0], [1, 1], [0, 1], 3);
    quad([-x, 0, -b], [x, 0, -b], [x, 0, b], [-x, 0, b], [0, 0], [1, 0], [1, 1], [0, 1], 4);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    groups.forEach(([s, c, m]) => g.addGroup(s, c, m));
    g.computeVertexNormals();
    // open top: a stitched leather rim around a dark opening
    const tc = document.createElement('canvas'); tc.width = 1024; tc.height = 160;
    const tg = tc.getContext('2d');
    tg.fillStyle = '#5c2a1e'; tg.fillRect(0, 0, 1024, 160);
    for (let i = 0; i < 2600; i++) { const l = Math.random() < .5 ? 255 : 0; tg.fillStyle = `rgba(${l},${l * .85},${l * .7},.06)`; tg.beginPath(); tg.arc(Math.random() * 1024, Math.random() * 160, 1 + Math.random() * 2.5, 0, 7); tg.fill(); }
    const og = tg.createLinearGradient(0, 34, 0, 126); og.addColorStop(0, '#120806'); og.addColorStop(.5, '#24120c'); og.addColorStop(1, '#120806');
    tg.fillStyle = og; tg.beginPath(); tg.roundRect(26, 34, 972, 92, 30); tg.fill();
    tg.strokeStyle = 'rgba(220,195,165,.55)'; tg.setLineDash([8, 6]); tg.lineWidth = 2;
    tg.beginPath(); tg.roundRect(12, 18, 1000, 124, 34); tg.stroke();
    const tt = new THREE.CanvasTexture(tc); tt.colorSpace = THREE.SRGBColorSpace; tt.anisotropy = 8;
    const top = leather({ map: tt, roughness: .75 });
    const bottom = leather({ color: 0x3a1a12 });
    bag.add(new THREE.Mesh(g, [matFront, matBack, matSide, top, bottom]));
  }

  // ---------- Rolled leather piping along every edge ----------
  {
    const x = W / 2, b = DB / 2, t = DT / 2, r = 0.011;
    const edges = [
      [[-x, 0, b], [-x, H, t]], [[x, 0, b], [x, H, t]], [[-x, 0, -b], [-x, H, -t]], [[x, 0, -b], [x, H, -t]],
      [[-x, 0, b], [x, 0, b]], [[-x, 0, -b], [x, 0, -b]], [[-x, 0, b], [-x, 0, -b]], [[x, 0, b], [x, 0, -b]],
      [[-x, H, t], [x, H, t]], [[-x, H, -t], [x, H, -t]], [[-x, H, t], [-x, H, -t]], [[x, H, t], [x, H, -t]],
    ];
    for (const [a, c] of edges) {
      const curve = new THREE.LineCurve3(new THREE.Vector3(...a), new THREE.Vector3(...c));
      bag.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 1, r, 10, false), darkEdge));
    }
  }

  // ---------- Faces: groups that sit flat on the slanted front and back ----------
  function faceGroup(back) {
    const outer = new THREE.Group(); if (back) outer.rotation.y = Math.PI;
    const g = new THREE.Group();
    g.position.set(0, H / 2, (DB + DT) / 4);
    g.rotation.x = -TILT;
    outer.add(g); bag.add(outer);
    return g;
  }
  const front = faceGroup(false), back = faceGroup(true);

  // A raised leather piece cut to a shape, showing the real photo on its face
  function piece(group, mat, pts, depth, z = 0) {
    const s = new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(fx(u), fy(v))));
    const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: .003, bevelSize: .003, bevelSegments: 2, curveSegments: 6 });
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / W + .5, p.getY(i) / HS + .5);
    const m = new THREE.Mesh(geo, mat); m.position.z = z; group.add(m); return m;
  }
  const ellipsePts = (cu, cv, ru, rv, n = 28) => Array.from({ length: n }, (_, i) => {
    const a = i / n * Math.PI * 2; return [cu + Math.cos(a) * ru, cv + Math.sin(a) * rv];
  });

  // --- Front ---
  // flap behind the buckled strap
  piece(front, matFront, [[42, 0], [60, 0], [60.5, 14], [59, 24], [56, 31], [51, 35.5], [46, 31], [43, 24], [41.5, 14]], .006);
  // buckled centre strap with its pointed tip
  piece(front, matFront, [[48.3, 0], [53.7, 0], [53.7, 46.5], [51, 50.5], [48.3, 46.5]], .01, .01);
  // brass keeper on the strap
  { const k = new THREE.Mesh(new THREE.BoxGeometry(fx(55.4) - fx(47.2), fy(21.5) - fy(25.5), .026), gold);
    k.position.set((fx(47.2) + fx(55.4)) / 2, (fy(21.5) + fy(25.5)) / 2, .03); front.add(k); }
  // handle tabs
  piece(front, matFront, [[25.5, 0], [33, 0], [33.5, 10], [31, 19], [28.6, 23], [26, 19], [25, 10]], .01, .004);
  piece(front, matFront, [[67.5, 0], [75, 0], [75.3, 10], [73.5, 18.5], [71.2, 22.5], [68.6, 18.5], [67, 10]], .01, .004);
  // buckled belts at each end, with keepers and brass studs
  piece(front, matFront, [[0, 8], [23, 8.5], [27.5, 14], [23.5, 19.5], [0, 19.5]], .01, .002);
  piece(front, matFront, [[100, 6], [78, 6.5], [74, 12], [77.5, 18], [100, 18]], .01, .002);
  piece(front, matFront, [[11.8, 6.5], [14.9, 6.5], [14.9, 20.5], [11.8, 20.5]], .012, .012);
  piece(front, matFront, [[86, 4.5], [89.2, 4.5], [89.2, 18.8], [86, 18.8]], .012, .012);
  for (const [u, v] of [[7, 11], [93.5, 10.5]]) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(.013, 16, 12), gold); s.position.set(fx(u), fy(v), .02); front.add(s);
  }
  // horse-bit: leather tabs, two gilt rings and the jointed mouthpiece
  piece(front, matFront, [[29.5, 61.8], [33, 59.2], [37.5, 59.5], [37.5, 64.5], [33, 64.5]], .008, .002);
  piece(front, matFront, [[74.5, 61.8], [71, 59.2], [66.5, 59.5], [66.5, 64.5], [71, 64.5]], .008, .002);
  for (const u of [39.6, 64.3]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(W * .043, .0075, 14, 48), gold);
    ring.position.set(fx(u), fy(63.6), .03); front.add(ring);
  }
  {
    const pts = [[42.6, 66.5], [46.5, 69], [50, 71.2], [53.5, 69], [61.3, 66.5]].map(([u, v]) => new THREE.Vector3(fx(u), fy(v), .034));
    const left = new THREE.CatmullRomCurve3(pts.slice(0, 3)), right = new THREE.CatmullRomCurve3(pts.slice(2));
    for (const c of [left, right]) front.add(new THREE.Mesh(new THREE.TubeGeometry(c, 24, .011, 12, false), gold));
    for (const p of [pts[0], pts[4]]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.016, 16, 12), gold); e.position.copy(p); front.add(e); }
    const j = new THREE.Mesh(new THREE.TorusGeometry(.012, .004, 10, 24), gold); j.position.copy(pts[2]); front.add(j);
  }

  // --- Back ---
  piece(back, matBack, [[45, 0], [61.5, 0], [61.5, 19.5], [45, 19.5]], .007);
  piece(back, matBack, [[50.3, 0], [56, 0], [56, 16], [50.3, 16]], .01, .008);
  piece(back, matBack, ellipsePts(53, 26.2, 4.7, 4.1), .009, .004);   // stamped Zoe Smith badge
  piece(back, matBack, [[27, 0], [35, 0], [35.5, 10], [33, 18], [31, 20.5], [29, 18], [26.5, 10]], .01, .004);
  piece(back, matBack, [[70, 0], [78, 0], [78.5, 10], [76, 18], [74, 20.5], [72, 18], [69.5, 10]], .01, .004);
  piece(back, matBack, [[0, 2.5], [11.5, 2.5], [11.5, 12.5], [0, 12.5]], .01, .002);
  piece(back, matBack, [[92.5, 4.5], [100, 4.5], [100, 12.5], [92.5, 12.5]], .01, .002);

  // ---------- Belts wrapping round each end, from the side photograph ----------
  {
    const yTop = H * (1 - .065), yBot = H * (1 - .195);
    const depthAt = y => DB + (DT - DB) * (y / H);
    const beltMat = leather({ map: texBelt, roughness: .65 });
    for (const s of [-1, 1]) {
      const d0 = depthAt(yBot) / 2 + .012, d1 = depthAt(yTop) / 2 + .012, x = s * (W / 2 + .012);
      const pos = s > 0
        ? [x, yBot, d0, x, yBot, -d0, x, yTop, -d1, x, yBot, d0, x, yTop, -d1, x, yTop, d1]
        : [x, yBot, -d0, x, yBot, d0, x, yTop, d1, x, yBot, -d0, x, yTop, d1, x, yTop, -d1];
      const uv = s > 0 ? [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1] : [1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1];
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.computeVertexNormals();
      bag.add(new THREE.Mesh(g, beltMat));
      // leather thickness at the belt edges
      for (const y of [yTop, yBot]) {
        const d = depthAt(y) / 2 + .012;
        const c = new THREE.LineCurve3(new THREE.Vector3(x, y, -d), new THREE.Vector3(x, y, d));
        bag.add(new THREE.Mesh(new THREE.TubeGeometry(c, 1, .005, 8, false), leather({ color: 0x6b3a22 })));
      }
    }
  }

  // ---------- Rolled handles with a stitched seam ----------
  {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, 64);
    grd.addColorStop(0, '#6e2f17'); grd.addColorStop(.45, '#9b4b28'); grd.addColorStop(.55, '#a3532d'); grd.addColorStop(1, '#6e2f17');
    g.fillStyle = grd; g.fillRect(0, 0, 1024, 64);
    g.strokeStyle = 'rgba(70,30,15,.9)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 4); g.lineTo(1024, 4); g.stroke();
    g.strokeStyle = 'rgba(225,200,170,.55)'; g.setLineDash([7, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(0, 9); g.lineTo(1024, 9); g.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.set(3, 1);
    const handleMat = leather({ map: t, roughness: .4 });
    const top = H, rise = .7;
    const pts = [
      [-.336, top - .1], [-.34, top + .02], [-.348, top + .2], [-.34, top + .42], [-.27, top + .6],
      [-.14, top + rise - .02], [0, top + rise], [.14, top + rise - .02], [.27, top + .6],
      [.34, top + .42], [.348, top + .2], [.34, top + .02], [.336, top - .1],
    ];
    for (const s of [1, -1]) {
      const z = s * (DT / 2 + .03);
      const curve = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, z + s * (y < top ? (top - y) * Math.tan(TILT) : 0))));
      bag.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 160, .027, 18, false), handleMat));
    }
  }

  bag.position.y = -0.78;
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
    dist = Math.max(4.2, 4.0 / camera.aspect);
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
