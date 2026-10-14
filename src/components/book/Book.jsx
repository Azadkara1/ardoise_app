import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SHELL } from "../../theme.js";
import { hexA, onColor } from "../../colorUtils.js";
import { buildToc } from "../../bookPages.js";
import { PAGE_W, PAGE_H, renderPage } from "./PageViews.jsx";

/*
 * Le livre. Pages A5 (420×594), double page si la place le permet (≥ 760 px), une seule sinon.
 *
 * Modèle : `anchor` = index de la page « ancre » (page de gauche d'une double page, ou page unique).
 *   En double page, t = nombre de feuilles tournées : t=0 → seule la couverture (à droite) ;
 *   t≥1 → pages 2t-1 (gauche) et 2t (droite). Une feuille k porte la page 2k au recto et 2k+1 au verso.
 *
 * Animation : on pose les pages « du dessous » (déjà dans leur état final) et on fait pivoter la feuille
 * concernée autour de la reliure (transform-origin: left) en CSS 3D — voir @keyframes dans index.css.
 * prefers-reduced-motion : pas de rotation, simple fondu.
 */

const SPREAD_MIN_W = 760;
const FLIP_MS = 750;

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);
  return reduced;
}

/** Ombre côté reliure d'une page statique. */
const spineShade = (side) => ({
  position: "absolute", inset: 0, pointerEvents: "none",
  background: side === "left"
    ? "linear-gradient(to left, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.05) 6%, rgba(0,0,0,0) 14%)"
    : "linear-gradient(to right, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.05) 6%, rgba(0,0,0,0) 14%)",
});

const faceBase = { position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };

/**
 * Props : pages (voir bookPages.js), ctx (kit, info, settings, venueType, editable…),
 *   index/onIndex (optionnels, pour piloter la page depuis l'extérieur), onView({left,right}) (pages visibles).
 */
