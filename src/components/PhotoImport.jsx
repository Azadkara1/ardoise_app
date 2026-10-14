import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { SHELL } from "../theme.js";
import { resizeImageFile } from "../imageUtils.js";
import { useStore } from "../state/store.jsx";
import { useUi } from "../state/ui.jsx";

// Sur mobile (pointeur tactile), `capture` ouvre directement l'appareil photo ; sur desktop, simple sélecteur de fichier.
const isTouch = () => typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

/** Hook d'import : ouvre le sélecteur, redimensionne/compresse (canvas) puis stocke en dataURL sur le plat. */
export function usePhotoImport(dishId) {
  const { patchDish } = useStore();
  const { notify } = useUi();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const photo = await resizeImageFile(file);
      patchDish(dishId, { photo, photoFit: null });
    } catch {
      notify("Cette image n'a pas pu être lue");
    } finally {
      setBusy(false);
    }
  };

  const input = (
    <input ref={inputRef} type="file" accept="image/*" capture={isTouch() ? "environment" : undefined}
      className="hidden" aria-hidden="true" tabIndex={-1}
      onChange={(e) => { onFile(e.target.files && e.target.files[0]); e.target.value = ""; }} />
  );
  return { open: () => inputRef.current && inputRef.current.click(), busy, input };
}

/* Bouton à côté de chaque ligne : vignette si photo (cliquer = remplacer, croix = supprimer), sinon icône d'ajout. */
export default function PhotoImportButton({ dish, size = 44 }) {
  const { patchDish } = useStore();
  const { open, busy, input } = usePhotoImport(dish.id);
  const label = dish.photo ? `Remplacer la photo de ${dish.name}` : `Ajouter une photo pour ${dish.name}`;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {input}
      <button onClick={open} aria-label={label} title={label} disabled={busy}
        className="flex items-center justify-center overflow-hidden w-full h-full"
        style={{ borderRadius: 9, background: "#f4f2ee", border: `1px ${dish.photo ? "solid" : "dashed"} ${SHELL.line}`, color: SHELL.honeyDeep }}>
        {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          : dish.photo ? <img src={dish.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <ImagePlus size={18} aria-hidden="true" />}
      </button>
      {dish.photo && !busy && (
        <button onClick={() => patchDish(dish.id, { photo: null, photoFit: null })} aria-label={`Supprimer la photo de ${dish.name}`} title="Supprimer la photo"
          className="absolute flex items-center justify-center"
          style={{ top: -5, right: -5, width: 18, height: 18, borderRadius: 999, background: SHELL.ink, color: "#fff", border: "1.5px solid #fff" }}>
          <X size={10} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
