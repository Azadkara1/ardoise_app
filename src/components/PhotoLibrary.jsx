import { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { SHELL } from "../theme.js";

/* Photothèque : on importe les photos une fois ici, puis on les attribue aux plats (bouton photo de chaque plat). */
export default function PhotoLibrary({ photos, onAdd, onDelete }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async (files) => {
    if (!files || !files.length) return;
    setBusy(true);
    try { await onAdd(Array.from(files)); } finally { setBusy(false); }
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { pick(e.target.files); e.target.value = ""; }} />
      <button onClick={() => fileRef.current && fileRef.current.click()} disabled={busy}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3"
        style={{ border: `1.5px dashed ${SHELL.line}`, background: "#fcfbf9", color: SHELL.honeyDeep, fontSize: 13, fontWeight: 600 }}>
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
        {busy ? "Import…" : "Importer des photos"}
      </button>

      {photos.length === 0 ? (
        <p style={{ fontSize: 11.5, color: SHELL.mut, marginTop: 8, lineHeight: 1.4 }}>
          Aucune photo. Importez-les ici, puis choisissez-en une pour chaque plat via son bouton photo.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {photos.map((p) => (
            <div key={p.id} className="relative" style={{ aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: `1px solid ${SHELL.line}` }}>
              <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => onDelete(p.id)} title="Supprimer cette photo"
                className="absolute flex items-center justify-center"
                style={{ top: 3, right: 3, width: 18, height: 18, borderRadius: 999, background: "rgba(0,0,0,0.6)", color: "#fff" }}>
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
