// Interactive 3D view of the Newmarket Bag, built from Zoe's own photographs.
// Front, back, sides, belt and the inside zip pocket are the real photos.
// The panels are shaped like soft leather, the buckles, straps, tabs,
// horse-bit and rolled handles are raised in 3D, and the bag can be opened
// to show its red twill lining.
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

// ---------- Measurements (taken from the photographs and videos) ----------
const W = 1.6;            // width
const H = 0.9;            // body height
const DB = 0.4;           // depth at the base
const DT_CLOSED = 0.2;    // depth at the top when closed: the sides taper
const DT_OPEN = 0.52;     // the mouth spreads when the bag is opened
const INSET = 0.014;      // thickness of the leather walls

// state that changes as the bag opens
let open = 1;             // 0 closed .. 1 open (eased); the bag starts open
let DT = DT_OPEN, TILT = 0, HS = H;
function setShape() {
  TILT = Math.atan(((DB - DT) / 2) / H);
  HS = Math.hypot(H, (DB - DT) / 2);
}
DT = DT_CLOSED; setShape();
const HS0 = HS;           // pieces are cut once, at the closed shape
DT = DT_OPEN; setShape();

const fx = u => (u / 100 - 0.5) * W;
const fy = v => (0.5 - v / 100) * HS0;
const depthAt = s => DB + (DT - DB) * s;

