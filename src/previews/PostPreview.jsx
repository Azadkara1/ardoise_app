import { Instagram, Facebook, Globe } from "lucide-react";
import { ff } from "../theme.js";
import { hexA, onColor } from "../colorUtils.js";
import { formatPrice } from "../currency.js";
import { t } from "../i18n.js";
import PhotoBg from "./PhotoBg.jsx";
import { basePrice } from "../dishUtils.js";

/* ======================= PREVIEW : POST (1080×1080) ======================= */
export default function PostPreview({ kit, info, dish, currency, lang, venueType, w }) {
  const title = ff(kit.titleFont), body = ff(kit.bodyFont);
  const ctaFg = onColor(kit.primary);
  const hasPhoto = !!dish?.photo;
  // Photo en fond : texte forcé en blanc sur voile sombre (lisible quelle que
  // soit l'image) plutôt que sur les couleurs de la DA, sans quoi le contraste
  // avec kit.text/kit.background n'est pas garanti sur une photo.
  const textFg = hasPhoto ? "#ffffff" : kit.text;

  return (
    <div style={{ width: w, height: w, fontFamily: body, position: "relative",
      background: hasPhoto ? "#000" : kit.background,
      color: textFg,
      boxShadow: "0 24px 60px -20px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.10)", overflow: "hidden",
      display: "flex", flexDirection: "column", padding: 30 }}>
      {hasPhoto && <PhotoBg src={dish.photo} fit={dish.photoFit} />}
      {hasPhoto && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.7) 100%)" }} />
      )}

      {/* handle */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
        {kit.logo ? <img src={kit.logo} alt="" style={{ width: 30, height: 30, objectFit: "contain", borderRadius: 6,
            background: hasPhoto ? "rgba(255,255,255,0.92)" : "transparent", padding: hasPhoto ? 2 : 0 }} />
          : <span style={{ width: 30, height: 30, borderRadius: 8, background: hasPhoto ? "#fff" : kit.primary }} />}
        <span style={{ fontSize: 14, fontWeight: 600, color: textFg }}>@{info.handle}</span>
        <span style={{ marginLeft: "auto", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: hexA(textFg, 0.55), fontWeight: 600 }}>
          {t("signature", lang)}
        </span>
      </div>

      {/* centre */}
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.24em", textTransform: "uppercase", color: hasPhoto ? hexA("#ffffff", 0.85) : kit.accent, fontWeight: 700, marginBottom: 12 }}>
          {t("atTheMenu", lang)}
        </div>
        <div style={{ fontFamily: title, fontSize: 40, lineHeight: 1.04, color: hasPhoto ? "#fff" : kit.primary, fontWeight: 700,
          textShadow: hasPhoto ? "0 2px 10px rgba(0,0,0,0.35)" : "none" }}>
          {dish ? dish.name : "—"}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 16 }}>
          <span style={{ fontFamily: title, fontSize: 34, fontWeight: 700, color: textFg }}>{dish ? formatPrice(basePrice(dish), currency) : ""}</span>
          <span style={{ fontSize: 12.5, color: hexA(textFg, 0.6) }}>{info.name}</span>
        </div>
      </div>

      {/* réseaux + contact */}
      <div style={{ position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "5px 14px", marginBottom: 12, fontSize: 11.5, color: hexA(textFg, 0.72) }}>
        {info.handle && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Instagram size={13} style={{ color: hasPhoto ? "#fff" : kit.primary }} /> @{info.handle}</span>}
        {info.facebook && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Facebook size={13} style={{ color: hasPhoto ? "#fff" : kit.primary }} /> {info.facebook}</span>}
        {info.website && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Globe size={13} style={{ color: hasPhoto ? "#fff" : kit.primary }} /> {info.website}</span>}
      </div>

      {/* CTA */}
      <a href={info.reserveUrl || (info.phone ? `tel:${info.phone.replace(/\s/g, "")}` : "#")}
        target="_blank" rel="noopener noreferrer"
        style={{ position: "relative", width: "100%", background: hasPhoto ? "#fff" : kit.primary, color: hasPhoto ? kit.primary : ctaFg, borderRadius: 14, padding: "15px 0",
          fontSize: 16, fontWeight: 700, fontFamily: title, letterSpacing: "0.04em", textDecoration: "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {t(venueType === "snack" ? "order" : "reserve", lang)}
      </a>
    </div>
  );
}
