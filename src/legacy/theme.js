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

export const GOOGLE_HREF =
  "https://fonts.googleapis.com/css2?" +
  [
    "Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400",
    "Bebas+Neue",
    "DM+Serif+Display:ital@0;1",
    "Space+Grotesk:wght@400;500;600;700",
    "Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400",
    "Fraunces:ital,wght@0,400;0,600;0,900;1,400",
    "Abril+Fatface",
    "Archivo+Black",
    "Oswald:wght@400;500;600;700",
    "Inter:wght@300;400;500;600;700",
    "DM+Sans:ital,wght@0,400;0,500;0,700;1,400",
    "Work+Sans:wght@400;500;600;700",
    "Karla:ital,wght@0,400;0,500;0,700;1,400",
    "Nunito+Sans:wght@400;600;700",
    "Lora:ital,wght@0,400;0,500;0,600;1,400",
  ].map((f) => "family=" + f).join("&") +
  "&display=swap";

export const INP = {
  width: "100%", fontSize: 13, color: SHELL.txt, background: "#faf9f6",
  border: `1px solid ${SHELL.line}`, borderRadius: 6, padding: "6px 8px", outline: "none",
};
