/* ---- Devises supportées ---- */
export const CURRENCIES = {
  CHF: { code: "CHF", symbol: "CHF", position: "prefix", decimalSep: ".", integerSuffix: ".–", spacer: " " },
  EUR: { code: "EUR", symbol: "€", position: "suffix", decimalSep: ",", integerSuffix: "", spacer: " " },
  USD: { code: "USD", symbol: "$", position: "prefix", decimalSep: ".", integerSuffix: "", spacer: "" },
  GBP: { code: "GBP", symbol: "£", position: "prefix", decimalSep: ".", integerSuffix: "", spacer: "" },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES);

/**
 * "CHF 21.–" / "CHF 8.50" / "21 €" / "8,50 €" / "$21" / "$8.50" / "£21" / "£8.50"
 * selon la devise choisie. Les entiers gardent le style suisse (".–") uniquement
 * pour CHF ; les autres devises n'ajoutent rien après un entier.
 */
export function formatPrice(p, currencyCode = "CHF") {
  const cur = CURRENCIES[currencyCode] || CURRENCIES.CHF;
  const n = Number(p);
  if (isNaN(n)) return `${cur.symbol} ${p}`;

  const numStr = Number.isInteger(n)
    ? n + (cur.integerSuffix || "")
    : n.toFixed(2).replace(".", cur.decimalSep);

  return cur.position === "prefix"
    ? `${cur.symbol}${cur.spacer}${numStr}`
    : `${numStr}${cur.spacer}${cur.symbol}`;
}

/** Label court à afficher à côté d'un champ prix dans l'éditeur (ex. "CHF", "€"). */
export function currencyLabel(currencyCode = "CHF") {
  return (CURRENCIES[currencyCode] || CURRENCIES.CHF).symbol;
}
