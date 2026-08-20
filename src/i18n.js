/*
 * Traduction des libellés FIXES des supports exportés (et de la nav des
 * supports) — jamais du contenu saisi par le resto (noms de plats, textes
 * libres, intitulés personnalisés…), qui reste tel quel dans les deux langues.
 * Par choix, l'éditeur lui-même reste en français ; seuls les rendus publiés
 * (et le nom des supports dans le sélecteur) sont bilingues.
 */
const DICT = {
  fr: {
    supportSemaine: "Semaine",
    supportMenu: "Menu",
    supportSpecial: "Plat du jour",
    supportPost: "Post réseaux",
    supportSaison: "Saisonnier",
    supportBoissons: "Boissons",
    supportStory: "Story",
    supportSoiree: "Soirée",
    dailySpecials: "Les plats du jour",
    weekSpecial: "Le plat de la semaine",
    bonAppetit: "Bon appétit !",
    sectionEntrees: "Entrées",
    sectionPlats: "Plats",
    sectionDesserts: "Desserts",
    badgeDuJour: "du jour",
    badgeCoupDeCoeur: "coup de cœur",
    todaysSpecial: "Le plat du jour",
    atTheMenu: "À la carte",
    reserveTable: "Réserver une table",
    signature: "Signature",
    drinksTitle: "Carte des boissons",
    seasonPrintemps: "Printemps",
    seasonEte: "Été",
    seasonAutomne: "Automne",
    seasonHiver: "Hiver",
  },
  en: {
    supportSemaine: "Week",
    supportMenu: "Menu",
    supportSpecial: "Daily special",
    supportPost: "Social post",
    supportSaison: "Seasonal",
    supportBoissons: "Drinks",
    supportStory: "Story",
    supportSoiree: "Event",
    dailySpecials: "Today's specials",
    weekSpecial: "Dish of the week",
    bonAppetit: "Enjoy your meal!",
    sectionEntrees: "Starters",
    sectionPlats: "Mains",
    sectionDesserts: "Desserts",
    badgeDuJour: "today's pick",
    badgeCoupDeCoeur: "favourite",
    todaysSpecial: "Today's special",
    atTheMenu: "On the menu",
    reserveTable: "Book a table",
    signature: "Signature",
    drinksTitle: "Drinks menu",
    seasonPrintemps: "Spring",
    seasonEte: "Summer",
    seasonAutomne: "Autumn",
    seasonHiver: "Winter",
  },
};

export function t(key, lang = "fr") {
  return DICT[lang]?.[key] ?? DICT.fr[key] ?? key;
}

/** "Formule avec dessert du jour + {price}" — le seul libellé fixe avec un prix inséré. */
export function setMenuLine(price, lang = "fr") {
  return lang === "en" ? `Set menu with dessert of the day + ${price}` : `Formule avec dessert du jour + ${price}`;
}

const DAY_NAMES_EN = {
  Lundi: "Monday", Mardi: "Tuesday", Mercredi: "Wednesday", Jeudi: "Thursday",
  Vendredi: "Friday", Samedi: "Saturday", Dimanche: "Sunday",
};

/** Ne traduit que les jours par défaut reconnus (Lundi…Dimanche) — un nom personnalisé est du contenu saisi, pas traduit. */
export function translateDay(day, lang) {
  if (lang !== "en") return day;
  return DAY_NAMES_EN[day] || day;
}

const SEASON_KEYS = { Printemps: "seasonPrintemps", Été: "seasonEte", Automne: "seasonAutomne", Hiver: "seasonHiver" };

export function translateSeason(season, lang) {
  const key = SEASON_KEYS[season];
  return key ? t(key, lang) : season;
}

const SECTION_KEYS = { entrees: "sectionEntrees", plats: "sectionPlats", desserts: "sectionDesserts" };

/** `sec.id` (entrees/plats/desserts) → libellé traduit ; ce sont des catégories fixes, pas du contenu saisi. */
export function translateSection(sectionId, lang) {
  const key = SECTION_KEYS[sectionId];
  return key ? t(key, lang) : sectionId;
}
