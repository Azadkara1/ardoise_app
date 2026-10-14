/*
 * Persistance locale d'Ardoise.
 *
 * Isolé volontairement de l'état React : quand la commercialisation ajoutera
 * des comptes utilisateurs / une vraie base, ce module pourra être remplacé par
 * un client API sans toucher au reste de l'app (mêmes fonctions load/save/clear).
 *
 * Clé versionnée : v2 = modèle sections/plats dynamiques (venueType…). Les données
 * de l'ancienne version (ardoise:v1) ne sont pas migrées.
 */
const KEY = "ardoise:v2";
const SAVE_DEBOUNCE_MS = 400;

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null; // JSON corrompu ou storage indisponible : on repart des défauts
  }
}

/** Retourne { ok: true } ou { ok: false, quota: boolean } — jamais d'exception. */
export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return { ok: true };
  } catch (e) {
    const quota = !!e && (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED" || e.code === 22 || e.code === 1014);
    return { ok: false, quota };
  }
}

export function clear() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

let saveTimer = null;
/** Sauvegarde différée ; `onResult` reçoit le résultat de save() (pour signaler un quota dépassé). */
export function saveDebounced(state, onResult) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const res = save(state);
    if (onResult) onResult(res);
  }, SAVE_DEBOUNCE_MS);
}
