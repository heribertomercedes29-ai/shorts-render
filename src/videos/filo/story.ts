// Timeline of the "la carne" (the edge you must NOT over-sharpen) short, 56.28 s, timed to public/voz/filo.wav
// (palabras.json, 163 words; the narration ends at frame 1669, the composition runs to the end of the voice file).
// BUILT WITH THE IMPROVEMENTS PACKAGE (Heriberto, 2026-11-10): 19 short shots (2-4 s) on the 18 beats, HARD CUTS
// between shots (XFADE = 0, allowed by the package; the cut count is reported as it comes out), the camera never
// stops inside a shot, deliberate framing variety (macros of the edge, low patio camera, close faces, wides).
// words (frames): negó 41 · fortuna 130-142 · Déjale 164 · carne 179-188 · anciano 209-219 · furioso 257-268 ·
// se fue 268-289 · mandó 293 · afilar otra 301-316 · fina 338-347 · papel 356-362 · cortó 424-434 · ceja 439-449 ·
// admirarla 468-484 · volcánico 551-567 · aguja 609-619 · átomo 634-645 · punta 652-662 · clavó 712-722 ·
// astilló 813-825 · sierra 836-845 · estalló 881-894 · saltó 923-934 · roce 943-954 · culpó 1009-1018 ·
// problema 1058-1069 · nunca 1069-1082 · delgado 1138-1150 · sostenga 1189-1202 · abultamiento 1270-1288 ·
// concha 1335-1346 · carne 1392-1402 · cortó(bambú) 1447-1460 · tras bambú 1468-1485 · inmutarse 1495-1511 ·
// dejar 1662-1669
export const FPS = 30;
export const TOTAL = 1688;
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const smoother = (x: number) => { const u = clamp01(x); return u * u * u * (u * (6 * u - 15) + 10); };

