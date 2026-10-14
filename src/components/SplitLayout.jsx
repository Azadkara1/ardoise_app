import { SHELL } from "../theme.js";

/* Mise en page éditeur (panneau à gauche) + zone de rendu (à droite) ; empilé sur mobile. */
export default function SplitLayout({ aside, asideWidth = 392, children }) {
  return (
    <div className="flex flex-col md:flex-row md:h-full">
      <aside className="w-full md:h-full md:overflow-y-auto shrink-0 md:w-[var(--aside-w)]"
        style={{ "--aside-w": `${asideWidth}px`, background: SHELL.panel, borderRight: `1px solid ${SHELL.line}` }}>
        <div className="p-5" style={{ display: "flex", flexDirection: "column", gap: 26 }}>{aside}</div>
      </aside>
      {children}
    </div>
  );
}
