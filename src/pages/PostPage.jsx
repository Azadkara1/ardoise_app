import { Instagram } from "lucide-react";
import { SHELL } from "../theme.js";
import { venueCopy } from "../venue.js";
import { useStore, pickFeatured } from "../state/store.jsx";
import SplitLayout from "../components/SplitLayout.jsx";
import Workspace from "../components/Workspace.jsx";
import FeaturedPicker from "../components/FeaturedPicker.jsx";
import PhotoImportButton from "../components/PhotoImport.jsx";
import PhotoAdjuster from "../components/PhotoAdjuster.jsx";
import PostPreview from "../previews/PostPreview.jsx";
import { Group } from "../components/ui.jsx";

/* Post réseaux : carré 1080 avec le plat vedette (photo, prix) et un bouton Réserver / Commander. */
export default function PostPage() {
  const { state, setFeatured, patchDish } = useStore();
  const { kit, info, dishes, settings, featuredId, venueType } = state;
  const featured = pickFeatured(state);
  const copy = venueCopy(venueType);
  return (
    <SplitLayout aside={
      <Group icon={Instagram} title="Post réseaux" hint="Carré 1080">
        {dishes.length === 0 ? (
          <p style={{ fontSize: 12.5, color: SHELL.mut }}>Ajoutez d'abord un {copy.item} dans « Ma carte ».</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FeaturedPicker dishes={dishes} featuredId={featuredId} onChange={setFeatured} />
            {featured && (
              <div>
                <div className="flex items-center gap-3">
                  <PhotoImportButton dish={featured} size={56} />
                  <p style={{ fontSize: 12, color: SHELL.mut, lineHeight: 1.4 }}>
                    {featured.photo ? "Photo du plat vedette. Cliquez pour la remplacer." : "Ajoutez une photo : elle devient le fond du post."}
                  </p>
                </div>
                {featured.photo && (
                  <div style={{ marginTop: 14 }}>
                    <PhotoAdjuster src={featured.photo} fit={featured.photoFit} onChange={(photoFit) => patchDish(featured.id, { photoFit })} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Group>
    }>
      <Workspace fmt="Carré 1080" deps={[kit, info, featured, settings, venueType]}>
        {(w) => <PostPreview kit={kit} info={info} dish={featured} currency={settings.currency} lang={settings.lang} venueType={venueType} w={w} />}
      </Workspace>
    </SplitLayout>
  );
}