type Key = { f: number; pos: V3; look: V3; fov: number; glide?: boolean };
export type ShotDef = { id: number; a: number; b: number; keys: Key[]; fog: [number, number]; zone: "taller" | "patio" };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 80, zone: "taller", fog: [6, 42], keys: [ // beat 1: the refusal — two-shot, slow push-in
    { f: 0, pos: [0.1, 1.9, 7.0], look: [-0.15, 1.18, -0.2], fov: 48 },
    { f: 80, pos: [-0.05, 1.8, 6.35], look: [-0.15, 1.19, -0.2], fov: 48 },
  ] },
  { id: 2, a: 80, b: 142, zone: "taller", fog: [3, 30], keys: [ // beat 2: the fortune offered — the client, coins at his side
    { f: 80, pos: [2.75, 1.66, 3.95], look: [1.72, 1.18, 0.62], fov: 42 },
    { f: 142, pos: [2.5, 1.6, 3.4], look: [1.74, 1.19, 0.62], fov: 41 },
  ] },
  { id: 3, a: 142, b: 219, zone: "taller", fog: [2.5, 26], keys: [ // beat 3: "déjale la carne" — the old man, close, unhurried push
    { f: 142, pos: [-0.9, 1.7, 1.9], look: [-1.9, 1.47, -0.9], fov: 38 },
    { f: 219, pos: [-1.15, 1.62, 1.45], look: [-1.9, 1.47, -0.9], fov: 37 },
  ] },
  { id: 4, a: 219, b: 293, zone: "taller", fog: [4, 34], keys: [ // beat 4a: fury — the client shouts, then turns to leave ("se fue" 268-289)
    { f: 219, pos: [1.1, 1.75, 4.8], look: [2.0, 1.32, 0.6], fov: 42 },
    { f: 293, pos: [1.65, 1.62, 4.0], look: [2.05, 1.3, 0.6], fov: 41 },
  ] },
  { id: 5, a: 293, b: 362, zone: "taller", fog: [1.2, 18], keys: [ // beat 4b: MACRO — the new blade, thin as paper, drooping under its weight stone
    { f: 293, pos: [0.75, 1.42, 0.75], look: [-1.0, 1.05, -1.3], fov: 48 },
    { f: 362, pos: [0.45, 1.34, 0.42], look: [-1.0, 1.04, -1.3], fov: 47 },
  ] },
  { id: 6, a: 362, b: 484, zone: "taller", fog: [3, 30], keys: [ // beat 5: he admires it — and cuts his eyebrow ("cortó" 424)
    { f: 362, pos: [3.05, 1.7, 3.5], look: [2.0, 1.42, 0.6], fov: 39 },
    { f: 484, pos: [2.7, 1.62, 2.9], look: [2.0, 1.43, 0.6], fov: 38 },
  ] },
  { id: 7, a: 484, b: 567, zone: "taller", fog: [4, 34], keys: [ // beat 6: the volcanic-glass blade, presented in its box
    { f: 484, pos: [1.17, 1.76, 5.1], look: [0.24, 1.08, 0.85], fov: 52 },
    { f: 567, pos: [0.9, 1.66, 4.6], look: [0.24, 1.09, 0.85], fov: 53 },
  ] },
  { id: 8, a: 567, b: 662, zone: "taller", fog: [1.2, 18], keys: [ // beat 7: MACRO — the single-atom needle under the big magnifier
    { f: 567, pos: [1.15, 1.52, 0.35], look: [0.42, 1.16, -2.02], fov: 38 },
    { f: 662, pos: [0.9, 1.44, 0.05], look: [0.42, 1.15, -2.02], fov: 37 },
  ] },
  { id: 9, a: 662, b: 757, zone: "patio", fog: [9, 80], keys: [ // beat 8: LOW camera — the old man plants the dry bamboo ("clavó" 712)
    { f: 662, pos: [297.6, 0.66, 306.4], look: [300.4, 1.28, 300.4], fov: 56 },
    { f: 757, pos: [298.1, 0.58, 305.5], look: [300.4, 1.26, 300.4], fov: 55 },
  ] },
  { id: 10, a: 757, b: 845, zone: "patio", fog: [5, 55], keys: [ // beat 9: the thin sword strikes ("astilló" 813) — macro, then an 18-frame whip back to the shock
    { f: 757, pos: [298.85, 1.3, 302.7], look: [300.0, 1.22, 300.0], fov: 44 },
    { f: 812, pos: [299.05, 1.32, 303.05], look: [300.0, 1.22, 300.0], fov: 44 },
    { f: 830, pos: [300.7, 1.75, 306.9], look: [301.3, 1.3, 301.4], fov: 47, glide: true },
    { f: 845, pos: [300.85, 1.78, 307.3], look: [301.32, 1.3, 301.4], fov: 47 },
  ] },
  { id: 11, a: 845, b: 894, zone: "patio", fog: [5, 55], keys: [ // beat 10: the glass bursts ("estalló" 881)
    { f: 845, pos: [301.9, 1.58, 305.4], look: [300.9, 1.25, 300.6], fov: 44 },
    { f: 894, pos: [301.5, 1.5, 304.7], look: [300.9, 1.24, 300.6], fov: 43 },
  ] },
  { id: 12, a: 894, b: 954, zone: "patio", fog: [1.5, 20], keys: [ // beat 11: MACRO — the atom needle jumps at the first touch ("saltó" 923)
    { f: 894, pos: [301.7, 1.18, 302.4], look: [300.62, 0.95, 300.8], fov: 34 },
    { f: 954, pos: [301.42, 1.1, 301.95], look: [300.62, 0.94, 300.8], fov: 34 },
  ] },
  { id: 13, a: 954, b: 1030, zone: "patio", fog: [7, 65], keys: [ // beat 12: he blames the material — pointing at the old man, debris at their feet
    { f: 954, pos: [298.9, 2.0, 311.4], look: [300.3, 1.3, 301.4], fov: 52 },
    { f: 1030, pos: [299.2, 1.9, 310.4], look: [300.3, 1.3, 301.4], fov: 51 },
  ] },
  { id: 14, a: 1030, b: 1102, zone: "taller", fog: [2.5, 26], keys: [ // beat 13: "nunca fue el material" — the old man, close, barely shaking his head
    { f: 1030, pos: [-1.05, 1.7, 1.8], look: [-1.9, 1.49, -0.9], fov: 38 },
    { f: 1102, pos: [-1.3, 1.64, 1.4], look: [-1.9, 1.49, -0.9], fov: 37 },
  ] },
  { id: 15, a: 1102, b: 1202, zone: "taller", fog: [1.2, 18], keys: [ // beat 14: MACRO — the thin edge in profile: less steel to hold it; a crack creeps
    { f: 1102, pos: [0.5, 1.4, 0.8], look: [-1.0, 1.06, -1.3], fov: 48 },
    { f: 1202, pos: [0.2, 1.33, 0.5], look: [-1.0, 1.05, -1.3], fov: 47 },
  ] },
  { id: 16, a: 1202, b: 1288, zone: "taller", fog: [1.2, 18], keys: [ // beat 15a: MACRO — the other profile: the gentle bulge behind the edge, "la carne"
    { f: 1202, pos: [0.6, 1.44, 0.9], look: [-0.98, 1.2, -1.3], fov: 48 },
    { f: 1288, pos: [0.52, 1.41, 0.86], look: [-0.98, 1.19, -1.3], fov: 47 },
  ] },
  { id: 17, a: 1288, b: 1402, zone: "taller", fog: [3.5, 32], keys: [ // beats 15b+16: the master presents the first sword — "lo llaman la carne" (1392)
    { f: 1288, pos: [0.25, 2.02, 7.4], look: [-0.2, 1.3, -0.3], fov: 52 },
    { f: 1402, pos: [-0.02, 1.96, 7.3], look: [-0.2, 1.3, -0.3], fov: 51 },
  ] },
  { id: 18, a: 1402, b: 1511, zone: "patio", fog: [8, 75], keys: [ // beat 17: LOW — the first sword cuts bamboo after bamboo (cuts at 1447 and 1468-1485)
    { f: 1402, pos: [296.4, 0.55, 308.6], look: [300.3, 1.05, 300.9], fov: 62 },
    { f: 1511, pos: [296.8, 0.52, 308.55], look: [300.3, 1.03, 300.9], fov: 61 },
  ] },
  { id: 19, a: 1511, b: TOTAL, zone: "patio", fog: [10, 95], keys: [ // beat 18: the close — a slow rise and pull-back over the pile of cut bamboo
    { f: 1511, pos: [296.9, 2.2, 310.6], look: [300.4, 1.2, 300.7], fov: 50 },
    { f: TOTAL, pos: [295.8, 3.1, 313.2], look: [300.4, 1.15, 300.7], fov: 50 },
  ] },
];
export const XFADE = 0; // the improvements package allows hard cuts; shots change on the beat, no crossfade

