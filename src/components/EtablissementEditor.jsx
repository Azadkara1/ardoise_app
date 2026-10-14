import { Store, Instagram, Facebook, Globe, Phone, CalendarDays } from "lucide-react";
import { useStore } from "../state/store.jsx";
import { Group, SubLabel, TextField } from "./ui.jsx";

/* Nom, accroche, réseaux et contact — lus par la couverture du livre, le plat du jour et le post. */
export default function EtablissementEditor() {
  const { state, setInfo } = useStore();
  const { info, venueType } = state;
  return (
    <Group icon={Store} title="Établissement">
      <TextField label="Nom" value={info.name} onChange={(v) => setInfo({ name: v })} />
      <TextField label="Accroche" value={info.tagline} onChange={(v) => setInfo({ tagline: v })} />
      <SubLabel style={{ marginTop: 6 }}>
        <span className="inline-flex items-center gap-1"><Instagram size={12} aria-hidden="true" /> Réseaux &amp; contact</span>
      </SubLabel>
      <TextField label="Instagram" prefix="@" icon={Instagram} value={info.handle} onChange={(v) => setInfo({ handle: v.replace(/^@/, "") })} />
      <TextField label="Facebook" icon={Facebook} value={info.facebook} onChange={(v) => setInfo({ facebook: v })} />
      <TextField label="Site web" icon={Globe} value={info.website} onChange={(v) => setInfo({ website: v })} />
      <TextField label="Téléphone" icon={Phone} value={info.phone} onChange={(v) => setInfo({ phone: v })} />
      <TextField label={venueType === "snack" ? "Lien de commande" : "Lien de réservation"} icon={CalendarDays} value={info.reserveUrl} onChange={(v) => setInfo({ reserveUrl: v })} />
    </Group>
  );
}
