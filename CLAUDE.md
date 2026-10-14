# Ardoise — guide pour Claude Code

> **Mets ce fichier à jour à chaque nouvelle fonctionnalité** (états ajoutés, nouveaux supports, section « Fait / À faire »). C'est la première chose à lire en début de session.

> **Deux versions coexistent** (sélecteur en haut à gauche, `src/Root.jsx`) :
> - **Nouvelle app** (`src/App.jsx`) : accueil, restaurant/snack, `sections` dynamiques, menu en livre 3D (`components/book/`), store Context+useReducer (`state/store.jsx`), 6 vues (Accueil, Ma carte, Menu, Plat du jour, Post, Identité), stockage `ardoise:v2`. Les sections ci-dessous décrivant `week/seasonal/drinks/event/profils` concernent l'**ancienne app**.
> - **Ancienne app** (`src/legacy/`) : copie figée de la version précédente (stockage `ardoise:v1`), décrite dans le reste de ce fichier.
> Fichiers de l'ancienne structure encore présents à la racine de `src/` mais inutilisés par la nouvelle app : WeekEditor, SeasonalEditor, DrinksEditor, EventEditor, ProfilesPanel, PhotoLibrary, previews Week/Menu/Seasonal/Drinks/Story/Event, dateUtils.js (doublons de `src/legacy/`, à supprimer).

## Le projet

Générateur de supports de communication pour **un** restaurant, dans **sa** charte graphique (« Brand Kit ») : un seul réglage de couleurs/polices/logo que tous les supports (menu, post Instagram, affiche…) lisent automatiquement. Pas de backend : tout vit dans le navigateur (localStorage).

Pré-configuré pour **La courbe du goût** (Grange-Canal, Genève) comme profil de démo.

Pas d'auth/multi-compte pour l'instant — ça viendra avec la commercialisation, dans un chantier séparé.

## Stack & commandes

