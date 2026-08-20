import { toPng } from "html-to-image";
import jsPDF from "jspdf";

/*
 * Un format d'export par support : dimensions physiques (mm) pour le PDF, et
 * un pixelRatio de capture (le nœud est rendu à l'échelle 1 en ~420px CSS —
 * voir Workspace.jsx — donc c'est le pixelRatio qui fait la résolution finale).
 * 4:5 et 1:1 sont pensés écran (Instagram) ; A5/A4 pensés impression.
 */
const PAGE_SPECS = {
  semaine: { width: 150, height: 187.5, pixelRatio: 3 }, // 4:5
  menu: { width: 148, height: 210, pixelRatio: 4 }, // A5 portrait
  special: { width: 210, height: 297, pixelRatio: 4 }, // A4 portrait
  post: { width: 190, height: 190, pixelRatio: 3 }, // carré
  saison: { width: 148, height: 210, pixelRatio: 4 }, // A5 portrait
  boissons: { width: 148, height: 210, pixelRatio: 4 }, // A5 portrait
  story: { width: 105, height: 186.7, pixelRatio: 3 }, // 9:16
  soiree: { width: 210, height: 297, pixelRatio: 4 }, // A4 portrait
};

const SUPPORT_SLUGS = {
  semaine: "semaine",
  menu: "menu",
  special: "plat-du-jour",
  post: "post-reseaux",
  saison: "saisonnier",
  boissons: "boissons",
  story: "story",
  soiree: "soiree",
};

const stripDiacritics = (s) =>
  Array.from(s.normalize("NFD"))
    .filter((ch) => ch.codePointAt(0) < 0x0300 || ch.codePointAt(0) > 0x036f)
    .join("");

const slugify = (s) =>
  stripDiacritics((s || "ardoise").toLowerCase())
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "ardoise";

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Capture le nœud d'aperçu (à l'échelle 1, cf. Workspace.jsx) en PNG net et
 * déclenche le téléchargement, en PNG direct ou intégré dans un PDF.
 */
export async function exportSupport({ node, support, restaurantName, format }) {
  if (!node) throw new Error("Aperçu introuvable pour l'export.");
  const spec = PAGE_SPECS[support] || PAGE_SPECS.post;

  // Sans cette attente, html-to-image peut capturer le texte avec la police
  // de repli si les polices Google n'ont pas fini de charger.
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const dataUrl = await toPng(node, {
    pixelRatio: spec.pixelRatio,
    cacheBust: true,
    skipFonts: false,
  });

  const filename = `${slugify(restaurantName)}-${SUPPORT_SLUGS[support] || support}`;

  if (format === "PNG") {
    downloadDataUrl(dataUrl, `${filename}.png`);
    return;
  }

  const pdf = new jsPDF({
    orientation: spec.width > spec.height ? "landscape" : "portrait",
    unit: "mm",
    format: [spec.width, spec.height],
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, spec.width, spec.height);
  pdf.save(`${filename}.pdf`);
}
