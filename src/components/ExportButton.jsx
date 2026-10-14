import { useEffect, useRef, useState } from "react";
import { Download, ChevronDown, Loader2 } from "lucide-react";
import { SHELL } from "../theme.js";
import { exportSupport, exportPages } from "../export.js";
import { useStore } from "../state/store.jsx";
import { useUi } from "../state/ui.jsx";

// "PNG" reste le format technique interne (export.js) ; le libellé affiché est « Image ».
const FORMAT_LABELS = { PNG: "Image", PDF: "PDF" };

/* Bouton « Exporter » de la barre du haut : capture le nœud exposé par la page active (exportRef). */
export default function ExportButton({ support }) {
  const { state } = useStore();
  const { exportRef, exportSuffix, exportPageIdx, notify } = useUi();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const box = useRef(null);

  // ferme le menu au clic extérieur / Échap
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  // Menu : le livre complet (toutes les pages) ou seulement la page affichée.
  const isMenu = support === "menu";
  const entries = isMenu
    ? [
        { format: "PDF", scope: "all", label: "PDF — menu complet" },
        { format: "PNG", scope: "all", label: "Images — toutes les pages" },
        { format: "PNG", scope: "page", label: "Image — page affichée" },
        { format: "PDF", scope: "page", label: "PDF — page affichée" },
      ]
    : [
        { format: "PNG", scope: "page", label: "Exporter en Image" },
        { format: "PDF", scope: "page", label: "Exporter en PDF" },
      ];

  const run = async ({ format, scope }) => {
    setOpen(false);
    setBusy(true);
    try {
      const root = exportRef.current;
      const restaurantName = state.info.name;
      if (isMenu && scope === "all") {
        await exportPages({ nodes: Array.from(root.children), support, restaurantName, format });
      } else if (isMenu) {
        const node = root.children[exportPageIdx.current] || root.children[0];
        await exportSupport({ node, support, restaurantName, format, suffix: exportSuffix.current });
      } else {
        await exportSupport({ node: root, support, restaurantName, format, suffix: exportSuffix.current });
      }
      notify(format === "PNG" && scope === "all" ? "Images téléchargées (une par page)" : `Export ${FORMAT_LABELS[format]} téléchargé`);
    } catch (e) {
      console.error(e);
      notify("Échec de l'export — réessayez");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div ref={box} className="relative ml-auto md:ml-0">
      <button onClick={() => setOpen((v) => !v)} disabled={busy} aria-haspopup="menu" aria-expanded={open}
        className="flex items-center gap-2 rounded-lg px-3.5 py-2"
        style={{ background: SHELL.honey, color: SHELL.ink, fontSize: 13, fontWeight: 600, opacity: busy ? 0.7 : 1 }}>
        {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Download size={15} strokeWidth={2.4} aria-hidden="true" />}
        {busy ? "Export…" : "Exporter"} <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && !busy && (
        <div role="menu" className="absolute right-0 mt-2 rounded-lg overflow-hidden z-40 shadow-xl" style={{ background: "#fff", border: `1px solid ${SHELL.line}`, width: 220 }}>
          {entries.map((e) => (
            <button key={e.label} role="menuitem" onClick={() => run(e)}
              className="flex items-center gap-2 w-full px-3.5 py-2.5 text-left hover:bg-neutral-100" style={{ fontSize: 13, color: SHELL.txt }}>
              <Download size={14} aria-hidden="true" /> {e.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
