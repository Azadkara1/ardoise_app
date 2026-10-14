import { useEffect } from "react";
import { Sparkles, AlertTriangle } from "lucide-react";

import { SHELL } from "./theme.js";
import { StoreProvider, useStore } from "./state/store.jsx";
import { UiProvider, useUi } from "./state/ui.jsx";
import { PAGES } from "./pages/pages.js";
import { HomeButton, TopNav, BottomTabs } from "./components/Navigation.jsx";
import ExportButton from "./components/ExportButton.jsx";
import HomePage from "./pages/HomePage.jsx";
import CartePage from "./pages/CartePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import SpecialPage from "./pages/SpecialPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import DaPage from "./pages/DaPage.jsx";
import { useCustomFonts } from "./customFonts.js";

/* ------------------------------------------------------------------ */
/*  Ardoise — le menu du resto et sa com parlent enfin la même langue  */
/*  App = coquille (barre du haut, onglets mobiles, toast) + routage.  */
/* ------------------------------------------------------------------ */

const VIEWS = {
  home: HomePage,
  carte: CartePage,
  menu: MenuPage,
  special: SpecialPage,
  post: PostPage,
  da: DaPage,
};

const STORAGE_MESSAGES = {
  quota: "Espace de stockage plein : vos dernières modifications ne sont plus sauvegardées. Supprimez quelques photos ou réduisez leur nombre pour retrouver la sauvegarde automatique.",
  unavailable: "Le stockage du navigateur est indisponible (navigation privée ?) : vos modifications ne seront pas conservées à la fermeture.",
};

function Shell() {
  const { state, storageError } = useStore();
  const { page, toast } = useUi();
  useCustomFonts(state.kit.customFonts);

  const current = PAGES.find((p) => p.id === page) || PAGES[0];
  const View = VIEWS[current.id] || HomePage;

  // titre d'onglet = vue courante
  useEffect(() => { document.title = `${current.label} — Ardoise`; }, [current.label]);

  return (
    <div className="flex flex-col min-h-full md:h-full" style={{ background: SHELL.work, color: SHELL.txt, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ===================== BARRE DU HAUT (encre) ===================== */}
      <header className="flex items-center gap-3 px-4 sm:px-5 py-3 shrink-0" style={{ background: SHELL.ink, color: "#eceae4" }}>
        <HomeButton />
        <TopNav />
        {current.exportable && <ExportButton support={current.id} />}
      </header>

      {storageError && (
        <div role="alert" className="flex items-start gap-2.5 px-4 sm:px-5 py-2.5 shrink-0" style={{ background: "#fdf0d5", color: "#6b4a07", fontSize: 12.5, lineHeight: 1.45, borderBottom: "1px solid #ecd8a6" }}>
          <AlertTriangle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>{STORAGE_MESSAGES[storageError]}</span>
        </div>
      )}

      {/* padding bas = hauteur des onglets mobiles */}
      <main className="flex-1 md:min-h-0 overflow-y-auto md:overflow-hidden pb-[68px] md:pb-0">
        {/* key : l'état local de chaque vue repart propre quand on change de page */}
        <View key={current.id} />
      </main>

      <BottomTabs />

      {toast && (
        <div className="fixed left-1/2 bottom-24 md:bottom-6 z-40" style={{ transform: "translateX(-50%)" }} role="status">
          <div className="flex items-center gap-2 rounded-full px-4 py-2.5 shadow-xl" style={{ background: SHELL.ink, color: "#fff", fontSize: 13 }}>
            <Sparkles size={14} style={{ color: SHELL.honey }} aria-hidden="true" /> {toast}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Ardoise() {
  return (
    <StoreProvider>
      <UiProvider>
        <Shell />
      </UiProvider>
    </StoreProvider>
  );
}
