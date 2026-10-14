import { Home, ClipboardList, BookOpen, Star, Instagram, Palette } from "lucide-react";

/*
 * Les 6 vues de l'app. `exportable` = affiche le bouton « Exporter » dans la barre du haut
 * (le support correspond à une clé de PAGE_SPECS dans export.js).
 */
export const PAGES = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "carte", label: "Ma carte", icon: ClipboardList },
  { id: "menu", label: "Menu", icon: BookOpen, exportable: true },
  { id: "special", label: "Plat du jour", icon: Star, exportable: true },
  { id: "post", label: "Post", icon: Instagram, exportable: true },
  { id: "da", label: "Identité", icon: Palette },
];
