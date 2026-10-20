const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const mainDir = path.join(root, 'src', 'assets', 'images');
const aboutDir = path.join(mainDir, 'aboutme');

// output webp name -> [dir, maxWidth, quality]
const jobs = [
  ['hero-bg.webp', mainDir, 1280, 62],
  ['itb_logo.webp', mainDir, 200, 78],
  ['tec_logo.webp', mainDir, 200, 78],
  ['akhdani_logo.webp', mainDir, 220, 78],
  ['hmif_logo.webp', mainDir, 220, 78],
  ['simkopdes-rekop.webp', mainDir, 1280, 65],
  ['kjpp-dashboard.webp', mainDir, 1280, 65],
  ['cv-screening.webp', mainDir, 1280, 65],
  ['profil.webp', mainDir, 900, 58],
  ['oop-java.webp', mainDir, 900, 58],
  ['spark-parking.webp', mainDir, 900, 60],
  ['enterprise-architecture.webp', mainDir, 1000, 64],
  ['api-integrated.webp', mainDir, 1000, 64],
  ['cross-platform.webp', mainDir, 900, 62],
  ['ui-ux.webp', mainDir, 600, 64],
  ['Screenshot 2026-03-23 124619.webp', mainDir, 1000, 62],
  ['qr-linkedin.webp', mainDir, 600, 76],
  ['itb-asprak.webp', aboutDir, 488, 56],
  ['tec-recruitment.webp', aboutDir, 488, 56],
  ['tec-comvis-microsoft.webp', aboutDir, 488, 56],
  ['hmif-comvis.webp', aboutDir, 488, 56],
  ['hmif-wispril.webp', aboutDir, 488, 56],
  ['oskm-lapangan.webp', aboutDir, 488, 56],
  ['tec-comvis.webp', aboutDir, 488, 56],
  ['inkam-oskm.webp', aboutDir, 488, 56],
];

function findSource(dir, name) {
  const base = name.replace(/\.webp$/i, '');
  for (const ext of ['.png', '.jpeg', '.jpg']) {
    const p = path.join(dir, base + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

(async () => {
  let before = 0, after = 0;
  for (const [name, dir, width, quality] of jobs) {
    const src = findSource(dir, name);
    const out = path.join(dir, name);
    if (!src) { console.log('MISSING', name); continue; }
    const b = fs.statSync(out).size;
    before += b;
    const tmp = out + '.tmp';
    await sharp(src, { failOn: 'none' })
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(tmp);
    fs.unlinkSync(out);
    fs.renameSync(tmp, out);
    const a = fs.statSync(out).size;
    after += a;
    console.log(name.padEnd(38), `${(b / 1024).toFixed(0)} -> ${(a / 1024).toFixed(0)} KiB`);
  }
  console.log(
    `\nTOTAL: ${(before / 1024).toFixed(0)} KiB -> ${(after / 1024).toFixed(0)} KiB ` +
    `(saved ${((before - after) / 1024).toFixed(0)} KiB, ${(100 * (1 - after / before)).toFixed(0)}%)`
  );
})().catch((e) => { console.error(e); process.exit(1); });
