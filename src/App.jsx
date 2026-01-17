import { useState } from "react";
import MapViewport from "./components/MapViewport";
import AreaPanel from "./components/AreaPanel";

export default function App() {
  const [selectedAreaId, setSelectedAreaId] = useState(null);

  return (
    <>
      <MapViewport onAreaClick={setSelectedAreaId} />
      <AreaPanel
        areaId={selectedAreaId}
        onClose={() => setSelectedAreaId(null)}
      />
    </>
  );
}
