import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./pages/HomePage";
import { VisualizerPage } from "./pages/VisualizerPage";

export default function App() {
  const [activeId, setActiveId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleSelect(id: string) {
    setActiveId(id);
    setSidebarOpen(false); // auto-close the drawer after picking something on mobile
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--ink-950)]">
      <Sidebar
        activeId={activeId}
        onSelect={handleSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile-only top bar with the menu button; sidebar is always visible at lg+ so this hides there */}
        <div className="flex items-center gap-3 border-b border-[var(--ink-700)] bg-[var(--ink-900)] px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="rounded p-1.5 text-[var(--paper-dim)] hover:bg-[var(--ink-700)] hover:text-[var(--paper)]"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <rect y="2" width="16" height="1.6" />
              <rect y="7.2" width="16" height="1.6" />
              <rect y="12.4" width="16" height="1.6" />
            </svg>
          </button>
          <span className="font-[var(--font-display)] text-base">Algorithm Visualizer</span>
        </div>

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          {activeId ? (
            <VisualizerPage id={activeId} onBack={() => setActiveId("")} />
          ) : (
            <HomePage onSelect={handleSelect} />
          )}
        </main>
      </div>
    </div>
  );
}