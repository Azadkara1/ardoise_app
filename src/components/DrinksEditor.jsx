import { Plus, Trash2 } from "lucide-react";
import { SHELL, INP } from "../theme.js";
import { uid } from "../id.js";
import { currencyLabel } from "../currency.js";

export default function DrinksEditor({ drinks, setDrinks, currency }) {
  const updCategory = (id, patch) =>
    setDrinks((d) => ({ ...d, categories: d.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const delCategory = (id) => setDrinks((d) => ({ ...d, categories: d.categories.filter((c) => c.id !== id) }));
  const addCategory = () =>
    setDrinks((d) => ({ ...d, categories: [...d.categories, { id: uid(), name: "Nouvelle catégorie", items: [] }] }));

  const addItem = (catId) =>
    updCategory(catId, {
      items: [...drinks.categories.find((c) => c.id === catId).items, { id: uid(), name: "Nouvelle ligne", price: 0 }],
    });
  const updItem = (catId, itemId, patch) => {
    const cat = drinks.categories.find((c) => c.id === catId);
    updCategory(catId, { items: cat.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) });
  };
  const delItem = (catId, itemId) => {
    const cat = drinks.categories.find((c) => c.id === catId);
    updCategory(catId, { items: cat.items.filter((it) => it.id !== itemId) });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {drinks.categories.map((cat) => (
        <div key={cat.id} style={{ border: `1px solid ${SHELL.line}`, borderRadius: 10, padding: 8, background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <input value={cat.name} onChange={(e) => updCategory(cat.id, { name: e.target.value })}
              style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: SHELL.honeyDeep, border: "none", outline: "none", background: "transparent" }} />
            <button onClick={() => delCategory(cat.id)} title="Supprimer la catégorie" style={{ padding: 3, color: SHELL.mut, borderRadius: 6 }} className="hover:bg-neutral-100">
              <Trash2 size={13} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {cat.items.map((it) => (
              <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input value={it.name} placeholder="Nom" onChange={(e) => updItem(cat.id, it.id, { name: e.target.value })}
                  style={{ ...INP, flex: 1 }} />
                <input value={it.price} inputMode="decimal" onChange={(e) => updItem(cat.id, it.id, { price: e.target.value.replace(",", ".") })}
                  style={{ width: 52, fontSize: 12.5, color: SHELL.txt, background: "#faf9f6", border: `1px solid ${SHELL.line}`, borderRadius: 6, padding: "4px 6px", textAlign: "right" }} />
                <span style={{ fontSize: 11, color: SHELL.mut }}>{currencyLabel(currency)}</span>
                <button onClick={() => delItem(cat.id, it.id)} title="Supprimer" style={{ padding: 3, color: SHELL.mut, borderRadius: 6 }} className="hover:bg-neutral-100">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => addItem(cat.id)} className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg py-1.5"
            style={{ border: `1px dashed ${SHELL.line}`, color: SHELL.honeyDeep, fontSize: 12, fontWeight: 600, background: "#fcfbf9" }}>
            <Plus size={13} /> Ajouter une ligne
          </button>
        </div>
      ))}

      <button onClick={addCategory} className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5"
        style={{ border: `1px dashed ${SHELL.line}`, color: SHELL.honeyDeep, fontSize: 13, fontWeight: 600, background: "#fcfbf9" }}>
        <Plus size={15} /> Ajouter une catégorie
      </button>
    </div>
  );
}
