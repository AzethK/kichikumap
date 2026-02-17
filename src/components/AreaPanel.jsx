import { areas } from "../data/areas";
import { characters } from "../data/characters";
import { regionIcons } from "../data/regionIcons";
import { regionStyles } from "../data/regionStyles";
import CharacterCard from "./CharacterCard";

export default function AreaPanel({ areaId, onClose }) {
  if (!areaId) return null;

  const area = areas.find((a) => a.id === areaId);
  if (!area) return null;

  const recruitIds = area.recruitableCharacters ?? [];
  const recruits = recruitIds.map((id) => characters[id]);

  const region = area.id.split("_")[0];
  const regionIcon = regionIcons[region];
  const regionStyle = regionStyles[region];

  return (
    <div className="area-panel">
      <div
        className="area-panel-header"
        style={{
          "--region-color": regionStyle?.color ?? "red",
        }}
      >
        <button className="area-panel-close" onClick={onClose}>
          ✕
        </button>
        <h2>{area.name}</h2>
        {regionIcon && (
          <img
            src={regionIcon}
            alt={region}
            className="area-panel-region-icon"
          />
        )}
      </div>

      <section>
        <h3>Recruitable Characters</h3>

        {recruits.length === 0 && (
          <p className="empty">No recruitable characters.</p>
        )}

        {recruits.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </section>
    </div>
  );
}
