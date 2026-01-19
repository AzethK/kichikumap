import { useState } from "react";
import SubordinatesOverlay from "./components/SubordinatesOverlay.jsx";
import AreaPanel from "./components/AreaPanel.jsx";
import LeftSidebar from "./components/LeftSidebar.jsx";
import MapViewport from "./components/MapViewport.jsx";

export default function App() {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [activeOverlay, setActiveOverlay] = useState(null);

  return (
    <>
      <LeftSidebar
        onOpenSubordinates={() => setActiveOverlay("subordinates")}
      />

      <MapViewport onAreaClick={setSelectedAreaId} />

      <AreaPanel
        areaId={selectedAreaId}
        onClose={() => setSelectedAreaId(null)}
      />

      {activeOverlay === "subordinates" && (
        <SubordinatesOverlay onClose={() => setActiveOverlay(null)} />
      )}
    </>
  );
}
