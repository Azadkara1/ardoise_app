import { useEffect, useRef, useState } from "react";
import { SHELL } from "../theme.js";
import { useUi } from "../state/ui.jsx";

export const PREVIEW_W = 420;

/*
 * Zone d'aperçu d'un support à taille fixe (Plat du jour, Post) : l'aperçu est
 * mis à l'échelle pour tenir à l'écran, et une copie hors-écran à l'échelle 1 est
 * exposée à l'export (exportRef) pour sortir une image nette quel que soit le zoom.
 * `children` = fonction (w) => élément d'aperçu.
 */
export default function Workspace({ fmt, children, deps = [] }) {
  const { exportRef, exportSuffix } = useUi();
  const stageRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [outerH, setOuterH] = useState(0);

  useEffect(() => { exportSuffix.current = ""; }, [exportSuffix]);

  useEffect(() => {
    const el = stageRef.current; if (!el) return;
    const update = () => setScale(Math.min(1, Math.max(0.34, (el.clientWidth - 40) / PREVIEW_W)));
    update();
    const ro = new ResizeObserver(update); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = innerRef.current; if (!el) return;
    const update = () => setOuterH(el.offsetHeight * scale);
    update();
    const ro = new ResizeObserver(update); ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, ...deps]);

  return (
    <div ref={stageRef} className="flex-1 md:h-full md:overflow-y-auto" style={{ background: SHELL.work }}>
      <div className="flex flex-col items-center px-5 py-8 sm:py-10">
        <div className="flex items-center gap-2 mb-6">
          <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: SHELL.mut, fontWeight: 600 }}>Aperçu live</span>
          <span style={{ width: 4, height: 4, borderRadius: 4, background: SHELL.mut }} />
          <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: SHELL.honeyDeep, fontWeight: 700 }}>{fmt}</span>
        </div>

        <div style={{ height: outerH || undefined, width: "100%", display: "flex", justifyContent: "center" }}>
          <div ref={innerRef} style={{ width: PREVIEW_W, transform: `scale(${scale})`, transformOrigin: "top center" }}>
            {children(PREVIEW_W)}
          </div>
        </div>
      </div>

      {/* Copie hors-écran à l'échelle 1 : c'est ce nœud que capture l'export PNG/PDF. */}
      <div aria-hidden="true" style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }}>
        <div ref={exportRef} style={{ width: PREVIEW_W }}>
          {children(PREVIEW_W)}
        </div>
      </div>
    </div>
  );
}
