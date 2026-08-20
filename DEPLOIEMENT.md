# Déployer Ardoise et obtenir un lien à partager

Objectif : mettre l'app en ligne gratuitement pour obtenir une adresse type
`ardoise-courbe.vercel.app` que tu envoies au restaurateur. Il ouvre le lien dans
son navigateur (téléphone ou ordinateur), sans rien installer.

Deux méthodes. La **méthode A (GitHub + Vercel)** est la plus simple et se met à
jour toute seule à chaque modification. La **méthode B (ligne de commande)** est
la plus rapide si tu es pressé.

---

## Méthode A — GitHub + Vercel (recommandée)

### 1. Mettre le projet sur GitHub

Si tu n'as pas de compte : crée-en un sur https://github.com (gratuit).

Dans un terminal, à la racine du dossier `ardoise/` :

```bash
git init
git add .
git commit -m "Ardoise - version initiale"
```

Crée un dépôt vide sur GitHub (bouton « New repository », nomme-le `ardoise`,
laisse-le vide, clique « Create repository »), puis relie-le :

```bash
git remote add origin https://github.com/TON-UTILISATEUR/ardoise.git
git branch -M main
git push -u origin main
```

> Tu peux aussi laisser **Claude Code** faire ces commandes pour toi.

### 2. Connecter Vercel

1. Va sur https://vercel.com et connecte-toi **avec GitHub** (gratuit).
2. Clique **Add New… → Project**.
3. Choisis ton dépôt `ardoise` → **Import**.
4. Vercel détecte automatiquement **Vite**. Laisse les réglages par défaut :
   - Framework Preset : **Vite**
   - Build Command : `npm run build`
   - Output Directory : `dist`
5. Clique **Deploy**. Au bout d'une minute, tu obtiens ton lien public. 🎉

### 3. Mettre à jour plus tard

À chaque fois que tu modifies l'app (toi ou Claude Code) :

```bash
git add .
git commit -m "mise à jour du menu"
git push
```

Vercel redéploie tout seul en ~1 minute. Le lien ne change pas.

---

## Méthode B — En ligne de commande (la plus rapide)

À la racine de `ardoise/` :

```bash
npm install -g vercel   # une seule fois
vercel                  # suis les questions, accepte les valeurs par défaut
vercel --prod           # publie la version définitive et donne le lien
```

La première commande `vercel` te demande de te connecter (elle ouvre le
navigateur). Ensuite, réponds « Entrée » à toutes les questions : Vercel
reconnaît Vite tout seul.

---

## Nom d'adresse plus propre (optionnel)

Dans le tableau de bord Vercel : **Project → Settings → Domains**, tu peux
renommer en `courbe-du-gout.vercel.app`, ou brancher un vrai nom de domaine
(par ex. `menu.courbe-du-gout.ch`) si le restaurant en possède un.

---

## Points à savoir

- **Gratuit** : l'offre Hobby de Vercel suffit largement pour cet usage.
- **Sauvegarde** : les modifications faites dans l'app sont mémorisées
  automatiquement, mais stockées **dans le navigateur de chaque personne**
  (localStorage) — donc propres à l'appareil. Le stockage partagé /
  multi-appareils viendra avec les comptes, à l'étape commercialisation.
- **Confidentialité** : le lien est public (devinable difficilement mais non
  protégé). Pour un usage perso c'est suffisant ; on ajoutera un accès protégé
  plus tard si besoin.
