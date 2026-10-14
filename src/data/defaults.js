/* ---- Presets de DA (4 univers visuels très différents) ---- */
export const PRESETS = [
  {
    id: "bistrot", name: "Bistrot Parisien", cuisine: "Cuisine française",
    kit: { primary: "#6e1423", accent: "#c8a24a", background: "#f6f1e6", text: "#2a1a12", titleFont: "Playfair Display", bodyFont: "Lora" },
  },
  {
    id: "street", name: "Snack / Street", cuisine: "Street food",
    kit: { primary: "#141414", accent: "#e4ff32", background: "#f4f4ef", text: "#141414", titleFont: "Bebas Neue", bodyFont: "Work Sans" },
  },
  {
    id: "healthy", name: "Healthy / Bowl", cuisine: "Bowls & veggie",
    kit: { primary: "#1f4d38", accent: "#e0902c", background: "#f1f5ea", text: "#182b20", titleFont: "DM Serif Display", bodyFont: "Karla" },
  },
  {
    id: "sushi", name: "Sushi / Izakaya", cuisine: "Japonais",
    kit: { primary: "#15161c", accent: "#e5432f", background: "#f3efe6", text: "#15161c", titleFont: "Space Grotesk", bodyFont: "DM Sans" },
  },
];

/** Preset pré-sélectionné selon le type d'établissement. */
export const PRESET_FOR_VENUE = { restaurant: "bistrot", snack: "street" };

export const DEFAULT_KIT = {
  ...PRESETS[0].kit,
  logo: null,
  customFonts: [], // [{ name, dataUrl }] — polices importées (.ttf/.otf/.woff2)
};

export const DEFAULT_SETTINGS = {
  currency: "CHF",
  lang: "fr",
};

export const DEFAULT_DAILY = { text: "", dishId: null, photo: null, photoFit: null };
