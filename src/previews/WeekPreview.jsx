import { Instagram, Globe } from "lucide-react";
import { ff } from "../theme.js";
import { hexA, onColor } from "../colorUtils.js";
import { formatPrice } from "../currency.js";
import { t, setMenuLine, translateDay } from "../i18n.js";

/* ======================= PREVIEW : SEMAINE (Instagram 4:5) ======================= */
export default function WeekPreview({ kit, info, week, currency, lang, w }) {
  const H = Math.round((w * 5) / 4);
  const title = ff(kit.titleFont), body = ff(kit.bodyFont);
  const cap = (str) =>
    str ? (<span><span style={{ color: kit.primary }}>{str.charAt(0)}</span>{str.slice(1)}</span>) : str;
  return (
    <div style={{ width: w, minHeight: H, background: kit.background, color: kit.text, fontFamily: body,
      boxShadow: "0 24px 60px -20px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.10)",
      display: "flex", flexDirection: "column", padding: "32px 34px 26px", textAlign: "center" }}>
      {/* en-tête */}
      {kit.logo && <img src={kit.logo} alt="" style={{ height: 38, objectFit: "contain", margin: "0 auto 12px", display: "block" }} />}
      <div style={{ fontFamily: title, fontSize: 27, letterSpacing: "0.04em", textTransform: "uppercase", color: kit.primary, fontWeight: 700, lineHeight: 1.08 }}>
        {t("dailySpecials", lang)}
      </div>
      <div style={{ fontSize: 12.5, fontStyle: "italic", color: hexA(kit.text, 0.72), marginTop: 6 }}>{week.label}</div>
      <div style={{ alignSelf: "center", marginTop: 12, background: kit.accent, color: onColor(kit.accent),
        borderRadius: 999, padding: "5px 18px", fontSize: 15, fontWeight: 700, fontFamily: title }}>
        {formatPrice(week.price, currency)}
      </div>

      {/* jours */}
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        {week.days.map((d) => (
          <div key={d.id}>
            <div style={{ fontFamily: title, fontSize: 16.5, fontWeight: 700 }}>{cap(translateDay(d.day, lang))}</div>
            {d.dish && <div style={{ fontSize: 14, marginTop: 3 }}>{d.dish}</div>}
            {d.garnish && <div style={{ fontSize: 12.5, color: hexA(kit.text, 0.75) }}>{d.garnish}</div>}
          </div>
        ))}
      </div>

      {/* plat de la semaine */}
      {(week.special.dish || week.special.garnish) && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: title, fontSize: 15.5, fontWeight: 700 }}>{cap(t("weekSpecial", lang))}</div>
          {week.special.dish && <div style={{ fontSize: 14, marginTop: 3 }}>{week.special.dish}</div>}
          {week.special.garnish && <div style={{ fontSize: 12.5, color: hexA(kit.text, 0.75) }}>{week.special.garnish}</div>}
        </div>
      )}

      {/* formule + note */}
      <div style={{ marginTop: 18, fontSize: 13.5, fontWeight: 700 }}>
        {cap(setMenuLine(formatPrice(week.dessert, currency), lang))}
      </div>
      {week.note && (
        <div style={{ alignSelf: "center", marginTop: 10, fontSize: 12, fontStyle: "italic", color: hexA(kit.text, 0.72), lineHeight: 1.5, maxWidth: 300 }}>
          {cap(week.note)}
        </div>
      )}
      <div style={{ marginTop: 14, fontFamily: title, fontSize: 16, fontWeight: 700, color: kit.primary }}>
        {cap(t("bonAppetit", lang))}
      </div>

      {/* pied réseaux */}
      <div style={{ marginTop: "auto", paddingTop: 20 }}>
        <div style={{ height: 1, background: hexA(kit.text, 0.16), marginBottom: 12 }} />
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "5px 14px",
          fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: hexA(kit.text, 0.62) }}>
          {info.handle && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Instagram size={11} style={{ color: kit.primary }} /> @{info.handle}</span>}
          {info.website && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Globe size={11} style={{ color: kit.primary }} /> {info.website}</span>}
        </div>
      </div>
    </div>
  );
}
