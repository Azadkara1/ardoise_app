import { SHELL, INP } from "../theme.js";

/* Plat du jour : un seul champ libre (plat, accompagnement, prix… ce que le resto veut afficher). */
export default function DailyEditor({ daily, setDaily }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 11.5, color: SHELL.mut, display: "block", marginBottom: 4 }}>Plat du jour</span>
      <textarea value={daily.text} onChange={(e) => setDaily({ text: e.target.value })} rows={5}
        placeholder="Ex. : Filets de perche, sauce citron, riz — 24.-"
        style={{ ...INP, borderRadius: 8, padding: "8px 10px", resize: "vertical", fontFamily: "inherit", lineHeight: 1.4 }} />
      <span style={{ fontSize: 11, color: SHELL.mut, display: "block", marginTop: 5, lineHeight: 1.4 }}>
        Tout ce que vous écrivez ici s'affiche tel quel sur l'affiche (retours à la ligne inclus).
      </span>
    </label>
  );
}
