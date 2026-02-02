import { useState } from "react";
import SubordinatesOverlay from "./components/SubordinatesOverlay.jsx";
import AreaPanel from "./components/AreaPanel.jsx";
import LeftSidebar from "./components/LeftSidebar.jsx";
import MapViewport from "./components/MapViewport.jsx";
import ItemsOverlay from "./components/ItemsOverlay.jsx";
import CharacterDetail from "./components/CharacterDetail.jsx";

export default function App() {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [mode, setMode] = useState("characters");

  return (
    <>
      {/* Sidebar toggle button */}
      <button
        className={`sidebar-toggle ${sidebarOpen ? "open" : "closed"}`}
        onClick={() => setSidebarOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        {"▶"}
      </button>

      <LeftSidebar
        onOpenSubordinates={() => setActiveOverlay("subordinates")}
        onOpenItems={() => setActiveOverlay("items")}
        open={sidebarOpen}
      />

      <MapViewport onAreaClick={setSelectedAreaId} />

      <AreaPanel
        areaId={selectedAreaId}
        onClose={() => setSelectedAreaId(null)}
        setSelectedCharacterId={setSelectedCharacterId}
      />

      {activeOverlay === "subordinates" && (
        <SubordinatesOverlay
          onClose={() => setActiveOverlay(null)}
          setSelectedCharacterId={setSelectedCharacterId}
          mode={mode}
          setMode={setMode}
        />
      )}

      {activeOverlay === "items" && (
        <ItemsOverlay
          onClose={() => setActiveOverlay(null)}
          setSelectedItemId={setSelectedItemId}
        />
      )}

      {selectedCharacterId && (
        <CharacterDetail
          characterId={selectedCharacterId}
          onClose={() => {
            if (activeOverlay != "subordinates") {
              setMode("Characters");
            }
            setSelectedCharacterId(null);
          }}
          setSelectedCharacterId={setSelectedCharacterId}
          mode={mode}
          setMode={setMode}
        />
      )}
    </>
  );
}
