import { useEffect } from "react";

/*
 * Polices importées par l'utilisateur (.ttf/.otf/.woff2), stockées en dataURL dans le kit.
 * - FontFace : chargement immédiat pour l'aperçu.
 * - <style @font-face> : indispensable pour que html-to-image puisse embarquer la police dans l'export.
 */
export function useCustomFonts(fonts = []) {
  useEffect(() => {
    let style = document.getElementById("ardoise-custom-fonts");
    if (!style) {
      style = document.createElement("style");
      style.id = "ardoise-custom-fonts";
      document.head.appendChild(style);
    }
    style.textContent = fonts
      .map((f) => `@font-face{font-family:'${f.name}';src:url(${f.dataUrl});font-display:swap;}`)
      .join("\n");

    fonts.forEach((f) => {
      try {
        if (![...document.fonts].some((x) => x.family.replace(/['"]/g, "") === f.name)) {
          new FontFace(f.name, `url(${f.dataUrl})`).load().then((face) => document.fonts.add(face)).catch(() => {});
        }
      } catch {
        // FontFace indisponible : le <style> suffit dans la plupart des cas
      }
    });
  }, [fonts]);
}

/** Lit un fichier de police et renvoie { name, dataUrl } (le nom vient du nom de fichier). */
export function readFontFile(file) {
  return new Promise((resolve, reject) => {
    if (!/\.(ttf|otf|woff2?)$/i.test(file.name)) return reject(new Error("Format non pris en charge (.ttf, .otf, .woff2)"));
    const reader = new FileReader();
    reader.onload = () => resolve({
      name: file.name.replace(/\.[^.]+$/, "").replace(/[^\p{L}\p{N} _-]+/gu, "").trim() || "Ma police",
      dataUrl: reader.result,
    });
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.readAsDataURL(file);
  });
}
