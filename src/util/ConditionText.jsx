import { characters } from "../data/characters";
import { charactersSubordinate } from "../data/charactersSubordinate";
import { harem } from "../data/charactersHarem";
import { enemies } from "../data/charactersEnemy";
import { areas } from "../data/areas";
import { useAppContext } from "../App";

const TOKEN_REGEX = /(character_[a-z0-9_]+|area_[a-z0-9_]+)/gi;

const areaMap = areas.reduce((map, area) => {
  map[area.id] = area;
  return map;
}, {});

export default function ConditionText({ text, onCharacterClick }) {
  const {
    selectedItemId,
    setSelectedItemId,
    setSelectedCharacterId,
    setMode,
    setSelectedAreaId,
    setActiveOverlay,
  } = useAppContext();

  const parts = text.split(TOKEN_REGEX);

  return parts.map((part, i) => {
    if (part.startsWith("character_")) {
      const id = part.replace("character_", "");

      const inSubordinate = Boolean(charactersSubordinate[id]);
      const inHarem = Boolean(harem[id]);
      const inEnemy = Boolean(enemies[id]);

      return (
        <span
          key={i}
          className="character-link"
          onClick={() => {
            if (selectedItemId != null) setSelectedItemId(null);
            (inSubordinate ?
              (setMode("Subordinates"), setSelectedCharacterId(id))
            : inEnemy ? (setMode("Enemies"), setSelectedCharacterId(id))
            : inHarem ? (setMode("Harem"), setSelectedCharacterId(id))
            : setMode("Subordinates"),
              setSelectedCharacterId(id));

            if (onCharacterClick) {
              onCharacterClick();
            }
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
        <span
          key={i}
          className="character-link"
          onClick={() => {
            setSelectedAreaId(areaId);
            setSelectedCharacterId(null);
            setSelectedItemId(null);
            setActiveOverlay(null);
          }}
        >
          {area ? area.name : areaId}
        </span>
      );
    }

    return <span key={i}>{part}</span>;
  });
}
