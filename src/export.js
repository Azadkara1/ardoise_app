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
  menu: { width: 148, pixelRatio: 4 }, // une page du livre : A5 portrait
  special: { width: 210, pixelRatio: 4 }, // A4 portrait
  post: { width: 190, pixelRatio: 3 }, // carré
};

const SUPPORT_SLUGS = {
  menu: "menu",
  special: "plat-du-jour",
  post: "post-reseaux",
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
 * Capture le nœud d'aperçu (à l'échelle 1, cf. Workspace.jsx / MenuPage.jsx) en image nette
 * et déclenche le téléchargement, en PNG direct ou intégré dans un PDF dont
 * la page épouse le ratio réellement capturé (pas de déformation).
 */
export async function exportSupport({ node, support, restaurantName, format, suffix = "" }) {
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
    // les éléments marqués data-noexport (boutons d'import de photo…) ne sortent pas dans l'image
    filter: (n) => !(n.dataset && n.dataset.noexport),
  });
  if (!blob) throw new Error("La génération de l'image a échoué.");

  const filename = `${slugify(restaurantName)}-${SUPPORT_SLUGS[support] || support}${suffix ? `-${suffix}` : ""}`;

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

/**
 * Export de PLUSIEURS pages (le menu complet) : `nodes` = un nœud par page, à l'échelle 1.
 * PDF : un seul fichier, une page A5 par page du livre. PNG : un fichier par page.
 */
export async function exportPages({ nodes, support, restaurantName, format }) {
  if (!nodes || !nodes.length) throw new Error("Aucune page à exporter.");
  const spec = PAGE_SPECS[support] || PAGE_SPECS.menu;
  if (document.fonts && document.fonts.ready) await document.fonts.ready;

  const base = `${slugify(restaurantName)}-${SUPPORT_SLUGS[support] || support}`;
  const capture = (node) => toBlob(node, {
    pixelRatio: spec.pixelRatio, cacheBust: true, skipFonts: false,
    filter: (n) => !(n.dataset && n.dataset.noexport),
  });

  let pdf = null;
  for (let i = 0; i < nodes.length; i++) {
    const blob = await capture(nodes[i]);
    if (!blob) throw new Error("La génération de l'image a échoué.");
    if (format === "PNG") {
      downloadBlob(blob, `${base}-page-${i + 1}.png`);
      await new Promise((r) => setTimeout(r, 350)); // laisse le navigateur enchaîner les téléchargements
    } else {
      const rect = nodes[i].getBoundingClientRect();
      const h = spec.width * (rect.height / Math.max(1, rect.width));
      const dataUrl = await blobToDataURL(blob);
      if (!pdf) pdf = new jsPDF({ orientation: h > spec.width ? "portrait" : "landscape", unit: "mm", format: [spec.width, h] });
      else pdf.addPage([spec.width, h], h > spec.width ? "portrait" : "landscape");
      pdf.addImage(dataUrl, "PNG", 0, 0, spec.width, h);
    }
  }
  if (pdf) pdf.save(`${base}.pdf`);
}
