/* ---- Génération de l'intitulé de semaine à partir d'une date de début ---- */

// Parsing manuel (plutôt que `new Date(iso)`) pour rester en heure locale :
// `new Date("2026-04-07")` est interprété en UTC par le moteur JS et peut
// glisser d'un jour selon le fuseau du navigateur.
function parseISODate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

const dayFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric" });
const monthFmt = new Intl.DateTimeFormat("fr-FR", { month: "long" });

/**
 * "Semaine du 7 au 12 avril" (même mois) ou
 * "Semaine du 30 mars au 4 avril" (mois différents).
 */
export function computeWeekLabel(startIso, numDays = 6) {
  const start = parseISODate(startIso);
  if (!start) return "";
  const end = addDays(start, Math.max(1, Number(numDays) || 6) - 1);

  const startDay = dayFmt.format(start);
  const endDay = dayFmt.format(end);
  const endMonth = monthFmt.format(end);

  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `Semaine du ${startDay} au ${endDay} ${endMonth}`;
  }
  const startMonth = monthFmt.format(start);
  return `Semaine du ${startDay} ${startMonth} au ${endDay} ${endMonth}`;
}

const pad2 = (n) => String(n).padStart(2, "0");
const toISODate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** Ajoute `n` jours à une date ISO ("2026-04-07") et rend une date ISO. Utilisé par « Semaine suivante ». */
export function addDaysISO(startIso, n) {
  const start = parseISODate(startIso);
  if (!start) return startIso;
  return toISODate(addDays(start, n));
}

const longDateFmt = {
  fr: new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
  en: new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }),
};

/** "Vendredi 12 décembre" / "Friday 12 December" — date de la soirée à thème. */
export function formatLongDate(iso, lang = "fr") {
  const d = parseISODate(iso);
  if (!d) return "";
  const s = (longDateFmt[lang] || longDateFmt.fr).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