- Vite + React 18, Tailwind pour la mise en page.
- `npm run dev` — serveur de dev (hot reload).
- `npm run build` — build de prod dans `dist/`.
- `npm run preview` — sert le build en local.
- Pas de suite de tests : vérifier à la main (`npm run build` + `npm run dev` et cliquer dans l'app) après chaque fonctionnalité.

## Structure des fichiers

```
src/
├─ App.jsx              ← assemblage : bandeau, panneau d'édition, tout l'état
├─ main.jsx, index.css
├─ theme.js              ← SHELL (jetons de couleur du shell éditeur), polices, ff(), INP
├─ colorUtils.js         ← hexToRgb/toHex/hexA/mix/lum/onColor, extractPalette (logo → palette)
├─ currency.js           ← table de devises + formatPrice(n, currencyCode)
├─ dateUtils.js          ← computeWeekLabel(), addDaysISO() (calendrier semaine)
├─ i18n.js               ← dictionnaire FR/EN pour les libellés fixes des supports
├─ imageUtils.js         ← resizeImageFile() (redimension canvas avant stockage)
├─ id.js                 ← uid()
├─ storage.js            ← persistance localStorage (load/save/clear), clé versionnée
├─ export.js             ← export PNG/PDF (html-to-image + jsPDF), un PAGE_SPEC par support
├─ data/defaults.js      ← presets DA, carte d'exemple, valeurs par défaut de tous les états, profil par défaut
├─ components/           ← UI de l'éditeur (un fichier par bloc du panneau gauche)
└─ previews/              ← un composant de rendu par support (ce qui s'affiche/s'exporte)
```

Si un fichier devient trop long, le découper plus finement (comme `App.jsx` l'a été depuis la version mono-fichier initiale) sans changer le rendu.

## Forme de l'état (dans `App.jsx`, tout persistant — voir plus bas)

- `kit` — Brand Kit : `{ primary, accent, background, text, titleFont, bodyFont, logo }`. Lu par tous les supports.
- `info` — établissement : `{ name, tagline, handle, facebook, website, phone, reserveUrl }`.
- `dishes` — carte principale : `[{ id, name, price, section, dujour, photo? }]`. `section` ∈ `entrees|plats|desserts`.
- `week` — menu de la semaine courante : `{ label, startDate, numDays, price, dessert, days:[{id,day,dish,garnish}], special:{dish,garnish}, note }`.
- `support` — support actif : `semaine | menu | special | post | saison | boissons | story | soiree`.
- `profiles` / `activeProfileId` — DA sauvegardées, cliquables (voir plus bas).
- `settings` — réglages transverses : `{ currency: "CHF"|"EUR"|"USD"|"GBP", lang: "fr"|"en"|"it" }`.
- `seasonal` — menu saisonnier : `{ season, label, dishes:[...] }` (même forme que `dishes`, carte indépendante).
- `drinks` — carte des boissons : `{ categories: [{ id, name, items:[{id,name,price}] }] }`.
- `about` — bloc « à propos » optionnel sur le Menu : `{ enabled, title, text }`.
- `featuredId` — id du plat vedette choisi manuellement (`null` = automatique) pour Plat du jour / Post / Story.
- `weekHistory` — semaines passées archivées : `[{ id, ...snapshot de week }]`.
- `event` — soirée à thème : `{ title, date, desc, price, photo }`.
- `photos` — photothèque : `[{ id, src }]` (dataURL redimensionnées). Un plat y réfère via `photoId` + cadrage `photoFit: { x, y, zoom }` (x/y 0–100, zoom ≥ 1). `dish.photo` (dataURL directe) reste lu pour compatibilité.
- `daily` — Plat du jour : `{ text }`, un seul champ libre (affiche `special`, indépendante de la carte).

**Règle systématique : tout nouvel état doit être ajouté (1) à la sauvegarde `localStorage`, (2) au profil par défaut dans `data/defaults.js`, (3) à `saveProfile`/`selectProfile` dans `App.jsx`.** Sinon il n'est ni mémorisé, ni rechargé au clic sur un restaurant.

## Supports

| id | label | composant d'aperçu | format |
|---|---|---|---|
| `semaine` | Semaine | `previews/WeekPreview.jsx` | Insta portrait 4:5 |
| `menu` | Menu | `previews/MenuPreview.jsx` | Carte A5 |
| `special` | Plat du jour | `previews/SpecialPreview.jsx` | Affiche A4 |
| `post` | Post réseaux | `previews/PostPreview.jsx` | Carré 1080 |
| `saison` | Saisonnier | `previews/SeasonalPreview.jsx` | Carte A5 |
| `boissons` | Boissons | `previews/DrinksPreview.jsx` | Carte A5 |
| `story` | Story | `previews/StoryPreview.jsx` | Story 9:16 |
| `soiree` | Soirée | `previews/EventPreview.jsx` | Affiche A4 |

Ajouter un support = une entrée dans le tableau `supports` de `App.jsx` + un composant d'aperçu + une section d'éditeur affichée quand ce support est actif + une entrée dans `PAGE_SPECS`/`SUPPORT_SLUGS` de `export.js`.

## Conventions de style

- **Tailwind** pour la mise en page (flex/grid/spacing). **Styles inline** dès qu'une valeur dépend de la DA/l'état (couleurs, polices, tailles calculées) — c'est la règle du projet, ne pas la mélanger.
- Jetons de l'éditeur (chrome, pas les supports) dans `SHELL` (`theme.js`) : encre (`ink`/`ink2`), accent miel (`honey`/`honeyDeep`), gris (`mut`/`line`).
- Helpers à réutiliser systématiquement : `ff(fontName)` (police + repli), `formatPrice(n, currencyCode)` (jamais de "CHF"/devise en dur), `hexA(hex, alpha)`, `onColor(bg)` (texte lisible sur un fond donné).
- Devise : ne jamais formater un prix à la main, toujours `formatPrice` depuis `currency.js`, avec `settings.currency`.
- Langue : les libellés **fixes** des supports exportés (titres de section, CTA, jours par défaut) passent par `t(key, lang)` de `i18n.js`. Le contenu saisi par le resto (noms de plats, textes libres) n'est **jamais** traduit. Par choix, l'UI de l'éditeur elle-même reste en français ; seuls les supports exportés et le libellé des supports dans le sélecteur sont bilingues.

## Persistance / profils

- `storage.js` : `load()/save(state)/saveDebounced(state)/clear()`, clé versionnée `ardoise:v1`, try/catch sur tout accès (JSON corrompu → défauts).
- Sauvegarde auto (debounce ~400ms) de tout l'état listé ci-dessus à chaque changement.
- Un **profil** (`src/data/defaults.js` → `DEFAULT_PROFILE`) = `{ id, name, data: { kit, info, dishes, week, settings, seasonal, drinks, about, featuredId, weekHistory, event, photos, daily } }`. Cliquer sur un profil recharge tout `data` d'un coup.

## Fait / À faire

**Fait :**
- Socle Vite/Tailwind, 4 supports historiques (Semaine/Menu/Plat du jour/Post), Brand Kit avec extraction de palette.
- Calendrier semaine (date de début → intitulé FR auto).
- Restaurants sauvegardés cliquables (profils).
- Persistance localStorage + bouton Réinitialiser.
- Export PNG/PDF net (polices Google embarquées via `crossorigin` sur le `<link>`).
- Devise configurable (`settings.currency`, `src/currency.js`, `formatPrice()`) — CHF/EUR/USD/GBP, sélecteur dans un nouveau panneau « Réglages ».
- Support **Saisonnier** (`saison`) : état `seasonal` (même forme que `dishes`), éditeur dédié (`SeasonalEditor.jsx`, réutilise `DishRow`), aperçu A5 avec bandeau de saison (`SeasonalPreview.jsx`).
- Support **Boissons** (`boissons`) : état `drinks.categories[].items[]`, éditeur dédié (`DrinksEditor.jsx`), aperçu A5 (`DrinksPreview.jsx`).
- Bloc **« À propos »** optionnel sur le Menu : état `about` (`{enabled,title,text}`), checkbox + champs dans un Group dédié affiché seulement quand `support === "menu"`, rendu conditionnel dans `MenuPreview.jsx`.
- **Plat vedette manuel** : état `featuredId` (`null` = auto), `FeaturedPicker.jsx` affiché dans l'éditeur Carte pour Plat du jour / Post / Story.
- Support **Story** (`story`) : aperçu 9:16 (`StoryPreview.jsx`), utilise `featured` + un fond photo optionnel (voile dégradé si `dish.photo` est présent).
- **Historique des semaines** : état `weekHistory` (liste de snapshots de `week`), bouton « Semaine suivante » (archive + `startDate` +7j via `addDaysISO()` + régénère l'intitulé, garde les plats), semaines passées cliquables pour les reprendre.
- **Photos de plats** : champ `photo` (dataURL) sur chaque plat, upload + redimension canvas (`imageUtils.js`, max 1000px large, JPEG q0.8) via un petit bouton sur `DishRow.jsx`. Utilisée en fond sur Post et Story quand le plat vedette en a une (voile dégradé pour la lisibilité, sinon rendu inchangé).
- **Multi-langue FR/EN** : état `settings.lang`, dictionnaire `src/i18n.js` (`t()`, `translateDay()`, `translateSeason()`, `translateSection()`, `setMenuLine()`). Traduit les libellés fixes des supports exportés + le nom des supports dans la nav. L'éditeur (panneaux de gauche) reste en français par choix — voir la section Conventions plus haut.
- Support **Soirée à thème** (`soiree`) : état `event` (`{title,date,desc,price,photo}`), éditeur dédié (`EventEditor.jsx`), affiche A4 festive (`EventPreview.jsx`, photo de fond optionnelle avec voile comme Post/Story).

Chantier « devise, nouveaux supports, i18n » (AMELIORATIONS.md, second prompt) : **complet, 10/10 points.**

- **Italien** (`lang: "it"`) : dictionnaire, jours, saisons, formule, date longue (`dateUtils.js`).
- **Suppression du logo** (bouton sous l'import dans la DA).
- **Photothèque** (`PhotoLibrary.jsx`) : import multiple une fois, puis attribution à chaque plat via son bouton photo (`DishRow.jsx`) ; cadrage déplaçable/zoomable (`PhotoAdjuster.jsx`, rendu `previews/PhotoBg.jsx`) appliqué à Post et Story.
- **Plat du jour** simplifié : un seul champ libre (`DailyEditor.jsx`), plus de carte ni de plat vedette sur cette page (le sélecteur reste pour Post/Story).

**Backlog (hors chantier actuel) :**
- QR code de réservation.
- Set de table / chevalet de table, formats d'impression supplémentaires.
- Suggestions de contraste automatiques.
- Commercialisation : comptes utilisateurs, sauvegarde cloud, plusieurs établissements par compte, rôles.
