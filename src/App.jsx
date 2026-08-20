import { useEffect, useState, useRef } from "react";
import {
  Palette, Image as ImageIcon, Upload, Loader2, Plus, Sparkles,
  Type, Store, UtensilsCrossed, LayoutGrid, Presentation, Square, Leaf, Wine, Info, Smartphone, PartyPopper,
  Download, ChevronDown, RotateCcw,
  Instagram, Facebook, Globe, Phone, CalendarDays,
} from "lucide-react";

import { SHELL, ff, GOOGLE_HREF, TITLE_FONTS, BODY_FONTS } from "./theme.js";
import { hexA, extractPalette } from "./colorUtils.js";
import { uid } from "./id.js";
import { computeWeekLabel, addDaysISO } from "./dateUtils.js";
import { t } from "./i18n.js";
import { PRESETS, SECTIONS, SAMPLE_DISHES, WEEK_DEFAULT, DEFAULT_KIT, DEFAULT_INFO, DEFAULT_SETTINGS, DEFAULT_SEASONAL, DEFAULT_DRINKS, DEFAULT_ABOUT, DEFAULT_EVENT, DEFAULT_PROFILE, DEFAULT_PROFILE_ID } from "./data/defaults.js";
import { load, saveDebounced, clear as clearStorage } from "./storage.js";
import { exportSupport } from "./export.js";

import { Group, SubLabel, TextField, TextArea, FontSelect } from "./components/ui.jsx";
import WeekEditor from "./components/WeekEditor.jsx";
import DishRow from "./components/DishRow.jsx";
import ProfilesPanel from "./components/ProfilesPanel.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import SeasonalEditor from "./components/SeasonalEditor.jsx";
import DrinksEditor from "./components/DrinksEditor.jsx";
import FeaturedPicker from "./components/FeaturedPicker.jsx";
import EventEditor from "./components/EventEditor.jsx";
import Workspace from "./components/Workspace.jsx";

/* ------------------------------------------------------------------ */
/*  Ardoise — le menu du resto et sa com parlent enfin la même langue  */
/* ------------------------------------------------------------------ */

