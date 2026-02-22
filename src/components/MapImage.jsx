import { useState } from "react";
import continent from "../assets/continent.svg";

export default function MapImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="map-wrapper">
      {!loaded && <div className="map-loader">Loading map...</div>}

      <img
        src={continent}
        alt="Kichikuou Rance Map"
        draggable={false}
        className={`map-content ${loaded ? "visible" : "hidden"}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
