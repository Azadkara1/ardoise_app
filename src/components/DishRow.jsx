import { useState } from "react";
import { Trash2, Star, Image as ImageIcon, X } from "lucide-react";
import { SHELL } from "../theme.js";
import { hexA } from "../colorUtils.js";
import { currencyLabel } from "../currency.js";
import { SECTIONS } from "../data/defaults.js";
import PhotoAdjuster from "./PhotoAdjuster.jsx";

export default function DishRow({ dish, currency, photos = [], onUpd, onDel }) {
  const [open, setOpen] = useState(false);
  // photo de la photothèque (photoId), ou ancienne photo stockée directement sur le plat
  const src = photos.find((p) => p.id === dish.photoId)?.src ?? dish.photo ?? null;

  return (
    <div style={{ border: `1px solid ${SHELL.line}`, borderRadius: 10, padding: 8, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={() => setOpen((v) => !v)} title={src ? "Modifier la photo" : "Ajouter une photo"}
          className="relative shrink-0 flex items-center justify-center overflow-hidden"
          style={{ width: 26, height: 26, borderRadius: 7, background: "#f4f2ee", border: `1px solid ${open ? SHELL.honey : SHELL.line}` }}>
          {src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <ImageIcon size={13} style={{ color: SHELL.mut }} />}
        </button>
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
      {open && (
        <div style={{ marginTop: 8, padding: 8, borderRadius: 8, background: "#faf9f6" }}>
          {photos.length === 0 && !src ? (
            <p style={{ fontSize: 11.5, color: SHELL.mut, lineHeight: 1.4 }}>
              Importez d'abord des photos dans la Photothèque (en haut du panneau), puis choisissez-les ici.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => onUpd(dish.id, { photoId: null, photo: null, photoFit: null })}
                  title="Aucune photo" className="flex items-center justify-center"
                  style={{ width: 40, height: 40, borderRadius: 7, border: `1.5px solid ${!src ? SHELL.honey : SHELL.line}`, background: "#fff", color: SHELL.mut }}>
                  <X size={14} />
                </button>
                {photos.map((p) => (
                  <button key={p.id} onClick={() => onUpd(dish.id, { photoId: p.id, photo: null, photoFit: null })}
                    style={{ width: 40, height: 40, borderRadius: 7, overflow: "hidden", padding: 0,
                      border: `1.5px solid ${dish.photoId === p.id ? SHELL.honey : SHELL.line}` }}>
                    <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
              {src && (
                <div style={{ marginTop: 10 }}>
                  <PhotoAdjuster src={src} fit={dish.photoFit} onChange={(photoFit) => onUpd(dish.id, { photoFit })} />
                </div>
              )}
            </>
          )}
        </div>
      )}
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
