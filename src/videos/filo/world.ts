// The "la carne" world: a sword-sharpener's workshop (origin) and the yard behind it (x = 300), posed per frame
// as a pure function of shot id + frame, with the template's pieces (painted sky, two-tone materials, lit
// character cards, world ink). Built with the improvements package: the MASTER's face never changes
// (smile_closed, white beard) while the CLIENT cycles expressions every appearance; narrative props carry the
// story (coins, the paper-thin blade, the obsidian box, the magnifier needle, the bamboo and its growing pile).
import * as THREE from "three";
import { Pen, bodyFront, Outfit, Expr, SKINS } from "./toon";
import { Pool, Actor, Fx, Stage, tier, light2D, blob, BODY } from "./troop";
import { NOINK } from "./ink";
import { LIGHTS, LOOK, LightPreset, WorldLook } from "./lights";
import { TONE, CHAR, twoTone, untone } from "./shade";
import { ctex, rep, planks, beam } from "./paint";
import { FPS, SHOTS, camAt, smooth, shakeAt, worldF, EV } from "./story";

const DL: LightPreset = { ...LIGHTS.day, el: 44 };
const K: WorldLook = { ...LOOK.day };
const AZ: Record<number, number> = { 1: 75, 2: 70, 3: 65, 4: 80, 5: 115, 6: 70, 7: 75, 8: 110, 9: 75, 10: 80, 11: 78, 12: 105, 13: 72, 14: 65, 15: 118, 16: 112, 17: 70, 18: 78, 19: 45 };
const FOGC: Record<string, string> = { taller: "#2e2118", patio: "#b8d0ec" };

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
const lam = (p: THREE.MeshLambertMaterialParameters) => twoTone(new THREE.MeshLambertMaterial(p));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const qk = (k: number) => Math.round(k * 20) / 20; // quantize held-sword angles so the card pool stays small

// ---------------- cast ----------------
const MAESTRO: Outfit = { // no beard: the template's beard ellipse reads as a muzzle ball (sismo lesson, confirmed on still f185)
  jacket: "#3d4a63", pants: "#2e3440", boots: "#241c14", hat: "hair", hair: "#ddd6c4",
  moustache: "#e6e1d5", buttons: "#9aa184", belt: "#4a3a26", skin: SKINS[1],
};
const CLIENTE: Outfit = {
  jacket: "#8e2f26", pants: "#33302c", boots: "#2c2015", hat: "hair", hair: "#241a12",
  buttons: "#e8c45a", belt: "#5a4326", skin: SKINS[0], build: "stout",
};
type Marks = { nick?: boolean; bandaid?: boolean };
/** the client's brow wound, drawn over the finished card drawing (head centre ~(300,309), brows ~y262) */
const drawBrowMark = (p: Pen, m: Marks) => {
  const g = p.g;
  if (m.nick) { // a fresh red cut across the screen-left brow (position measured on still f455: brow line ~y286)
    g.save(); g.strokeStyle = "#b03024"; g.lineWidth = 6; g.lineCap = "round";
    g.beginPath(); g.moveTo(238, 282); g.lineTo(272, 290); g.stroke();
    g.fillStyle = "#b03024"; g.beginPath(); g.arc(258, 298, 4.5, 0, 6.3); g.fill(); g.restore();
  }
  if (m.bandaid) { // a bandage over the same brow from shot 7 on
    g.save(); g.translate(255, 286); g.rotate(-0.13);
    g.fillStyle = "#e8d9b0"; g.strokeStyle = "#241726"; g.lineWidth = 3.5;
    g.beginPath(); g.roundRect(-30, -10, 60, 20, 9); g.fill(); g.stroke();
    g.fillStyle = "#d9c48f"; g.fillRect(-11, -10, 22, 20);
    g.fillStyle = "rgba(90,60,20,0.55)";
    for (const dx of [-20, 20]) for (const dy of [-4, 4]) { g.beginPath(); g.arc(dx, dy, 1.8, 0, 6.3); g.fill(); }
    g.restore();
  }
};
const charDraw = (who: "maestro" | "cliente", o: Outfit, opts: Parameters<typeof bodyFront>[2], m: Marks) => (p: Pen) => {
  bodyFront(p, o, opts);
  if (who === "cliente" && (m.nick || m.bandaid)) drawBrowMark(p, m);
};