// soft leather: front and back panels swell, most in the lower middle
const BULGE = 0.042;
function bulge(u, s) {
  if (u <= 0 || u >= 1) return 0;
  const across = Math.pow(Math.sin(Math.PI * u), 0.55);
  const up = s >= 0.94 ? 0 : Math.pow(Math.sin(Math.PI * Math.min(s / 0.94, 1)), 0.7);
  return BULGE * across * up * (1 - 0.35 * s);
}
const bulgeLocal = (x, y) => bulge(x / W + 0.5, y / HS0 + 0.5);
// the gusset folds inwards towards the top; it opens out as the bag opens
const pleat = (w, s) => 0.05 * (1 - 0.8 * open) * Math.pow(1 - Math.abs(2 * w - 1), 1.6) * Math.pow(s, 1.3);
const rimSag = u => 0.012 * (1 - open) * Math.sin(Math.PI * u);

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
  const texZip = photo('img/3d-zip.jpg');

  const leather = (o = {}) => new THREE.MeshStandardMaterial({ roughness: .8, metalness: 0, ...o });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd2a650, metalness: .9, roughness: .28 });
  const darkEdge = leather({ color: 0x3e1a12, roughness: .55 });
  const beltEdge = leather({ color: 0x6b3a22 });
  const matFront = leather({ map: texFront, bumpMap: texFront, bumpScale: 1.2, roughness: .85 });
  const matBack = leather({ map: texBack, bumpMap: texBack, bumpScale: 1.2, roughness: .85 });
  const matSide = leather({ map: texSide, bumpMap: texSide, bumpScale: 1.4, roughness: .65 });

  // red twill lining, with a band of leather facing round the top
  function liningTexture() {
    const c = document.createElement('canvas'); c.width = 512; c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = '#c62a2c'; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(90,0,10,.16)'; g.lineWidth = 1.2;
    for (let i = -512; i < 1024; i += 5) { g.beginPath(); g.moveTo(i, 512); g.lineTo(i + 512, 0); g.stroke(); }
    g.strokeStyle = 'rgba(255,140,130,.08)';
    for (let i = -510; i < 1024; i += 5) { g.beginPath(); g.moveTo(i, 512); g.lineTo(i + 512, 0); g.stroke(); }
    // leather facing (top 15%)
    g.fillStyle = '#5a2a1e'; g.fillRect(0, 0, 512, 78);
    for (let i = 0; i < 900; i++) { const l = Math.random() < .5 ? 255 : 0; g.fillStyle = `rgba(${l},${l * .85},${l * .7},.07)`; g.beginPath(); g.arc(Math.random() * 512, Math.random() * 78, 1 + Math.random() * 2, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(225,200,170,.6)'; g.setLineDash([7, 5]); g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, 70); g.lineTo(512, 70); g.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }
  const matLining = leather({ map: liningTexture(), roughness: .95 });
  const matLiningFloor = leather({ color: 0xa82326, roughness: .95 });

  const bag = new THREE.Group();

  // ---------- Panels: grids whose shape is recalculated as the bag opens ----------
  const grids = [];
  function grid(nu, nv, at, mat, flipped = false) {
    const count = (nu + 1) * (nv + 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(count * 3), 3));
    const uv = [];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) uv.push(i / nu, j / nv);
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    const idx = [];
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 2, d = a + nu + 1;
      if (flipped) idx.push(a, c, b, a, d, c); else idx.push(a, b, c, a, c, d);
    }
    g.setIndex(idx);
    const m = new THREE.Mesh(g, mat);
    m.userData = { nu, nv, at };
    bag.add(m); grids.push(m); refreshGrid(m);
    return m;
  }
  function refreshGrid(m) {
    const { nu, nv, at } = m.userData, p = m.geometry.attributes.position, uv = m.geometry.attributes.uv;
    let k = 0;
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++, k++) {
      const q = at(i / nu, j / nv);
      p.setXYZ(k, q.x, q.y, q.z);
      if (q.tu !== undefined) uv.setXY(k, q.tu, q.tv);
    }
    p.needsUpdate = true; uv.needsUpdate = true;
    m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere();
  }

  const zFace = (u, s) => depthAt(s) / 2 + bulge(u, s) * Math.cos(TILT);
  // outside
  grid(48, 32, (u, s) => ({ x: (u - .5) * W, y: s * H, z: zFace(u, s) }), matFront);
  grid(48, 32, (u, s) => ({ x: (.5 - u) * W, y: s * H, z: -zFace(u, s) }), matBack);
  for (const side of [1, -1]) {
    grid(16, 32, (w, s) => ({ x: side * (W / 2 - pleat(w, s)), y: s * H, z: (.5 - w) * depthAt(s), tu: w, tv: s }), matSide, side < 0);
  }
  grid(8, 4, (u, w) => ({ x: (u - .5) * W, y: 0.001, z: (w - .5) * DB }), leather({ color: 0x3a1a12 }));

  // inside: the lining, set in by the thickness of the leather
  const e = INSET;
  grid(24, 16, (u, s) => ({ x: (u - .5) * (W - 2 * e), y: e + s * (H - e), z: depthAt(s) / 2 - e, tu: u, tv: s }), matLining, true);
  grid(24, 16, (u, s) => ({ x: (.5 - u) * (W - 2 * e), y: e + s * (H - e), z: -(depthAt(s) / 2 - e), tu: u, tv: s }), matLining, true);
  for (const side of [1, -1]) {
    grid(8, 16, (w, s) => ({ x: side * (W / 2 - e - pleat(w, s)), y: e + s * (H - e), z: (.5 - w) * (depthAt(s) - 2 * e), tu: w * .3, tv: s }), matLining, side > 0);
  }
  grid(8, 4, (u, w) => ({ x: (u - .5) * (W - 2 * e), y: e, z: (w - .5) * (DB - 2 * e) }), matLiningFloor, true);

  // the closed top: a stitched rim round a dark opening (hidden once opened)
  let lid;
  {
    const tc = document.createElement('canvas'); tc.width = 1024; tc.height = 160;
    const tg = tc.getContext('2d');
    tg.fillStyle = '#5c2a1e'; tg.fillRect(0, 0, 1024, 160);
    for (let i = 0; i < 2600; i++) { const l = Math.random() < .5 ? 255 : 0; tg.fillStyle = `rgba(${l},${l * .85},${l * .7},.06)`; tg.beginPath(); tg.arc(Math.random() * 1024, Math.random() * 160, 1 + Math.random() * 2.5, 0, 7); tg.fill(); }
    const og = tg.createLinearGradient(0, 34, 0, 126); og.addColorStop(0, '#2a0b0b'); og.addColorStop(.5, '#4a1214'); og.addColorStop(1, '#2a0b0b');
    tg.fillStyle = og; tg.beginPath(); tg.roundRect(26, 34, 972, 92, 30); tg.fill();
    tg.strokeStyle = 'rgba(220,195,165,.55)'; tg.setLineDash([8, 6]); tg.lineWidth = 2;
    tg.beginPath(); tg.roundRect(12, 18, 1000, 124, 34); tg.stroke();
    const tt = new THREE.CanvasTexture(tc); tt.colorSpace = THREE.SRGBColorSpace; tt.anisotropy = 8;
    lid = grid(32, 4, (u, w) => ({ x: (u - .5) * W, y: H - rimSag(u), z: (w - .5) * -DT }), leather({ map: tt, roughness: .75 }));
  }

  // ---------- Piping and belt edges: rebuilt as the shape changes ----------
  const edges = new THREE.Group(); bag.add(edges);
  const beltMat = leather({ map: texBelt, bumpMap: texBelt, bumpScale: 1.4, roughness: .6 });
  const sTop = 1 - .065, sBot = 1 - .195;
  for (const side of [1, -1]) {
    grid(16, 3, (w, k) => {
      const s = sBot + (sTop - sBot) * k, d = depthAt(s) / 2 + .014;
      return { x: side * (W / 2 + .012 + 0.006 * Math.sin(Math.PI * w)), y: s * H, z: (.5 - w) * 2 * d, tu: side > 0 ? w : 1 - w, tv: k };
    }, beltMat, side < 0);
  }
  function rebuildEdges() {
    for (const m of edges.children) m.geometry.dispose();
    edges.clear();
    const x = W / 2, b = DB / 2, t = DT / 2;
    const tube = (pts, r, mat, n = 1) => edges.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p))), n, r, 10, false), mat));
    const along = z => Array.from({ length: 17 }, (_, i) => { const u = i / 16; return [(u - .5) * W, H - rimSag(u), z]; });
    for (const [a, c] of [[[-x, 0, b], [-x, H, t]], [[x, 0, b], [x, H, t]], [[-x, 0, -b], [-x, H, -t]], [[x, 0, -b], [x, H, -t]],
      [[-x, 0, b], [x, 0, b]], [[-x, 0, -b], [x, 0, -b]], [[-x, 0, b], [-x, 0, -b]], [[x, 0, b], [x, 0, -b]],
      [[-x, H, t], [-x, H, -t]], [[x, H, t], [x, H, -t]]]) tube([a, c], .012, darkEdge);
    tube(along(t), .012, darkEdge, 32); tube(along(-t), .012, darkEdge, 32);
    for (const side of [1, -1]) for (const s of [sTop, sBot]) {
      const d = depthAt(s) / 2 + .014;
      tube([-1, 0, 1].map(k => [side * (W / 2 + .012 + (k === 0 ? .006 : 0)), s * H, k * d]), .005, beltEdge, 12);
    }
  }

  // ---------- Front and back faces: everything raised sits on these ----------
  const faces = [];
  function faceGroup(back) {
    const outer = new THREE.Group(); if (back) outer.rotation.y = Math.PI;
    const g = new THREE.Group(); outer.add(g); bag.add(outer); faces.push(g);
    return g;
  }
  function placeFaces() {
    for (const g of faces) { g.position.set(0, H / 2, (DB + DT) / 4); g.rotation.x = -TILT; }
  }
  const front = faceGroup(false), back = faceGroup(true);

  function piece(group, mat, pts, depth, z = 0) {
    const s = new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(fx(u), fy(v))));
    const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: .003, bevelSize: .003, bevelSegments: 2, curveSegments: 6, steps: 1 });
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      uv.setXY(i, p.getX(i) / W + .5, p.getY(i) / HS0 + .5);
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
    for (const p of [pts[0], pts[4]]) { const e2 = new THREE.Mesh(new THREE.SphereGeometry(.016, 16, 12), gold); e2.position.copy(p); front.add(e2); }
    const j = new THREE.Mesh(new THREE.TorusGeometry(.012, .004, 10, 24), gold); j.position.copy(pts[2]); front.add(j);
  }

  // --- Back ---
  piece(back, matBack, [[45, 0], [61.5, 0], [61.5, 19.5], [45, 19.5]], .007);
  piece(back, matBack, [[50.3, 0], [56, 0], [56, 16], [50.3, 16]], .01, .008);
  piece(back, matBack, ellipsePts(53, 26.2, 4.7, 4.1), .009, .004);
  piece(back, matBack, [[27, 0], [35, 0], [35.5, 10], [33, 18], [31, 20.5], [29, 18], [26.5, 10]], .012, .004);
  piece(back, matBack, [[70, 0], [78, 0], [78.5, 10], [76, 18], [74, 20.5], [72, 18], [69.5, 10]], .012, .004);
  piece(back, matBack, [[0, 2.5], [11.5, 2.5], [11.5, 12.5], [0, 12.5]], .01, .002);
  piece(back, matBack, [[92.5, 4.5], [100, 4.5], [100, 12.5], [92.5, 12.5]], .01, .002);

  // --- Inside the back wall: the leather zip pocket, from Zoe's photograph ---
  {
    const zw = W * .74, zh = zw * 236 / 1536;
    const zip = new THREE.Mesh(new THREE.PlaneGeometry(zw, zh), leather({ map: texZip, roughness: .7 }));
    zip.rotation.y = Math.PI;                 // facing into the bag
    zip.position.set(0, fy(31), -INSET - .004);
    back.add(zip);
  }

  // ---------- Rolled handles: they fall outwards as the bag opens ----------
  const handlePivots = [];
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

    const rise = .71, R = .036, half = W * .21;
    const path = [
      [-half, -.1], [-half - .004, .02], [-half - .014, .16], [-half - .016, .32],
      [-half + .006, .48], [-half * .72, .61], [-half * .4, rise - .018], [0, rise],
      [half * .4, rise - .018], [half * .72, .61], [half - .006, .48], [half + .016, .32],
      [half + .014, .16], [half + .004, .02], [half, -.1],
    ];
    const tilt0 = Math.atan(((DB - DT_CLOSED) / 2) / H);
    for (const s of [1, -1]) {
      const pivot = new THREE.Group(); bag.add(pivot); handlePivots.push({ pivot, s });
      const curve = new THREE.CatmullRomCurve3(path.map(([x, y]) => {
        const above = Math.max(0, y), below = Math.max(0, -y);
        return new THREE.Vector3(x, y, s * (.034 + (above / rise) * .1 + below * Math.tan(tilt0)));
      }), false, 'centripetal');
      const segs = 200, radial = 20;
      const geo = new THREE.TubeGeometry(curve, segs, R, radial, false);
      const pos = geo.attributes.position;
      for (let i = 0; i <= segs; i++) {
        const k = i / segs, c0 = curve.getPointAt(k);
        const ee = Math.min(k, 1 - k) / 0.1;
        const scaleR = ee >= 1 ? 1 : .62 + .38 * ee, flat = ee >= 1 ? 1 : .55 + .45 * ee;
        for (let j = 0; j <= radial; j++) {
          const vi = i * (radial + 1) + j;
          const v = new THREE.Vector3(pos.getX(vi), pos.getY(vi), pos.getZ(vi)).sub(c0).multiplyScalar(scaleR);
          v.z *= flat;
          pos.setXYZ(vi, c0.x + v.x, c0.y + v.y, c0.z + v.z);
        }
      }
      geo.computeVertexNormals();
      pivot.add(new THREE.Mesh(geo, handleMat));
    }
  }
  function placeHandles() {
    for (const { pivot, s } of handlePivots) {
      pivot.position.set(0, H, s * DT / 2);
      pivot.rotation.x = s * open * 1.15;      // handles drop away to each side
    }
  }

  // apply the current open amount to everything
  function applyShape() {
    DT = DT_CLOSED + (DT_OPEN - DT_CLOSED) * open;
    setShape();
    for (const m of grids) refreshGrid(m);
    lid.visible = open < 0.03;
    rebuildEdges(); placeFaces(); placeHandles();
  }
  applyShape();

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
  canvas.style.touchAction = 'pan-y';
  controls.enableZoom = false; controls.enablePan = false;
  controls.enableDamping = true; controls.dampingFactor = .08; controls.rotateSpeed = .8;
  controls.minPolarAngle = 0.02; controls.maxPolarAngle = Math.PI / 2 + 0.05;
  controls.autoRotate = true; controls.autoRotateSpeed = 1.6;
  controls.target.set(0, 0, 0);

  let dist = 5;
  camera.position.setFromSpherical(new THREE.Spherical(dist, 0.95, 0.55));
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

  const buttons = document.querySelectorAll('.v-controls button[data-view]');
  let anim = null;
  const views = { front: [1.4, 0], side: [1.4, Math.PI / 2], back: [1.4, Math.PI], above: [0.03, 0], inside: [0.62, 0.35] };
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

  // Open / close
  let openTarget = 1, openFrom = 1, openT0 = 0;
  const openBtn = document.querySelector('.v-open');
  if (openBtn) openBtn.addEventListener('click', () => {
    openFrom = open; openTarget = openTarget ? 0 : 1; openT0 = performance.now();
    openBtn.setAttribute('aria-pressed', openTarget === 1);
    openBtn.textContent = openTarget ? 'Close the bag' : 'Open the bag';
    if (openTarget) goTo('inside'); else if (!controls.autoRotate) goTo('front');
  });

  let visible = true;
  new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; if (visible) loop(); }).observe(stage);

  let raf = 0;
  function loop() {
    cancelAnimationFrame(raf);
    if (!visible) return;
    raf = requestAnimationFrame(loop);
    if (open !== openTarget) {
      const k = Math.min((performance.now() - openT0) / 1400, 1);
      const eased = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      open = k === 1 ? openTarget : openFrom + (openTarget - openFrom) * eased;
      applyShape();
    }
    if (anim) {
      const k = Math.min((performance.now() - anim.t0) / 1100, 1), ez = 1 - Math.pow(1 - k, 3);
      const s = new THREE.Spherical(dist, anim.from.phi + (anim.phi - anim.from.phi) * ez, anim.from.theta + (anim.theta - anim.from.theta) * ez);
      camera.position.setFromSpherical(s).add(controls.target);
      if (k === 1) anim = null;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  loop();
}