/* ============================ APP ============================ */
export default function Ardoise() {
  // Restauration unique depuis localStorage au montage (voir src/storage.js).
  // Chaque morceau d'état retombe sur ses défauts si absent ou corrompu.
  const [restored] = useState(load);

  const [kit, setKit] = useState(() => ({ ...DEFAULT_KIT, ...(restored?.kit || {}) }));
  const [info, setInfo] = useState(() => ({ ...DEFAULT_INFO, ...(restored?.info || {}) }));
  const [dishes, setDishes] = useState(() => (Array.isArray(restored?.dishes) ? restored.dishes : SAMPLE_DISHES));
  const [week, setWeek] = useState(() => ({ ...WEEK_DEFAULT, ...(restored?.week || {}) }));
  const [support, setSupport] = useState(() => restored?.support || "semaine");
  const [profiles, setProfiles] = useState(() => (Array.isArray(restored?.profiles) && restored.profiles.length ? restored.profiles : [DEFAULT_PROFILE]));
  const [activeProfileId, setActiveProfileId] = useState(() => restored?.activeProfileId ?? DEFAULT_PROFILE_ID);
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...(restored?.settings || {}) }));
  const [seasonal, setSeasonal] = useState(() => ({ ...DEFAULT_SEASONAL, ...(restored?.seasonal || {}) }));
  const [drinks, setDrinks] = useState(() => ({ ...DEFAULT_DRINKS, ...(restored?.drinks || {}) }));
  const [about, setAbout] = useState(() => ({ ...DEFAULT_ABOUT, ...(restored?.about || {}) }));
  const [featuredId, setFeaturedId] = useState(() => restored?.featuredId ?? null);
  const [weekHistory, setWeekHistory] = useState(() => (Array.isArray(restored?.weekHistory) ? restored.weekHistory : []));
  const [event, setEvent] = useState(() => ({ ...DEFAULT_EVENT, ...(restored?.event || {}) }));

  const [analyzing, setAnalyzing] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [toast, setToast] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fileRef = useRef(null);
  const exportRef = useRef(null);

  /* desktop vs mobile pour la largeur du panneau */
  const [isDesk, setIsDesk] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setIsDesk(mq.matches);
    on();
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);

  /* charge les polices Google */
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = GOOGLE_HREF;
    // `crossOrigin` force un fetch CORS : sans lui, le navigateur bloque la
    // lecture de `styleSheet.cssRules` (SecurityError) et html-to-image ne
    // peut pas embarquer les polices Google dans l'export PNG/PDF.
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  /* toast auto-dismiss */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  /* sauvegarde automatique (debounce) de tout l'état utile */
  useEffect(() => {
    saveDebounced({ kit, info, dishes, week, support, profiles, activeProfileId, settings, seasonal, drinks, about, featuredId, weekHistory, event });
  }, [kit, info, dishes, week, support, profiles, activeProfileId, settings, seasonal, drinks, about, featuredId, weekHistory, event]);

  const applyPreset = (p) => {
    setActivePreset(p.id);
    setKit((k) => ({ ...p.kit, logo: k.logo }));
  };

  const onFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      setKit((k) => ({ ...k, logo: dataURL }));
      setAnalyzing(true);
      const img = new Image();
      img.onload = () => {
        setTimeout(() => {
          const pal = extractPalette(img);
          if (pal) { setKit((k) => ({ ...k, ...pal })); setActivePreset(null); }
          setAnalyzing(false);
        }, 620);
      };
      img.onerror = () => setAnalyzing(false);
      img.src = dataURL;
    };
    reader.readAsDataURL(file);
  };

  const setColor = (key, val) => { setKit((k) => ({ ...k, [key]: val })); setActivePreset(null); };
  const setFont = (key, val) => { setKit((k) => ({ ...k, [key]: val })); setActivePreset(null); };

  /* ---- Historique des semaines ---- */
  // Archive la semaine courante puis avance de 7 jours en gardant les plats
  // (on ne modifie que ce qui change d'une semaine à l'autre).
  const nextWeek = () => {
    setWeekHistory((h) => [...h, { ...week, id: uid() }]);
    setWeek((w) => {
      const startDate = w.startDate ? addDaysISO(w.startDate, 7) : "";
      const label = startDate ? (computeWeekLabel(startDate, w.numDays) || w.label) : w.label;
      return { ...w, startDate, label };
    });
  };

  const restoreWeek = (histId) => {
    const entry = weekHistory.find((h) => h.id === histId);
    if (!entry) return;
    setWeekHistory((h) => [...h.filter((x) => x.id !== histId), { ...week, id: uid() }]);
    setWeek(entry);
  };

  const deleteWeekHistory = (histId) => setWeekHistory((h) => h.filter((x) => x.id !== histId));

  const updDish = (id, patch) => setDishes((d) => d.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const delDish = (id) => setDishes((d) => d.filter((x) => x.id !== id));
  const addDish = () =>
    setDishes((d) => [...d, { id: uid(), name: "Nouveau plat", price: 0, section: "plats", dujour: false }]);

  /* ---- Profils resto (DA sauvegardées, cliquables) ---- */
  const saveProfile = (name) => {
    const data = { kit, info: { ...info, name }, dishes, week, settings, seasonal, drinks, about, featuredId, weekHistory, event };
    setProfiles((prev) => {
      const existing = prev.find((p) => p.name === name);
      const id = existing ? existing.id : uid();
      const entry = { id, name, data };
      const next = existing ? prev.map((p) => (p.id === id ? entry : p)) : [...prev, entry];
      setActiveProfileId(id);
      return next;
    });
    setInfo((i) => ({ ...i, name }));
    setToast(`Restaurant « ${name} » enregistré`);
  };

  const selectProfile = (p) => {
    const data = structuredClone(p.data);
    setKit({ ...DEFAULT_KIT, ...data.kit });
    setInfo({ ...DEFAULT_INFO, ...data.info });
    setDishes(Array.isArray(data.dishes) ? data.dishes : SAMPLE_DISHES);
    setWeek({ ...WEEK_DEFAULT, ...data.week });
    setSettings({ ...DEFAULT_SETTINGS, ...(data.settings || {}) });
    setSeasonal({ ...DEFAULT_SEASONAL, ...(data.seasonal || {}) });
    setDrinks({ ...DEFAULT_DRINKS, ...(data.drinks || {}) });
    setAbout({ ...DEFAULT_ABOUT, ...(data.about || {}) });
    setFeaturedId(data.featuredId ?? null);
    setWeekHistory(Array.isArray(data.weekHistory) ? data.weekHistory : []);
    setEvent({ ...DEFAULT_EVENT, ...(data.event || {}) });
    setActiveProfileId(p.id);
    setActivePreset(null);
    setToast(`« ${p.name} » chargé`);
  };

  const deleteProfile = (id) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfileId === id) setActiveProfileId(null);
  };

  const handleReset = () => {
    const ok = window.confirm(
      "Réinitialiser Ardoise ? La DA, la carte, les menus et les restaurants enregistrés seront effacés de cet appareil."
    );
    if (!ok) return;
    clearStorage();
    window.location.reload();
  };

  // "PNG" reste le format technique interne (export.js, extension de fichier) ;
  // seul le libellé affiché change ("Image", plus parlant pour un commerçant).
  const FORMAT_LABELS = { PDF: "PDF", PNG: "Image" };

  const doExport = async (fmt) => {
    setExportOpen(false);
    setExporting(true);
    try {
      await exportSupport({ node: exportRef.current, support, restaurantName: info.name, format: fmt });
      setToast(`Export ${FORMAT_LABELS[fmt] || fmt} téléchargé`);
    } catch (e) {
      console.error(e);
      setToast("Échec de l'export — réessaie");
    } finally {
      setExporting(false);
    }
  };

  const autoFeatured =
    dishes.find((d) => d.dujour && d.section === "plats") ||
    dishes.find((d) => d.dujour) ||
    dishes.find((d) => d.section === "plats") ||
    dishes[0];
  const featured = (featuredId && dishes.find((d) => d.id === featuredId)) || autoFeatured;
  const showFeaturedPicker = support === "special" || support === "post" || support === "story";

  const lang = settings.lang;
  const supports = [
    { id: "semaine", label: t("supportSemaine", lang), icon: CalendarDays, fmt: "Insta portrait 4:5" },
    { id: "menu", label: t("supportMenu", lang), icon: LayoutGrid, fmt: "Carte A5" },
    { id: "special", label: t("supportSpecial", lang), icon: Presentation, fmt: "Affiche A4" },
    { id: "post", label: t("supportPost", lang), icon: Square, fmt: "Carré 1080" },
    { id: "saison", label: t("supportSaison", lang), icon: Leaf, fmt: "Carte A5" },
    { id: "boissons", label: t("supportBoissons", lang), icon: Wine, fmt: "Carte A5" },
    { id: "story", label: t("supportStory", lang), icon: Smartphone, fmt: "Story 9:16" },
    { id: "soiree", label: t("supportSoiree", lang), icon: PartyPopper, fmt: "Affiche A4" },
  ];

  return (
    <div className="flex flex-col md:h-screen" style={{ background: SHELL.work, color: SHELL.txt, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ===================== TOP BAR (encre) ===================== */}
      <header
        className="flex items-center gap-3 px-4 sm:px-5 py-3 shrink-0"
        style={{ background: SHELL.ink, color: "#eceae4" }}
      >
        <div className="flex items-center gap-2.5 mr-1">
          <div className="flex items-center justify-center rounded-md" style={{ width: 30, height: 30, background: SHELL.honey, color: SHELL.ink }}>
            <UtensilsCrossed size={17} strokeWidth={2.4} />
          </div>
          <div className="leading-none">
            <div style={{ fontFamily: ff("Fraunces"), fontSize: 19, fontWeight: 600, letterSpacing: "0.01em" }}>Ardoise</div>
            <div style={{ fontSize: 10.5, color: "#9c988f", letterSpacing: "0.09em", textTransform: "uppercase", marginTop: 2 }}>
              menu &amp; com, une seule DA
            </div>
          </div>
        </div>

        {/* Switch supports */}
        <nav className="hidden sm:flex items-center gap-1 mx-auto rounded-lg p-1 overflow-x-auto max-w-full" style={{ background: SHELL.ink2 }}>
          {supports.map((s) => {
            const Ic = s.icon; const on = support === s.id;
            return (
              <button key={s.id} onClick={() => setSupport(s.id)}
                className="shrink-0 flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors whitespace-nowrap"
                style={{ background: on ? SHELL.honey : "transparent", color: on ? SHELL.ink : "#cfcbc2", fontSize: 13, fontWeight: on ? 600 : 500 }}>
                <Ic size={15} strokeWidth={2.2} /> {s.label}
              </button>
            );
          })}
        </nav>

        {/* Export */}
        <div className="relative ml-auto sm:ml-0">
          <button onClick={() => setExportOpen((v) => !v)} disabled={exporting}
            className="flex items-center gap-2 rounded-lg px-3.5 py-2"
            style={{ background: SHELL.honey, color: SHELL.ink, fontSize: 13, fontWeight: 600, opacity: exporting ? 0.7 : 1 }}>
            {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} strokeWidth={2.4} />}
            {exporting ? "Export…" : "Exporter"} <ChevronDown size={14} />
          </button>
          {exportOpen && !exporting && (
            <div className="absolute right-0 mt-2 rounded-lg overflow-hidden z-20 shadow-xl" style={{ background: "#fff", border: `1px solid ${SHELL.line}`, width: 168 }}>
              {["PDF", "PNG"].map((f) => (
                <button key={f} onClick={() => doExport(f)} className="flex items-center gap-2 w-full px-3.5 py-2.5 text-left hover:bg-neutral-100"
                  style={{ fontSize: 13, color: SHELL.txt }}>
                  <Download size={14} /> Exporter en {FORMAT_LABELS[f]}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* switch supports mobile — 8 supports ne tiennent plus sur une largeur d'écran fixe :
          défilement horizontal plutôt que de les écraser (ou les faire déborder) sur une ligne */}
      <nav className="flex sm:hidden items-center gap-1.5 p-2 overflow-x-auto shrink-0" style={{ background: SHELL.ink2 }}>
        {supports.map((s) => {
          const Ic = s.icon; const on = support === s.id;
          return (
            <button key={s.id} onClick={() => setSupport(s.id)}
              className="shrink-0 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 whitespace-nowrap"
              style={{ background: on ? SHELL.honey : "transparent", color: on ? SHELL.ink : "#cfcbc2", fontSize: 12, fontWeight: 600 }}>
              <Ic size={14} /> {s.label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1 flex flex-col md:flex-row md:min-h-0">
        {/* ===================== PANNEAU D'ÉDITION ===================== */}
        <aside className="w-full md:h-full md:overflow-y-auto shrink-0"
          style={{ width: isDesk ? 392 : "100%", maxWidth: "100%", background: SHELL.panel, borderRight: `1px solid ${SHELL.line}`, flexShrink: 0 }}>
          <div className="p-5" style={{ display: "flex", flexDirection: "column", gap: 26 }}>

            {/* --- Restaurants sauvegardés --- */}
            <ProfilesPanel
              profiles={profiles}
              activeProfileId={activeProfileId}
              currentName={info.name}
              onSelect={selectProfile}
              onSave={saveProfile}
              onDelete={deleteProfile}
            />

            {/* --- Réglages transverses (devise, langue…) --- */}
            <SettingsPanel settings={settings} setSettings={setSettings} />

            {/* --- DA --- */}
            <Group icon={Palette} title="Direction artistique" hint="Tous les supports lisent cette DA">
              {/* Import logo */}
              <SubLabel>Logo</SubLabel>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => onFile(e.target.files && e.target.files[0])} />
              <button onClick={() => fileRef.current && fileRef.current.click()}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-3 transition-colors"
                style={{ border: `1.5px dashed ${analyzing ? SHELL.honey : SHELL.line}`, background: analyzing ? hexA(SHELL.honey, 0.06) : "#fcfbf9" }}>
                <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 46, height: 46, background: "#f1efe9", overflow: "hidden" }}>
                  {analyzing ? <Loader2 size={20} className="animate-spin" style={{ color: SHELL.honeyDeep }} />
                    : kit.logo ? <img src={kit.logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    : <ImageIcon size={20} style={{ color: SHELL.mut }} />}
                </div>
                <div className="text-left min-w-0">
                  <div style={{ fontSize: 13, fontWeight: 600, color: SHELL.txt }}>
                    {analyzing ? "Analyse du logo…" : kit.logo ? "Remplacer le logo" : "Importer un logo"}
                  </div>
                  <div style={{ fontSize: 11.5, color: SHELL.mut, marginTop: 1 }}>
                    {analyzing ? "Extraction de la palette dominante" : "PNG ou JPG — palette auto-détectée"}
                  </div>
                </div>
                {!analyzing && <Upload size={16} style={{ color: SHELL.mut, marginLeft: "auto" }} />}
              </button>

              {kit.logo && !analyzing && (
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span style={{ fontSize: 11, color: SHELL.mut, marginRight: 4 }}>Extrait :</span>
                  {["primary", "accent", "background", "text"].map((k) => (
                    <span key={k} title={kit[k]} style={{ width: 20, height: 20, borderRadius: 6, background: kit[k], border: `1px solid ${hexA("#000", 0.12)}` }} />
                  ))}
                </div>
              )}

              {/* Modèles */}
              <SubLabel style={{ marginTop: 18 }}>Modèles par cuisine</SubLabel>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => {
                  const on = activePreset === p.id;
                  return (
                    <button key={p.id} onClick={() => applyPreset(p)}
                      className="rounded-xl px-2.5 py-2.5 text-left transition-all"
                      style={{ border: on ? `1.5px solid ${SHELL.honey}` : `1px solid ${SHELL.line}`, background: on ? hexA(SHELL.honey, 0.06) : "#fff" }}>
                      <div className="flex gap-1 mb-2">
                        {[p.kit.primary, p.kit.accent, p.kit.background].map((c, i) => (
                          <span key={i} style={{ width: 18, height: 18, borderRadius: 5, background: c, border: `1px solid ${hexA("#000", 0.1)}` }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: SHELL.txt, lineHeight: 1.15 }}>{p.name}</div>
                      <div style={{ fontSize: 10.5, color: SHELL.mut, marginTop: 2, fontFamily: ff(p.kit.titleFont) }}>{p.kit.titleFont}</div>
                    </button>
                  );
                })}
              </div>

              {/* Couleurs */}
              <SubLabel style={{ marginTop: 18 }}>Couleurs</SubLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["primary", "Primaire"], ["accent", "Accent"],
                  ["background", "Fond"], ["text", "Texte"],
                ].map(([k, lbl]) => (
                  <div key={k} className="flex items-center gap-2.5">
                    <label className="relative shrink-0" style={{ width: 34, height: 34 }}>
                      <span style={{ position: "absolute", inset: 0, borderRadius: 9, background: kit[k], border: `1px solid ${hexA("#000", 0.12)}` }} />
                      <input type="color" value={kit[k]} onChange={(e) => setColor(k, e.target.value)}
                        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                    </label>
                    <span style={{ fontSize: 12.5, color: SHELL.txt, flex: 1 }}>{lbl}</span>
                    <input value={kit[k]} onChange={(e) => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && setColor(k, e.target.value)}
                      style={{ width: 82, fontSize: 12, fontFamily: "ui-monospace, monospace", color: SHELL.mut, background: "#faf9f6", border: `1px solid ${SHELL.line}`, borderRadius: 7, padding: "5px 8px" }} />
                  </div>
                ))}
              </div>

              {/* Polices */}
              <SubLabel style={{ marginTop: 18 }}>
                <span className="inline-flex items-center gap-1"><Type size={12} /> Polices</span>
              </SubLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <FontSelect label="Titres" value={kit.titleFont} options={TITLE_FONTS} onChange={(v) => setFont("titleFont", v)} />
                <FontSelect label="Corps" value={kit.bodyFont} options={BODY_FONTS} onChange={(v) => setFont("bodyFont", v)} />
                <p style={{ fontSize: 11, color: SHELL.mut, lineHeight: 1.4, marginTop: 2 }}>
                  La police n'est pas devinée depuis le logo (peu fiable) : choisissez-la ici.
                </p>
              </div>
            </Group>

            {/* --- Établissement --- */}
            <Group icon={Store} title="Établissement">
              <TextField label="Nom" value={info.name} onChange={(v) => setInfo((i) => ({ ...i, name: v }))} />
              <TextField label="Accroche" value={info.tagline} onChange={(v) => setInfo((i) => ({ ...i, tagline: v }))} />

              <SubLabel style={{ marginTop: 6 }}>
                <span className="inline-flex items-center gap-1"><Instagram size={12} /> Réseaux &amp; contact</span>
              </SubLabel>
              <TextField label="Instagram" prefix="@" icon={Instagram} value={info.handle} onChange={(v) => setInfo((i) => ({ ...i, handle: v.replace(/^@/, "") }))} />
              <TextField label="Facebook" icon={Facebook} value={info.facebook} onChange={(v) => setInfo((i) => ({ ...i, facebook: v }))} />
              <TextField label="Site web" icon={Globe} value={info.website} onChange={(v) => setInfo((i) => ({ ...i, website: v }))} />
              <TextField label="Téléphone" icon={Phone} value={info.phone} onChange={(v) => setInfo((i) => ({ ...i, phone: v }))} />
              <TextField label="Lien de réservation" icon={CalendarDays} value={info.reserveUrl} onChange={(v) => setInfo((i) => ({ ...i, reserveUrl: v }))} />
            </Group>

            {/* --- Éditeur selon le support --- */}
            {support === "semaine" ? (
              <Group icon={CalendarDays} title="Menu de la semaine" hint="Format Instagram">
                <WeekEditor week={week} setWeek={setWeek} currency={settings.currency}
                  weekHistory={weekHistory} onNextWeek={nextWeek} onRestoreWeek={restoreWeek} onDeleteHistory={deleteWeekHistory} />
              </Group>
            ) : support === "saison" ? (
              <Group icon={Leaf} title="Menu saisonnier" hint={`${seasonal.dishes.length} plats`}>
                <SeasonalEditor seasonal={seasonal} setSeasonal={setSeasonal} currency={settings.currency} />
              </Group>
            ) : support === "boissons" ? (
              <Group icon={Wine} title="Carte des boissons" hint={`${drinks.categories.length} catégories`}>
                <DrinksEditor drinks={drinks} setDrinks={setDrinks} currency={settings.currency} />
              </Group>
            ) : support === "soiree" ? (
              <Group icon={PartyPopper} title="Soirée à thème" hint="Affiche A4">
                <EventEditor event={event} setEvent={setEvent} currency={settings.currency} />
              </Group>
            ) : (
              <Group icon={UtensilsCrossed} title="Carte" hint={`${dishes.length} plats`}>
                {showFeaturedPicker && (
                  <div style={{ marginBottom: 14 }}>
                    <FeaturedPicker dishes={dishes} featuredId={featuredId} onChange={setFeaturedId} />
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SECTIONS.map((sec) => {
                    const items = dishes.filter((d) => d.section === sec.id);
                    return (
                      <div key={sec.id}>
                        <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: SHELL.honeyDeep, fontWeight: 700, margin: "6px 0 4px" }}>
                          {sec.label}
                        </div>
                        {items.length === 0 && <div style={{ fontSize: 11.5, color: SHELL.mut, padding: "2px 0 4px" }}>Aucun plat</div>}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {items.map((d) => (
                            <DishRow key={d.id} dish={d} currency={settings.currency} onUpd={updDish} onDel={delDish} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={addDish} className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5"
                  style={{ border: `1px dashed ${SHELL.line}`, color: SHELL.honeyDeep, fontSize: 13, fontWeight: 600, background: "#fcfbf9" }}>
                  <Plus size={15} /> Ajouter un plat
                </button>
              </Group>
            )}

            {/* --- Bloc « À propos » optionnel, seulement sur le Menu --- */}
            {support === "menu" && (
              <Group icon={Info} title="À propos de nous" hint={about.enabled ? "Affiché sur le menu" : "Masqué"}>
                <label className="flex items-center gap-2" style={{ fontSize: 12.5, color: SHELL.txt, marginBottom: about.enabled ? 12 : 0 }}>
                  <input type="checkbox" checked={about.enabled}
                    onChange={(e) => setAbout((a) => ({ ...a, enabled: e.target.checked }))} />
                  Afficher « À propos de nous » sur le menu
                </label>
                {about.enabled && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <TextField label="Titre" value={about.title} onChange={(v) => setAbout((a) => ({ ...a, title: v }))} />
                    <TextArea label="Texte" value={about.text} onChange={(v) => setAbout((a) => ({ ...a, text: v }))} />
                  </div>
                )}
              </Group>
            )}

            {/* --- Réinitialisation --- */}
            <button onClick={handleReset}
              className="flex items-center justify-center gap-1.5"
              style={{ fontSize: 11.5, color: SHELL.mut, padding: "4px 0" }}>
              <RotateCcw size={12} /> Réinitialiser Ardoise sur cet appareil
            </button>
          </div>
        </aside>

        {/* ===================== WORKSPACE / PREVIEW ===================== */}
        <Workspace support={support} supports={supports} kit={kit} info={info} dishes={dishes} week={week} seasonal={seasonal} drinks={drinks} about={about} event={event} featured={featured} currency={settings.currency} lang={lang} exportRef={exportRef} />
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed left-1/2 bottom-6 z-30" style={{ transform: "translateX(-50%)" }}>
          <div className="flex items-center gap-2 rounded-full px-4 py-2.5 shadow-xl"
            style={{ background: SHELL.ink, color: "#fff", fontSize: 13 }}>
            <Sparkles size={14} style={{ color: SHELL.honey }} /> {toast}
          </div>
        </div>
      )}
    </div>
  );
}