// ---------------- painted textures ----------------
const woodWallTex = () => ctex("wallFILO", 512, 512, (g, r) => {
  g.fillStyle = "#8a6a42"; g.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 64) {
    g.fillStyle = `rgba(30,18,8,${0.10 + r() * 0.08})`; g.fillRect(x, 0, 3, 512);
    for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(30,18,8,${0.04 + r() * 0.06})`; g.fillRect(x + 4 + r() * 56, r() * 512, 1.5 + r() * 2, 8 + r() * 40); }
    for (let i = 0; i < 10; i++) { g.fillStyle = `rgba(240,200,140,${0.03 + r() * 0.05})`; g.fillRect(x + 4 + r() * 56, r() * 512, 2 + r() * 3, 10 + r() * 30); }
  }
});
const dirtTex = () => ctex("dirtFILO", 512, 512, (g, r) => {
  g.fillStyle = "#9a7c54"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 1700; i++) { g.fillStyle = r() < 0.5 ? `rgba(80,58,30,${0.05 + r() * 0.12})` : `rgba(232,208,164,${0.05 + r() * 0.1})`; g.fillRect(r() * 512, r() * 512, 2 + r() * 5, 2 + r() * 5); }
  for (let i = 0; i < 26; i++) { g.strokeStyle = `rgba(96,120,52,${0.10 + r() * 0.12})`; g.lineWidth = 2; const x = r() * 512, y = r() * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 8, y - 6 - r() * 10); g.stroke(); }
});
const signTex = () => ctex("signFILO", 256, 192, (g, r) => {
  g.fillStyle = "#cdb27f"; g.fillRect(0, 0, 256, 192); // darker parchment: the pale version blew out to white under the day rig
  g.strokeStyle = "#5e3f1c"; g.lineWidth = 9; g.strokeRect(7, 7, 242, 178);
  g.fillStyle = "#c9973f"; g.strokeStyle = "#6e4c16"; g.lineWidth = 6; // the big coin
  g.beginPath(); g.arc(128, 72, 40, 0, 6.3); g.fill(); g.stroke();
  g.fillStyle = "#5e3f1c"; g.font = "bold 46px Georgia"; g.textAlign = "center"; g.fillText("F", 128, 89);
  g.fillStyle = "#33220f"; g.font = "bold 33px Georgia"; g.fillText("¡FORTUNA!", 128, 156);
  for (let i = 0; i < 24; i++) { g.fillStyle = `rgba(94,63,28,${0.06 + r() * 0.09})`; g.fillRect(r() * 256, r() * 192, 2 + r() * 5, 2 + r() * 5); }
});

// ---------------- world ----------------
export class World {
  root = new THREE.Group();
  private pool = new Pool();
  private actors: Actor[] = [];
  private fxs: Fx[] = [];
  private hemi: THREE.HemisphereLight; private sun: THREE.DirectionalLight;
  private skyMat: THREE.ShaderMaterial; private sky: THREE.Mesh;
  private fog = new THREE.Fog("#2e2118", 6, 42);
  private taller = new THREE.Group();
  private patio = new THREE.Group();
  private thinMacro = new THREE.Group();   // the paper-thin blade on its supports (shots 5, 15)
  private thinSeg2 = new THREE.Group(); private thinSeg3 = new THREE.Group(); private crack: THREE.Mesh;
  private primeraMacro = new THREE.Group(); // the first sword standing in profile, "la carne" (shot 16)
  private bamboo = new THREE.Group(); private bambooTop = new THREE.Group();
  private bamboo2 = new THREE.Group(); private bamboo2Top = new THREE.Group();
  private bamboo3 = new THREE.Group();
  private pile: THREE.Mesh[] = [];
  private thinStrike = new THREE.Group(); private thinStraight: THREE.Group; private thinSerrated: THREE.Group;
  private chips: THREE.Mesh[] = [];
  private obsStrike = new THREE.Group(); private obsBlade: THREE.Group;
  private shards: THREE.Mesh[] = []; private shardRest: [number, number, number][] = [];
  private needlePatio = new THREE.Group();
  private sunCache = new Map<number, THREE.Vector3>();
  private frustum = new THREE.Frustum(); private m4 = new THREE.Matrix4(); private sph = new THREE.Sphere(); private v = new THREE.Vector3();

  constructor() {
    const R = this.root;
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: { c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() },
        c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0));
          vec3 c = mix(c0, c1, smoothstep(0.0, e.x, el)); c = mix(c, c2, smoothstep(e.x, e.y, el));
          c = mix(c, c3, smoothstep(e.y, e.z, el)); c = mix(c, c4, smoothstep(e.z, e.w, el)); gl_FragColor = vec4(c, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(2400, 48, 24), this.skyMat);
    this.sky.renderOrder = -1; this.sky.frustumCulled = false; this.sky.layers.set(NOINK);
    R.add(this.sky);
    this.hemi = new THREE.HemisphereLight("#dcecff", "#b49a78", 0.55);
    this.sun = new THREE.DirectionalLight("#fff3e0", 2.8);
    this.sun.castShadow = true; this.sun.shadow.mapSize.set(2048, 2048);
    R.add(this.hemi, this.sun, this.sun.target);

    const woodM = lam({ map: rep(planks(), 6, 6), color: "#b3a284" }); // tinted down: raw planks() reads neon-yellow
    const woodDark = lam({ map: rep(beam(), 2, 1) });
    const wallM = lam({ map: rep(woodWallTex(), 3, 1.4) });
    const steel = lam({ color: "#c9ccd2" }), steelBright = lam({ color: "#e8ecf2" }), steelDark = lam({ color: "#7d848c" });
    const gold = lam({ color: "#d9a441" }), brass = lam({ color: "#a87c34" });
    const gripM = lam({ color: "#5a3421" });

    // a sword as a small group: grip + guard + blade box, origin at the guard, blade toward +x
    const sword3D = (bladeLen: number, bladeW: number, bladeT: number, mat: THREE.Material, serrated = false) => {
      const g = new THREE.Group();
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.024, 0.17, 10).rotateZ(Math.PI / 2), gripM);
      grip.position.x = -0.1; grip.castShadow = true; g.add(grip);
      const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), brass);
      pommel.position.x = -0.19; g.add(pommel);
      const guard = new THREE.Mesh(new THREE.BoxGeometry(0.03, bladeW * 2.1, 0.055), brass);
      guard.castShadow = true; g.add(guard);
      if (!serrated) {
        const bl = new THREE.Mesh(new THREE.BoxGeometry(bladeLen, bladeW, bladeT), mat);
        bl.position.x = bladeLen / 2; bl.castShadow = true; g.add(bl);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(bladeW * 0.72, 0.12, 4).rotateZ(-Math.PI / 2), mat);
        tip.scale.z = bladeT / bladeW * 1.4; tip.position.x = bladeLen + 0.055; g.add(tip);
      } else { // the edge chewed into a saw: a spine strip + teeth cones hanging from it
        const spine = new THREE.Mesh(new THREE.BoxGeometry(bladeLen, bladeW * 0.45, bladeT), mat);
        spine.position.set(bladeLen / 2, bladeW * 0.26, 0); spine.castShadow = true; g.add(spine);
        for (let i = 0; i < 11; i++) {
          const th = new THREE.Mesh(new THREE.ConeGeometry(bladeW * 0.30, bladeW * (0.5 + hh(i, 3) * 0.45), 4), mat);
          th.rotation.x = Math.PI; th.position.set(0.06 + i * (bladeLen - 0.1) / 10, -bladeW * 0.12, 0); g.add(th);
        }
      }
      return g;
    };

    // ================= the workshop (origin) =================
    const T = this.taller;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(17, 15).rotateX(-Math.PI / 2), woodM);
    floor.position.set(0, 0, 1); floor.receiveShadow = true; T.add(floor);
    const backW = new THREE.Mesh(new THREE.PlaneGeometry(17, 7.6), wallM);
    backW.position.set(0, 3.8, -6); backW.receiveShadow = true; T.add(backW);
    const sideL = new THREE.Mesh(new THREE.PlaneGeometry(15, 7.6).rotateY(Math.PI / 2), wallM);
    sideL.position.set(-8, 3.8, 1); T.add(sideL);
    const sideR = new THREE.Mesh(new THREE.PlaneGeometry(15, 7.6).rotateY(-Math.PI / 2), wallM);
    sideR.position.set(8, 3.8, 1); T.add(sideR);
    for (const bz of [-3.5, 0.5, 4.5]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(16.4, 0.4, 0.5), woodDark);
      b.position.set(0, 5.2, bz); T.add(b);
    }
    // the bright window on the left wall — the old man's light
    const winGlow = new THREE.MeshBasicMaterial({}); winGlow.color.setRGB(2.0, 1.7, 1.25);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.7).rotateY(Math.PI / 2), winGlow);
    win.position.set(-7.94, 2.9, -1.2); win.layers.set(NOINK); T.add(win);
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.9, 2.5), woodDark);
    winFrame.position.set(-7.99, 2.9, -1.2); T.add(winFrame);
    const winBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.7, 0.09), woodDark);
    winBar.position.set(-7.93, 2.9, -1.2); T.add(winBar);
    // the workbench
    const bench = new THREE.Group(); bench.position.set(-1.3, 0, -1.9); T.add(bench);
    const top = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.12, 1.15), lam({ map: rep(planks(), 2, 0.6), color: "#c0aa87" }));
    top.position.y = 0.98; top.castShadow = true; top.receiveShadow = true; bench.add(top);
    for (const [lx, lz] of [[-1.8, -0.45], [1.8, -0.45], [-1.8, 0.45], [1.8, 0.45]] as const) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.12), woodDark);
      leg.position.set(lx, 0.48, lz); leg.castShadow = true; bench.add(leg);
    }
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.07, 0.95), woodDark);
    shelf.position.y = 0.3; bench.add(shelf);
    // whetstone with its water sheen + bowl, at the maestro's end of the bench
    const stone1 = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.09, 0.21), lam({ color: "#5d6a72" }));
    stone1.position.set(-2.15, 1.09, -1.98); stone1.castShadow = true; T.add(stone1);
    const wet = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.012, 0.17), lam({ color: "#2e3c44" }));
    wet.position.set(-2.15, 1.14, -1.98); T.add(wet);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 0.09, 14), lam({ color: "#7a4b2a" }));
    bowl.position.set(-1.62, 1.09, -2.12); bowl.castShadow = true; T.add(bowl);
    // the FIRST sword, resting on the bench (the one with "la carne")
    const primera = sword3D(0.92, 0.045, 0.008, steelDark);
    primera.position.set(-1.62, 1.07, -1.82); primera.rotation.y = 1.15; T.add(primera); // pointing away, dimmer: on-axis and bright, it stole the S5/S15 macros (still f1180)
    // a modest stack of coins on the bench, and the sign on the wall
    for (let i = 0; i < 5; i++) {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.012, 14), gold);
      c.position.set(0.42, 1.05 + i * 0.013, -2.05); T.add(c);
    }
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.79), lam({ map: signTex() }));
    sign.position.set(4.7, 3.15, -5.93); T.add(sign);
    // the sword rack on the back wall: two rails and four hanging swords
    for (const ry of [1.55, 2.95]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.09, 0.09), woodDark);
      rail.position.set(3.6, ry, -5.88); T.add(rail);
    }
    for (let i = 0; i < 4; i++) { // wider blades turned a quarter to the light, so they read as swords, not cords
      const sw = sword3D(0.85, 0.06, 0.008, i % 2 ? steelBright : steel);
      sw.position.set(2.55 + i * 0.68, 2.92, -5.84); sw.rotation.z = -Math.PI / 2 + 0.06; sw.rotation.y = 0.35; T.add(sw);
    }
    // hanging tools on the right wall: file, hammer, tongs (dark silhouettes)
    const toolM = lam({ color: "#3a3f45" });
    const file = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.02), toolM);
    file.position.set(7.9, 2.6, -2.5); file.rotation.y = -Math.PI / 2; T.add(file);
    const hamH = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.55, 0.04), gripM);
    hamH.position.set(7.9, 2.45, -1.6); T.add(hamH);
    const hamB = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.3), toolM);
    hamB.position.set(7.9, 2.75, -1.6); T.add(hamB);
    // the client's side table: the fortune, in coin stacks and a pouch
    const table = new THREE.Group(); table.position.set(2.28, 0, 0.97); T.add(table);
    const ttop = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.06, 20), lam({ map: rep(planks(), 1, 1), color: "#c0aa87" }));
    ttop.position.y = 0.92; ttop.castShadow = true; ttop.receiveShadow = true; table.add(ttop);
    const tleg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.9, 10), woodDark);
    tleg.position.y = 0.46; table.add(tleg);
    for (const [sx, sz, n] of [[-0.25, -0.1, 7], [0.05, 0.18, 5], [0.28, -0.2, 9]] as const)
      for (let i = 0; i < n; i++) {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.013, 14), gold);
        c.position.set(sx, 0.96 + i * 0.014, sz); c.castShadow = true; table.add(c);
      }
    const pouch = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), lam({ color: "#5a4028" }));
    pouch.scale.set(0.95, 0.58, 0.95); pouch.position.set(-0.05, 1.0, -0.28); pouch.castShadow = true; table.add(pouch);
    // a crate of tools in the near foreground (depth for the maestro close-ups)
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.5, 0.55), woodDark);
    crate.position.set(-2.1, 0.25, 0.75); crate.castShadow = true; crate.receiveShadow = true; T.add(crate);
    const crateSword = sword3D(0.8, 0.04, 0.007, steelDark);
    crateSword.position.set(-2.1, 0.56, 0.75); crateSword.rotation.y = 0.8; T.add(crateSword);
    // ---- MACRO set A: the paper-thin blade lying across two supports, a weight stone hanging mid-blade ----
    const TM = this.thinMacro; TM.position.set(-1.0, 1.045, -1.28); T.add(TM); // at the bench's front edge, so the weight hangs in view
    for (const sx of [-0.48, 0.48]) {
      const sup = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.16), woodDark);
      sup.position.set(sx, 0.035, 0); TM.add(sup);
    }
    const seg1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.055, 0.0035), steelBright);
    seg1.position.x = -0.36; seg1.castShadow = true; TM.add(seg1);
    this.thinSeg2.position.set(-0.18, 0, 0); TM.add(this.thinSeg2);
    const seg2 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.048, 0.003), steelBright);
    seg2.position.x = 0.18; this.thinSeg2.add(seg2);
    this.thinSeg3.position.set(0.36, 0, 0); this.thinSeg2.add(this.thinSeg3);
    const seg3 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.0025), steelBright);
    seg3.position.x = 0.17; this.thinSeg3.add(seg3);
    const weight = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), lam({ color: "#4c4f45" }));
    weight.position.set(0.1, -0.17, 0); weight.castShadow = true; TM.add(weight);
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.13, 6), lam({ color: "#2c2118" }));
    string.position.set(0.1, -0.075, 0); TM.add(string);
    this.crack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.013, 0.006), lam({ color: "#0d0b0a" }));
    this.crack.position.set(0.05, 0.03, 0); TM.add(this.crack); // proud of the blade's face so the crack READS (still f1180)
    // ---- MACRO set B: the first sword standing on its spine in a slotted stand, its convex profile to camera ----
    const PM = this.primeraMacro; PM.position.set(-0.97, 1.045, -1.28); T.add(PM);
    for (const sx of [-0.42, 0.42]) {
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.13, 0.2), woodDark);
      block.position.set(sx, 0.065, 0); block.castShadow = true; PM.add(block);
    }
    const profShape = new THREE.Shape(); // side profile: spine on top, the edge below swelling into "la carne"
    profShape.moveTo(-0.55, 0.055);
    profShape.lineTo(0.48, 0.05);
    profShape.quadraticCurveTo(0.58, 0.045, 0.6, 0.0);
    profShape.quadraticCurveTo(0.35, -0.062, 0.05, -0.07); // the bulge, deepened after still f1245 read too flat
    profShape.quadraticCurveTo(-0.3, -0.072, -0.55, -0.01);
    profShape.closePath();
    const prof = new THREE.Mesh(new THREE.ExtrudeGeometry(profShape, { depth: 0.007, bevelEnabled: false }), steel);
    prof.position.set(0, 0.185, -0.0035); prof.castShadow = true; PM.add(prof);
    const profGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.023, 0.17, 10).rotateZ(Math.PI / 2), gripM);
    profGrip.position.set(-0.64, 0.185, 0); PM.add(profGrip);
    const profGuard = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.15, 0.05), brass);
    profGuard.position.set(-0.545, 0.185, 0); PM.add(profGuard);
    // ---- the magnifier station (shot 8): the single-atom needle under the big lens ----
    const mag = new THREE.Group(); mag.position.set(0.45, 1.045, -2.08); T.add(mag); // back-right corner of the bench, clear of the macros and of shot edges
    const nBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.2), woodDark);
    nBase.position.y = 0.015; mag.add(nBase);
    const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0008, 0.3, 8).rotateZ(Math.PI / 2), steelDark);
    needle.position.set(0, 0.075, 0); mag.add(needle);
    const atom = new THREE.Mesh(new THREE.SphereGeometry(0.011, 10, 8), steelBright);
    atom.position.set(0.155, 0.075, 0); mag.add(atom);
    const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 10, 28), gripM);
    lensRing.position.set(0.05, 0.3, 0); lensRing.rotation.x = 0.5; lensRing.castShadow = true; mag.add(lensRing);
    const lensGlass = new THREE.Mesh(new THREE.CircleGeometry(0.165, 28),
      new THREE.MeshBasicMaterial({ color: "#cfe4f2", transparent: true, opacity: 0.16, depthWrite: false }));
    lensGlass.position.copy(lensRing.position); lensGlass.rotation.x = 0.5 - Math.PI / 2 + Math.PI / 2; lensGlass.rotation.set(-Math.PI / 2 + 0.5, 0, 0);
    lensGlass.position.set(0.05, 0.3, 0); mag.add(lensGlass);
    const lensHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.3, 8), gripM);
    lensHandle.position.set(0.22, 0.16, -0.1); lensHandle.rotation.z = -0.6; lensHandle.rotation.x = 0.4; mag.add(lensHandle);
    const lensPost = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8), brass);
    lensPost.position.set(-0.14, 0.16, -0.06); mag.add(lensPost);
    R.add(T);

    // ---- the presentation table (shot 7): the volcanic-glass blade in its open box ----
    const ptab = new THREE.Group(); ptab.position.set(-0.4, 0, 1.3); T.add(ptab);
    const ptop = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.05, 18), lam({ map: rep(planks(), 1, 1), color: "#c0aa87" }));
    ptop.position.y = 0.86; ptop.castShadow = true; ptop.receiveShadow = true; ptab.add(ptop);
    const pleg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.84, 10), woodDark);
    pleg.position.y = 0.42; ptab.add(pleg);
    const boxBase = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.05, 0.26), woodDark);
    boxBase.position.set(0, 0.91, 0); boxBase.castShadow = true; ptab.add(boxBase);
    const boxLid = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.03, 0.26), woodDark);
    boxLid.position.set(-0.24, 0.885, -0.05); ptab.add(boxLid); // flat under the box: leaning, it read as fallen debris (still f50)
    const obsMat = lam({ color: "#14161c" });
    const obsInBox = sword3D(0.52, 0.05, 0.005, obsMat);
    obsInBox.position.set(-0.05, 0.97, 0); obsInBox.rotation.z = 0.38; ptab.add(obsInBox);
    const streak = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.008, 0.006), lam({ color: "#9fb4c8" }));
    streak.position.set(0.18, 0.031, 0.004); obsInBox.add(streak); // on the blade's face: at 0.135 it floated as a stray line (still f520)

    // ================= the yard (x = 300) =================
    const P = this.patio;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(46, 34).rotateX(-Math.PI / 2), lam({ map: rep(dirtTex(), 9, 7), color: "#c2ab84" }));
    ground.position.set(300, 0, 303); ground.receiveShadow = true; P.add(ground);
    const fenceM = lam({ map: rep(planks(), 3, 1) });
    for (let fx = 288; fx <= 312; fx += 2.4) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.5, 0.14), woodDark);
      post.position.set(fx, 0.75, 309.5); post.castShadow = true; P.add(post);
    }
    for (const ry of [0.55, 1.15]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(24.5, 0.12, 0.06), fenceM);
      rail.position.set(300, ry, 309.45); rail.receiveShadow = true; P.add(rail);
    }
    const bambooMat = lam({ color: "#5d7d3a" }), bambooDark = lam({ color: "#47632c" }), leafM = lam({ color: "#6d9142" });
    const makeBamboo = (withTop: boolean) => {
      const g = new THREE.Group();
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.85, 12), bambooMat);
      lower.position.y = 0.425; lower.castShadow = true; g.add(lower);
      const topG = new THREE.Group(); topG.position.y = 0.85; g.add(topG);
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.082, 1.8, 12), bambooMat);
      upper.position.y = 0.9; upper.castShadow = true; topG.add(upper);
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.082 - i * 0.005, 0.012, 6, 14).rotateX(Math.PI / 2), bambooDark);
        ring.position.y = 0.55 + i * 0.58; topG.add(ring);
      }
      for (let i = 0; i < 6; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), leafM);
        leaf.scale.set(1.5, 0.16, 0.42); const a = i * 1.05 + 0.4;
        leaf.position.set(Math.cos(a) * 0.3, 1.78 + (i % 3) * 0.09, Math.sin(a) * 0.3);
        leaf.rotation.set(0.3 * Math.sin(a), a, 0.35); leaf.castShadow = true; topG.add(leaf);
      }
      if (!withTop) { /* decor clump: no cut animation needed */ }
      return { g, topG };
    };
    const b1 = makeBamboo(true); this.bamboo = b1.g; this.bambooTop = b1.topG; P.add(b1.g);
    const b2 = makeBamboo(true); this.bamboo2 = b2.g; this.bamboo2Top = b2.topG; b2.g.position.set(301.35, 0, 299.35); P.add(b2.g);
    const b3 = makeBamboo(true); this.bamboo3 = b3.g; b3.g.position.set(302.6, 0, 300.15); P.add(b3.g);
    for (const [cx, cz] of [[295.2, 296.5], [305.4, 297.2], [307.2, 303.5]] as const) { // background clumps
      const c = makeBamboo(false); c.g.position.set(cx, 0, cz); c.g.scale.setScalar(1.25); P.add(c.g);
    }
    for (let i = 0; i < 6; i++) { // the cut-bamboo pile by the fence side
      const piece = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1.15, 12).rotateZ(Math.PI / 2), bambooMat);
      piece.position.set(303.3 + (i % 2) * 0.1, 0.08 + Math.floor(i / 2) * 0.15, 298.55 + (i % 3) * 0.14);
      piece.rotation.y = (hh(i, 5) - 0.5) * 0.5; piece.castShadow = true; piece.receiveShadow = true;
      this.pile.push(piece); P.add(piece);
    }
    const debris = sword3D(0.72, 0.042, 0.005, steel, true); // the chewed thin sword, thrown on the ground
    debris.rotation.order = "YXZ"; debris.rotation.y = 0.7; debris.rotation.x = Math.PI / 2 - 0.06;
    debris.position.set(301.7, 0.05, 303.7); debris.name = "debris"; P.add(debris);
    // the strike rigs: the thin sword and the glass blade swing at the bamboo on pivots
    this.thinStrike.position.set(298.92, 1.5, 300.0); P.add(this.thinStrike);
    this.thinStraight = sword3D(0.98, 0.052, 0.003, steelBright); this.thinStrike.add(this.thinStraight);
    this.thinSerrated = sword3D(0.98, 0.052, 0.003, steelBright, true); this.thinStrike.add(this.thinSerrated);
    this.obsStrike.position.set(301.18, 1.5, 300.0); this.obsStrike.rotation.y = Math.PI; P.add(this.obsStrike);
    this.obsBlade = sword3D(0.85, 0.055, 0.005, obsMat); this.obsStrike.add(this.obsBlade);
    const obsStreak = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.009, 0.007), lam({ color: "#9fb4c8" }));
    obsStreak.position.set(0.45, 0.02, 0.004); this.obsBlade.add(obsStreak);
    for (let i = 0; i < 6; i++) { // steel chips from the first strike
      const chip = new THREE.Mesh(new THREE.TetrahedronGeometry(0.032), steelDark);
      chip.castShadow = true; this.chips.push(chip); P.add(chip);
    }
    this.shardRest = [[300.35, 300.62, 0.4], [299.8, 300.9, 1.7], [300.7, 300.3, 2.6], [300.1, 301.15, 0.9], [299.55, 300.45, 2.0],
      [300.55, 301.0, 1.2], [300.9, 300.75, 2.9], [299.9, 299.95, 0.2], [300.42, 300.05, 1.5]];
    for (let i = 0; i < 9; i++) { // the glass shards
      const sh = new THREE.Mesh(new THREE.TetrahedronGeometry(0.05), obsMat);
      sh.castShadow = true; this.shards.push(sh); P.add(sh);
    }
    // the atom-needle stand beside the bamboo
    const nstand = new THREE.Group(); nstand.position.set(300.78, 0, 300.95); P.add(nstand);
    const npost = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.95, 10), woodDark);
    npost.position.y = 0.475; npost.castShadow = true; nstand.add(npost);
    const narm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.035, 0.035), woodDark);
    narm.position.set(-0.1, 0.95, 0); nstand.add(narm);
    this.needlePatio.position.set(300.62, 0.98, 300.95); P.add(this.needlePatio);
    const pn = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.001, 0.34, 8).rotateZ(Math.PI / 2), steelDark);
    this.needlePatio.add(pn);
    const patom = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 8), steelBright);
    patom.position.x = -0.175; this.needlePatio.add(patom);
    for (let i = 0; i < 9; i++) { // grass tufts and two low bushes for depth
      const tx = 291 + hh(i, 31) * 19, tz = 295 + hh(i, 37) * 12;
      if (Math.hypot(tx - 300, tz - 301) < 3.2) continue;
      for (let j = 0; j < 3; j++) {
        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.3 + hh(i * 3 + j, 41) * 0.22, 6), leafM);
        blade.position.set(tx + (hh(j, 43) - 0.5) * 0.16, 0.16, tz + (hh(j, 47) - 0.5) * 0.16);
        blade.rotation.z = (hh(j, 53) - 0.5) * 0.5; P.add(blade);
      }
    }
    for (const [bx, bz, bs] of [[292.6, 305.5, 1.1], [308.6, 296.8, 0.9]] as const) {
      const bush = new THREE.Mesh(new THREE.SphereGeometry(bs, 12, 10), bambooDark);
      bush.scale.y = 0.62; bush.position.set(bx, bs * 0.4, bz); bush.castShadow = true; P.add(bush);
    }
    R.add(P);
  }

  /** camera-relative sun frozen per shot: az from the shot's mean view direction */
  private shotSun(id: number) {
    let v = this.sunCache.get(id);
    if (v) return v;
    const s = SHOTS[id - 1], L = DL;
    let fx = 0, fz = 0;
    for (let f = s.a; f < s.b; f += 3) { const c = camAt(id, f), x = c.look[0] - c.pos[0], z = c.look[2] - c.pos[2], n = Math.hypot(x, z) || 1; fx += x / n; fz += z / n; }
    const n = Math.hypot(fx, fz) || 1; fx /= n; fz /= n;
    const az = THREE.MathUtils.degToRad(AZ[id] ?? 70), el = THREE.MathUtils.degToRad(L.el);
    const hx = fx * Math.cos(az) - fz * Math.sin(az), hz = fz * Math.cos(az) + fx * Math.sin(az);
    v = new THREE.Vector3(hx * Math.cos(el), Math.sin(el), hz * Math.cos(el)).normalize();
    this.sunCache.set(id, v);
    return v;
  }
  private actor(i: number) { while (this.actors.length <= i) this.actors.push(new Actor(this.root)); return this.actors[i]; }
  private fx(i: number) { while (this.fxs.length <= i) this.fxs.push(new Fx(this.root)); return this.fxs[i]; }

  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const fw = worldF(f), t = fw / FPS, L = DL, S = SHOTS[id - 1];
    const zone = S.zone;
    const c = camAt(id, f);
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look);
    const sh = shakeAt(f);
    cam.position.x += sh[0]; cam.position.y += sh[1];
    cam.fov = c.fov; cam.near = 0.2; cam.far = 5000; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    cam.layers.enable(NOINK);
    const focus = V(...c.look), dist = cam.position.distanceTo(focus), sunDir = this.shotSun(id);
    this.hemi.color.set(L.sky); this.hemi.groundColor.set(L.ground); this.hemi.intensity = L.hemiI;
    this.sun.color.set(L.sunCol); this.sun.intensity = L.sunI;
    const Rr = THREE.MathUtils.clamp(dist * 1.15 + 7, 12, 120);
    this.sun.position.copy(focus).addScaledVector(sunDir, 300); this.sun.target.position.copy(focus);
    const sc = this.sun.shadow.camera;
    sc.left = -Rr; sc.right = Rr; sc.top = Rr; sc.bottom = -Rr; sc.near = 20; sc.far = 700; sc.updateProjectionMatrix();
    this.sun.shadow.bias = L.bias; this.sun.shadow.normalBias = L.normalBias * (Rr / 12);
    TONE.uLitCol.value.set(...L.lit); TONE.uShadeCol.value.set(...L.shade); TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert; TONE.uSideK.value = L.sideK; TONE.uTerm.value = L.term; TONE.uBounce.value.set(...K.bounce);
    TONE.uSat.value = K.sat;
    CHAR.uCharTint.value.set(...L.charTint); CHAR.uCharShade.value = L.charShade; CHAR.uGrad.value = L.charGrad;
    CHAR.uBodyGrad.value = L.bodyGrad; CHAR.uSideTint.value.set(...L.sideTint);
    const su = this.skyMat.uniforms;
    K.sky.c.forEach((hx, i) => untone(hx, su["c" + i].value));
    const e = K.sky.e.map((deg) => THREE.MathUtils.degToRad(deg));
    su.e.value.set(e[1], e[2], e[3], e[4]);
    this.sky.position.copy(cam.position);
    untone(FOGC[zone], this.fog.color);
    this.fog.near = S.fog[0]; this.fog.far = S.fog[1];
    scene.fog = this.fog; scene.background = null;
    this.taller.visible = zone === "taller";
    this.patio.visible = zone === "patio";

    // ---- prop states ----
    this.thinMacro.visible = id === 5 || id === 15;
    if (this.thinMacro.visible) {
      const bend = id === 5 ? smooth((f - 300) / 48) : 0.32 + 0.02 * Math.sin(f * 1.7);
      this.thinSeg2.rotation.z = -0.10 * bend;
      this.thinSeg3.rotation.z = -0.16 * bend;
      this.crack.visible = id === 15;
      if (id === 15) { const g2 = smooth((f - 1155) / 40); this.crack.scale.x = 0.15 + 0.85 * g2; this.crack.position.x = lerp(-0.08, 0.05, g2); }
    }
    this.primeraMacro.visible = id === 16;
    { // the bamboo: leaning against nothing in shot 9 until the old man plants it ("clavó" 712)
      const u = id === 9 ? smooth((f - EV.plantA) / (EV.plantB - EV.plantA)) : 1;
      this.bamboo.position.set(lerp(300.95, 300, u), 0, lerp(300.75, 300, u));
      this.bamboo.rotation.z = lerp(0.30, 0.02, u);
      const fall = (topG: THREE.Group, cut: number) => {
        const fu = id >= 18 ? smooth((f - cut) / 14) : 0;
        topG.rotation.z = -1.52 * fu + (fu < 0.05 ? 0.012 * Math.sin(t * 0.9) : 0);
        topG.position.y = 0.85 - 0.78 * fu; // the cut top must LAND on the ground, not hover at waist height (still f1600)
      };
      fall(this.bambooTop, EV.cut1);
      fall(this.bamboo2Top, EV.cut2);
      this.bamboo2.visible = this.bamboo3.visible = id >= 18;
      const pieces = id === 19 ? 5 : id === 18 ? (f >= EV.cut2 ? 4 : f >= EV.cut1 ? 2 : 0) : 0;
      this.pile.forEach((p, i) => { p.visible = i < pieces; });
    }
    this.thinStrike.visible = id === 10;
    if (id === 10) {
      let rz = 0.45;
      if (f >= EV.swing1A && f < EV.hit1) rz = lerp(0.45, -0.13, smooth((f - EV.swing1A) / (EV.hit1 - EV.swing1A)));
      else if (f >= EV.hit1) rz = -0.13 + 0.05 * Math.sin((f - EV.hit1) * 0.8) * Math.exp(-(f - EV.hit1) / 10);
      this.thinStrike.rotation.z = rz;
      this.thinStraight.visible = f < EV.hit1;
      this.thinSerrated.visible = f >= EV.hit1;
      this.chips.forEach((chip, i) => {
        const u = (f - EV.hit1) / 26;
        chip.visible = f >= EV.hit1 && u < 1.4;
        if (chip.visible) {
          const vx = (hh(i, 21) - 0.35) * 1.5, vz = (hh(i, 23) - 0.5) * 1.1, vy = 0.9 + hh(i, 29) * 0.8;
          chip.position.set(300 + vx * u, Math.max(0.03, 1.34 + vy * u - 2.0 * u * u), 300 + vz * u);
          chip.rotation.set(f * 0.4 + i, f * 0.3, i * 2.1);
        }
      });
    } else this.chips.forEach((chip) => { chip.visible = false; });
    this.obsStrike.visible = id === 11;
    if (id === 11) {
      let rz = 0.38;
      if (f >= EV.swing2A && f < EV.hit2) rz = lerp(0.38, -0.06, smooth((f - EV.swing2A) / (EV.hit2 - EV.swing2A)));
      else if (f >= EV.hit2) rz = -0.06;
      this.obsBlade.rotation.z = rz;
      this.obsBlade.visible = f < EV.hit2;
    }
    this.shards.forEach((s2, i) => {
      const rest = this.shardRest[i];
      if (id === 11 && f >= EV.hit2) {
        const u = Math.min(1, (f - EV.hit2) / 12);
        s2.visible = true;
        s2.position.set(lerp(300.15, rest[0], u), Math.max(0.035, lerp(1.25, 0.035, u) + Math.sin(u * Math.PI) * 0.22 * (1 - u)), lerp(300.1, rest[1], u));
        s2.rotation.set(u * 3 * (i + 1), rest[2], u * 2);
      } else if (id > 11 && zone === "patio") {
        s2.visible = true; s2.position.set(rest[0], 0.035, rest[1]); s2.rotation.set(0.4, rest[2], 0.2);
      } else s2.visible = false;
    });
    { // the atom needle on its stand: intact, then it jumps at the first touch ("saltó" 923) and lands spent
      const np = this.needlePatio;
      if (id === 12 && f >= EV.needleJump) {
        const u = Math.min(1, (f - EV.needleJump) / 17);
        if (u < 1) { np.position.set(300.62 - 0.1 * u, 0.98 + Math.sin(u * Math.PI) * 0.3, 300.95); np.rotation.z = 2.4 * u; }
        else { np.position.set(300.52, 0.05, 301.12); np.rotation.set(0, 0.4, 1.35); }
      } else if (id >= 13) { np.position.set(300.52, 0.05, 301.12); np.rotation.set(0, 0.4, 1.35); }
      else { np.position.set(300.62, 0.98, 300.95); np.rotation.set(0, 0, 0); }
    }
    const debris = this.patio.getObjectByName("debris");
    if (debris) debris.visible = zone === "patio" && id >= 11;

    // ---- cast ----
    const right = V(0, 0, 0).setFromMatrixColumn(cam.matrixWorld, 0);
    const light = light2D(sunDir, right);
    const st: Stage = { places: [], fx: [] };
    this.frustum.setFromProjectionMatrix(this.m4.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
    const lidAt = (i: number) => {
      let s = Math.round(-60 * hh(i, 9));
      for (let n = 0; s <= f && n < 80; n++) { const k = f - s; if (k >= 0 && k < 4) return [0.5, 1, 1, 0.5][k]; s += Math.round(15 + 54 * hh(i * 31 + n, 13)); }
      return 0;
    };
    const visible = (x: number, y: number, z: number, r: number) => this.frustum.intersectsSphere(this.sph.set(this.v.set(x, y, z), r));
    const person = (who: "maestro" | "cliente", x: number, y: number, z: number, opts: Parameters<typeof bodyFront>[2], i: number, marks: Marks = {}) => {
      if (!visible(x, y + 1.1, z, 3.5)) return;
      const d = cam.position.distanceTo(this.v.set(x, y + 1.2, z)), [w, h, k] = tier(d), near = d < 16;
      const o2 = { ...opts, light, seed: (i * 5 + 3) % 7 + 1, blink: near ? lidAt(i) : 0 };
      if (!near) o2.expr = "neutral" as Expr; // (all our acting shots are near; the rule stays from the template)
      const o = who === "maestro" ? MAESTRO : CLIENTE;
      st.places.push({ key: `${who}|${JSON.stringify(o2)}|${marks.nick ? "n" : ""}${marks.bandaid ? "b" : ""}`, x, y, z, size: [w, h, k], draw: charDraw(who, o, o2, marks) });
      if (d < 60) blob(st, sunDir, x, y, z);
    };
    const M = { x: -1.9, z: -0.9 }, C = { x: 1.5, z: 0.4 };           // workshop homes (closer: vertical frame is narrow)
    const Cp = { x: 302.3, z: 302.6 };   // yard home
    const SERENE: Expr = "smile_closed"; // the master's face NEVER changes: that is the joke and the lesson

    if (id === 1) { // the hook shot stands them closer together so the two-shot can stay tight
      person("maestro", -1.55, 0, -0.7, { mode: "stand", expr: SERENE, facing: 0, prop: ["sword", 0.3] }, 11);
      person("cliente", 1.25, 0, 0.3, { mode: "stand", expr: f < 43 ? "smile" : "nervous", facing: 0 }, 12);
    }
    if (id === 2) person("cliente", C.x, 0, C.z, { mode: "stand", expr: "lick", facing: 0, look: -1 }, 12);
    if (id === 3) person("maestro", M.x, 0, M.z, { mode: "stand", expr: SERENE, facing: 0, prop: ["sword", 0.3] }, 11);
    if (id === 4) person("cliente", C.x, 0, C.z, {
      mode: "stand", expr: f < 257 ? "stern" : f < 283 ? "shout" : "stern", facing: f < 283 ? 0 : 1 }, 12);
    if (id === 6) {
      const k = f < EV.nick ? qk(0.78 + 0.07 * Math.sin(f * 0.11)) : 0.3;
      person("cliente", C.x, 0, C.z, { mode: "stand", expr: f < 425 ? "smile" : "pained", facing: 0, prop: ["sword", k] }, 12, { nick: f >= 426 });
    }
    if (id === 7) { // he steps up to the presentation table to show off the glass blade
      person("cliente", 1.15, 0, 0.75, { mode: "stand", expr: "grin", facing: 0, wave: 0.35 }, 12, { bandaid: true });
      person("maestro", -3.6, 0, -1.6, { mode: "stand", expr: SERENE, facing: 0 }, 11); // clear of this frame: at his home spot he cropped as a half-head at the edge (still f520)
    }
    // shot 8 is a pure macro (the needle under the lens); the client's fascination lives in shots 7, 11 and 12
    if (id === 9) {
      person("maestro", 299.0, 0, 302.2, { mode: "stand", expr: SERENE, facing: 0 }, 11);
      person("cliente", 301.2, 0, 301.6, { mode: "stand", expr: "grin", facing: 0 }, 12, { bandaid: true });
    }
    if (id === 10) {
      const k = f < 770 ? 0.6 : f < EV.swing1A ? qk(lerp(0.6, 0.92, smooth((f - 770) / 16))) : f < EV.hit1 ? qk(lerp(0.92, 0.12, (f - EV.swing1A) / (EV.hit1 - EV.swing1A))) : 0.15;
      person("cliente", 301.9, 0, 301.9, { mode: "stand", expr: f < EV.hit1 ? "stern" : "shock", facing: 0, prop: ["sword", k] }, 12, { bandaid: true });
      person("maestro", 297.9, 0, 300.6, { mode: "stand", expr: SERENE, facing: 0 }, 11);
    }
    if (id === 11) {
      person("cliente", 301.6, 0, 302.1, f < EV.hit2
        ? { mode: "stand", expr: "stern", facing: 0, wave: 0.85 }
        : { mode: "stand", expr: "dazed", facing: 0, headTilt: 4 }, 12, { bandaid: true });
      person("maestro", 297.9, 0, 300.6, { mode: "stand", expr: SERENE, facing: 0 }, 11);
    }
    if (id === 12) // behind the bamboo, soft in the macro's depth: nervous, then dazed when the atom jumps
      person("cliente", 299.3, 0, 299.3, { mode: "stand", expr: f < EV.needleJump ? "nervous" : "dazed", facing: 0 }, 12, { bandaid: true });
    if (id === 13) {
      person("cliente", 302.2, 0, 302.2, { mode: "stand", expr: "shout", facing: 0, wave: 0.95, headTilt: -3 }, 12, { bandaid: true });
      person("maestro", 298.3, 0, 301.0, { mode: "stand", expr: SERENE, facing: 0 }, 11);
    }
    if (id === 14) person("maestro", M.x, 0, M.z, {
      mode: "stand", expr: SERENE, facing: 0, headTilt: f < 1069 ? 0 : f < 1086 ? -2.5 : 0 }, 11);
    if (id === 17) {
      person("maestro", M.x, 0, M.z, { mode: "stand", expr: SERENE, facing: 0, prop: ["sword", 0.55] }, 11);
      person("cliente", C.x, 0, C.z, { mode: "stand", expr: f < 1390 ? "neutral" : "relief", facing: 0 }, 12, { bandaid: true });
    }
    if (id === 18) {
      const k = f < 1420 ? 0.5 : f < EV.cut1A ? lerp(0.5, 0.9, smooth((f - 1420) / 18))
        : f < EV.cut1 ? lerp(0.9, 0.08, (f - EV.cut1A) / (EV.cut1 - EV.cut1A))
        : f < EV.cut2A ? lerp(0.08, 0.85, smooth((f - EV.cut1) / 8))
        : f < EV.cut2 ? lerp(0.85, 0.08, (f - EV.cut2A) / (EV.cut2 - EV.cut2A))
        : lerp(0.08, 0.45, smooth((f - EV.cut2) / 20));
      person("maestro", 298.3, 0, 301.0, { mode: "stand", expr: SERENE, facing: 0, prop: ["sword", qk(k)] }, 11);
      person("cliente", 301.3, 0, 302.3, { mode: "stand", expr: "relief_open", facing: 0 }, 12, { bandaid: true }); // stepped in: at 301.9 his card cropped at the frame edge (still f1500)
    }
    if (id === 19) {
      person("maestro", 298.6, 0, 301.2, { mode: "stand", expr: SERENE, facing: 0 }, 11);
      person("cliente", 301.9, 0, 302.4, { mode: "stand", expr: f < 1658 ? "relief" : "smile_closed", facing: 0 }, 12, { bandaid: true });
    }

    let ai = 0;
    for (const p of st.places) {
      const a = this.actor(ai++), [w, h, k] = p.size, s = p.scale ?? 1;
      a.r = this.pool.req(p.key, w, h, k, p.draw);
      a.mesh.geometry = BODY;
      a.mesh.visible = true; a.mesh.position.set(p.x, p.y, p.z);
      a.mesh.rotation.set(0, Math.atan2(cam.position.x - p.x, cam.position.z - p.z), 0);
      a.mesh.scale.set(p.mirror ? -s : s, s, s);
    }
    for (let i = ai; i < this.actors.length; i++) this.actors[i].mesh.visible = false;
    let fi = 0;
    for (const p of st.fx) {
      if (!visible(p.x, p.y, p.z, Math.max(p.w, p.h))) continue;
      const en = this.fx(fi++);
      en.r = this.pool.req(p.key, p.cw, p.ch, 1, p.draw);
      en.use(!!p.soft); en.mesh.visible = true; en.mesh.position.set(p.x, p.y, p.z);
      if (p.flat) en.mesh.rotation.set(-Math.PI / 2, 0, p.rot ?? 0);
      else {
        const yaw = Math.atan2(cam.position.x - p.x, cam.position.z - p.z);
        en.mesh.rotation.order = "YXZ"; en.mesh.rotation.set(0, yaw, p.lean ?? 0);
        if (p.soft) en.mesh.quaternion.copy(cam.quaternion);
      }
      en.mesh.scale.set(p.w, p.h, 1);
    }
    for (let i = fi; i < this.fxs.length; i++) this.fxs[i].mesh.visible = false;
    this.pool.flush();
    for (let i = 0; i < ai; i++) this.actors[i].bind();
    for (let i = 0; i < fi; i++) this.fxs[i].bind();
    return focus;
  }
}
