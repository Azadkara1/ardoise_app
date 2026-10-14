import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { uid } from "../id.js";
import { load, saveDebounced, clear as clearStorage } from "../storage.js";
import { DEFAULT_KIT, DEFAULT_SETTINGS, DEFAULT_DAILY } from "../data/defaults.js";
import { buildDemo } from "../data/demo.js";
import { venueCopy } from "../venue.js";

/*
 * Store central (Context + useReducer). Forme de l'état :
 *   venueType  "restaurant" | "snack" | null (null = premier lancement, on pose la question)
 *   info       établissement : nom, accroche, réseaux, contact
 *   kit        Brand Kit lu par TOUS les supports (couleurs, polices, logo, polices importées)
 *   presetId   preset de DA actif (null = personnalisée / extraite d'un logo)
 *   sections   [{ id, name, layout: "photos"|"list" }] — l'ordre du tableau EST l'ordre d'affichage
 *   dishes     [{ id, sectionId, name, price, variants?, description, photo, photoFit,
 *                 duJour, isFormula?, contents? }]
 *   daily      plat du jour : { text, dishId } (un champ libre + plat de la carte optionnel pour photo/prix)
 *   featuredId plat vedette du Post (null = automatique)
 *   settings   { currency, lang }
 */

function initialState() {
  const demo = buildDemo("restaurant");
  return {
    venueType: null,
    info: demo.info,
    kit: { ...DEFAULT_KIT },
    presetId: "bistrot",
    sections: demo.sections,
    dishes: demo.dishes,
    daily: { ...DEFAULT_DAILY },
    featuredId: null,
    settings: { ...DEFAULT_SETTINGS },
  };
}

/** Restaure depuis localStorage en validant la forme ; retombe sur l'état initial si invalide. */
function hydrate() {
  const base = initialState();
  const saved = load();
  if (!saved || !Array.isArray(saved.sections) || !Array.isArray(saved.dishes)) return base;
  return {
    ...base,
    venueType: saved.venueType === "restaurant" || saved.venueType === "snack" ? saved.venueType : null,
    info: { ...base.info, ...(saved.info || {}) },
    kit: { ...DEFAULT_KIT, ...(saved.kit || {}), customFonts: Array.isArray(saved.kit?.customFonts) ? saved.kit.customFonts : [] },
    presetId: saved.presetId ?? null,
    sections: saved.sections,
    dishes: saved.dishes,
    daily: { ...DEFAULT_DAILY, ...(saved.daily || {}) },
    featuredId: saved.featuredId ?? null,
    settings: { ...DEFAULT_SETTINGS, ...(saved.settings || {}) },
  };
}

const move = (arr, i, d) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

/** Applique un contenu de démo (carte, établissement, DA du preset) en conservant logo et polices importées. */
function withDemo(state, venueType) {
  const demo = buildDemo(venueType);
  return {
    ...state,
    venueType,
    info: demo.info,
    sections: demo.sections,
    dishes: demo.dishes,
    kit: { ...state.kit, ...demo.presetKit },
    presetId: demo.presetId,
    daily: { ...DEFAULT_DAILY },
    featuredId: null,
  };
}

