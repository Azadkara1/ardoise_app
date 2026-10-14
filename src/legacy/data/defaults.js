import { uid } from "../id.js";

/* ---- Presets par type de cuisine ---- */
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

export const SECTIONS = [
  { id: "entrees", label: "Entrées", short: "E" },
  { id: "plats", label: "Plats", short: "P" },
  { id: "desserts", label: "Desserts", short: "D" },
];

/* ---- Carte d'exemple (bistrot réaliste) ---- */
export const SAMPLE_DISHES = [
  { id: uid(), name: "Tartare de féra du Léman, câpres", price: 19, section: "entrees", dujour: false },
  { id: uid(), name: "Velouté de courge, huile de noisette", price: 16, section: "entrees", dujour: true },
  { id: uid(), name: "Œuf parfait, crème de champignons", price: 18, section: "entrees", dujour: false },
  { id: uid(), name: "Burrata des Pouilles, tomates anciennes", price: 21, section: "entrees", dujour: false },
  { id: uid(), name: "Filet de perche du lac meunière", price: 42, section: "plats", dujour: true },
  { id: uid(), name: "Suprême de volaille, morilles & vin jaune", price: 44, section: "plats", dujour: false },
  { id: uid(), name: "Longeole, gratin de cardons genevois", price: 38, section: "plats", dujour: true },
  { id: uid(), name: "Risotto Carnaroli aux cèpes", price: 34, section: "plats", dujour: false },
  { id: uid(), name: "Onglet de bœuf, jus corsé & frites maison", price: 39, section: "plats", dujour: false },
  { id: uid(), name: "Crème brûlée à la vanille de Madagascar", price: 14, section: "desserts", dujour: false },
  { id: uid(), name: "Tarte fine aux pommes, glace caramel", price: 15, section: "desserts", dujour: true },
  { id: uid(), name: "Moelleux au chocolat Grand Cru", price: 16, section: "desserts", dujour: false },
];

/* ---- Menu de la semaine (format réellement utilisé par le resto) ---- */
export const WEEK_DEFAULT = {
  label: "Semaine du 7 au 12 avril",
  startDate: "",
  numDays: 6,
  price: 21,
  dessert: 5,
  days: [
    { id: uid(), day: "Lundi", dish: "Curry de porc", garnish: "Riz Madras" },
    { id: uid(), day: "Mardi", dish: "Filets de perche, beurre citron", garnish: "Flan de courgettes, frites" },
    { id: uid(), day: "Mercredi", dish: "Lasagnes à la bolognaise", garnish: "" },
    { id: uid(), day: "Jeudi", dish: "Burger de veau confit", garnish: "Pommes country" },
    { id: uid(), day: "Vendredi", dish: "Tataki de thon", garnish: "Légumes croquants, basmati" },
  ],
  special: { dish: "Tartare de saumon", garnish: "Frites" },
  note: "Tous nos plats du jour sont précédés d'une salade verte ou d'une soupe.",
};

export const DEFAULT_KIT = {
  primary: "#b0302e",
  accent: "#988c7e",
  background: "#f7f3ec",
  text: "#2a1c17",
  titleFont: "Playfair Display",
  bodyFont: "Lora",
  logo: null,
};

export const DEFAULT_INFO = {
  name: "La courbe du goût",
  tagline: "Café restaurant de Grange-Canal",
  handle: "lacourbedugout",
  facebook: "",
  website: "courbe-du-gout.ch",
  phone: "+41 22 310 00 00",
  reserveUrl: "https://www.google.com/maps/reserve/v/dine/c/vhtlR1NNHgY?source=pa&opi=89978449&hl=fr-FR",
};

export const DEFAULT_SETTINGS = {
  currency: "CHF",
  lang: "fr",
};

export const SEASONS = ["Printemps", "Été", "Automne", "Hiver"];

/* ---- Menu saisonnier : carte indépendante, même forme que `dishes` ---- */
export const DEFAULT_SEASONAL = {
  season: "Automne",
  label: "Suggestions de saison",
  dishes: [
    { id: uid(), name: "Velouté de courge, éclats de châtaigne", price: 14, section: "entrees", dujour: false },
    { id: uid(), name: "Joue de bœuf braisée, purée de céleri", price: 36, section: "plats", dujour: true },
    { id: uid(), name: "Risotto aux champignons des bois", price: 32, section: "plats", dujour: false },
    { id: uid(), name: "Poire pochée au vin épicé, glace vanille", price: 13, section: "desserts", dujour: false },
  ],
};

/* ---- Carte des boissons : catégories → lignes (nom + prix) ---- */
const drinkCategory = (name, items) => ({
  id: uid(),
  name,
  items: items.map(([itemName, price]) => ({ id: uid(), name: itemName, price })),
});

export const DEFAULT_DRINKS = {
  categories: [
    drinkCategory("Apéritifs", [
      ["Kir maison", 8],
      ["Aperol Spritz", 12],
      ["Pastis", 7],
    ]),
    drinkCategory("Vins au verre", [
      ["Chasselas, Genève AOC (12cl)", 8],
      ["Gamay, Genève AOC (12cl)", 8],
      ["Pinot noir, Genève AOC (12cl)", 9],
    ]),
    drinkCategory("Bières", [
      ["Blonde pression (33cl)", 6.5],
      ["Blanche (33cl)", 7],
      ["IPA locale (33cl)", 8],
    ]),
    drinkCategory("Sans alcool", [
      ["Limonade maison", 6],
      ["Jus de pomme du verger", 5.5],
      ["Eau minérale (50cl)", 5],
    ]),
    drinkCategory("Cafés & thés", [
      ["Espresso", 4],
      ["Cappuccino", 5],
      ["Thé en infusion", 5],
    ]),
  ],
};

/* ---- Bloc « à propos » optionnel, affiché en bas du Menu ---- */
export const DEFAULT_ABOUT = {
  enabled: false,
  title: "À propos de nous",
  text: "Nichée à Grange-Canal, La courbe du goût cuisine une carte de saison à partir de produits locaux, dans une ambiance chaleureuse pensée pour les tablées du quotidien comme les grandes occasions.",
};

/* ---- Soirée à thème (affiche dédiée, format A4) ---- */
export const DEFAULT_EVENT = {
  title: "Soirée Couscous",
  date: "",
  desc: "Un menu unique inspiré du Maghreb, préparé pour l'occasion : couscous royal, pâtisseries orientales et thé à la menthe.",
  price: 39,
  photo: null,
};

/* ---- Photothèque : photos importées une fois, attribuées aux plats via `photoId` ---- */
export const DEFAULT_PHOTOS = [];

/* ---- Plat du jour : un seul champ libre ---- */
export const DEFAULT_DAILY = { text: "" };

export const DEFAULT_PROFILE_ID = "la-courbe-du-gout";

export const DEFAULT_PROFILE = {
  id: DEFAULT_PROFILE_ID,
  name: DEFAULT_INFO.name,
  data: {
    kit: DEFAULT_KIT,
    info: DEFAULT_INFO,
    dishes: SAMPLE_DISHES,
    week: WEEK_DEFAULT,
    settings: DEFAULT_SETTINGS,
    seasonal: DEFAULT_SEASONAL,
    drinks: DEFAULT_DRINKS,
    about: DEFAULT_ABOUT,
    weekHistory: [],
    event: DEFAULT_EVENT,
    photos: DEFAULT_PHOTOS,
    daily: DEFAULT_DAILY,
  },
};
