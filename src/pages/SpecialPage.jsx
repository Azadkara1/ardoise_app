import { Star } from "lucide-react";
import { useStore } from "../state/store.jsx";
import SplitLayout from "../components/SplitLayout.jsx";
import Workspace from "../components/Workspace.jsx";
import DailyEditor from "../components/DailyEditor.jsx";
import SpecialPreview from "../previews/SpecialPreview.jsx";
import { Group } from "../components/ui.jsx";

/* Plat du jour : un seul champ libre (+ plat de la carte en option pour photo et prix). */
export default function SpecialPage() {
  const { state } = useStore();
  const { kit, info, daily, dishes, settings } = state;
  const dish = (daily.dishId && dishes.find((d) => d.id === daily.dishId)) || null;
  return (
    <SplitLayout aside={
      <Group icon={Star} title="Plat du jour" hint="Affiche A4">
        <DailyEditor />
      </Group>
    }>
      <Workspace fmt="Affiche A4" deps={[kit, info, daily, dish, settings]}>
        {(w) => <SpecialPreview kit={kit} info={info} daily={daily} dish={dish} currency={settings.currency} lang={settings.lang} w={w} />}
      </Workspace>
    </SplitLayout>
  );
}
