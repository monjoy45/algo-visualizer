import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./pages/HomePage";
import { VisualizerPage } from "./pages/VisualizerPage";

export default function App() {
  const [activeId, setActiveId] = useState<string>("");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--ink-950)]">
      <Sidebar activeId={activeId} onSelect={setActiveId} />
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        {activeId ? (
          <VisualizerPage id={activeId} onBack={() => setActiveId("")} />
        ) : (
          <HomePage onSelect={setActiveId} />
        )}
      </main>
    </div>
  );
}
