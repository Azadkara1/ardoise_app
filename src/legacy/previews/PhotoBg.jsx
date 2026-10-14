/*
 * Photo de fond d'un support (Post/Story), recadrable : `fit` = { x, y, zoom }.
 * x/y (0–100) = point de la photo qui reste au centre du cadre (objectPosition),
 * zoom ≥ 1 agrandit autour de ce même point — la photo couvre donc toujours
 * tout le cadre, jamais de bords vides. À placer en premier enfant d'un
 * conteneur `position: relative; overflow: hidden`.
 */
export default function PhotoBg({ src, fit }) {
  const x = fit?.x ?? 50, y = fit?.y ?? 50, zoom = fit?.zoom ?? 1;
  return (
    <img src={src} alt="" draggable={false}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        objectPosition: `${x}% ${y}%`, transform: `scale(${zoom})`, transformOrigin: `${x}% ${y}%` }} />
  );
}
