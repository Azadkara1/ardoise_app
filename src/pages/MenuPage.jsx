import { useEffect, useState } from "react";
import { SHELL } from "../theme.js";
import { useUi } from "../state/ui.jsx";
import LiveBook, { useBookCtx, useBookPages } from "../components/book/LiveBook.jsx";
import { renderPage, PAGE_W } from "../components/book/PageViews.jsx";

/*
 * Menu : le livre en grand. L'export capture UNE page (A5) : la page de droite d'une double page par défaut,
 * au choix la page de gauche — une copie hors-écran à l'échelle 1 est exposée à l'export (exportRef).
 */
export default function MenuPage() {
  const { exportRef, exportSuffix, exportPageIdx } = useUi();
  const pages = useBookPages();
  const exportCtx = useBookCtx(false);
  const [anchor, setAnchor] = useState(0);
  const [view, setView] = useState({ left: null, right: 0 });
  const [side, setSide] = useState("right");

  const both = view.left != null && view.right != null;
  const idx = both ? (side === "left" ? view.left : view.right) : (view.right ?? view.left ?? 0);

  useEffect(() => { exportSuffix.current = `page-${idx + 1}`; exportPageIdx.current = idx; }, [idx, exportSuffix, exportPageIdx]);

  return (
    <div className="h-full overflow-y-auto" style={{ background: SHELL.work }}>
      <div className="mx-auto px-4 sm:px-6 py-8 sm:py-10" style={{ maxWidth: 1180 }}>
        <LiveBook index={anchor} onIndex={setAnchor} onView={setView} />

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6" style={{ fontSize: 12, color: SHELL.mut }}>
          {both ? (
            <div role="group" aria-label="Page à exporter" className="flex items-center gap-1" style={{ background: "#fff", border: `1px solid ${SHELL.line}`, borderRadius: 999, padding: 3 }}>
              <span style={{ padding: "0 8px" }}>Page affichée :</span>
              {[["left", `page ${view.left + 1}`], ["right", `page ${view.right + 1}`]].map(([id, label]) => (
                <button key={id} onClick={() => setSide(id)} aria-pressed={side === id}
                  style={{ padding: "4px 11px", borderRadius: 999, fontWeight: 600, background: side === id ? SHELL.ink : "transparent", color: side === id ? "#fff" : SHELL.txt }}>
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <span>Exporter : menu complet ou page affichée.</span>
          )}
          <span>← → pour tourner les pages</span>
        </div>
      </div>

      {/* Copie hors-écran de TOUTES les pages à l'échelle 1 (un enfant = une page) : l'export choisit
          le menu complet ou la page affichée. */}
      <div aria-hidden="true" style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }}>
        <div ref={exportRef} style={{ width: PAGE_W }}>
          {pages.map((pg, i) => <div key={pg.id} style={{ width: PAGE_W }}>{renderPage(pg, exportCtx, i + 1)}</div>)}
        </div>
      </div>
    </div>
  );
}
