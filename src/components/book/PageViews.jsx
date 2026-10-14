import { Camera, Loader2 } from "lucide-react";
import { ff } from "../../theme.js";
import { hexA, onColor } from "../../colorUtils.js";
import { formatPrice } from "../../currency.js";
import { t } from "../../i18n.js";
import PhotoBg from "../../previews/PhotoBg.jsx";
import { usePhotoImport } from "../PhotoImport.jsx";

/*
 * Pages du livre, à taille fixe (A5 : 420×594). Elles lisent toutes la DA (ctx.kit) :
 * changer de DA les restyle instantanément. `ctx.editable` = false pour la copie d'export
 * (pas de boutons d'import dans l'image).
 */
export const PAGE_W = 420;
export const PAGE_H = 594;

/* ---------- briques communes ---------- */

function Frame({ ctx, number, children, bg, fg }) {
  const { kit, info } = ctx;
  const background = bg || kit.background;
  const color = fg || kit.text;
  return (
    <div style={{ width: PAGE_W, height: PAGE_H, background, color, fontFamily: ff(kit.bodyFont), position: "relative", overflow: "hidden" }}>
      {children}
      {number != null && (
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 16, display: "flex", justifyContent: "space-between",
          fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: hexA(color, 0.5) }}>
          <span>{info.name}</span><span>{number}</span>
        </div>
      )}
    </div>
  );
}

/** Prix d'un plat : un prix unique, ou toutes ses variantes (Seul 11.– · Menu 15.–). */
function Price({ dish, ctx, size = 16, color, align = "right" }) {
  const { kit, settings } = ctx;
  const c = color || kit.primary;
  const variants = (dish.variants || []).filter((v) => v.label || v.price !== "");
  if (variants.length) {
    return (
      <span style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: align === "right" ? "flex-end" : "flex-start", gap: "2px 12px" }}>
        {variants.map((v) => (
          <span key={v.id} style={{ whiteSpace: "nowrap", fontFamily: ff(kit.titleFont), fontSize: size * 0.85, fontWeight: 700, color: c }}>
            {v.label && <span style={{ fontFamily: ff(kit.bodyFont), fontSize: size * 0.55, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.65, marginRight: 4 }}>{v.label}</span>}
            {formatPrice(v.price, settings.currency)}
          </span>
        ))}
      </span>
    );
  }
  return <span style={{ fontFamily: ff(kit.titleFont), fontSize: size, fontWeight: 700, color: c, whiteSpace: "nowrap" }}>{formatPrice(dish.price, settings.currency)}</span>;
}

