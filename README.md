# Ardoise

Une petite app qui génère les supports d'un restaurant (menu de la semaine, carte, plat du jour, post réseaux) dans **sa** charte graphique — un seul « Brand Kit » (couleurs + polices + logo) que tous les supports lisent.

Pré-configurée pour **La courbe du goût** (Grange-Canal, Genève).

## Démarrer

Prérequis : [Node.js 18+](https://nodejs.org).

```bash
npm install
npm run dev
```

Ouvre l'adresse affichée (par défaut http://localhost:5173).

## Scripts

- `npm run dev` — serveur de développement avec rechargement à chaud.
- `npm run build` — build de production dans `dist/`.
- `npm run preview` — sert le build de production en local.

## Structure

```
ardoise/
├─ index.html
├─ public/
│  └─ logo-courbe-du-gout.png
├─ src/
│  ├─ App.jsx           ← assemblage (bandeau, panneau d'édition, état)
│  ├─ main.jsx
│  ├─ index.css
│  ├─ theme.js           ← SHELL, polices, styles partagés
│  ├─ colorUtils.js       ← helpers couleur + extraction de palette
│  ├─ dateUtils.js        ← génération de l'intitulé de semaine
│  ├─ storage.js          ← persistance localStorage (load/save/clear)
│  ├─ export.js           ← export PNG/PDF (html-to-image + jsPDF)
│  ├─ id.js
│  ├─ data/defaults.js    ← presets, carte d'exemple, profil par défaut
│  ├─ components/         ← UI de l'éditeur (WeekEditor, DishRow, Restaurants…)
│  └─ previews/           ← les 4 rendus de support (Semaine/Menu/Plat/Post)
├─ AMELIORATIONS.md
└─ package.json
```

## Ce qui est déjà en place

- 4 supports : **Semaine** (post Instagram 4:5), **Menu** (carte A5), **Plat du jour** (affiche A4), **Post réseaux** (1080×1080).
- Brand Kit : import de logo avec extraction automatique de palette, 4 modèles, color pickers, choix des polices.
- Infos établissement pré-remplies + réseaux (Instagram, site, téléphone).
- Le bouton **Réserver** du post pointe vers le lien de réservation Google du restaurant.
- **Calendrier de semaine** : une date de début (+ nombre de jours) génère automatiquement l'intitulé français ("Semaine du 7 au 12 avril").
- **Restaurants sauvegardés** : profils cliquables (DA + infos + carte + menu semaine) enregistrés en un clic, "La courbe du goût" préchargé.
- **Persistance locale** : toute modification est sauvegardée automatiquement dans le navigateur (`localStorage`, clé versionnée `ardoise:v1`) ; bouton « Réinitialiser » pour repartir des défauts.
- **Export PNG / PDF** net (polices et couleurs embarquées) pour le support affiché, nommé d'après le resto et le support.

## Idées d'amélioration

Voir la fin de **`AMELIORATIONS.md`** (backlog) : duplication de semaine, historique de semaines, sélection du plat vedette, QR code, comptes utilisateurs…

## Partager / déployer

Guide complet pas-à-pas dans **`DEPLOIEMENT.md`** (méthode GitHub + Vercel, ou ligne de commande).

En résumé : pousse le dossier sur GitHub, connecte-le à **[Vercel](https://vercel.com)** (framework détecté : Vite), et tu obtiens une URL type `ardoise.vercel.app` à partager.

> Note : les données sont stockées dans le navigateur de chaque personne (localStorage), donc propres à l'appareil. Le stockage partagé / multi-appareils viendra avec les comptes, à l'étape commercialisation.
