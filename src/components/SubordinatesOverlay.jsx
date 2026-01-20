import { characters } from "../data/characters.js";
import { getCharacterPortrait } from "../data/characterPortraits.js";

export default function SubordinatesOverlay({
  onClose,
  setSelectedCharacterId,
}) {
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

        <div className="subordinates-grid">
          {Object.values(characters).map((character) => {
            const portraits =
              Array.isArray(character.portrait) ?
                character.portrait
              : [character.portrait];

            return (
              <img
                key={character.id}
                src={getCharacterPortrait(portraits[0])}
                alt=""
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
