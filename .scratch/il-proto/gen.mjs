// Protótipo: pose (juntas 3D, z-up) -> pictograma 2D limpo (estilo judô Tokyo2020).
// Emite SVG (preview rápido) + JSX (Illustrator). Sem deps.
import fs from "node:fs";

const pose = JSON.parse(fs.readFileSync(new URL("./gf.json", import.meta.url)));

// --- projeção 3/4 (ajustável) ---
const AZ = 0.62, TILT = 0.5, ZS = 1.0;
function proj([x, y, z]) {
  const rx = x * Math.cos(AZ) - y * Math.sin(AZ);
  const ry = x * Math.sin(AZ) + y * Math.cos(AZ);
  return [rx, z * ZS - ry * TILT]; // 2D, y pra cima
}

const BONES = [
  ["Head", "Neck"], ["Neck", "Core"],
  ["Neck", "LeftShoulder"], ["Neck", "RightShoulder"],
  ["LeftShoulder", "LeftElbow"], ["LeftElbow", "LeftWrist"], ["LeftWrist", "LeftHand"],
  ["RightShoulder", "RightElbow"], ["RightElbow", "RightWrist"], ["RightWrist", "RightHand"],
  ["Core", "LeftHip"], ["Core", "RightHip"],
  ["LeftHip", "LeftKnee"], ["LeftKnee", "LeftAnkle"], ["LeftAnkle", "LeftToe"],
  ["RightHip", "RightKnee"], ["RightKnee", "RightAnkle"], ["RightAnkle", "RightToe"],
];
const TORSO = ["LeftShoulder", "RightShoulder", "RightHip", "LeftHip"];

// projeta todas as juntas dos dois players
const P = {};
let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
for (const pk of Object.keys(pose)) {
  P[pk] = {};
  for (const [jn, co] of Object.entries(pose[pk])) {
    const q = proj(co);
    P[pk][jn] = q;
    minX = Math.min(minX, q[0]); maxX = Math.max(maxX, q[0]);
    minY = Math.min(minY, q[1]); maxY = Math.max(maxY, q[1]);
  }
}

const W = 760, H = 600, PAD = 80;
const sx = (W - 2 * PAD) / (maxX - minX);
const sy = (H - 2 * PAD) / (maxY - minY);
const s = Math.min(sx, sy);
const figH = (maxY - minY) * s;
const SW = Math.round(figH / 13);     // espessura do membro
const HEAD = Math.round(figH / 12);   // raio da cabeça

// para tela: x normaliza, y inverte (SVG/IL y pra baixo)
function toScreen([px, py]) {
  const X = PAD + (px - minX) * s + (W - 2 * PAD - (maxX - minX) * s) / 2;
  const Y = H - (PAD + (py - minY) * s); // flip
  return [Math.round(X * 10) / 10, Math.round(Y * 10) / 10];
}
const S = {};
for (const pk of Object.keys(P)) {
  S[pk] = {};
  for (const jn of Object.keys(P[pk])) S[pk][jn] = toScreen(P[pk][jn]);
}

// top = cabeça mais alta (z) = figura da frente (clay); bottom = atrás (ink)
const top = Object.keys(pose).reduce((a, b) => (pose[a].Head[2] > pose[b].Head[2] ? a : b));
const bottom = Object.keys(pose).find((k) => k !== top);

const CLAY = [198, 118, 81], INK = [40, 44, 54], PAPER = [243, 240, 234];
const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

// ---------- SVG ----------
function svgFigure(pk, color, knockout) {
  const J = S[pk];
  let out = "";
  if (knockout) {
    // halo branco sob cada osso da figura da frente -> separa cruzamentos
    for (const [a, b] of BONES) {
      out += `<line x1="${J[a][0]}" y1="${J[a][1]}" x2="${J[b][0]}" y2="${J[b][1]}" stroke="${rgb(PAPER)}" stroke-width="${SW + 10}" stroke-linecap="round"/>\n`;
    }
    out += `<circle cx="${J.Head[0]}" cy="${J.Head[1]}" r="${HEAD + 5}" fill="${rgb(PAPER)}"/>\n`;
    return out;
  }
  // tronco preenchido (massa do corpo)
  const tp = TORSO.map((j) => J[j].join(",")).join(" ");
  out += `<polygon points="${tp}" fill="${rgb(color)}"/>\n`;
  for (const [a, b] of BONES) {
    out += `<line x1="${J[a][0]}" y1="${J[a][1]}" x2="${J[b][0]}" y2="${J[b][1]}" stroke="${rgb(color)}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>\n`;
  }
  out += `<circle cx="${J.Head[0]}" cy="${J.Head[1]}" r="${HEAD}" fill="${rgb(color)}"/>\n`;
  return out;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#f3f0ea"/>
${svgFigure(bottom, INK, false)}
${svgFigure(top, PAPER, true)}
${svgFigure(top, CLAY, false)}
</svg>`;
fs.writeFileSync(new URL("./gf.svg", import.meta.url), svg);

// ---------- Illustrator JSX ----------
function jsxColor(name, c) {
  return `var ${name}=new RGBColor();${name}.red=${c[0]};${name}.green=${c[1]};${name}.blue=${c[2]};`;
}
function jsxFigure(pk, colorVar, knockout) {
  const J = S[pk];
  let out = "";
  if (!knockout) {
    const tp = TORSO.map((j) => `[${J[j][0]},${-J[j][1]}]`).join(",");
    out += `var tq=doc.pathItems.add();tq.setEntirePath([${tp}]);tq.closed=true;tq.stroked=false;tq.filled=true;tq.fillColor=${colorVar};\n`;
  }
  for (const [a, b] of BONES) {
    const w = knockout ? SW + 10 : SW;
    const col = knockout ? "paper" : colorVar;
    out += `var l=doc.pathItems.add();l.setEntirePath([[${J[a][0]},${-J[a][1]}],[${J[b][0]},${-J[b][1]}]]);l.stroked=true;l.filled=false;l.strokeColor=${col};l.strokeWidth=${w};l.strokeCap=StrokeCap.ROUNDENDCAP;l.strokeJoin=StrokeJoin.ROUNDENDJOIN;\n`;
  }
  const hr = knockout ? HEAD + 5 : HEAD;
  const col = knockout ? "paper" : colorVar;
  out += `var h=doc.pathItems.ellipse(${-(J.Head[1]) + hr},${J.Head[0] - hr},${hr * 2},${hr * 2});h.stroked=false;h.filled=true;h.fillColor=${col};\n`;
  return out;
}
const jsx = `try{
var OUT="/Users/leonardomeireles/Work/claude-roupa-de-jiu/webapp-jiu/.scratch/il-proto/gf-il.png";
var doc=app.documents.add(DocumentColorSpace.RGB, ${W}, ${H});
${jsxColor("clay", CLAY)} ${jsxColor("ink", INK)} ${jsxColor("paper", PAPER)}
${jsxFigure(bottom, "ink", false)}
${jsxFigure(top, "paper", true)}
${jsxFigure(top, "clay", false)}
var f=new File(OUT);var opt=new ExportOptionsPNG24();opt.transparency=true;opt.artBoardClipping=true;
doc.exportFile(f, ExportType.PNG24, opt);doc.close(SaveOptions.DONOTSAVECHANGES);
"exists="+f.exists;
}catch(e){"ERR:"+e.toString();}`;
fs.writeFileSync(new URL("./gf.jsx", import.meta.url), jsx);

console.log(`top=${top} bottom=${bottom} SW=${SW} HEAD=${HEAD} -> wrote gf.svg + gf.jsx`);
