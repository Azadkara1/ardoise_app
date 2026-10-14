/*
 * Traduction des libellés FIXES des supports exportés — jamais du contenu saisi
 * par le resto (noms de plats, sections, textes libres), qui reste tel quel
 * quelle que soit la langue. Par choix, l'éditeur lui-même reste en français ;
 * seuls les rendus publiés (livre, plat du jour, post) sont multilingues.
 */
const DICT = {
  fr: {
    todaysSpecial: "Le plat du jour",
    atTheMenu: "À la carte",
    reserve: "Réserver",
    order: "Commander",
    signature: "Signature",
    formula: "Formule",
    addPhoto: "Ajouter une photo",
    menuWord: "Menu",
  },
  en: {
    todaysSpecial: "Today's special",
    atTheMenu: "On the menu",
    reserve: "Book a table",
    order: "Order now",
    signature: "Signature",
    formula: "Meal deal",
    addPhoto: "Add a photo",
    menuWord: "Menu",
  },
  it: {
    todaysSpecial: "Il piatto del giorno",
    atTheMenu: "Al menù",
    reserve: "Prenota",
    order: "Ordina",
    signature: "Signature",
    formula: "Formula",
    addPhoto: "Aggiungi una foto",
    menuWord: "Menù",
  },
};

export function t(key, lang = "fr") {
  return DICT[lang]?.[key] ?? DICT.fr[key] ?? key;
}
