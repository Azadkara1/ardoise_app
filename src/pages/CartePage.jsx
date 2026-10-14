import { ClipboardList } from "lucide-react";
import { SHELL } from "../theme.js";
import { venueCopy } from "../venue.js";
import { useStore } from "../state/store.jsx";
import SplitLayout from "../components/SplitLayout.jsx";
import EtablissementEditor from "../components/EtablissementEditor.jsx";
import CarteEditor from "../components/CarteEditor.jsx";
import LiveBook from "../components/book/LiveBook.jsx";
import { Group } from "../components/ui.jsx";

/* Ma carte : édition des sections et des plats à gauche, le livre se met à jour en direct à droite (desktop). */
export default function CartePage() {
  const { state } = useStore();
  const copy = venueCopy(state.venueType);
  return (
    <SplitLayout asideWidth={440} aside={
      <>
        <EtablissementEditor />
        <Group icon={ClipboardList} title="Ma carte" hint={`${state.dishes.length} ${state.dishes.length > 1 ? copy.items : copy.item}`}>
          <CarteEditor />
        </Group>
      </>
    }>
      <div className="hidden md:block flex-1 md:h-full md:overflow-y-auto" style={{ background: SHELL.work }}>
        <div className="px-5 py-8">
          <p className="text-center mb-5" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: SHELL.mut, fontWeight: 600 }}>
            Aperçu live · le menu en livre
          </p>
          <LiveBook />
        </div>
      </div>
    </SplitLayout>
  );
}
