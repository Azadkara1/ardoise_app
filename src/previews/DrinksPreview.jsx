import { Instagram, Globe } from "lucide-react";
import { ff } from "../theme.js";
import { hexA } from "../colorUtils.js";
import { formatPrice } from "../currency.js";
import { t } from "../i18n.js";

/* ======================= PREVIEW : BOISSONS (A5) ======================= */
export default function DrinksPreview({ kit, info, drinks, currency, lang, w }) {
  const H = Math.round((w * 210) / 148);
  const title = ff(kit.titleFont), body = ff(kit.bodyFont);
  return (
    <div style={{ width: w, minHeight: H, background: kit.background, color: kit.text, fontFamily: body,
      boxShadow: "0 24px 60px -20px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.10)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "34px 34px 40px", flex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          {kit.logo && <img src={kit.logo} alt="" style={{ height: 40, objectFit: "contain", margin: "0 auto 10px", display: "block" }} />}
          <div style={{ fontFamily: title, fontSize: 30, lineHeight: 1.05, color: kit.primary, fontWeight: 700 }}>{t("drinksTitle", lang)}</div>
          <div style={{ fontSize: 12.5, fontStyle: "italic", color: hexA(kit.text, 0.72), marginTop: 6 }}>{info.name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "14px 0 20px" }}>
          <span style={{ height: 1, width: 40, background: hexA(kit.text, 0.25) }} />
          <span style={{ width: 5, height: 5, transform: "rotate(45deg)", background: kit.accent }} />
          <span style={{ height: 1, width: 40, background: hexA(kit.text, 0.25) }} />
        </div>

        {drinks.categories.map((cat) => {
          if (!cat.items.length) return null;
          return (
            <div key={cat.id} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: title, fontSize: 15, letterSpacing: "0.16em", textTransform: "uppercase", color: kit.primary, fontWeight: 700 }}>
                  {cat.name}
                </span>
                <span style={{ flex: 1, height: 2, background: hexA(kit.accent, 0.55) }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {cat.items.map((it) => (
                  <div key={it.id} style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.2 }}>{it.name}</span>
                    <span style={{ flex: 1, borderBottom: `1.5px dotted ${hexA(kit.text, 0.35)}`, transform: "translateY(-4px)" }} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: kit.primary, whiteSpace: "nowrap" }}>{formatPrice(it.price, currency)}</span>
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
