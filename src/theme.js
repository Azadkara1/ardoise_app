/* ---- Shell (neutre, encre + miel) ---- */
export const SHELL = {
  ink: "#181714",
  ink2: "#242019",
  line: "#e7e3db",
  panel: "#ffffff",
  work: "#e8e5df",
  honey: "#d5a441",
  honeyDeep: "#a67c26",
  mut: "#8c8880",
  txt: "#221f1b",
};

/* ---- Polices dispo ---- */
export const SERIF = new Set([
  "Playfair Display", "DM Serif Display", "Cormorant Garamond",
  "Fraunces", "Abril Fatface", "Lora",
]);
export const TITLE_FONTS = [
  "Playfair Display", "Bebas Neue", "DM Serif Display", "Space Grotesk",
  "Cormorant Garamond", "Fraunces", "Abril Fatface", "Archivo Black", "Oswald",
];
export const BODY_FONTS = ["Lora", "Inter", "DM Sans", "Work Sans", "Karla", "Nunito Sans"];
export const ff = (name) =>
  `'${name}', ${SERIF.has(name) ? "Georgia, 'Times New Roman', serif" : "system-ui, sans-serif"}`;

/* Les polices Google sont chargées dans index.html (garder les deux listes synchronisées). */

export const INP = {
  width: "100%", fontSize: 13, color: SHELL.txt, background: "#faf9f6",
  border: `1px solid ${SHELL.line}`, borderRadius: 6, padding: "6px 8px", outline: "none",
};
