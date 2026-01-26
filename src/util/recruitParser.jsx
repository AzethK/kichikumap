import { characters } from "../data/characters.js";
import { areas } from "../data/areas.js";

const TOKEN_REGEX = /(character_[a-z0-9_]+|area_[a-z0-9_]+)/gi;
const areaMap = areas.reduce((map, area) => {
  map[area.id] = area;
  return map;
}, {});

export function renderConditionText(text, setSelectedCharacterId) {
  const parts = text.split(TOKEN_REGEX);

  return parts.map((part, i) => {
    if (part.startsWith("character_")) {
      const id = part.replace("character_", "");

      return (
        <span
          key={i}
          className="character-link"
          onClick={() => setSelectedCharacterId(id)}
        >
          {characters[id]?.name.split(" ")[0] ?? id}
        </span>
      );
    }
    if (part.startsWith("area_")) {
      const areaId = part.replace("area_", "");
      const area = areaMap[areaId];

      return (
        <span key={i} className="character-link" data-area-id={areaId}>
          {area ? area.name : areaId}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
