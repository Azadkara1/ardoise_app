import { Instagram, Globe } from "lucide-react";
import { ff } from "../theme.js";
import { hexA, onColor } from "../colorUtils.js";
import { formatPrice } from "../currency.js";
import { t } from "../i18n.js";
import { basePrice } from "../dishUtils.js";
import PhotoBg from "./PhotoBg.jsx";

/* ======================= PREVIEW : PLAT DU JOUR (A4) =======================
 * Le texte libre est l'élément principal. Si un plat de la carte est lié, on affiche
 * en plus sa photo (si elle existe) et son prix en pastille accent. */
export default function SpecialPreview({ kit, info, daily, dish, currency, lang, w }) {
  const H = Math.round((w * 297) / 210);
  const title = ff(kit.titleFont), body = ff(kit.bodyFont);
  const fg = onColor(kit.primary);
  const text = (daily?.text || "").trim();
  const photo = daily?.photo || dish?.photo || null;
  const fit = daily?.photo ? daily.photoFit : dish?.photoFit;
  const hasPhoto = !!photo;
  return (
    <div style={{ width: w, height: H, background: kit.primary, color: fg, fontFamily: body, position: "relative",
      boxShadow: "0 24px 60px -20px rgba(0,0,0,0.4), 0 4px 14px rgba(0,0,0,0.12)", overflow: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "48px 40px" }}>
      {/* liseré accent */}
      <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: kit.accent }} />
      <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: kit.accent }} />

      <div style={{ textAlign: "center" }}>
        {kit.logo && <img src={kit.logo} alt="" style={{ height: 44, objectFit: "contain", margin: "0 auto 16px", display: "block", filter: fg === "#ffffff" ? "brightness(0) invert(1)" : "none", opacity: 0.92 }} />}
        <div style={{ fontSize: 13, letterSpacing: "0.34em", textTransform: "uppercase", color: kit.accent, fontWeight: 700 }}>
          {t("todaysSpecial", lang)}
        </div>
      </div>

      <div style={{ textAlign: "center", width: "100%" }}>
        {hasPhoto && (
          <div style={{ position: "relative", overflow: "hidden", width: "100%", height: 250, borderRadius: 16, background: "#000", marginBottom: 26 }}>
            <PhotoBg src={photo} fit={fit} />
          </div>
        )}
        <div style={{ fontFamily: title, fontSize: hasPhoto ? 36 : 46, lineHeight: 1.12, fontWeight: 700, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
          {text || "—"}
        </div>
        {dish && (
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 24,
            background: kit.accent, color: onColor(kit.accent), borderRadius: 999, padding: "12px 28px",
            fontSize: 26, fontWeight: 700, fontFamily: title }}>
            {formatPrice(basePrice(dish), currency)}
          </div>
        )}
        {!dish && <div style={{ height: 1, width: 70, background: hexA(fg, 0.4), margin: "26px auto 0" }} />}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: title, fontSize: 19, fontWeight: 600 }}>{info.name}</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 14px", marginTop: 9, fontSize: 11, color: hexA(fg, 0.72), letterSpacing: "0.04em" }}>
          {info.handle && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Instagram size={12} /> @{info.handle}</span>}
          {info.website && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Globe size={12} /> {info.website}</span>}
        </div>
      </div>
    </div>
  );
}
