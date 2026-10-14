import { UtensilsCrossed } from "lucide-react";
import { SHELL, ff } from "../theme.js";
import { PAGES } from "../pages/pages.js";
import { useUi } from "../state/ui.jsx";

/* Logo fourchette/couteau + nom : bouton d'ACCUEIL (hover + focus clavier visibles). */
export function HomeButton() {
  const { page, go } = useUi();
  return (
    <button onClick={() => go("home")} aria-label="Accueil" aria-current={page === "home" ? "page" : undefined}
      className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 -ml-1.5 mr-1 transition-colors hover:bg-white/10 focus-visible:bg-white/10">
      <span className="flex items-center justify-center rounded-md" style={{ width: 30, height: 30, background: SHELL.honey, color: SHELL.ink }}>
        <UtensilsCrossed size={17} strokeWidth={2.4} aria-hidden="true" />
      </span>
      <span className="leading-none text-left">
        <span className="block" style={{ fontFamily: ff("Fraunces"), fontSize: 19, fontWeight: 600, letterSpacing: "0.01em" }}>Ardoise</span>
        <span className="hidden sm:block" style={{ fontSize: 10.5, color: "#a8a49b", letterSpacing: "0.09em", textTransform: "uppercase", marginTop: 2 }}>
          menu &amp; com, une seule DA
        </span>
      </span>
    </button>
  );
}

/* Barre de navigation du haut (desktop) : toutes les vues sauf Accueil (le logo y mène). */
export function TopNav() {
  const { page, go } = useUi();
  return (
    <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-1 mx-auto rounded-lg p-1" style={{ background: SHELL.ink2 }}>
      {PAGES.filter((p) => p.id !== "home").map((p) => {
        const Ic = p.icon, on = page === p.id;
        return (
          <button key={p.id} onClick={() => go(p.id)} aria-current={on ? "page" : undefined}
            className="shrink-0 flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors whitespace-nowrap"
            style={{ background: on ? SHELL.honey : "transparent", color: on ? SHELL.ink : "#d6d2c9", fontSize: 13, fontWeight: on ? 600 : 500 }}>
            <Ic size={15} strokeWidth={2.2} aria-hidden="true" /> {p.label}
          </button>
        );
      })}
    </nav>
  );
}

/* Barre d'onglets du bas (mobile) : les 6 vues, accueil compris. */
export function BottomTabs() {
  const { page, go } = useUi();
  return (
    <nav aria-label="Navigation principale" className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex"
      style={{ background: SHELL.ink, borderTop: `1px solid ${SHELL.ink2}`, paddingBottom: "env(safe-area-inset-bottom)" }}>
      {PAGES.map((p) => {
        const Ic = p.icon, on = page === p.id;
        return (
          <button key={p.id} onClick={() => go(p.id)} aria-current={on ? "page" : undefined}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-w-0"
            style={{ color: on ? SHELL.honey : "#b9b5ab", fontSize: 10, fontWeight: on ? 700 : 500 }}>
            <Ic size={19} strokeWidth={on ? 2.5 : 2} aria-hidden="true" />
            <span className="truncate max-w-full px-0.5">{p.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
