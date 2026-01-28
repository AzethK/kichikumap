import { characters } from "../data/characters.js";
import { harem } from "../data/charactersHarem.js";
import { charactersSubordinate } from "../data/charactersSubordinate.js";
import { getCharacterPortrait } from "../data/characterPortraits.js";

export default function SubordinatesOverlay({
  onClose,
  setSelectedCharacterId,
  haremToggle,
  subordinateToggle,
  setHaremToggle,
  setSubordinateToggle,
}) {
  const activeCharacters =
    haremToggle ?
      Object.keys(harem)
        .map((id) => characters[id])
        .filter(Boolean)
    : subordinateToggle ?
      Object.keys(charactersSubordinate)
        .map((id) => characters[id])
        .filter(Boolean)
    : Object.values(characters);

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="subordinates-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>

        <h2>Subordinates</h2>

        <button
          onClick={() => {
            if (subordinateToggle) {
              setSubordinateToggle(!subordinateToggle);
            }
            setHaremToggle(!haremToggle);
          }}
        >
          Harem
        </button>
        <button
          onClick={() => {
            if (haremToggle) {
              setHaremToggle(!haremToggle);
            }
            setSubordinateToggle(!subordinateToggle);
          }}
        >
          Subordinate
        </button>

        <div className="subordinates-grid">
          {activeCharacters.map((character) => {
            const portraits =
              Array.isArray(character.portrait) ?
                character.portrait
              : [character.portrait];

            return (
              <img
                key={character.id}
                src={getCharacterPortrait(portraits[0])}
                alt={character.id}
                className="subordinate-portrait"
                onClick={() => setSelectedCharacterId(character.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
