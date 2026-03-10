import { areas } from "../data/areas";
import { regionIcons } from "../data/regionIcons";
import { useAppContext } from "../App.jsx";
import { characters } from "../data/characters";
import { items } from "../data/items";

export default function MarkerLayer({ onAreaClick }) {
  const { enabledRegions, search } = useAppContext();

  function characterMatches(id, q) {
    const char = characters[id];
    if (!char) return false;

    const names = Array.isArray(char.name) ? char.name : [char.name];
    return names.some((n) => n?.toLowerCase().includes(q));
  }

  return (
    <>
      {areas
        .filter((area) => {
          const region = area.id.split("_")[0];

          if (!enabledRegions.includes(region)) return false;

          const q = search.toLowerCase().trim();
          if (!q) return true;

          // Area name
          if (area.name.toLowerCase().includes(q)) return true;

          // Recruitable characters
          if (area.recruitableCharacters?.some((id) => characterMatches(id, q)))
            return true;

          // Enemies
          if (area.enemies?.some((id) => characterMatches(id, q))) return true;

          // Items
          if (
            area.items?.some((id) => items[id]?.name?.toLowerCase().includes(q))
          )
            return true;

          return false;
        })
        .map((area) => {
          const region = area.id.split("_")[0];

          if (!enabledRegions.includes(region)) return null;
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