export default function Book({ pages, ctx, index, onIndex, onView }) {
  const n = pages.length;
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);
  const [availW, setAvailW] = useState(900);
  const [innerAnchor, setInnerAnchor] = useState(0);
  const [anim, setAnim] = useState(null); // { from, to, dir } en unités de « t »
  const [fadeKey, setFadeKey] = useState(0);
  const animDone = useRef(null);
  const animRef = useRef(null);

  const double = availW >= SPREAD_MIN_W;
  const anchorRaw = index ?? innerAnchor;
  const setAnchor = useCallback((p) => { if (onIndex) onIndex(p); else setInnerAnchor(p); }, [onIndex]);

  /* conversions ancre ↔ t, selon le mode */
  const tOf = (p) => (double ? (p + 1) >> 1 : p);
  const pOf = (t) => (double ? (t === 0 ? 0 : 2 * t - 1) : t);
  const maxT = double ? Math.floor(n / 2) : n - 1;
  const t = Math.max(0, Math.min(tOf(anchorRaw), maxT));
  const p = pOf(t);

  // normalise l'ancre (changement de mode, pages supprimées…)
  useEffect(() => { if (anchorRaw !== p) setAnchor(p); }, [anchorRaw, p, setAnchor]);

  /* largeur disponible → mode + échelle */
  useLayoutEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const update = () => setAvailW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bookW = double ? PAGE_W * 2 : PAGE_W;
  const scale = Math.min(1.2, Math.max(0.3, availW / bookW));

  /* pages visibles — pendant un tournage, on annonce déjà la destination */
  const te = anim ? anim.to : t;
  const leftIdx = double ? (te > 0 ? 2 * te - 1 : null) : null;
  const rightIdx = double ? (2 * te < n ? 2 * te : null) : pOf(te);
  useEffect(() => { onView && onView({ left: leftIdx, right: rightIdx }); }, [leftIdx, rightIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  /* navigation */
  const go = useCallback((toT) => {
    const to = Math.max(0, Math.min(toT, maxT));
    if (to === t || anim) return;
    if (reduced || Math.abs(to - t) !== 1) {
      setAnchor(pOf(to));
      setFadeKey((k) => k + 1);
      return;
    }
    const a = { from: t, to, dir: to > t ? 1 : -1 };
    animRef.current = a;
    setAnim(a);
  }, [t, maxT, anim, reduced, double]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = useCallback(() => {
    const a = animRef.current;
    if (!a) return;
    animRef.current = null;
    setAnchor(pOf(a.to));
    setAnim(null);
  }, [double, setAnchor]); // eslint-disable-line react-hooks/exhaustive-deps

  // filet de sécurité si `animationend` ne part pas (onglet en arrière-plan…)
  useEffect(() => {
    if (!anim) return;
    animDone.current = setTimeout(finish, FLIP_MS + 150);
    return () => clearTimeout(animDone.current);
  }, [anim, finish]);

  const prev = () => go(t - 1);
  const next = () => go(t + 1);

  /* clavier ← → (hors champs de saisie) */
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (e.target && e.target.tagName) || "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable)) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* swipe */
  const touch = useRef(null);
  const onTouchStart = (e) => { const c = e.touches[0]; touch.current = { x: c.clientX, y: c.clientY }; };
  const onTouchEnd = (e) => {
    const s = touch.current; touch.current = null;
    if (!s) return;
    const c = e.changedTouches[0];
    const dx = c.clientX - s.x, dy = c.clientY - s.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
  };

  /* contenu */
  const num = (i) => i + 1;
  const page = (i, extra) => (i != null && pages[i] ? renderPage(pages[i], ctx, num(i)) : extra ?? null);

  let layers;
  if (!anim) {
    layers = double ? (
      <>
        {leftIdx != null && <Slot x={0}>{page(leftIdx)}<div style={spineShade("left")} /></Slot>}
        {rightIdx != null && <Slot x={PAGE_W}>{page(rightIdx)}<div style={spineShade("right")} /></Slot>}
      </>
    ) : (
      <Slot x={0}>{page(rightIdx)}</Slot>
    );
  } else {
    const { from, dir } = anim;
    const k = dir > 0 ? from : from - 1; // feuille qui tourne (double page)
    let underL = null, underR = null, front = null, back = null;
    if (double) {
      front = 2 * k; back = 2 * k + 1;
      if (dir > 0) { underL = from > 0 ? 2 * from - 1 : null; underR = 2 * (from + 1) < n ? 2 * (from + 1) : null; }
      else { underL = k > 0 ? 2 * k - 1 : null; underR = 2 * from < n ? 2 * from : null; }
    } else {
      // page unique : la page sortante (avant) ou entrante (arrière) pivote ; pas de verso
      if (dir > 0) { front = from; underR = from + 1; } else { front = from - 1; underR = from; }
    }
    const flipClass = dir > 0 ? "book-flip-fwd" : "book-flip-back";
    const shadeDir = { animationDirection: dir > 0 ? "normal" : "reverse" };
    layers = (
      <>
        {double && underL != null && <Slot x={0}>{page(underL)}<div style={spineShade("left")} /></Slot>}
        {underR != null && (
          <Slot x={double ? PAGE_W : 0}>
            {page(underR)}
            {double && <div style={spineShade("right")} />}
            <div className="book-under-shade" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0) 70%)", ...shadeDir }} />
          </Slot>
        )}
        <div className={flipClass}
          onAnimationEnd={(e) => { if (e.target === e.currentTarget) finish(); }}
          style={{ position: "absolute", left: double ? PAGE_W : 0, top: 0, width: PAGE_W, height: PAGE_H, transformOrigin: "left center", transformStyle: "preserve-3d", zIndex: 5 }}>
          <div style={faceBase}>
            {page(front)}
            <div className="book-shade" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.05))", ...shadeDir }} />
          </div>
          {double && back != null && pages[back] && (
            <div style={{ ...faceBase, transform: "rotateY(180deg)" }}>
              {page(back)}
              <div className="book-shade" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to left, rgba(0,0,0,0.55), rgba(0,0,0,0.05))", ...shadeDir }} />
            </div>
          )}
        </div>
      </>
    );
  }

  /* indicateur « Plats · 3/7 » (double page : 2-3/7) */
  const shown = double ? [leftIdx, rightIdx].filter((i) => i != null) : [rightIdx];
  const lead = shown && shown.length ? pages[shown[shown.length - 1]] : null;
  const range = shown && shown.length ? (shown.length > 1 ? `${shown[0] + 1}–${shown[1] + 1}` : `${shown[0] + 1}`) : "";
  const toc = useMemo(() => buildToc(pages), [pages]);
  const activeGroup = lead ? lead.group : null;
  const btn = { width: 40, height: 40, borderRadius: 999, background: "#fff", border: `1px solid ${SHELL.line}`, color: SHELL.txt, display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <div className="w-full" role="group" aria-roledescription="livre" aria-label="Menu en livre — flèches gauche et droite pour tourner les pages">
      {/* sommaire cliquable */}
      <nav aria-label="Sommaire" className="flex flex-wrap justify-center gap-1.5 mb-5">
        {toc.map((e) => {
          const on = e.group === activeGroup;
          return (
            <button key={e.group} onClick={() => go(tOf(e.index))} aria-current={on ? "true" : undefined}
              style={{ fontSize: 12.5, fontWeight: on ? 700 : 500, padding: "6px 13px", borderRadius: 999,
                background: on ? ctx.kit.primary : "#fff", color: on ? onColor(ctx.kit.primary) : SHELL.txt,
                border: `1px solid ${on ? ctx.kit.primary : SHELL.line}` }}>
              {e.label}
            </button>
          );
        })}
      </nav>

      {/* scène */}
      <div ref={wrapRef} className="w-full flex justify-center" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div style={{ width: bookW * scale, height: PAGE_H * scale }}>
          <div style={{ width: bookW, height: PAGE_H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            {/* perspective sur le parent DIRECT de la feuille qui tourne ; key = fondu lors d'un saut ou en mouvement réduit */}
            <div key={fadeKey} className={fadeKey ? "book-fade" : undefined}
              style={{ position: "relative", width: bookW, height: PAGE_H, perspective: 2400 }}>
              {double && <div style={{ position: "absolute", inset: 0, background: hexA(SHELL.ink, 0.04), borderRadius: 4 }} />}
              {layers}
            </div>
          </div>
        </div>
      </div>

      {/* contrôles + indicateur */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={prev} disabled={t <= 0 || !!anim} aria-label="Page précédente" style={{ ...btn, opacity: t <= 0 ? 0.35 : 1 }}>
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <div aria-live="polite" style={{ minWidth: 140, textAlign: "center", fontSize: 13, color: SHELL.txt, fontWeight: 600 }}>
          {lead ? <>{lead.label || "Couverture"} <span style={{ color: SHELL.mut, fontWeight: 500 }}>· {range}/{n}</span></> : " "}
        </div>
        <button onClick={next} disabled={t >= maxT || !!anim} aria-label="Page suivante" style={{ ...btn, opacity: t >= maxT ? 0.35 : 1 }}>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function Slot({ x, children }) {
  return <div style={{ position: "absolute", left: x, top: 0, width: PAGE_W, height: PAGE_H, boxShadow: "0 14px 34px -8px rgba(0,0,0,0.35)" }}>{children}</div>;
}