function reducer(state, a) {
  switch (a.type) {
    /* --- type d'établissement --- */
    case "SET_VENUE":
      // loadDemo = remplace la carte par l'exemple du type ; sinon on ne change que le type
      return a.loadDemo ? withDemo(state, a.venueType) : { ...state, venueType: a.venueType };
    case "RESET_DEMO":
      return withDemo(state, state.venueType || "restaurant");

    /* --- établissement, DA, réglages --- */
    case "SET_INFO": return { ...state, info: { ...state.info, ...a.patch } };
    case "SET_KIT": return { ...state, kit: { ...state.kit, ...a.patch }, presetId: a.keepPreset ? state.presetId : null };
    case "APPLY_PRESET": return { ...state, kit: { ...state.kit, ...a.preset.kit }, presetId: a.preset.id };
    case "SET_SETTINGS": return { ...state, settings: { ...state.settings, ...a.patch } };

    /* --- sections --- */
    case "ADD_SECTION": return { ...state, sections: [...state.sections, { id: a.id, name: a.name, layout: "photos" }] };
    case "PATCH_SECTION": return { ...state, sections: state.sections.map((s) => (s.id === a.id ? { ...s, ...a.patch } : s)) };
    case "MOVE_SECTION": {
      const i = state.sections.findIndex((s) => s.id === a.id);
      return i < 0 ? state : { ...state, sections: move(state.sections, i, a.dir) };
    }
    case "DELETE_SECTION":
      return {
        ...state,
        sections: state.sections.filter((s) => s.id !== a.id),
        dishes: state.dishes.filter((d) => d.sectionId !== a.id),
      };

    /* --- plats --- */
    case "ADD_DISH":
      return { ...state, dishes: [...state.dishes, { id: a.id, sectionId: a.sectionId, name: a.name, price: 0, description: "", photo: null, photoFit: null, duJour: false }] };
    case "PATCH_DISH": return { ...state, dishes: state.dishes.map((d) => (d.id === a.id ? { ...d, ...a.patch } : d)) };
    case "DELETE_DISH":
      return {
        ...state,
        dishes: state.dishes.filter((d) => d.id !== a.id),
        featuredId: state.featuredId === a.id ? null : state.featuredId,
        daily: state.daily.dishId === a.id ? { ...state.daily, dishId: null } : state.daily,
      };

    /* --- supports --- */
    case "SET_DAILY": return { ...state, daily: { ...state.daily, ...a.patch } };
    case "SET_FEATURED": return { ...state, featuredId: a.id };
    default: return state;
  }
}

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, hydrate);
  const [storageError, setStorageError] = useState(null); // null | "quota" | "unavailable"

  // sauvegarde auto (debounce) ; un quota dépassé est signalé à l'utilisateur
  useEffect(() => {
    saveDebounced(state, (res) => setStorageError(res.ok ? null : res.quota ? "quota" : "unavailable"));
  }, [state]);

  const actions = useMemo(() => ({
    setVenue: (venueType, loadDemo) => dispatch({ type: "SET_VENUE", venueType, loadDemo }),
    resetDemo: () => dispatch({ type: "RESET_DEMO" }),
    setInfo: (patch) => dispatch({ type: "SET_INFO", patch }),
    setKit: (patch, keepPreset = false) => dispatch({ type: "SET_KIT", patch, keepPreset }),
    applyPreset: (preset) => dispatch({ type: "APPLY_PRESET", preset }),
    setSettings: (patch) => dispatch({ type: "SET_SETTINGS", patch }),
    addSection: (name) => dispatch({ type: "ADD_SECTION", id: uid(), name }),
    patchSection: (id, patch) => dispatch({ type: "PATCH_SECTION", id, patch }),
    moveSection: (id, dir) => dispatch({ type: "MOVE_SECTION", id, dir }),
    deleteSection: (id) => dispatch({ type: "DELETE_SECTION", id }),
    addDish: (sectionId, name) => dispatch({ type: "ADD_DISH", id: uid(), sectionId, name }),
    patchDish: (id, patch) => dispatch({ type: "PATCH_DISH", id, patch }),
    deleteDish: (id) => dispatch({ type: "DELETE_DISH", id }),
    setDaily: (patch) => dispatch({ type: "SET_DAILY", patch }),
    setFeatured: (id) => dispatch({ type: "SET_FEATURED", id }),
    /** Efface tout le stockage et recharge : on retombe sur la question du premier lancement. */
    wipeAll: () => { clearStorage(); window.location.reload(); },
  }), []);

  const value = useMemo(() => ({ state, storageError, ...actions }), [state, storageError, actions]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore doit être utilisé sous <StoreProvider>");
  return ctx;
}

/* ---- sélecteurs dérivés ---- */

/** Plat vedette : choix manuel, sinon 1er plat « du jour », sinon 1er plat de la carte. */
export function pickFeatured(state) {
  const { dishes, featuredId } = state;
  return (
    (featuredId && dishes.find((d) => d.id === featuredId)) ||
    dishes.find((d) => d.duJour) ||
    dishes[0] ||
    null
  );
}

export function useCopy() {
  const { state } = useStore();
  return venueCopy(state.venueType);
}
