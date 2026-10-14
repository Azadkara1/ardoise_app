import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { SHELL } from "../theme.js";
import { venueCopy } from "../venue.js";
import { useStore } from "../state/store.jsx";
import DishRow from "./DishRow.jsx";

/*
 * Éditeur de carte : plats groupés par section. Sections renommables, réordonnables, supprimables,
 * + « Ajouter une section ». Les changements se répercutent en direct dans le livre, le plat du jour et le post.
 */
export default function CarteEditor() {
  const { state, patchSection, moveSection, deleteSection, addSection, addDish } = useStore();
  const { sections, dishes, venueType } = state;
  const copy = venueCopy(venueType);

  const onDelete = (sec, count) => {
    const msg = count
      ? `Supprimer « ${sec.name} » et ses ${count} ${count > 1 ? copy.items : copy.item} ?`
      : `Supprimer « ${sec.name} » ?`;
    if (window.confirm(msg)) deleteSection(sec.id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {sections.length === 0 && (
        <p style={{ fontSize: 12.5, color: SHELL.mut }}>Aucune section. Ajoutez-en une pour commencer votre carte.</p>
      )}

      {sections.map((sec, i) => {
        const items = dishes.filter((d) => d.sectionId === sec.id);
        return (
          <section key={sec.id} aria-label={sec.name}>
            {/* en-tête de section */}
            <div className="flex items-center gap-1.5 mb-2">
              <input value={sec.name} onChange={(e) => patchSection(sec.id, { name: e.target.value })} aria-label="Nom de la section"
                style={{ flex: 1, minWidth: 0, fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: SHELL.honeyDeep, fontWeight: 700,
                  background: "transparent", border: "none", borderBottom: `1px dashed ${SHELL.line}`, outline: "none", padding: "3px 0" }} />
              <button onClick={() => moveSection(sec.id, -1)} disabled={i === 0} aria-label={`Monter ${sec.name}`} title="Monter"
                className="hover:bg-neutral-100 disabled:opacity-30" style={{ padding: 5, borderRadius: 6, color: SHELL.mut }}>
                <ArrowUp size={14} aria-hidden="true" />
              </button>
              <button onClick={() => moveSection(sec.id, 1)} disabled={i === sections.length - 1} aria-label={`Descendre ${sec.name}`} title="Descendre"
                className="hover:bg-neutral-100 disabled:opacity-30" style={{ padding: 5, borderRadius: 6, color: SHELL.mut }}>
                <ArrowDown size={14} aria-hidden="true" />
              </button>
              <button onClick={() => onDelete(sec, items.length)} aria-label={`Supprimer ${sec.name}`} title="Supprimer la section"
                className="hover:bg-neutral-100" style={{ padding: 5, borderRadius: 6, color: SHELL.mut }}>
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </div>

            <label className="flex items-center gap-2 mb-2" style={{ fontSize: 11.5, color: SHELL.mut }}>
              <input type="checkbox" checked={sec.layout !== "list"} onChange={(e) => patchSection(sec.id, { layout: e.target.checked ? "photos" : "list" })} />
              Pages photos dans le menu
            </label>

            {items.length === 0 && <div style={{ fontSize: 11.5, color: SHELL.mut, padding: "2px 0 6px" }}>Aucun {copy.item} (la section n'apparaît pas dans le menu)</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((d) => <DishRow key={d.id} dish={d} />)}
            </div>
            <button onClick={() => addDish(sec.id, copy.newItem)} className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg py-2"
              style={{ border: `1px dashed ${SHELL.line}`, color: SHELL.honeyDeep, fontSize: 12.5, fontWeight: 600, background: "#fcfbf9" }}>
              <Plus size={14} aria-hidden="true" /> {copy.addItem}
            </button>
          </section>
        );
      })}

      <button onClick={() => addSection(copy.newSection)} className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5"
        style={{ background: SHELL.ink, color: "#fff", fontSize: 13, fontWeight: 600 }}>
        <Plus size={15} aria-hidden="true" /> Ajouter une section
      </button>
    </div>
  );
}
