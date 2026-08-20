import { useRef, useState } from "react";
import { Trash2, Star, Image as ImageIcon, X } from "lucide-react";
import { SHELL } from "../theme.js";
import { hexA } from "../colorUtils.js";
import { currencyLabel } from "../currency.js";
import { resizeImageFile } from "../imageUtils.js";
import { SECTIONS } from "../data/defaults.js";

export default function DishRow({ dish, currency, onUpd, onDel }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const onPickPhoto = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await resizeImageFile(file);
      onUpd(dish.id, { photo: dataUrl });
    } catch {
      // fichier illisible : on laisse la photo existante inchangée
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ border: `1px solid ${SHELL.line}`, borderRadius: 10, padding: 8, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => onPickPhoto(e.target.files && e.target.files[0])} />
        <button onClick={() => fileRef.current && fileRef.current.click()} title={dish.photo ? "Remplacer la photo" : "Ajouter une photo"}
          className="relative shrink-0 flex items-center justify-center overflow-hidden"
          style={{ width: 26, height: 26, borderRadius: 7, background: "#f4f2ee", border: `1px solid ${SHELL.line}` }}>
          {dish.photo ? <img src={dish.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <ImageIcon size={13} style={{ color: SHELL.mut }} />}
        </button>
        {dish.photo && !uploading && (
          <button onClick={() => onUpd(dish.id, { photo: null })} title="Retirer la photo"
            style={{ padding: 3, color: SHELL.mut, borderRadius: 6 }} className="hover:bg-neutral-100">
            <X size={12} />
          </button>
        )}
        <input value={dish.name} onChange={(e) => onUpd(dish.id, { name: e.target.value })}
          style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500, color: SHELL.txt, border: "none", outline: "none", background: "transparent" }} />
        <input value={dish.price} onChange={(e) => onUpd(dish.id, { price: e.target.value.replace(",", ".") })}
          inputMode="decimal"
          style={{ width: 52, fontSize: 12.5, color: SHELL.txt, background: "#faf9f6", border: `1px solid ${SHELL.line}`, borderRadius: 6, padding: "4px 6px", textAlign: "right" }} />
        <span style={{ fontSize: 11, color: SHELL.mut }}>{currencyLabel(currency)}</span>
        <button onClick={() => onDel(dish.id)} title="Supprimer"
          style={{ padding: 4, color: SHELL.mut, borderRadius: 6 }} className="hover:bg-neutral-100">
          <Trash2 size={14} />
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7 }}>
        <div style={{ display: "flex", gap: 3, background: "#f4f2ee", borderRadius: 7, padding: 2 }}>
          {SECTIONS.map((s) => {
            const on = dish.section === s.id;
            return (
              <button key={s.id} onClick={() => onUpd(dish.id, { section: s.id })}
                style={{ fontSize: 11, fontWeight: on ? 700 : 500, padding: "3px 8px", borderRadius: 5,
                  background: on ? "#fff" : "transparent", color: on ? SHELL.txt : SHELL.mut,
                  boxShadow: on ? "0 1px 2px rgba(0,0,0,0.08)" : "none" }}>
                {s.label}
              </button>
            );
          })}
        </div>
        <button onClick={() => onUpd(dish.id, { dujour: !dish.dujour })}
          className="ml-auto"
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 999,
            border: `1px solid ${dish.dujour ? SHELL.honey : SHELL.line}`,
            background: dish.dujour ? hexA(SHELL.honey, 0.12) : "#fff",
            color: dish.dujour ? SHELL.honeyDeep : SHELL.mut }}>
          <Star size={12} fill={dish.dujour ? SHELL.honey : "none"} strokeWidth={2} /> du jour
        </button>
      </div>
    </div>
  );
}
