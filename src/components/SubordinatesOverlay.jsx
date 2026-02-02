import { characters } from "../data/characters.js";
import { harem } from "../data/charactersHarem.js";
import { charactersSubordinate } from "../data/charactersSubordinate.js";
import { getCharacterPortrait } from "../data/imageGetter.js";

export default function SubordinatesOverlay({
  onClose,
  setSelectedCharacterId,
  mode,
  setMode,
}) {
  const activeCharacters =
    mode === "Harem" ?
      Object.keys(harem)
        .map((id) => characters[id])
        .filter(Boolean)
    : mode === "Subordinates" ?
      Object.keys(charactersSubordinate)
        .map((id) => characters[id])
        .filter(Boolean)
    : Object.values(characters);

  const getCharacterRole = (characterId) => {
    const inHarem = Boolean(harem[characterId]);
    const inSubordinate = Boolean(charactersSubordinate[characterId]);

    if (inHarem && inSubordinate) return "Both";
    if (inHarem) return "Harem";
    if (inSubordinate) return "Subordinate";

    return null;
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="subordinates-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>

        <h2>
          {mode === "Harem" ?
            "Harem"
          : mode === "Subordinates" ?
            "Subordinates"
          : "Characters"}
        </h2>

        <div className="character-tabs">
          <button
            className={`tab-btn ${mode === "Subordinates" ? "active" : ""}`}
            onClick={() => {
              mode === "Subordinates" ?
                setMode("Characters")
              : setMode("Subordinates");
            }}
          >
            Subordinate
          </button>
          <button
            className={`tab-btn ${mode === "Harem" ? "active" : ""}`}
            onClick={() => {
              mode === "Harem" ? setMode("Characters") : setMode("Harem");
            }}
          >
            Harem
          </button>
        </div>

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
                onClick={() =>
                  getCharacterRole(character.id) === "Harem" ?
                    (setMode("Harem"), setSelectedCharacterId(character.id))
                  : setSelectedCharacterId(character.id)
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
