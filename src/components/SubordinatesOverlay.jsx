import { characters } from "../data/characters.js";
import { useAppContext } from "../App.jsx";
import { harem } from "../data/charactersHarem.js";
import { charactersSubordinate } from "../data/charactersSubordinate.js";
import { enemies } from "../data/charactersEnemy.js";
import { getCharacterPortrait } from "../data/imageGetter.js";

export default function SubordinatesOverlay({ onClose }) {
  const { setSelectedCharacterId, mode, setMode } = useAppContext();
  const activeCharacters =
    mode === "Harem" ?
      Object.keys(harem)
        .map((id) => characters[id])
        .filter(Boolean)
    : mode === "Subordinates" ?
      Object.keys(charactersSubordinate)
        .map((id) => characters[id])
        .filter(Boolean)
    : mode === "Enemies" ?
      Object.keys(enemies)
        .map((id) => characters[id])
        .filter(Boolean)
    : Object.values(characters);

  const getCharacterRole = (characterId) => {
    const inHarem = Boolean(harem[characterId]);
    const inSubordinate = Boolean(charactersSubordinate[characterId]);
    const inEnemy = Boolean(enemies[characterId]);

    if (inHarem && inSubordinate) return "Both";
    if (inSubordinate) return "Subordinate";
    if (inEnemy) return "Enemy";
    if (inHarem) return "Harem";

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
          : mode === "Enemies" ?
            "Enemies"
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
            Subordinates
          </button>
          <button
            className={`tab-btn ${mode === "Harem" ? "active" : ""}`}
            onClick={() => {
              mode === "Harem" ? setMode("Characters") : setMode("Harem");
            }}
          >
            Harem
          </button>
          <button
            className={`tab-btn ${mode === "Enemies" ? "active" : ""}`}
            onClick={() => {
              mode === "Enemies" ? setMode("Characters") : setMode("Enemies");
            }}
          >
            Enemies
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
                  : mode === "Enemies" ? setSelectedCharacterId(character.id)
                  : (setMode("Subordinates"),
                    setSelectedCharacterId(character.id))
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
