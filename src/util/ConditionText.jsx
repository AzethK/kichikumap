import { characters } from "../data/characters";
import { harem } from "../data/charactersHarem";
import { areas } from "../data/areas";
import { useAppContext } from "../App";

const TOKEN_REGEX = /(character_[a-z0-9_]+|area_[a-z0-9_]+)/gi;

const areaMap = areas.reduce((map, area) => {
  map[area.id] = area;
  return map;
}, {});

export default function ConditionText({ text }) {
  const { selectedItemId, setSelectedItemId, setSelectedCharacterId, setMode } =
    useAppContext();

  const parts = text.split(TOKEN_REGEX);

  return parts.map((part, i) => {
    if (part.startsWith("character_")) {
      const id = part.replace("character_", "");

      const inHarem = Boolean(harem[id]);

      return (
        <span
          key={i}
          className="character-link"
          onClick={() => {
            if (selectedItemId != null) setSelectedItemId(null);
            inHarem ?
              (setMode("Harem"), setSelectedCharacterId(id))
            : setSelectedCharacterId(id);
          }}
        >
          {characters[id]?.name.split(" ")[0] ?? id}
        </span>
      );
    }

    if (part.startsWith("area_")) {
      const areaId = part.replace("area_", "");
      const area = areaMap[areaId];

      return (
        <span key={i} className="character-link">
          {area ? area.name : areaId}
        </span>
      );
    }

    return <span key={i}>{part}</span>;
  });
}
