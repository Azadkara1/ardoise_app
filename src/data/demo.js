import { uid } from "../id.js";
import { PRESETS, PRESET_FOR_VENUE } from "./defaults.js";

/*
 * Données d'exemple prêtes à l'emploi pour les deux types d'établissement.
 * Chaque appel génère de nouveaux ids : à appeler à la demande (pas au chargement du module).
 * `layout` d'une section : "photos" = pages liste + pages photos (resto) / tuiles (snack) ;
 * "list" = une simple liste de prix.
 */
const sec = (name, layout = "photos") => ({ id: uid(), name, layout });
const dish = (sectionId, name, price, extra = {}) => ({
  id: uid(), sectionId, name, price, description: "", photo: null, photoFit: null, duJour: false, ...extra,
});
const variant = (label, price) => ({ id: uid(), label, price });

function restaurantDemo() {
  const entrees = sec("Entrées"), plats = sec("Plats"), desserts = sec("Desserts"), boissons = sec("Boissons", "list");
  return {
    info: {
      name: "La courbe du goût", tagline: "Café restaurant de Grange-Canal", handle: "lacourbedugout",
      facebook: "", website: "courbe-du-gout.ch", phone: "+41 22 310 00 00",
      reserveUrl: "https://www.google.com/maps/reserve/v/dine/c/vhtlR1NNHgY?source=pa&opi=89978449&hl=fr-FR",
    },
    sections: [entrees, plats, desserts, boissons],
    dishes: [
      dish(entrees.id, "Tartare de féra du Léman", 19, { description: "Câpres, citron vert, huile d'olive" }),
      dish(entrees.id, "Velouté de courge", 16, { description: "Huile de noisette, éclats de châtaigne", duJour: true }),
      dish(entrees.id, "Œuf parfait", 18, { description: "Crème de champignons, croûtons" }),
      dish(entrees.id, "Burrata des Pouilles", 21, { description: "Tomates anciennes, basilic" }),
      dish(plats.id, "Filet de perche du lac meunière", 42, { description: "Pommes vapeur, beurre citronné", duJour: true }),
      dish(plats.id, "Suprême de volaille", 44, { description: "Morilles & vin jaune" }),
      dish(plats.id, "Longeole genevoise", 38, { description: "Gratin de cardons", duJour: true }),
      dish(plats.id, "Risotto Carnaroli aux cèpes", 34, { description: "Parmesan 24 mois" }),
      dish(plats.id, "Onglet de bœuf", 39, { description: "Jus corsé, frites maison" }),
      dish(desserts.id, "Crème brûlée", 14, { description: "Vanille de Madagascar" }),
      dish(desserts.id, "Tarte fine aux pommes", 15, { description: "Glace caramel", duJour: true }),
      dish(desserts.id, "Moelleux au chocolat", 16, { description: "Grand Cru, cœur coulant" }),
      dish(boissons.id, "Chasselas, Genève AOC (12cl)", 8),
      dish(boissons.id, "Gamay, Genève AOC (12cl)", 8),
      dish(boissons.id, "Limonade maison", 6),
      dish(boissons.id, "Espresso", 4),
    ],
  };
}

function snackDemo() {
  const burgers = sec("Burgers"), tacos = sec("Tacos & Kebabs"), sand = sec("Sandwichs"),
    snacks = sec("Snacks & Frites"), formules = sec("Formules"),
    boissons = sec("Boissons", "list"), supp = sec("Suppléments & Sauces", "list");
  const seulMenu = (a, b) => [variant("Seul", a), variant("Menu", b)];
  return {
    info: {
      name: "Street Corner", tagline: "Burgers, tacos & kebabs maison", handle: "streetcorner",
      facebook: "", website: "streetcorner.ch", phone: "+41 22 555 01 01", reserveUrl: "",
    },
    sections: [burgers, tacos, sand, snacks, formules, boissons, supp],
    dishes: [
      dish(burgers.id, "Classic Burger", 11, { description: "Bœuf 150 g, cheddar, salade, tomate", variants: seulMenu(11, 15), duJour: true }),
      dish(burgers.id, "Double Cheese", 14, { description: "2 steaks, double cheddar, oignons confits", variants: seulMenu(14, 18) }),
      dish(burgers.id, "Crispy Chicken", 12, { description: "Poulet croustillant, sauce maison", variants: seulMenu(12, 16) }),
      dish(burgers.id, "Veggie Burger", 12, { description: "Galette de pois chiches, avocat", variants: seulMenu(12, 16) }),
      dish(tacos.id, "Tacos Poulet", 11, { description: "Sauce fromagère, frites dedans", variants: [variant("M", 11), variant("L", 14)] }),
      dish(tacos.id, "Tacos Mixte", 13, { description: "Poulet & viande hachée", variants: [variant("M", 13), variant("L", 16)] }),
      dish(tacos.id, "Kebab Assiette", 16, { description: "Viande grillée, frites, salade" }),
      dish(tacos.id, "Durum Kebab", 10, { description: "Galette roulée, oignons, sauce blanche" }),
      dish(sand.id, "Panini Jambon-Fromage", 7),
      dish(sand.id, "Club Poulet", 9, { description: "Pain toasté, bacon, œuf" }),
      dish(sand.id, "Sandwich Thon-Crudités", 8),
      dish(snacks.id, "Frites", 4, { variants: [variant("S", 4), variant("M", 5.5), variant("L", 7)] }),
      dish(snacks.id, "Nuggets x9", 8),
      dish(snacks.id, "Onion rings", 6),
      dish(snacks.id, "Wings x6", 9),
      dish(formules.id, "Formule Burger", 15, { isFormula: true, contents: "Burger au choix + frites + boisson" }),
      dish(formules.id, "Formule Tacos", 14, { isFormula: true, contents: "Tacos M + frites + boisson" }),
      dish(formules.id, "Formule Kids", 9, { isFormula: true, contents: "Mini burger + frites + jus" }),
      dish(boissons.id, "Soda (33cl)", 3.5),
      dish(boissons.id, "Ice tea maison", 4),
      dish(boissons.id, "Eau minérale (50cl)", 3),
      dish(supp.id, "Sauce (algérienne, samouraï, BBQ…)", 1),
      dish(supp.id, "Fromage supplémentaire", 1.5),
      dish(supp.id, "Bacon", 2),
    ],
  };
}

/** Contenu de démo complet (carte + établissement + DA du preset associé) pour un type. */
export function buildDemo(venueType) {
  const base = venueType === "snack" ? snackDemo() : restaurantDemo();
  const presetId = PRESET_FOR_VENUE[venueType] || "bistrot";
  const preset = PRESETS.find((p) => p.id === presetId);
  return { ...base, presetId, presetKit: preset.kit };
}
