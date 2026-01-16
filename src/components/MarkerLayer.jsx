import { areas } from "./areas";
import { regionIcons } from "./regionIcons";

export default function MarkerLayer() {
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
              top: area.y
            }}

            onClick={() => {
              console.log("Clicked:", area.name);
            }}
          >
            <img
              src={icon}
              alt={region}
              className="map-marker-icon"
              draggable={false}
            />
            <div className="map-marker-label">
              {area.name}
            </div>
          </div>
        );
      })}
    </>
  );
}


