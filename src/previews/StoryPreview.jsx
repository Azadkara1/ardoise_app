import { ff } from "../theme.js";
import { hexA, onColor } from "../colorUtils.js";
import { formatPrice } from "../currency.js";
import { t } from "../i18n.js";

/* ======================= PREVIEW : STORY (9:16) ======================= */
export default function StoryPreview({ kit, info, dish, currency, lang, w }) {
  const H = Math.round((w * 16) / 9);
  const title = ff(kit.titleFont), body = ff(kit.bodyFont);
  const hasPhoto = !!dish?.photo;
  // Avec une photo en fond, le texte passe toujours en blanc sur un voile
  // sombre dégradé (lisible quelle que soit l'image) plutôt que sur onColor().
  const fg = hasPhoto ? "#ffffff" : onColor(kit.background);

  return (
    <div style={{ width: w, height: H, position: "relative", overflow: "hidden", fontFamily: body,
      background: hasPhoto ? `#000 url(${dish.photo}) center/cover no-repeat` : kit.background,
      color: hasPhoto ? fg : kit.text,
      boxShadow: "0 24px 60px -20px rgba(0,0,0,0.4), 0 4px 14px rgba(0,0,0,0.12)" }}>
      {hasPhoto && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.82) 100%)" }} />
      )}

      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", padding: "26px 26px 34px" }}>
        {/* handle */}
        <div className="flex items-center gap-2">
          {kit.logo ? (
            <img src={kit.logo} alt="" style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 999,
              background: hasPhoto ? "rgba(255,255,255,0.9)" : "transparent", padding: hasPhoto ? 3 : 0 }} />
          ) : (
            <span style={{ width: 28, height: 28, borderRadius: 999, background: hasPhoto ? "#fff" : kit.primary }} />
          )}
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>@{info.handle}</span>
        </div>

        {/* contenu vedette */}
        <div style={{ marginTop: "auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: hasPhoto ? hexA("#ffffff", 0.85) : kit.accent, fontWeight: 700, marginBottom: 10 }}>
            {t("atTheMenu", lang)}
          </div>
          <div style={{ fontFamily: title, fontSize: 34, lineHeight: 1.08, fontWeight: 700,
            color: hasPhoto ? "#fff" : kit.primary, textShadow: hasPhoto ? "0 2px 10px rgba(0,0,0,0.35)" : "none" }}>
            {dish ? dish.name : "—"}
          </div>
          <div style={{ display: "inline-flex", marginTop: 14, background: kit.accent, color: onColor(kit.accent),
            borderRadius: 999, padding: "8px 18px", fontSize: 18, fontWeight: 700, fontFamily: title }}>
            {dish ? formatPrice(dish.price, currency) : ""}
          </div>

          <a href={info.reserveUrl || (info.phone ? `tel:${info.phone.replace(/\s/g, "")}` : "#")}
            target="_blank" rel="noopener noreferrer"
            style={{ marginTop: 22, width: "100%", background: hasPhoto ? "#fff" : kit.primary, color: hasPhoto ? kit.primary : onColor(kit.primary),
              borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700, fontFamily: title, letterSpacing: "0.03em",
              textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {t("reserveTable", lang)}
          </a>
        </div>
      </div>
    </div>
  );
}
