import { ChevronDown } from "lucide-react";
import { SHELL, ff, INP } from "../theme.js";
import { hexA } from "../colorUtils.js";

export function Group({ icon: Icon, title, hint, children }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3.5">
        <Icon size={15} style={{ color: SHELL.honeyDeep }} strokeWidth={2.2} />
        <h3 style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.03em", color: SHELL.txt, textTransform: "uppercase" }}>{title}</h3>
        {hint && <span style={{ marginLeft: "auto", fontSize: 11, color: SHELL.mut }}>{hint}</span>}
      </div>
      {children}
    </section>
  );
}

export function SubLabel({ children, style }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: SHELL.mut, letterSpacing: "0.04em", marginBottom: 7, ...style }}>{children}</div>;
}

export function TextField({ label, value, onChange, prefix, icon: Icon }) {
  return (
    <label style={{ display: "block", marginBottom: 9 }}>
      <span style={{ fontSize: 11.5, color: SHELL.mut, display: "block", marginBottom: 4 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", background: "#faf9f6", border: `1px solid ${SHELL.line}`, borderRadius: 8, overflow: "hidden" }}>
        {Icon && <span style={{ paddingLeft: 10, display: "flex", color: SHELL.mut }}><Icon size={14} /></span>}
        {prefix && <span style={{ paddingLeft: Icon ? 5 : 10, color: SHELL.mut, fontSize: 13.5 }}>{prefix}</span>}
        <input value={value} onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, padding: "8px 10px", fontSize: 13.5, color: SHELL.txt, background: "transparent", outline: "none", border: "none", minWidth: 0 }} />
      </div>
    </label>
  );
}

export function DateField({ label, value, onChange }) {
  return (
    <label style={{ display: "block", marginBottom: 9 }}>
      <span style={{ fontSize: 11.5, color: SHELL.mut, display: "block", marginBottom: 4 }}>{label}</span>
      <input type="date" value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ ...INP, borderRadius: 8, padding: "7px 10px", fontSize: 13.5 }} />
    </label>
  );
}

export function NumField({ label, value, onChange, min }) {
  return (
    <label style={{ flex: 1, display: "block" }}>
      <span style={{ fontSize: 11.5, color: SHELL.mut, display: "block", marginBottom: 4 }}>{label}</span>
      <input value={value} inputMode="decimal" min={min} onChange={(e) => onChange(e.target.value.replace(",", "."))}
        style={{ ...INP, borderRadius: 8, padding: "8px 10px", fontSize: 13.5 }} />
    </label>
  );
}

export function TextArea({ label, value, onChange }) {
  return (
    <label style={{ display: "block", marginTop: 6 }}>
      <span style={{ fontSize: 11.5, color: SHELL.mut, display: "block", marginBottom: 4 }}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2}
        style={{ ...INP, borderRadius: 8, padding: "8px 10px", resize: "vertical", fontFamily: "inherit", lineHeight: 1.4 }} />
    </label>
  );
}

export function FontSelect({ label, value, options, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12.5, color: SHELL.txt, width: 50 }}>{label}</span>
      <div style={{ position: "relative", flex: 1 }}>
        <select value={value} onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", appearance: "none", background: "#faf9f6", border: `1px solid ${SHELL.line}`, borderRadius: 8,
            padding: "8px 30px 8px 10px", fontSize: 13, color: SHELL.txt, fontFamily: ff(value), cursor: "pointer", outline: "none" }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: SHELL.mut, pointerEvents: "none" }} />
      </div>
    </label>
  );
}

/** Sélecteur générique (devise, langue…) : { value, label } → <select> stylé comme le reste de l'éditeur. */
export function SelectField({ label, value, options, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12.5, color: SHELL.txt, width: 50 }}>{label}</span>
      <div style={{ position: "relative", flex: 1 }}>
        <select value={value} onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", appearance: "none", background: "#faf9f6", border: `1px solid ${SHELL.line}`, borderRadius: 8,
            padding: "8px 30px 8px 10px", fontSize: 13, color: SHELL.txt, cursor: "pointer", outline: "none" }}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: SHELL.mut, pointerEvents: "none" }} />
      </div>
    </label>
  );
}

/** Groupe de boutons exclusifs (saison, catégories courtes…). */
export function SegmentedField({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            style={{ fontSize: 12.5, fontWeight: on ? 700 : 500, padding: "6px 12px", borderRadius: 999,
              border: `1px solid ${on ? SHELL.honey : SHELL.line}`,
              background: on ? hexA(SHELL.honey, 0.1) : "#fff",
              color: on ? SHELL.honeyDeep : SHELL.txt }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