/** story events on word frames (palabras.json) */
export const EV = {
  nick: 424,          // "se cortó" — the eyebrow cut lands; from 426 the client is "pained", the red nick shows
  bandaidFrom: 484,   // from shot 7 on, a bandage covers the cut brow
  plantA: 705, plantB: 726,   // the bamboo goes from leaning to planted ("clavó" 712-722)
  swing1A: 786, hit1: 810,    // the thin sword swings and strikes the bamboo ("astilló" 813)
  swing2A: 862, hit2: 881,    // the glass blade taps and bursts ("estalló" 881)
  needleJump: 923,            // the atom needle jumps ("saltó" 923-934)
  cut1A: 1438, cut1: 1456,    // first bamboo cut ("cortó" 1447-1460)
  cut2A: 1464, cut2: 1482,    // second bamboo cut ("tras bambú" 1468-1485)
};

/** impact shakes: small, sign flipping per frame, dead in ~8 frames */
const SHAKES = [
  { f0: EV.plantB, amp: 0.030 },
  { f0: EV.hit1, amp: 0.050 },
  { f0: EV.hit2, amp: 0.045 },
  { f0: EV.cut1, amp: 0.035 },
  { f0: EV.cut2, amp: 0.035 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const camAt = (id: number, f: number) => {
  const k = SHOTS[id - 1].keys;
  if (f <= k[0].f) return { pos: k[0].pos, look: k[0].look, fov: k[0].fov };
  for (let i = 1; i < k.length; i++) if (f <= k[i].f) {
    const u = (f - k[i - 1].f) / (k[i].f - k[i - 1].f), t = k[i].glide ? smoother(u) : u;
    return { pos: lerp3(k[i - 1].pos, k[i].pos, t), look: lerp3(k[i - 1].look, k[i].look, t), fov: lerp(k[i - 1].fov, k[i].fov, t) };
  }
  const l = k[k.length - 1];
  return { pos: l.pos, look: l.look, fov: l.fov };
};

/** hard cuts (package): one layer at a time, the shot changes exactly on its first frame */
export const layersAt = (f: number): { id: number; alpha: number }[] => {
  for (let i = SHOTS.length - 1; i >= 0; i--) if (f >= SHOTS[i].a) return [{ id: i + 1, alpha: 1 }];
  return [{ id: 1, alpha: 1 }];
};

/** no slow motion in this story: the world clock runs 1:1 */
export const worldF = (f: number) => f;

export const shakeAt = (f: number): V3 => {
  for (const s of SHAKES) {
    const k = f - s.f0;
    if (k >= 0 && k < 8) { const a = s.amp * (1 - k / 8); return [Math.sin(f * 12.9) * a, Math.cos(f * 15.7) * a, 0]; }
  }
  return [0, 0, 0];
};

/** thin-lens depth of field per shot: cInf = blur at infinity (px at 1080p); focus point (default = camera look) */
export const dofAt = (id: number, f: number): { cInf: number; focus?: V3 } => {
  switch (id) {
    case 3: return { cInf: 14, focus: [-1.9, 1.47, -0.9] };   // the old man's face; the tool crate blurs in front
    case 5: return { cInf: 16, focus: [-1.0, 1.05, -1.3] };  // the drooping paper-thin blade
    case 6: return { cInf: 12, focus: [1.5, 1.45, 0.4] };     // the client and his cut brow
    case 8: return { cInf: 16, focus: [0.44, 1.15, -2.04] }; // the needle under the magnifier
    case 9: return { cInf: 8, focus: [300, 1.1, 300] };       // the bamboo, low
    case 10: return { cInf: 10, focus: [300, 1.22, 300] };
    case 12: return { cInf: 16, focus: [300.62, 0.95, 300.8] }; // the atom needle
    case 14: return { cInf: 14, focus: [-1.9, 1.49, -0.9] };  // the old man again, close
    case 15: return { cInf: 16, focus: [-1.0, 1.06, -1.3] };  // the thin profile
    case 16: return { cInf: 16, focus: [-0.98, 1.22, -1.3] }; // the convex profile, "la carne"
    case 2: case 4: case 7: case 11: case 13: case 17: return { cInf: 7 };
    case 18: return { cInf: 8, focus: [299.8, 1.15, 300.3] };
    case 19: return { cInf: 3 };
    default: return { cInf: 5 };
  }
};

// ---- screen markers: this script carries no numbers, so there are none (rule: a figure goes quiet at the top) ----
export const MARKS: { shot: number; a: number; b: number; label: string; sub: string; col: string }[] = [];
