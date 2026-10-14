import { useRef, useState } from "react";
import { Palette, Image as ImageIcon, Upload, Loader2, Trash2, Type, FileUp } from "lucide-react";
import { SHELL, ff, TITLE_FONTS, BODY_FONTS } from "../theme.js";
import { hexA, extractPalette } from "../colorUtils.js";
import { PRESETS } from "../data/defaults.js";
import { readFontFile } from "../customFonts.js";
import { useStore } from "../state/store.jsx";
import { useUi } from "../state/ui.jsx";
import { Group, SubLabel, FontSelect } from "./ui.jsx";

/*
 * Identité visuelle / Brand Kit : un seul objet lu par tous les supports.
 * Logo (palette extraite par canvas), presets, couleurs, polices (sélecteur + import .ttf/.otf/.woff2).
 * La police n'est JAMAIS « détectée » depuis une image : c'est un choix explicite.
 */
export default function DaEditor() {
  const { state, setKit, applyPreset } = useStore();
  const { notify } = useUi();
  const { kit, presetId } = state;
  const logoRef = useRef(null);
  const fontRef = useRef(null);
  const [analyzing, setAnalyzing] = useState(false);

  const onLogo = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      setKit({ logo: dataURL }, true); // le logo seul ne change pas le preset
      setAnalyzing(true);
      const img = new Image();
      img.onload = () => {
        setTimeout(() => {
          const pal = extractPalette(img);
          if (pal) setKit(pal); // palette extraite → DA personnalisée (preset désélectionné)
          setAnalyzing(false);
        }, 620);
      };
      img.onerror = () => setAnalyzing(false);
      img.src = dataURL;
    };
    reader.readAsDataURL(file);
  };

  const onFont = async (file) => {
    if (!file) return;
    try {
      const font = await readFontFile(file);
      const others = kit.customFonts.filter((f) => f.name !== font.name);
      setKit({ customFonts: [...others, font] }, true);
      notify(`Police « ${font.name} » importée — choisissez-la dans les listes`);
    } catch (e) {
      notify(e.message || "Police illisible");
    }
  };

  const customNames = kit.customFonts.map((f) => f.name);
  const titleOpts = [...TITLE_FONTS, ...customNames];
  const bodyOpts = [...BODY_FONTS, ...customNames];

  return (
    <Group icon={Palette} title="Direction artistique" hint="Tous les supports lisent cette DA">
      {/* Logo */}
      <SubLabel>Logo</SubLabel>
      <input ref={logoRef} type="file" accept="image/*" className="hidden" aria-hidden="true" tabIndex={-1}
        onChange={(e) => { onLogo(e.target.files && e.target.files[0]); e.target.value = ""; }} />
      <button onClick={() => logoRef.current && logoRef.current.click()}
        className="w-full flex items-center gap-3 rounded-xl px-3 py-3 transition-colors"
        style={{ border: `1.5px dashed ${analyzing ? SHELL.honey : SHELL.line}`, background: analyzing ? hexA(SHELL.honey, 0.06) : "#fcfbf9" }}>
        <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 46, height: 46, background: "#f1efe9", overflow: "hidden" }}>
          {analyzing ? <Loader2 size={20} className="animate-spin" style={{ color: SHELL.honeyDeep }} aria-hidden="true" />
            : kit.logo ? <img src={kit.logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            : <ImageIcon size={20} style={{ color: SHELL.mut }} aria-hidden="true" />}
        </div>
        <div className="text-left min-w-0">
          <div style={{ fontSize: 13, fontWeight: 600, color: SHELL.txt }}>
            {analyzing ? "Analyse du logo…" : kit.logo ? "Remplacer le logo" : "Importer un logo"}
          </div>
          <div style={{ fontSize: 11.5, color: SHELL.mut, marginTop: 1 }}>
            {analyzing ? "Extraction de la palette dominante" : "PNG ou JPG — palette auto-détectée"}
          </div>
        </div>
        {!analyzing && <Upload size={16} style={{ color: SHELL.mut, marginLeft: "auto" }} aria-hidden="true" />}
      </button>

      {kit.logo && !analyzing && (
        <button onClick={() => setKit({ logo: null }, true)} className="flex items-center gap-1.5 mt-2" style={{ fontSize: 12, color: SHELL.mut }}>
          <Trash2 size={13} aria-hidden="true" /> Supprimer le logo
        </button>
      )}

      {/* Presets */}
      <SubLabel style={{ marginTop: 18 }}>Modèles par cuisine</SubLabel>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((p) => {
          const on = presetId === p.id;
          return (
            <button key={p.id} onClick={() => applyPreset(p)} aria-pressed={on}
              className="rounded-xl px-2.5 py-2.5 text-left transition-all"
              style={{ border: on ? `1.5px solid ${SHELL.honey}` : `1px solid ${SHELL.line}`, background: on ? hexA(SHELL.honey, 0.06) : "#fff" }}>
              <div className="flex gap-1 mb-2">
                {[p.kit.primary, p.kit.accent, p.kit.background].map((c, i) => (
                  <span key={i} style={{ width: 18, height: 18, borderRadius: 5, background: c, border: `1px solid ${hexA("#000", 0.1)}` }} />
                ))}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: SHELL.txt, lineHeight: 1.15 }}>{p.name}</div>
              <div style={{ fontSize: 10.5, color: SHELL.mut, marginTop: 2, fontFamily: ff(p.kit.titleFont) }}>{p.kit.titleFont}</div>
            </button>
          );
        })}
      </div>

      {/* Couleurs */}
      <SubLabel style={{ marginTop: 18 }}>Couleurs</SubLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[["primary", "Primaire"], ["accent", "Accent"], ["background", "Fond"], ["text", "Texte"]].map(([k, lbl]) => (
          <div key={k} className="flex items-center gap-2.5">
            <label className="relative shrink-0" style={{ width: 34, height: 34 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: 9, background: kit[k], border: `1px solid ${hexA("#000", 0.12)}` }} />
              <input type="color" value={kit[k]} aria-label={`Couleur ${lbl}`} onChange={(e) => setKit({ [k]: e.target.value })}
                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
            </label>
            <span style={{ fontSize: 12.5, color: SHELL.txt, flex: 1 }}>{lbl}</span>
            <input value={kit[k]} aria-label={`Code couleur ${lbl}`} onChange={(e) => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && setKit({ [k]: e.target.value })}
              style={{ width: 82, fontSize: 12, fontFamily: "ui-monospace, monospace", color: SHELL.mut, background: "#faf9f6", border: `1px solid ${SHELL.line}`, borderRadius: 7, padding: "5px 8px" }} />
          </div>
        ))}
      </div>

      {/* Polices */}
      <SubLabel style={{ marginTop: 18 }}>
        <span className="inline-flex items-center gap-1"><Type size={12} aria-hidden="true" /> Polices</span>
      </SubLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <FontSelect label="Titres" value={kit.titleFont} options={titleOpts} onChange={(v) => setKit({ titleFont: v })} />
        <FontSelect label="Corps" value={kit.bodyFont} options={bodyOpts} onChange={(v) => setKit({ bodyFont: v })} />
        <p style={{ fontSize: 11, color: SHELL.mut, lineHeight: 1.4, marginTop: 2 }}>
          La police n'est pas devinée depuis le logo (peu fiable) : choisissez-la ici, ou importez le fichier de votre police.
        </p>
        <input ref={fontRef} type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" aria-hidden="true" tabIndex={-1}
          onChange={(e) => { onFont(e.target.files && e.target.files[0]); e.target.value = ""; }} />
        <button onClick={() => fontRef.current && fontRef.current.click()} className="flex items-center gap-1.5" style={{ fontSize: 12.5, fontWeight: 600, color: SHELL.honeyDeep }}>
          <FileUp size={14} aria-hidden="true" /> Importer une police (.ttf, .otf, .woff2)
        </button>
        {kit.customFonts.map((f) => (
          <div key={f.name} className="flex items-center gap-2" style={{ fontSize: 12, color: SHELL.mut }}>
            <span style={{ fontFamily: `'${f.name}', sans-serif`, color: SHELL.txt, fontSize: 14 }}>{f.name}</span>
            <button onClick={() => setKit({
              customFonts: kit.customFonts.filter((x) => x.name !== f.name),
              ...(kit.titleFont === f.name ? { titleFont: "Playfair Display" } : {}),
              ...(kit.bodyFont === f.name ? { bodyFont: "Lora" } : {}),
            }, true)} aria-label={`Retirer la police ${f.name}`} className="ml-auto" style={{ padding: 3 }}>
              <Trash2 size={12} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </Group>
  );
}
