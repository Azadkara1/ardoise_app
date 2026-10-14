/*
 * Persistance locale d'Ardoise.
 *
 * Isolé volontairement de l'état React : quand la commercialisation ajoutera
 * des comptes utilisateurs, ce module pourra être remplacé par un client API
 * sans toucher au reste de l'app (mêmes fonctions load/save/clear).
 */
const KEY = "ardoise:v1";
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

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // quota dépassé ou storage indisponible (navigation privée…) : non bloquant
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
export function saveDebounced(state) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => save(state), SAVE_DEBOUNCE_MS);
}
