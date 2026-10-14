import { Instagram, Globe, Leaf } from "lucide-react";
import { ff } from "../theme.js";
import { hexA, onColor } from "../colorUtils.js";
import { formatPrice } from "../currency.js";
import { t, translateSection, translateSeason } from "../i18n.js";
import { SECTIONS } from "../data/defaults.js";

/* ======================= PREVIEW : SAISONNIER (A5) ======================= */
export default function SeasonalPreview({ kit, info, seasonal, currency, lang, w }) {
  const H = Math.round((w * 210) / 148);
  const title = ff(kit.titleFont), body = ff(kit.bodyFont);
  const dishes = seasonal.dishes;
  return (
    <div style={{ width: w, minHeight: H, background: kit.background, color: kit.text, fontFamily: body,
      boxShadow: "0 24px 60px -20px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.10)", display: "flex", flexDirection: "column" }}>
      {/* bandeau de saison */}
      <div style={{ background: kit.primary, color: onColor(kit.primary), padding: "14px 24px", display: "flex", alignItems: "center", gap: 8 }}>
        <Leaf size={16} style={{ color: kit.accent }} />
        <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>{translateSeason(seasonal.season, lang)}</span>
        <span style={{ marginLeft: "auto", fontFamily: title, fontSize: 14, fontWeight: 600 }}>{seasonal.label}</span>
      </div>

      <div style={{ padding: "30px 34px 40px", flex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          {kit.logo && <img src={kit.logo} alt="" style={{ height: 36, objectFit: "contain", margin: "0 auto 10px", display: "block" }} />}
          <div style={{ fontFamily: title, fontSize: 28, lineHeight: 1.05, color: kit.primary, fontWeight: 700 }}>{info.name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "14px 0 20px" }}>
          <span style={{ height: 1, width: 40, background: hexA(kit.text, 0.25) }} />
          <span style={{ width: 5, height: 5, transform: "rotate(45deg)", background: kit.accent }} />
          <span style={{ height: 1, width: 40, background: hexA(kit.text, 0.25) }} />
        </div>

        {SECTIONS.map((sec) => {
          const items = dishes.filter((d) => d.section === sec.id);
          if (!items.length) return null;
          return (
            <div key={sec.id} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: title, fontSize: 15, letterSpacing: "0.16em", textTransform: "uppercase", color: kit.primary, fontWeight: 700 }}>
                  {translateSection(sec.id, lang)}
                </span>
                <span style={{ flex: 1, height: 2, background: hexA(kit.accent, 0.55) }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {items.map((d) => (
                  <div key={d.id} style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, lineHeight: 1.2 }}>
                      {d.name}
                      {d.dujour && (
                        <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                          color: onColor(kit.accent), background: kit.accent, padding: "2px 6px", borderRadius: 20, whiteSpace: "nowrap" }}>
                          {t("badgeCoupDeCoeur", lang)}
                        </span>
                      )}
                    </span>
                    <span style={{ flex: 1, borderBottom: `1.5px dotted ${hexA(kit.text, 0.35)}`, transform: "translateY(-4px)" }} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: kit.primary, whiteSpace: "nowrap" }}>{formatPrice(d.price, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "0 34px 24px", marginTop: 4 }}>
        <div style={{ height: 1, background: hexA(kit.text, 0.18), marginBottom: 12 }} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 16px", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: hexA(kit.text, 0.62) }}>
          {info.handle && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Instagram size={11} style={{ color: kit.primary }} /> @{info.handle}</span>}
          {info.website && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Globe size={11} style={{ color: kit.primary }} /> {info.website}</span>}
        </div>
      </div>
    </div>
  );
}
