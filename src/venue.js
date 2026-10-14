/*
 * Libellés de l'UI qui dépendent du type d'établissement (restaurant | snack).
 * On ne force jamais « Entrées / Plats / Desserts » sur un snack : tout texte
 * qui parle de la carte passe par ici.
 */
export const VENUE_TYPES = [
  { id: "restaurant", label: "Restaurant" },
  { id: "snack", label: "Snack" },
];

const COPY = {
  restaurant: {
    label: "Restaurant",
    item: "plat", items: "plats",
    addItem: "Ajouter un plat",
    newItem: "Nouveau plat",
    newSection: "Nouvelle section",
    cardHint: "Entrées, plats, desserts… à votre façon",
    bookHint: "Le menu en livre, page par page",
    cta: "reserve",
  },
  snack: {
    label: "Snack",
    item: "produit", items: "produits",
    addItem: "Ajouter un produit",
    newItem: "Nouveau produit",
    newSection: "Nouvelle catégorie",
    cardHint: "Burgers, tacos, formules… à votre façon",
    bookHint: "La carte du snack, une page par catégorie",
    cta: "order",
  },
};

export const venueCopy = (type) => COPY[type] || COPY.restaurant;
