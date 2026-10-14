import { UtensilsCrossed, Sandwich } from "lucide-react";
import { SHELL, ff } from "../theme.js";
import { hexA } from "../colorUtils.js";
import { useStore } from "../state/store.jsx";

const OPTIONS = [
  { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed, desc: "Entrées, plats, desserts. Menu en livre à feuilleter." },
  { id: "snack", label: "Snack", icon: Sandwich, desc: "Burgers, tacos, formules. Une page par catégorie, grosses photos et prix lisibles." },
];

/*
 * « Vous êtes un restaurant ou un snack ? » — pilote les sections par défaut, le rendu du menu et les textes.
 * `first` = premier lancement : le choix charge la carte d'exemple du type. Sinon (changement depuis
 * l'accueil), on demande s'il faut remplacer la carte actuelle par l'exemple ou la garder telle quelle.
 */
export default function VenueChooser({ first = false }) {
  const { state, setVenue } = useStore();

  const choose = (id) => {
    if (id === state.venueType) return;
    if (first) return setVenue(id, true);
    const replace = window.confirm(
      `Passer en mode ${id === "snack" ? "snack" : "restaurant"}.\n\nOK : charger la carte d'exemple ${id === "snack" ? "snack" : "restaurant"} (remplace votre carte et la DA).\nAnnuler : garder votre carte et ne changer que le type.`
    );
    setVenue(id, replace);
  };

  return (
    <div role="radiogroup" aria-label="Type d'établissement" className="grid gap-3 sm:grid-cols-2">
      {OPTIONS.map((o) => {
        const Ic = o.icon, on = state.venueType === o.id;
        return (
          <button key={o.id} role="radio" aria-checked={on} onClick={() => choose(o.id)}
            className="text-left rounded-2xl p-5 transition-all hover:-translate-y-0.5"
            style={{ background: "#fff", border: on ? `2px solid ${SHELL.honey}` : `1px solid ${SHELL.line}`, boxShadow: on ? `0 0 0 4px ${hexA(SHELL.honey, 0.15)}` : "0 1px 2px rgba(0,0,0,0.04)" }}>
            <span className="flex items-center justify-center rounded-xl mb-3" style={{ width: 44, height: 44, background: on ? SHELL.honey : "#f1efe9", color: SHELL.ink }}>
              <Ic size={22} aria-hidden="true" />
            </span>
            <span className="block" style={{ fontFamily: ff("Fraunces"), fontSize: 22, fontWeight: 600, color: SHELL.txt }}>{o.label}</span>
            <span className="block mt-1" style={{ fontSize: 13, color: SHELL.mut, lineHeight: 1.45 }}>{o.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
