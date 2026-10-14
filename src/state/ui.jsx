import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PAGES } from "../pages/pages.js";

/*
 * État d'interface (hors données) : page courante, toast, et le nœud DOM à exporter.
 * Routing léger par hash (#/carte…) — pas de dépendance, le bouton « précédent » du navigateur fonctionne.
 */
const UiCtx = createContext(null);

const pageFromHash = () => {
  const id = window.location.hash.replace(/^#\/?/, "");
  return PAGES.some((p) => p.id === id) ? id : "home";
};

export function UiProvider({ children }) {
  const [page, setPage] = useState(pageFromHash);
  const [toast, setToast] = useState(null);
  // nœud DOM capturé par l'export ; renseigné par la page active (voir Workspace / MenuPage)
  const exportRef = useRef(null);
  // suffixe de nom de fichier optionnel (ex. « page-3 » pour une page du livre)
  const exportSuffix = useRef("");
  // index de la page du livre actuellement affichée (export « page affichée »)
  const exportPageIdx = useRef(0);

  useEffect(() => {
    const on = () => setPage(pageFromHash());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const go = useCallback((id) => {
    window.location.hash = id === "home" ? "#/" : `#/${id}`;
    setPage(id);
    window.scrollTo?.(0, 0);
  }, []);
  const notify = useCallback((msg) => setToast(msg), []);

  const value = useMemo(() => ({ page, go, toast, notify, exportRef, exportSuffix, exportPageIdx }), [page, go, toast, notify]);
  return <UiCtx.Provider value={value}>{children}</UiCtx.Provider>;
}

export function useUi() {
  const ctx = useContext(UiCtx);
  if (!ctx) throw new Error("useUi doit être utilisé sous <UiProvider>");
  return ctx;
}
