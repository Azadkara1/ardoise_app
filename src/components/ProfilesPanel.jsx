import { useEffect, useState } from "react";
import { Bookmark, Save, Trash2 } from "lucide-react";
import { SHELL } from "../theme.js";
import { hexA } from "../colorUtils.js";
import { Group } from "./ui.jsx";

/*
 * Liste de profils resto cliquables ("DA sauvegardées"). Un clic charge
 * intégralement kit/info/dishes/week du profil dans l'app — c'est le mécanisme
 * qu'on veut voir grandir vers des comptes utilisateurs (cf. AMELIORATIONS.md).
 */
export default function ProfilesPanel({ profiles, activeProfileId, currentName, onSelect, onSave, onDelete }) {
  const [name, setName] = useState(currentName);

  // Pré-remplit le champ avec le nom du profil qu'on vient de charger, sans
  // écraser une saisie manuelle en cours (on ne resynchronise que sur switch).
  useEffect(() => {
    setName(currentName);
  }, [activeProfileId]);

  return (
    <Group icon={Bookmark} title="Restaurants" hint={profiles.length ? `${profiles.length} enregistré${profiles.length > 1 ? "s" : ""}` : null}>
      {profiles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {profiles.map((p) => {
            const on = p.id === activeProfileId;
            return (
              <span key={p.id} className="inline-flex items-center"
                style={{ border: on ? `1.5px solid ${SHELL.honey}` : `1px solid ${SHELL.line}`,
                  background: on ? hexA(SHELL.honey, 0.1) : "#fff", borderRadius: 999, overflow: "hidden" }}>
                <button onClick={() => onSelect(p)}
                  style={{ fontSize: 12.5, fontWeight: on ? 700 : 500, color: on ? SHELL.honeyDeep : SHELL.txt, padding: "6px 4px 6px 12px" }}>
                  {p.name}
                </button>
                <button onClick={() => onDelete(p.id)} title="Supprimer ce restaurant"
                  style={{ padding: "6px 10px 6px 4px", color: SHELL.mut }} className="hover:text-red-600">
                  <Trash2 size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du restaurant"
          style={{ flex: 1, minWidth: 0, fontSize: 13, color: SHELL.txt, background: "#faf9f6",
            border: `1px solid ${SHELL.line}`, borderRadius: 8, padding: "8px 10px", outline: "none" }} />
        <button onClick={() => name.trim() && onSave(name.trim())}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 shrink-0"
          style={{ background: SHELL.honey, color: SHELL.ink, fontSize: 12.5, fontWeight: 700 }}>
          <Save size={13} /> Enregistrer
        </button>
      </div>
    </Group>
  );
}