/** Photo d'un plat, ou placeholder élégant avec bouton d'import directement dessus. */
function PhotoSlot({ dish, ctx, radius = 10, style }) {
  const { kit, editable, settings } = ctx;
  const { open, busy, input } = usePhotoImport(dish.id);
  const box = { position: "relative", overflow: "hidden", borderRadius: radius, ...style };
  if (dish.photo) {
    return (
      <div style={{ ...box, background: "#000" }}>
        <PhotoBg src={dish.photo} fit={dish.photoFit} />
      </div>
    );
  }
  return (
    <div style={{ ...box, background: `linear-gradient(135deg, ${hexA(kit.primary, 0.1)}, ${hexA(kit.accent, 0.22)})`, border: `1.5px dashed ${hexA(kit.primary, 0.3)}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: hexA(kit.primary, 0.55) }}>
      <Camera size={26} strokeWidth={1.5} aria-hidden="true" />
      {editable && (
        <>
          {input}
          <button data-noexport="1" onClick={open} disabled={busy}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, background: kit.primary, color: onColor(kit.primary), borderRadius: 999,
              padding: "6px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.02em", fontFamily: ff(kit.bodyFont) }}>
            {busy && <Loader2 size={12} className="animate-spin" aria-hidden="true" />}
            {t("addPhoto", settings.lang)}
          </button>
        </>
      )}
    </div>
  );
}

function Rule({ color, width = 56, margin = "12px 0 0" }) {
  return <div style={{ height: 3, width, background: color, borderRadius: 2, margin }} />;
}

/* ---------- Couverture ---------- */
function CoverPage({ ctx }) {
  const { kit, info, settings } = ctx;
  const fg = onColor(kit.primary);
  return (
    <Frame ctx={ctx} bg={kit.primary} fg={fg}>
      <div style={{ position: "absolute", inset: 16, border: `1.5px solid ${hexA(kit.accent, 0.7)}`, borderRadius: 4 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 48px" }}>
        {kit.logo && (
          <div style={{ width: 112, height: 112, borderRadius: 999, background: "rgba(255,255,255,0.94)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
            <img src={kit.logo} alt="" style={{ maxWidth: 82, maxHeight: 82, objectFit: "contain" }} />
          </div>
        )}
        <div style={{ fontSize: 11, letterSpacing: "0.36em", textTransform: "uppercase", color: kit.accent, fontWeight: 700, marginBottom: 14 }}>{t("menuWord", settings.lang)}</div>
        <div style={{ fontFamily: ff(kit.titleFont), fontSize: 50, lineHeight: 1.04, fontWeight: 700, overflowWrap: "anywhere" }}>{info.name || "—"}</div>
        <div style={{ height: 3, width: 64, background: kit.accent, borderRadius: 2, margin: "22px 0" }} />
        {info.tagline && <div style={{ fontSize: 15, fontStyle: "italic", opacity: 0.88, lineHeight: 1.4 }}>{info.tagline}</div>}
      </div>
    </Frame>
  );
}

/* ---------- Liste texte (restaurant : plat + description + prix ; listes compactes : boissons, suppléments) ---------- */
function ListPage({ page, ctx, number }) {
  const { kit, venueType } = ctx;
  const snack = venueType === "snack";
  return (
    <Frame ctx={ctx} number={number}>
      <div style={{ padding: "44px 34px 0" }}>
        <PageTitle page={page} ctx={ctx} />
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: snack ? 15 : 17 }}>
          {page.dishes.map((d) => (
            <div key={d.id}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: snack ? 16 : 15.5, fontWeight: 700, color: kit.text, overflowWrap: "anywhere" }}>{d.name}</span>
                {!d.variants?.length && <span style={{ flex: 1, minWidth: 12, borderBottom: `1.5px dotted ${hexA(kit.text, 0.3)}`, transform: "translateY(-3px)" }} />}
                <span style={{ marginLeft: d.variants?.length ? "auto" : 0 }}><Price dish={d} ctx={ctx} size={snack ? 21 : 17} /></span>
              </div>
              {d.description && <div style={{ fontSize: 12, fontStyle: "italic", color: hexA(kit.text, 0.68), marginTop: 2, lineHeight: 1.35, paddingRight: 60 }}>{d.description}</div>}
              {d.isFormula && d.contents && <div style={{ fontSize: 12, color: hexA(kit.text, 0.68), marginTop: 2 }}>{d.contents}</div>}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function PageTitle({ page, ctx, color }) {
  const { kit } = ctx;
  return (
    <>
      <div style={{ fontFamily: ff(kit.titleFont), fontSize: 38, lineHeight: 1.05, fontWeight: 700, color: color || kit.primary, overflowWrap: "anywhere" }}>
        {page.title}
        {page.parts > 1 && <span style={{ fontFamily: ff(kit.bodyFont), fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", marginLeft: 10, opacity: 0.55 }}>{page.part}/{page.parts}</span>}
      </div>
      <Rule color={kit.accent} />
    </>
  );
}

/* ---------- Page photos (restaurant) : grille 2×2, photo + nom + prix ---------- */
function PhotosPage({ page, ctx, number }) {
  const { kit } = ctx;
  return (
    <Frame ctx={ctx} number={number}>
      <div style={{ position: "absolute", inset: "40px 30px 40px", display: "flex", flexDirection: "column" }}>
        <PageTitle page={page} ctx={ctx} />
        <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "16px 16px" }}>
          {page.dishes.map((d) => (
            <div key={d.id} style={{ display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>
              <PhotoSlot dish={d} ctx={ctx} style={{ flex: 1, minHeight: 0 }} />
              <div style={{ paddingTop: 7 }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2, overflowWrap: "anywhere" }}>{d.name}</div>
                <div style={{ marginTop: 2 }}><Price dish={d} ctx={ctx} size={15} align="left" /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ---------- Page catégorie snack : bandeau, grosses tuiles photo, prix très lisibles, badge FORMULE ---------- */
function TilesPage({ page, ctx, number }) {
  const { kit, settings } = ctx;
  const headFg = onColor(kit.primary);
  const accentFg = onColor(kit.accent);
  return (
    <Frame ctx={ctx} number={number}>
      <div style={{ background: kit.primary, color: headFg, padding: "30px 28px 20px", position: "relative" }}>
        <div style={{ fontFamily: ff(kit.titleFont), fontSize: 46, lineHeight: 1, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", overflowWrap: "anywhere" }}>
          {page.title}
          {page.parts > 1 && <span style={{ fontFamily: ff(kit.bodyFont), fontSize: 11, letterSpacing: "0.12em", marginLeft: 10, opacity: 0.6 }}>{page.part}/{page.parts}</span>}
        </div>
        <div style={{ height: 4, width: 70, background: kit.accent, borderRadius: 2, marginTop: 12 }} />
      </div>
      <div style={{ position: "absolute", left: 22, right: 22, top: 122, bottom: 36, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 14 }}>
        {page.dishes.map((d) => {
          const hasVariants = (d.variants || []).length > 0;
          return (
            <div key={d.id} style={{ display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>
              <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
                <PhotoSlot dish={d} ctx={ctx} radius={12} style={{ position: "absolute", inset: 0 }} />
                {d.isFormula && (
                  <span style={{ position: "absolute", top: 8, left: 8, background: kit.accent, color: accentFg, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em",
                    textTransform: "uppercase", padding: "4px 9px", borderRadius: 6, fontFamily: ff(kit.titleFont) }}>
                    {t("formula", settings.lang)}
                  </span>
                )}
                {!hasVariants && (
                  <span style={{ position: "absolute", right: 8, bottom: 8, background: kit.accent, color: accentFg, fontFamily: ff(kit.titleFont), fontSize: 25, fontWeight: 800,
                    padding: "3px 12px", borderRadius: 10, lineHeight: 1.15, boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
                    {formatPrice(d.price, settings.currency)}
                  </span>
                )}
              </div>
              <div style={{ paddingTop: 7 }}>
                <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.15, overflowWrap: "anywhere" }}>{d.name}</div>
                {(d.isFormula && d.contents) ? (
                  <div style={{ fontSize: 11, color: hexA(kit.text, 0.72), lineHeight: 1.3, marginTop: 2 }}>{d.contents}</div>
                ) : d.description ? (
                  <div style={{ fontSize: 11, color: hexA(kit.text, 0.68), lineHeight: 1.3, marginTop: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{d.description}</div>
                ) : null}
                {hasVariants && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 5 }}>
                    {d.variants.map((v) => (
                      <span key={v.id} style={{ background: kit.accent, color: accentFg, borderRadius: 7, padding: "2px 8px", fontFamily: ff(kit.titleFont), fontSize: 17, fontWeight: 800, whiteSpace: "nowrap" }}>
                        {v.label && <span style={{ fontFamily: ff(kit.bodyFont), fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 5, opacity: 0.75 }}>{v.label}</span>}
                        {formatPrice(v.price, settings.currency)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/** Rendu d'une page du livre selon son type. `number` = numéro affiché en pied de page. */
export function renderPage(page, ctx, number) {
  if (!page) return null;
  switch (page.kind) {
    case "cover": return <CoverPage ctx={ctx} />;
    case "list": return <ListPage page={page} ctx={ctx} number={number} />;
    case "photos": return <PhotosPage page={page} ctx={ctx} number={number} />;
    case "tiles": return <TilesPage page={page} ctx={ctx} number={number} />;
    default: return null;
  }
}
