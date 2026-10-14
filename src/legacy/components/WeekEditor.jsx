import { Plus, Trash2, ArrowRight, History } from "lucide-react";
import { SHELL, INP } from "../theme.js";
import { uid } from "../id.js";
import { computeWeekLabel } from "../dateUtils.js";
import { hexA } from "../colorUtils.js";
import { currencyLabel } from "../currency.js";
import { SubLabel, TextField, NumField, TextArea, DateField } from "./ui.jsx";

export default function WeekEditor({ week, setWeek, currency, weekHistory = [], onNextWeek, onRestoreWeek, onDeleteHistory }) {
  const set = (patch) => setWeek((w) => ({ ...w, ...patch }));
  const updDay = (id, patch) => setWeek((w) => ({ ...w, days: w.days.map((d) => (d.id === id ? { ...d, ...patch } : d)) }));
  const addDay = () => setWeek((w) => ({ ...w, days: [...w.days, { id: uid(), day: "Samedi", dish: "", garnish: "" }] }));
  const delDay = (id) => setWeek((w) => ({ ...w, days: w.days.filter((d) => d.id !== id) }));

  // La date de début ne fait que pré-remplir l'intitulé : celui-ci reste
  // éditable à la main juste après (le champ n'est jamais verrouillé).
  const setStartDate = (v) => set({ startDate: v, label: computeWeekLabel(v, week.numDays) || week.label });
  const setNumDays = (v) => {
    const n = Math.max(1, Math.round(Number(v)) || 6);
    set({ numDays: n, label: week.startDate ? computeWeekLabel(week.startDate, n) : week.label });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 2 }}>
          <DateField label="Date de début" value={week.startDate} onChange={setStartDate} />
        </div>
        <div style={{ flex: 1 }}>
          <NumField label="Nb de jours" value={week.numDays ?? 6} min={1} onChange={setNumDays} />
        </div>
      </div>
      <button onClick={onNextWeek} className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2"
        style={{ border: `1px solid ${SHELL.honey}`, color: SHELL.honeyDeep, fontSize: 12.5, fontWeight: 700, background: hexA(SHELL.honey, 0.08) }}>
        <ArrowRight size={13} /> Semaine suivante (archive celle-ci, +7 jours)
      </button>
      <TextField label="Intitulé de la semaine" value={week.label} onChange={(v) => set({ label: v })} />
      <div style={{ display: "flex", gap: 8 }}>
        <NumField label={`Prix (${currencyLabel(currency)})`} value={week.price} onChange={(v) => set({ price: v })} />
        <NumField label="Supp. dessert" value={week.dessert} onChange={(v) => set({ dessert: v })} />
      </div>

      <SubLabel style={{ marginTop: 8 }}>Plats par jour</SubLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {week.days.map((d) => (
          <div key={d.id} style={{ border: `1px solid ${SHELL.line}`, borderRadius: 10, padding: 8, background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <input value={d.day} onChange={(e) => updDay(d.id, { day: e.target.value })}
                style={{ flex: 1, fontSize: 12, fontWeight: 700, color: SHELL.honeyDeep, border: "none", outline: "none", background: "transparent" }} />
              <button onClick={() => delDay(d.id)} title="Supprimer le jour" style={{ padding: 3, color: SHELL.mut, borderRadius: 6 }} className="hover:bg-neutral-100">
                <Trash2 size={13} />
              </button>
            </div>
            <input value={d.dish} placeholder="Plat" onChange={(e) => updDay(d.id, { dish: e.target.value })} style={INP} />
            <input value={d.garnish} placeholder="Garniture (optionnel)" onChange={(e) => updDay(d.id, { garnish: e.target.value })}
              style={{ ...INP, marginTop: 4, color: SHELL.mut }} />
          </div>
        ))}
      </div>
      <button onClick={addDay} className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2"
        style={{ border: `1px dashed ${SHELL.line}`, color: SHELL.honeyDeep, fontSize: 12.5, fontWeight: 600, background: "#fcfbf9" }}>
        <Plus size={14} /> Ajouter un jour
      </button>

      <SubLabel style={{ marginTop: 8 }}>Plat de la semaine</SubLabel>
      <div style={{ border: `1px solid ${SHELL.line}`, borderRadius: 10, padding: 8, background: "#fff" }}>
        <input value={week.special.dish} placeholder="Plat" onChange={(e) => set({ special: { ...week.special, dish: e.target.value } })} style={INP} />
        <input value={week.special.garnish} placeholder="Garniture" onChange={(e) => set({ special: { ...week.special, garnish: e.target.value } })}
          style={{ ...INP, marginTop: 4, color: SHELL.mut }} />
      </div>

      <TextArea label="Note (salade / soupe…)" value={week.note} onChange={(v) => set({ note: v })} />

      {weekHistory.length > 0 && (
        <>
          <SubLabel style={{ marginTop: 8 }}>
            <span className="inline-flex items-center gap-1"><History size={12} /> Semaines précédentes</span>
          </SubLabel>
          <div className="flex flex-wrap gap-1.5">
            {weekHistory.map((h) => (
              <span key={h.id} className="inline-flex items-center"
                style={{ border: `1px solid ${SHELL.line}`, background: "#fff", borderRadius: 999, overflow: "hidden" }}>
                <button onClick={() => onRestoreWeek(h.id)} title="Reprendre cette semaine"
                  style={{ fontSize: 12, color: SHELL.txt, padding: "5px 4px 5px 12px" }}>
                  {h.label}
                </button>
                <button onClick={() => onDeleteHistory(h.id)} title="Supprimer de l'historique"
                  style={{ padding: "5px 10px 5px 4px", color: SHELL.mut }}>
                  <Trash2 size={11} />
                </button>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
