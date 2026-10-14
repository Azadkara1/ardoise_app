import { useState } from "react";
import { SHELL } from "./theme.js";
import NewApp from "./App.jsx";
import LegacyApp from "./legacy/App.jsx";

/*
 * Sélecteur de version, en haut à gauche :
 *   - « Nouvelle app »  : src/App.jsx (livre, accueil, restaurant/snack…)
 *   - « Ancienne app »  : src/legacy/ (copie de la version précédente, avec ses propres données ardoise:v1)
 * Les deux versions ne partagent pas leurs données.
 */
const MODE_KEY = "ardoise:mode";
const MODES = [
  { id: "new", label: "Nouvelle app" },
  { id: "legacy", label: "Ancienne app" },
];

const readMode = () => {
  try { return localStorage.getItem(MODE_KEY) === "legacy" ? "legacy" : "new"; } catch { return "new"; }
};

export default function Root() {
  const [mode, setMode] = useState(readMode);
  const choose = (m) => {
    setMode(m);
    try { localStorage.setItem(MODE_KEY, m); } catch { /* non bloquant */ }
  };

  return (
    <div className="flex flex-col h-screen">
      <div role="group" aria-label="Version de l'application" className="flex items-center gap-1 px-3 py-1.5 shrink-0"
        style={{ background: "#0e0d0b", borderBottom: `1px solid ${SHELL.ink2}` }}>
        {MODES.map((m) => {
          const on = mode === m.id;
          return (
            <button key={m.id} onClick={() => choose(m.id)} aria-pressed={on}
              style={{ fontSize: 11.5, fontWeight: on ? 700 : 500, padding: "3px 11px", borderRadius: 999,
                background: on ? SHELL.honey : "transparent", color: on ? SHELL.ink : "#b9b5ab" }}>
              {m.label}
            </button>
          );
        })}
      </div>
      {/* chaque app remplit cette zone ; elle défile si le contenu dépasse (mobile) */}
      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
        {mode === "legacy" ? <LegacyApp key="legacy" /> : <NewApp key="new" />}
      </div>
    </div>
  );
}
