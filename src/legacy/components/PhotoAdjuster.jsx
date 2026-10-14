import { useRef, useState } from "react";
import { ZoomIn, RotateCcw } from "lucide-react";
import { SHELL } from "../theme.js";
import PhotoBg from "../previews/PhotoBg.jsx";

const RATIOS = [
  { id: "square", label: "Post (carré)", r: 1 },
  { id: "story", label: "Story (9:16)", r: 9 / 16 },
];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* Cadrage d'une photo : glisser pour déplacer, curseur pour zoomer. */
export default function PhotoAdjuster({ src, fit, onChange }) {
  const [ratioId, setRatioId] = useState("square");
  const box = useRef(null);
  const drag = useRef(null);
  const cur = { x: fit?.x ?? 50, y: fit?.y ?? 50, zoom: fit?.zoom ?? 1 };
  const ratio = RATIOS.find((r) => r.id === ratioId).r;
  const boxW = ratioId === "square" ? 200 : 130;

  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, ...cur };
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d || !box.current) return;
    const rect = box.current.getBoundingClientRect();
    // on tire la photo : déplacer vers la droite fait reculer le point central
    onChange({
      ...cur,
      x: clamp(d.x - ((e.clientX - d.px) / rect.width) * 100 / d.zoom, 0, 100),
      y: clamp(d.y - ((e.clientY - d.py) / rect.height) * 100 / d.zoom, 0, 100),
    });
  };
  const onUp = () => { drag.current = null; };

  return (
    <div>
      <div className="flex items-center gap-1 mb-2" style={{ background: "#f4f2ee", borderRadius: 7, padding: 2, width: "fit-content" }}>
        {RATIOS.map((r) => {
          const on = r.id === ratioId;
          return (
            <button key={r.id} onClick={() => setRatioId(r.id)}
              style={{ fontSize: 11, fontWeight: on ? 700 : 500, padding: "3px 8px", borderRadius: 5,
                background: on ? "#fff" : "transparent", color: on ? SHELL.txt : SHELL.mut,
                boxShadow: on ? "0 1px 2px rgba(0,0,0,0.08)" : "none" }}>
              {r.label}
            </button>
          );
        })}
      </div>

      <div ref={box} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        style={{ position: "relative", overflow: "hidden", width: boxW, aspectRatio: String(ratio), borderRadius: 8,
          background: "#000", cursor: "grab", touchAction: "none", border: `1px solid ${SHELL.line}` }}>
        <PhotoBg src={src} fit={cur} />
      </div>

      <div className="flex items-center gap-2 mt-2.5">
        <ZoomIn size={14} style={{ color: SHELL.mut }} />
        <input type="range" min={1} max={3} step={0.05} value={cur.zoom}
          onChange={(e) => onChange({ ...cur, zoom: Number(e.target.value) })}
          style={{ flex: 1, accentColor: SHELL.honeyDeep }} />
        <button onClick={() => onChange({ x: 50, y: 50, zoom: 1 })} title="Réinitialiser le cadrage"
          style={{ padding: 4, color: SHELL.mut, borderRadius: 6 }} className="hover:bg-neutral-100">
          <RotateCcw size={13} />
        </button>
      </div>
      <p style={{ fontSize: 11, color: SHELL.mut, marginTop: 6, lineHeight: 1.4 }}>
        Glissez la photo pour la déplacer, le curseur pour zoomer.
      </p>
    </div>
  );
}
