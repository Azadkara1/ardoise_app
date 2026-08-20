import { Instagram, Globe } from "lucide-react";
import { ff } from "../theme.js";
import { hexA, onColor } from "../colorUtils.js";
import { formatPrice } from "../currency.js";
import { formatLongDate } from "../dateUtils.js";
import { t } from "../i18n.js";

/* ======================= PREVIEW : SOIRÉE À THÈME (A4) ======================= */
export default function EventPreview({ kit, info, event, currency, lang, w }) {
  const H = Math.round((w * 297) / 210);
  const title = ff(kit.titleFont), body = ff(kit.bodyFont);
  const hasPhoto = !!event.photo;
  const fg = hasPhoto ? "#ffffff" : onColor(kit.primary);
  const dateLabel = formatLongDate(event.date, lang);

  return (
    <div style={{ width: w, height: H, position: "relative", overflow: "hidden", fontFamily: body,
      background: hasPhoto ? `#000 url(${event.photo}) center/cover no-repeat` : kit.primary,
      color: fg,
      boxShadow: "0 24px 60px -20px rgba(0,0,0,0.4), 0 4px 14px rgba(0,0,0,0.12)" }}>
      {hasPhoto && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.78) 100%)" }} />
      )}
      {!hasPhoto && (
        <>
          <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: kit.accent }} />
          <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: kit.accent }} />
        </>
      )}

      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "48px 40px", textAlign: "center" }}>
        <div>
          {kit.logo && <img src={kit.logo} alt="" style={{ height: 40, objectFit: "contain", margin: "0 auto 14px", display: "block",
            filter: hasPhoto || fg === "#ffffff" ? "brightness(0) invert(1)" : "none", opacity: 0.92 }} />}
          {dateLabel && (
            <div style={{ fontSize: 12.5, letterSpacing: "0.24em", textTransform: "uppercase", color: hasPhoto ? hexA("#ffffff", 0.85) : kit.accent, fontWeight: 700 }}>
              {dateLabel}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontFamily: title, fontSize: 46, lineHeight: 1.06, fontWeight: 700, textShadow: hasPhoto ? "0 2px 12px rgba(0,0,0,0.4)" : "none" }}>
            {event.title}
          </div>
          {event.desc && (
            <div style={{ marginTop: 18, fontSize: 13.5, lineHeight: 1.6, color: hexA(fg, 0.88), maxWidth: 340, marginLeft: "auto", marginRight: "auto" }}>
              {event.desc}
            </div>
          )}
          <div style={{ display: "inline-flex", marginTop: 22, background: kit.accent, color: onColor(kit.accent),
            borderRadius: 999, padding: "11px 26px", fontSize: 22, fontWeight: 700, fontFamily: title }}>
            {formatPrice(event.price, currency)}
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <a href={info.reserveUrl || (info.phone ? `tel:${info.phone.replace(/\s/g, "")}` : "#")}
            target="_blank" rel="noopener noreferrer"
            style={{ width: "100%", background: hasPhoto ? "#fff" : kit.accent, color: hasPhoto ? kit.primary : onColor(kit.accent), borderRadius: 14, padding: "14px 0",
              fontSize: 15, fontWeight: 700, fontFamily: title, letterSpacing: "0.03em", textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            {t("reserveTable", lang)}
          </a>
          <div style={{ fontFamily: title, fontSize: 17, fontWeight: 600 }}>{info.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 14px", marginTop: 8, fontSize: 11, color: hexA(fg, 0.72), letterSpacing: "0.04em" }}>
            {info.handle && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Instagram size={12} /> @{info.handle}</span>}
            {info.website && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Globe size={12} /> {info.website}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
