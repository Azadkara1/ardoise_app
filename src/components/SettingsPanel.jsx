import { Settings } from "lucide-react";
import { SHELL } from "../theme.js";
import { CURRENCY_CODES, CURRENCIES } from "../currency.js";
import { useStore } from "../state/store.jsx";
import { Group, SelectField } from "./ui.jsx";

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "it", label: "Italiano" },
];

/* Devise + langue : réglages transverses lus par tous les supports exportés. */
export default function SettingsPanel() {
  const { state, setSettings } = useStore();
  const { settings } = state;
  const currencyOptions = CURRENCY_CODES.map((code) => ({ value: code, label: `${code} (${CURRENCIES[code].symbol})` }));

  return (
    <Group icon={Settings} title="Réglages">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SelectField label="Devise" value={settings.currency} options={currencyOptions} onChange={(v) => setSettings({ currency: v })} />
        <SelectField label="Langue" value={settings.lang} options={LANGUAGES} onChange={(v) => setSettings({ lang: v })} />
      </div>
      <p style={{ fontSize: 11, color: SHELL.mut, lineHeight: 1.4, marginTop: 8 }}>
        La langue traduit les libellés fixes des supports (« Réserver », « Le plat du jour »…), jamais le contenu que vous saisissez.
      </p>
    </Group>
  );
}
