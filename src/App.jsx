import { useState, createContext, useContext } from "react";
import SubordinatesOverlay from "./components/SubordinatesOverlay.jsx";
import AreaPanel from "./components/AreaPanel.jsx";
import LeftSidebar from "./components/LeftSidebar.jsx";
import MapViewport from "./components/MapViewport.jsx";
import ItemsOverlay from "./components/ItemsOverlay.jsx";
import CharacterDetail from "./components/CharacterDetail.jsx";
import ItemDetail from "./components/ItemDetail.jsx";

export const AppContext = createContext(null);
export const useAppContext = () => useContext(AppContext);

export default function App() {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [censoredMode, setCensoredMode] = useState(true);
  const [mode, setMode] = useState("characters");
  const [search, setSearch] = useState("");
  const [enabledRegions, setEnabledRegions] = useState([
    "leazas",
    "zeth",
    "helman",
    "freecities",
    "al",
    "japan",
    "kayblis",
    "hornet",
    "dungeon",
  ]);

  return (
    <>
      <AppContext.Provider
        value={{
          censoredMode,
          setCensoredMode,
          selectedAreaId,
          setSelectedAreaId,
          selectedItemId,
          setSelectedItemId,
          selectedCharacterId,
          setSelectedCharacterId,
          activeOverlay,
          setActiveOverlay,
          enabledRegions,
          setEnabledRegions,
          mode,
          setMode,
          search,
          setSearch,
        }}
      >
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
          toggleCensor={() => setCensoredMode(!censoredMode)}
          open={sidebarOpen}
        />

        <MapViewport onAreaClick={setSelectedAreaId} />

        <AreaPanel
          areaId={selectedAreaId}
          onClose={() => setSelectedAreaId(null)}
        />

        {activeOverlay === "subordinates" && (
          <SubordinatesOverlay
            onClose={() => (setMode("Characters"), setActiveOverlay(null))}
          />
        )}

        {activeOverlay === "items" && (
          <ItemsOverlay onClose={() => setActiveOverlay(null)} />
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
          />
        )}

        {selectedItemId && (
          <ItemDetail
            itemId={selectedItemId}
            onClose={() => {
              setSelectedItemId(null);
            }}
            setSelectedItemId={setSelectedItemId}
            selectedCharacterId={selectedCharacterId}
            setSelectedCharacterId={setSelectedCharacterId}
            setMode={setMode}
          />
        )}
      </AppContext.Provider>
    </>
  );
}
