import { areas } from "../data/areas";
import { regionIcons } from "../data/regionIcons";

export default function MarkerLayer({ onAreaClick }) {
  return (
    <>
      {areas.map((area) => {
        const region = area.id.split("_")[0];
        const icon = regionIcons[region];

        if (!icon) {
          console.warn("Missing icon for region:", region);
        }

        return (
          <div
            key={area.id}
            className="map-marker"
            style={{
              position: "absolute",
              left: area.x,
              top: area.y,
            }}
            onPointerUp={(e) => {
              e.stopPropagation();

              // Only trigger if NOT dragging
              if (e.pointerType === "mouse" || e.pointerType === "touch") {
                onAreaClick(area.id);
              }
            }}
          >
            <img
              src={icon}
              alt={region}
              className="map-marker-icon"
              draggable={false}
            />
            <div className="map-marker-label">{area.name}</div>
          </div>
        );
      })}
    </>
  );
}
