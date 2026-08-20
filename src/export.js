import { toBlob } from "html-to-image";
import jsPDF from "jspdf";

/*
 * Un pixelRatio de capture par support (le nœud est rendu à l'échelle 1 en
 * ~420px CSS — voir Workspace.jsx — donc c'est le pixelRatio qui fait la
 * résolution finale). La largeur de page PDF est nominale ; la hauteur est
 * recalculée à partir du ratio réellement capturé (voir exportSupport) car
 * les supports "carte" (Semaine/Menu/Saisonnier/Boissons) grandissent avec
 * le contenu et ne font pas toujours exactement le format A4/A5/4:5 nominal.
 */
const PAGE_SPECS = {
  semaine: { width: 150, pixelRatio: 3 }, // 4:5
  menu: { width: 148, pixelRatio: 4 }, // A5 portrait
  special: { width: 210, pixelRatio: 4 }, // A4 portrait
  post: { width: 190, pixelRatio: 3 }, // carré
  saison: { width: 148, pixelRatio: 4 }, // A5 portrait
  boissons: { width: 148, pixelRatio: 4 }, // A5 portrait
  story: { width: 105, pixelRatio: 3 }, // 9:16
  soiree: { width: 210, pixelRatio: 4 }, // A4 portrait
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

// Téléchargement via Blob + URL objet plutôt qu'un `data:` URI brut dans le
// `href` : un `data:` URI de plusieurs Mo (image haute résolution) échoue
// silencieusement dans plusieurs navigateurs (Firefox notamment). Un Blob
// n'a pas cette limite et fonctionne de façon fiable partout.
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Lecture de l'image impossible"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Capture le nœud d'aperçu (à l'échelle 1, cf. Workspace.jsx) en image nette
 * et déclenche le téléchargement, en PNG direct ou intégré dans un PDF dont
 * la page épouse le ratio réellement capturé (pas de déformation).
 */
export async function exportSupport({ node, support, restaurantName, format }) {
  if (!node) throw new Error("Aperçu introuvable pour l'export.");
  const spec = PAGE_SPECS[support] || PAGE_SPECS.post;

  // Sans cette attente, html-to-image peut capturer le texte avec la police
  // de repli si les polices Google n'ont pas fini de charger.
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  // Ratio réel du nœud au moment de la capture (les supports "carte" comme
  // Menu/Semaine ont une hauteur qui dépend du contenu, pas un format figé).
  const rect = node.getBoundingClientRect();
  const aspect = rect.height / Math.max(1, rect.width);

  const blob = await toBlob(node, {
    pixelRatio: spec.pixelRatio,
    cacheBust: true,
    skipFonts: false,
  });
  if (!blob) throw new Error("La génération de l'image a échoué.");

  const filename = `${slugify(restaurantName)}-${SUPPORT_SLUGS[support] || support}`;

  if (format === "PNG") {
    downloadBlob(blob, `${filename}.png`);
    return;
  }

  const dataUrl = await blobToDataURL(blob);
  const pageWidth = spec.width;
  const pageHeight = pageWidth * aspect;
  const pdf = new jsPDF({
    orientation: pageHeight > pageWidth ? "portrait" : "landscape",
    unit: "mm",
    format: [pageWidth, pageHeight],
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, pageHeight);
  pdf.save(`${filename}.pdf`);
}
