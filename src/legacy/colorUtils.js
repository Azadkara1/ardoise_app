/* ------------------------- helpers couleur ------------------------- */
export const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
export const toHex = (r, g, b) =>
  "#" + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("");
export const hexA = (hex, a) => { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; };
export const mix = (h1, h2, t) => {
  const a = hexToRgb(h1), b = hexToRgb(h2);
  return toHex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
};
export const lum = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const onColor = (bg) => (lum(bg) > 0.52 ? "#191712" : "#ffffff");
export const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s, l];
};

/* ---- Extraction de palette depuis le logo (pur canvas) ---- */
export function extractPalette(img) {
  const size = 90;
  const c = document.createElement("canvas");
  c.width = size; c.height = size;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, size, size);
  let data;
  try { data = ctx.getImageData(0, 0, size, size).data; } catch (e) { return null; }

  const bins = {};
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 125) continue; // ignore transparent
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4); // binning
    (bins[key] || (bins[key] = { r: 0, g: 0, b: 0, c: 0 }));
    const bn = bins[key]; bn.r += r; bn.g += g; bn.b += b; bn.c++;
  }
  let arr = Object.values(bins).map((bn) => {
    const r = bn.r / bn.c, g = bn.g / bn.c, b = bn.b / bn.c;
    const [h, s, l] = rgbToHsl(r, g, b);
    return { h, s, l, c: bn.c, hex: toHex(r, g, b) };
  });
  if (!arr.length) return null;
  const total = arr.reduce((a, x) => a + x.c, 0);
  const present = arr.filter((x) => x.c / total > 0.008);
  const pool = present.length ? present : arr;

  let background = [...pool].sort((a, b) => b.l - a.l)[0].hex;
  let text = [...pool].sort((a, b) => a.l - b.l)[0].hex;

  const sat = arr
    .filter((x) => x.s > 0.16 && x.l > 0.12 && x.l < 0.9)
    .sort((a, b) => b.s * Math.sqrt(b.c) - a.s * Math.sqrt(a.c));
  const primaryBin = sat[0] || [...arr].sort((a, b) => b.c - a.c)[0];
  let primary = primaryBin.hex;
  const accentBin =
    sat.find((x) => Math.abs(((x.h - primaryBin.h + 540) % 360) - 180) > 40) || sat[1] || primaryBin;
  let accent = accentBin.hex;

  // garde-fous lisibilité (démo readable)
  if (lum(background) < 0.6) background = mix(background, "#ffffff", 0.82);
  if (lum(text) > 0.34) text = mix(text, "#000000", 0.72);
  if (accent === primary) accent = mix(primary, "#ffffff", 0.4);

  return { primary, accent, background, text };
}
