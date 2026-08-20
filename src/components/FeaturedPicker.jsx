import { SelectField } from "./ui.jsx";

/* Sélecteur de plat vedette pour Plat du jour / Post / Story : "" = auto (1er plat "du jour"). */
export default function FeaturedPicker({ dishes, featuredId, onChange }) {
  const options = [
    { value: "", label: "Automatique (plat du jour)" },
    ...dishes.map((d) => ({ value: d.id, label: d.name })),
  ];
  return (
    <SelectField label="Vedette" value={featuredId || ""} options={options} onChange={(v) => onChange(v || null)} />
  );
}
