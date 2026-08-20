import { Plus } from "lucide-react";
import { SHELL } from "../theme.js";
import { uid } from "../id.js";
import { SEASONS, SECTIONS } from "../data/defaults.js";
import { SubLabel, TextField, SegmentedField } from "./ui.jsx";
import DishRow from "./DishRow.jsx";

/* Même structure d'édition que la Carte principale (DishRow + sections), sur `seasonal.dishes`. */
export default function SeasonalEditor({ seasonal, setSeasonal, currency }) {
  const set = (patch) => setSeasonal((s) => ({ ...s, ...patch }));
  const updDish = (id, patch) => setSeasonal((s) => ({ ...s, dishes: s.dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)) }));
  const delDish = (id) => setSeasonal((s) => ({ ...s, dishes: s.dishes.filter((d) => d.id !== id) }));
  const addDish = () =>
    setSeasonal((s) => ({ ...s, dishes: [...s.dishes, { id: uid(), name: "Nouveau plat de saison", price: 0, section: "plats", dujour: false }] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <SubLabel>Saison</SubLabel>
      <SegmentedField options={SEASONS.map((s) => ({ value: s, label: s }))} value={seasonal.season} onChange={(v) => set({ season: v })} />
      <TextField label="Intitulé" value={seasonal.label} onChange={(v) => set({ label: v })} />

      <SubLabel style={{ marginTop: 8 }}>Plats de saison</SubLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SECTIONS.map((sec) => {
          const items = seasonal.dishes.filter((d) => d.section === sec.id);
          return (
            <div key={sec.id}>
              <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: SHELL.honeyDeep, fontWeight: 700, margin: "6px 0 4px" }}>
                {sec.label}
              </div>
              {items.length === 0 && <div style={{ fontSize: 11.5, color: SHELL.mut, padding: "2px 0 4px" }}>Aucun plat</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map((d) => (
                  <DishRow key={d.id} dish={d} currency={currency} onUpd={updDish} onDel={delDish} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={addDish} className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5"
        style={{ border: `1px dashed ${SHELL.line}`, color: SHELL.honeyDeep, fontSize: 13, fontWeight: 600, background: "#fcfbf9" }}>
        <Plus size={15} /> Ajouter un plat de saison
      </button>
    </div>
  );
}
