import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { SHELL, INP } from "../theme.js";
import { resizeImageFile } from "../imageUtils.js";
import { SelectField, SubLabel } from "./ui.jsx";
import PhotoAdjuster from "./PhotoAdjuster.jsx";
import { useStore } from "../state/store.jsx";
import { useUi } from "../state/ui.jsx";

/* Plat du jour : un champ libre + une photo (importée ici) ; en option, lier un plat de la carte pour son prix (et sa photo à défaut). */
export default function DailyEditor() {
  const { state, setDaily } = useStore();
  const { notify } = useUi();
  const { daily, dishes } = state;
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const options = [{ value: "", label: "Aucun" }, ...dishes.map((d) => ({ value: d.id, label: d.name }))];

  const onPhoto = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      setDaily({ photo: await resizeImageFile(file), photoFit: null });
    } catch {
      notify("Cette image n'a pas pu être lue");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <label style={{ display: "block" }}>
        <span style={{ fontSize: 11.5, color: SHELL.mut, display: "block", marginBottom: 4 }}>Plat du jour</span>
        <textarea value={daily.text} onChange={(e) => setDaily({ text: e.target.value })} rows={5}
          placeholder="Ex. : Filets de perche, sauce citron, riz — 24.-"
          style={{ ...INP, borderRadius: 8, padding: "8px 10px", resize: "vertical", fontFamily: "inherit", lineHeight: 1.4 }} />
        <span style={{ fontSize: 11, color: SHELL.mut, display: "block", marginTop: 5, lineHeight: 1.4 }}>
          Tout ce que vous écrivez ici s'affiche tel quel sur l'affiche (retours à la ligne inclus).
        </span>
      </label>

      <div>
        <SubLabel>Photo</SubLabel>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-hidden="true" tabIndex={-1}
          onChange={(e) => { onPhoto(e.target.files && e.target.files[0]); e.target.value = ""; }} />
        <div className="flex items-center gap-3">
          <button onClick={() => fileRef.current && fileRef.current.click()} disabled={busy}
            aria-label={daily.photo ? "Remplacer la photo" : "Ajouter une photo"}
            className="flex items-center justify-center overflow-hidden shrink-0"
            style={{ width: 64, height: 64, borderRadius: 10, background: "#f4f2ee", border: `1px ${daily.photo ? "solid" : "dashed"} ${SHELL.line}`, color: SHELL.honeyDeep }}>
            {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              : daily.photo ? <img src={daily.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <ImagePlus size={22} aria-hidden="true" />}
          </button>
          <div style={{ fontSize: 12, color: SHELL.mut, lineHeight: 1.4 }}>
            {daily.photo ? "Cliquez sur la photo pour la remplacer." : "Ajoutez une photo du plat : elle s'affiche sur l'affiche."}
            {daily.photo && (
              <button onClick={() => setDaily({ photo: null, photoFit: null })} className="flex items-center gap-1 mt-1.5" style={{ color: SHELL.txt, fontWeight: 600 }}>
                <Trash2 size={12} aria-hidden="true" /> Supprimer la photo
              </button>
            )}
          </div>
        </div>
        {daily.photo && (
          <div style={{ marginTop: 14 }}>
            <PhotoAdjuster src={daily.photo} fit={daily.photoFit} onChange={(photoFit) => setDaily({ photoFit })} />
          </div>
        )}
      </div>

      <div>
        <SelectField label="Prix" value={daily.dishId || ""} options={options} onChange={(v) => setDaily({ dishId: v || null })} />
        <span style={{ fontSize: 11, color: SHELL.mut, display: "block", marginTop: 5, lineHeight: 1.4 }}>
          Optionnel : lier un plat de la carte affiche son prix en pastille (et sa photo si vous n'en avez pas ajouté).
        </span>
      </div>
    </div>
  );
}
