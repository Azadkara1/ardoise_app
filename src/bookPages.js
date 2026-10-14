/*
 * Transforme la carte (sections + plats) en liste ordonnée de pages du livre.
 *
 * Restaurant : Couverture → [Section : page(s) texte, puis page(s) photos] pour chaque section non vide.
 *   Une section dont `layout === "list"` (ex. Boissons) n'a que ses pages texte.
 * Snack : Couverture → une (ou plusieurs) page(s) « tuiles » par catégorie ; `layout === "list"` → liste de prix compacte.
 * Une section vide n'apparaît pas du tout.
 *
 * Page = { id, kind: "cover"|"list"|"photos"|"tiles", group, label, title, dishes?, part?, parts? }
 *   `group` = id de section (ou "cover") : sert au sommaire et à l'indicateur.
 */
const PER_PAGE = {
  list: 6, // liste texte avec descriptions
  listCompact: 10, // liste de prix seule (boissons, suppléments…)
  photos: 4, // grille 2×2
  tiles: 4, // tuiles snack 2×2
};

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

function sectionPages(sec, dishes, snack) {
  const photos = sec.layout !== "list";
  const make = (kind, size) => {
    const chunks = chunk(dishes, size);
    return chunks.map((ds, i) => ({
      id: `${sec.id}:${kind}:${i}`, kind, group: sec.id, label: sec.name, title: sec.name,
      dishes: ds, part: i + 1, parts: chunks.length,
    }));
  };
  if (snack) return photos ? make("tiles", PER_PAGE.tiles) : make("list", PER_PAGE.listCompact);
  return photos
    ? [...make("list", PER_PAGE.list), ...make("photos", PER_PAGE.photos)]
    : make("list", PER_PAGE.listCompact);
}

export function buildPages({ sections, dishes, venueType }) {
  const snack = venueType === "snack";
  const pages = [{ id: "cover", kind: "cover", group: "cover", label: "Couverture", title: "" }];
  for (const sec of sections) {
    const items = dishes.filter((d) => d.sectionId === sec.id);
    if (items.length) pages.push(...sectionPages(sec, items, snack));
  }
  return pages;
}

/** Entrées du sommaire : un lien par groupe (couverture + chaque section présente) vers sa première page. */
export function buildToc(pages) {
  const seen = new Set();
  const toc = [];
  pages.forEach((p, i) => {
    if (seen.has(p.group)) return;
    seen.add(p.group);
    toc.push({ group: p.group, label: p.label, index: i });
  });
  return toc;
}
