import { ArrowRight, RotateCcw } from "lucide-react";
import { SHELL, ff } from "../theme.js";
import { hexA } from "../colorUtils.js";
import { PRESETS } from "../data/defaults.js";
import { venueCopy } from "../venue.js";
import { useStore } from "../state/store.jsx";
import { useUi } from "../state/ui.jsx";
import { PAGES } from "./pages.js";
import VenueChooser from "../components/VenueChooser.jsx";

/* Accueil : question du premier lancement, rappel de l'établissement, accès rapide à chaque vue. */
export default function HomePage() {
  const { state, resetDemo, wipeAll } = useStore();
  const { go } = useUi();
  const { venueType, info, kit, sections, dishes, presetId } = state;
  const copy = venueCopy(venueType);

  /* ---- premier lancement : la question avant tout ---- */
  if (!venueType) {
    return (
      <div className="mx-auto px-4 sm:px-6 py-10 sm:py-16" style={{ maxWidth: 760 }}>
        <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: SHELL.honeyDeep }}>Bienvenue sur Ardoise</p>
        <h1 style={{ fontFamily: ff("Fraunces"), fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 600, color: SHELL.txt, lineHeight: 1.1, margin: "8px 0 8px" }}>
          Vous êtes un restaurant ou un snack ?
        </h1>
        <p style={{ fontSize: 14, color: SHELL.mut, marginBottom: 24, lineHeight: 1.5 }}>
          Ce choix adapte les sections de votre carte, le rendu du menu et les textes. Vous pourrez le modifier plus tard depuis l'accueil.
        </p>
        <VenueChooser first />
      </div>
    );
  }

  const preset = PRESETS.find((p) => p.id === presetId);
  const counts = {
    carte: `${dishes.length} ${dishes.length > 1 ? copy.items : copy.item} · ${sections.length} section${sections.length > 1 ? "s" : ""}`,
    menu: copy.bookHint,
    special: "Affiche A4 du jour",
    post: "Carré 1080 pour Instagram",
    da: preset ? preset.name : "DA personnalisée",
  };
  const desc = {
    carte: copy.cardHint,
    menu: "Feuilletez le livre, exportez une page.",
    special: "Un champ, une affiche prête à imprimer.",
    post: "Le plat vedette, sa photo et son prix.",
    da: "Couleurs, polices, logo : lus par tous les supports.",
  };

  return (
    <div className="mx-auto px-4 sm:px-6 py-8 sm:py-12" style={{ maxWidth: 980 }}>
      {/* établissement + DA active + type */}
      <section className="rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-5"
        style={{ background: kit.primary, color: "#fff" }} aria-label="Votre établissement">
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7, fontWeight: 600 }}>{copy.label}</p>
          <h1 style={{ fontFamily: ff(kit.titleFont), fontSize: "clamp(26px, 4vw, 36px)", lineHeight: 1.05, margin: "4px 0" }}>{info.name || "Mon établissement"}</h1>
          {info.tagline && <p style={{ fontSize: 14, opacity: 0.85 }}>{info.tagline}</p>}
        </div>
        <div className="shrink-0">
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7, fontWeight: 600, marginBottom: 6 }}>DA active</p>
          <div className="flex items-center gap-1.5">
            {[kit.primary, kit.accent, kit.background, kit.text].map((c, i) => (
              <span key={i} style={{ width: 22, height: 22, borderRadius: 6, background: c, border: "1.5px solid rgba(255,255,255,0.6)" }} />
            ))}
          </div>
          <p style={{ fontSize: 13, marginTop: 6, fontWeight: 600 }}>{preset ? preset.name : "Personnalisée"}</p>
        </div>
      </section>

      {/* accès rapide */}
      <h2 className="sr-only">Accès rapide</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.filter((p) => p.id !== "home").map((p) => {
          const Ic = p.icon;
          return (
            <button key={p.id} onClick={() => go(p.id)}
              className="group text-left rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "#fff", border: `1px solid ${SHELL.line}`, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              <span className="flex items-center justify-center rounded-xl mb-4" style={{ width: 42, height: 42, background: hexA(SHELL.honey, 0.16), color: SHELL.honeyDeep }}>
                <Ic size={21} aria-hidden="true" />
              </span>
              <span className="flex items-center" style={{ fontFamily: ff("Fraunces"), fontSize: 20, fontWeight: 600, color: SHELL.txt }}>
                {p.label}
                <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: SHELL.honeyDeep }} aria-hidden="true" />
              </span>
              <span className="block mt-1" style={{ fontSize: 13, color: SHELL.mut, lineHeight: 1.4 }}>{desc[p.id]}</span>
              <span className="block mt-3" style={{ fontSize: 11.5, fontWeight: 600, color: SHELL.honeyDeep }}>{counts[p.id]}</span>
            </button>
          );
        })}
      </div>

      {/* type d'établissement, modifiable */}
      <section className="mt-10" aria-label="Type d'établissement">
        <h2 style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.03em", color: SHELL.txt, textTransform: "uppercase", marginBottom: 12 }}>
          Type d'établissement
        </h2>
        <VenueChooser />
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
        <button onClick={() => { if (window.confirm("Recharger la carte et la DA d'exemple ? Votre carte actuelle sera remplacée.")) resetDemo(); }}
          className="flex items-center gap-1.5" style={{ fontSize: 12.5, color: SHELL.mut }}>
          <RotateCcw size={13} aria-hidden="true" /> Réinitialiser la démo
        </button>
        <button onClick={() => { if (window.confirm("Effacer toutes les données de cet appareil et recommencer ?")) wipeAll(); }}
          style={{ fontSize: 12.5, color: SHELL.mut, textDecoration: "underline" }}>
          Tout effacer et recommencer
        </button>
      </div>
    </div>
  );
}
