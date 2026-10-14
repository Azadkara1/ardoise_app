/**
 * Réduit une image uploadée (côté max ~900 px, JPEG qualité ~0.8) avant de la
 * stocker en dataURL — sans ça, quelques photos saturent vite le quota
 * localStorage (~5 Mo) et cassent la persistance de tout le reste.
 */
export function resizeImageFile(file, maxSide = 900, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        // fond blanc : un PNG transparent deviendrait noir en JPEG
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Image illisible"));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.readAsDataURL(file);
  });
}
