/**
 * Réduit une image uploadée (max ~1000px de large, JPEG qualité ~0.8) avant de
 * la stocker en dataURL — sans ça, quelques photos de plats saturent vite le
 * quota localStorage (~5 Mo) et cassent la persistance de tout le reste.
 */
export function resizeImageFile(file, maxW = 1000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
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
