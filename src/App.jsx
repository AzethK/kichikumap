import { useState } from "react";
import SubordinatesOverlay from "./components/SubordinatesOverlay.jsx";
import AreaPanel from "./components/AreaPanel.jsx";
import LeftSidebar from "./components/LeftSidebar.jsx";
import MapViewport from "./components/MapViewport.jsx";
import CharacterDetail from "./components/CharacterDetail.jsx";

export default function App() {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [haremToggle, setHaremToggle] = useState(false);
  const [subordinateToggle, setSubordinateToggle] = useState(false);

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
          haremToggle={haremToggle}
          subordinateToggle={subordinateToggle}
          setHaremToggle={setHaremToggle}
          setSubordinateToggle={setSubordinateToggle}
        />
      )}

      {selectedCharacterId && (
        <CharacterDetail
          characterId={selectedCharacterId}
          onClose={() => setSelectedCharacterId(null)}
          setSelectedCharacterId={setSelectedCharacterId}
        />
      )}
    </>
  );
}
