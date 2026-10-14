import { SHELL } from "../theme.js";
import SplitLayout from "../components/SplitLayout.jsx";
import DaEditor from "../components/DaEditor.jsx";
import SettingsPanel from "../components/SettingsPanel.jsx";
import LiveBook from "../components/book/LiveBook.jsx";

/* Identité : le Brand Kit (lu par tous les supports) ; le livre à droite se restyle en direct. */
export default function DaPage() {
  return (
    <SplitLayout aside={
      <>
        <DaEditor />
        <SettingsPanel />
      </>
    }>
      <div className="flex-1 md:h-full md:overflow-y-auto" style={{ background: SHELL.work }}>
        <div className="px-5 py-8">
          <p className="text-center mb-5" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: SHELL.mut, fontWeight: 600 }}>
            Aperçu live · votre DA sur le menu
          </p>
          <LiveBook editable={false} />
        </div>
      </div>
    </SplitLayout>
  );
}
