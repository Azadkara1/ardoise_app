import { useState } from "react";
import { Trash2, Star, ChevronDown, Plus, X } from "lucide-react";
import { SHELL, INP } from "../theme.js";
import { hexA } from "../colorUtils.js";
import { currencyLabel } from "../currency.js";
import { uid } from "../id.js";
import { useStore } from "../state/store.jsx";
import PhotoImportButton from "./PhotoImport.jsx";
import PhotoAdjuster from "./PhotoAdjuster.jsx";

const naked = { border: "none", outline: "none", background: "transparent", minWidth: 0 };
const minPrice = (variants) => Math.min(...variants.map((v) => Number(v.price) || 0));

/*
 * Une ligne de la carte, directement éditable : photo (à côté), nom, prix, description courte,
 * « du jour », suppression. « Options » : variantes de prix (Seul/Menu, S/M/L), formule (snack), cadrage photo.
 */
export default function DishRow({ dish }) {
  const { state, patchDish, deleteDish } = useStore();
  const { currency } = state.settings;
  const snack = state.venueType === "snack";
  const [open, setOpen] = useState(false);
  const variants = dish.variants || [];
  const hasVariants = variants.length > 0;

  const setVariants = (next) => patchDish(dish.id, { variants: next });
  const patchVariant = (id, p) => setVariants(variants.map((v) => (v.id === id ? { ...v, ...p } : v)));

  return (
    <div style={{ border: `1px solid ${SHELL.line}`, borderRadius: 10, padding: 8, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <PhotoImportButton dish={dish} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <input value={dish.name} onChange={(e) => patchDish(dish.id, { name: e.target.value })} aria-label="Nom"
            style={{ ...naked, width: "100%", fontSize: 13.5, fontWeight: 600, color: SHELL.txt }} />
          <input value={dish.description || ""} onChange={(e) => patchDish(dish.id, { description: e.target.value })}
            aria-label="Description courte" placeholder="Description courte (optionnelle)"
            style={{ ...naked, width: "100%", fontSize: 12, color: SHELL.mut, marginTop: 1 }} />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {hasVariants ? (
            <span title="Prix défini par les variantes" style={{ fontSize: 11.5, color: SHELL.mut, whiteSpace: "nowrap" }}>dès {minPrice(variants)}</span>
          ) : (
            <input value={dish.price} onChange={(e) => patchDish(dish.id, { price: e.target.value.replace(",", ".") })}
              inputMode="decimal" aria-label="Prix"
              style={{ ...INP, width: 54, padding: "4px 6px", textAlign: "right", fontSize: 12.5 }} />
          )}
          <span style={{ fontSize: 11, color: SHELL.mut }}>{currencyLabel(currency)}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7 }}>
        <button onClick={() => patchDish(dish.id, { duJour: !dish.duJour })} aria-pressed={!!dish.duJour}
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 999,
            border: `1px solid ${dish.duJour ? SHELL.honey : SHELL.line}`,
            background: dish.duJour ? hexA(SHELL.honey, 0.14) : "#fff",
            color: dish.duJour ? SHELL.honeyDeep : SHELL.mut }}>
          <Star size={12} fill={dish.duJour ? SHELL.honey : "none"} strokeWidth={2} aria-hidden="true" /> {snack ? "à la une" : "plat du jour"}
        </button>
        <button onClick={() => setOpen((v) => !v)} aria-expanded={open}
          style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: SHELL.mut, padding: "4px 6px" }}>
          Options <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none" }} aria-hidden="true" />
        </button>
        <button onClick={() => deleteDish(dish.id)} aria-label={`Supprimer ${dish.name}`} title="Supprimer"
          className="ml-auto hover:bg-neutral-100" style={{ padding: 5, color: SHELL.mut, borderRadius: 6 }}>
          <Trash2 size={14} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: "#faf9f6", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* variantes de prix */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: SHELL.mut, marginBottom: 6 }}>Variantes de prix</div>
            {variants.map((v) => (
              <div key={v.id} className="flex items-center gap-1.5 mb-1.5">
                <input value={v.label} onChange={(e) => patchVariant(v.id, { label: e.target.value })} aria-label="Nom de la variante" placeholder="Seul, Menu, S, M, L…"
                  style={{ ...INP, flex: 1, padding: "4px 7px", fontSize: 12.5 }} />
                <input value={v.price} onChange={(e) => patchVariant(v.id, { price: e.target.value.replace(",", ".") })} inputMode="decimal" aria-label="Prix de la variante"
                  style={{ ...INP, width: 58, padding: "4px 7px", fontSize: 12.5, textAlign: "right" }} />
                <button onClick={() => setVariants(variants.filter((x) => x.id !== v.id))} aria-label="Supprimer la variante" style={{ padding: 4, color: SHELL.mut }}>
                  <X size={13} aria-hidden="true" />
                </button>
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setVariants([...variants, { id: uid(), label: "", price: dish.price || 0 }])}
                className="flex items-center gap-1" style={{ fontSize: 11.5, fontWeight: 600, color: SHELL.honeyDeep }}>
                <Plus size={12} aria-hidden="true" /> Variante
              </button>
              {!hasVariants && snack && (
                <button onClick={() => setVariants([{ id: uid(), label: "Seul", price: dish.price || 0 }, { id: uid(), label: "Menu", price: (Number(dish.price) || 0) + 4 }])}
                  style={{ fontSize: 11.5, color: SHELL.mut, textDecoration: "underline" }}>Seul / Menu</button>
              )}
              {!hasVariants && (
                <button onClick={() => setVariants(["S", "M", "L"].map((l, i) => ({ id: uid(), label: l, price: (Number(dish.price) || 0) + i * 1.5 })))}
                  style={{ fontSize: 11.5, color: SHELL.mut, textDecoration: "underline" }}>S / M / L</button>
              )}
            </div>
          </div>

          {/* formule (snack) */}
          {snack && (
            <div>
              <label className="flex items-center gap-2" style={{ fontSize: 12.5, color: SHELL.txt }}>
                <input type="checkbox" checked={!!dish.isFormula} onChange={(e) => patchDish(dish.id, { isFormula: e.target.checked })} />
                C'est une formule (badge « FORMULE »)
              </label>
              {dish.isFormula && (
                <input value={dish.contents || ""} onChange={(e) => patchDish(dish.id, { contents: e.target.value })} aria-label="Contenu de la formule"
                  placeholder="Ex. burger + frites + boisson" style={{ ...INP, marginTop: 6, padding: "6px 8px", fontSize: 12.5 }} />
              )}
            </div>
          )}

          {/* cadrage photo */}
          {dish.photo && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: SHELL.mut, marginBottom: 6 }}>Cadrage de la photo (Post)</div>
              <PhotoAdjuster src={dish.photo} fit={dish.photoFit} onChange={(photoFit) => patchDish(dish.id, { photoFit })} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
