import { useRef, useState } from "react";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import { SHELL } from "../theme.js";
import { hexA } from "../colorUtils.js";
import { currencyLabel } from "../currency.js";
import { resizeImageFile } from "../imageUtils.js";
import { TextField, DateField, TextArea, NumField } from "./ui.jsx";

export default function EventEditor({ event, setEvent, currency }) {
  const set = (patch) => setEvent((e) => ({ ...e, ...patch }));
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const onPickPhoto = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await resizeImageFile(file);
      set({ photo: dataUrl });
    } catch {
      // fichier illisible : on laisse la photo existante inchangée
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => onPickPhoto(e.target.files && e.target.files[0])} />
      <button onClick={() => fileRef.current && fileRef.current.click()}
        className="w-full flex items-center gap-3 rounded-xl px-3 py-3 transition-colors"
        style={{ border: `1.5px dashed ${uploading ? SHELL.honey : SHELL.line}`, background: uploading ? hexA(SHELL.honey, 0.06) : "#fcfbf9" }}>
        <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 40, height: 40, background: "#f1efe9", overflow: "hidden" }}>
          {uploading ? <Loader2 size={17} className="animate-spin" style={{ color: SHELL.honeyDeep }} />
            : event.photo ? <img src={event.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <ImageIcon size={17} style={{ color: SHELL.mut }} />}
        </div>
        <div className="text-left min-w-0" style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: SHELL.txt }}>
            {uploading ? "Import…" : event.photo ? "Remplacer la photo" : "Ajouter une photo (optionnel)"}
          </div>
        </div>
        {event.photo && !uploading && (
          <span onClick={(e) => { e.stopPropagation(); set({ photo: null }); }} title="Retirer la photo"
            style={{ padding: 4, color: SHELL.mut, borderRadius: 6 }}>
            <X size={14} />
          </span>
        )}
      </button>

      <TextField label="Titre de la soirée" value={event.title} onChange={(v) => set({ title: v })} />
      <DateField label="Date" value={event.date} onChange={(v) => set({ date: v })} />
      <TextArea label="Description" value={event.desc} onChange={(v) => set({ desc: v })} />
      <NumField label={`Prix (${currencyLabel(currency)})`} value={event.price} onChange={(v) => set({ price: v })} />
    </div>
  );
}
