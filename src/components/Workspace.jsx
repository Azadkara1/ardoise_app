import { useEffect, useRef, useState } from "react";
import { SHELL } from "../theme.js";
import WeekPreview from "../previews/WeekPreview.jsx";
import MenuPreview from "../previews/MenuPreview.jsx";
import SpecialPreview from "../previews/SpecialPreview.jsx";
import PostPreview from "../previews/PostPreview.jsx";
import SeasonalPreview from "../previews/SeasonalPreview.jsx";
import DrinksPreview from "../previews/DrinksPreview.jsx";
import StoryPreview from "../previews/StoryPreview.jsx";
import EventPreview from "../previews/EventPreview.jsx";

export const PREVIEW_W = 420;

function renderPreview(support, props) {
  switch (support) {
    case "semaine": return <WeekPreview {...props} />;
    case "menu": return <MenuPreview {...props} />;
    case "special": return <SpecialPreview {...props} />;
    case "post": return <PostPreview {...props} />;
    case "saison": return <SeasonalPreview {...props} />;
    case "boissons": return <DrinksPreview {...props} />;
    case "story": return <StoryPreview {...props} />;
    case "soiree": return <EventPreview {...props} />;
    default: return null;
  }
}

export default function Workspace({ support, supports, kit, info, dishes, week, seasonal, drinks, about, event, featured, currency, lang, exportRef }) {
  const stageRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [outerH, setOuterH] = useState(0);

  useEffect(() => {
    const el = stageRef.current; if (!el) return;
    const update = () => {
      const w = el.clientWidth - 40;
      setScale(Math.min(1, Math.max(0.34, w / PREVIEW_W)));
    };
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
  }, [scale, support, dishes, week, seasonal, drinks, about, event, kit, info, currency, lang]);

  const meta = supports.find((s) => s.id === support);
  const previewProps = { kit, info, dishes, week, seasonal, drinks, about, event, dish: featured, currency, lang, w: PREVIEW_W };

  return (
    <main ref={stageRef} className="flex-1 md:h-full md:overflow-y-auto" style={{ background: SHELL.work }}>
      <div className="flex flex-col items-center px-5 py-8 sm:py-10">
        <div className="flex items-center gap-2 mb-6">
          <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: SHELL.mut, fontWeight: 600 }}>
            Aperçu live
          </span>
          <span style={{ width: 4, height: 4, borderRadius: 4, background: SHELL.mut }} />
          <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: SHELL.honeyDeep, fontWeight: 700 }}>
            {meta && meta.fmt}
          </span>
        </div>

        <div style={{ height: outerH || undefined, width: "100%", display: "flex", justifyContent: "center" }}>
          <div ref={innerRef} style={{ width: PREVIEW_W, transform: `scale(${scale})`, transformOrigin: "top center" }}>
            {renderPreview(support, previewProps)}
          </div>
        </div>

        <p style={{ fontSize: 11.5, color: SHELL.mut, marginTop: 22, textAlign: "center", maxWidth: 360, lineHeight: 1.5 }}>
          Modifiez la DA ou la carte à gauche — chaque support se restyle instantanément.
        </p>
      </div>

      {/*
        Copie hors-écran du même aperçu, rendue à l'échelle 1 (pas de transform).
        C'est ce nœud que l'export PNG/PDF capture, pour ne pas dépendre du
        zoom d'affichage courant et sortir une image toujours nette.
      */}
      <div aria-hidden="true" style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }}>
        <div ref={exportRef} style={{ width: PREVIEW_W }}>
          {renderPreview(support, previewProps)}
        </div>
      </div>
    </main>
  );
}
