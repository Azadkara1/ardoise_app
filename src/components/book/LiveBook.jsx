import { useMemo } from "react";
import { useStore } from "../../state/store.jsx";
import { buildPages } from "../../bookPages.js";
import Book from "./Book.jsx";

/** Pages du livre dérivées de la carte (mémoïsées). */
export function useBookPages() {
  const { state } = useStore();
  const { sections, dishes, venueType } = state;
  return useMemo(() => buildPages({ sections, dishes, venueType }), [sections, dishes, venueType]);
}

/** Contexte de rendu des pages : DA, établissement, réglages. `editable` = boutons d'import visibles. */
export function useBookCtx(editable = true) {
  const { state } = useStore();
  const { kit, info, settings, venueType } = state;
  return useMemo(() => ({ kit, info, settings, venueType, editable }), [kit, info, settings, venueType, editable]);
}

/** Le livre branché sur le store : se met à jour en direct quand la carte ou la DA change. */
export default function LiveBook({ editable = true, ...rest }) {
  const pages = useBookPages();
  const ctx = useBookCtx(editable);
  return <Book pages={pages} ctx={ctx} {...rest} />;
}
