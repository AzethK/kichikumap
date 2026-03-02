import { characters } from "../data/characters.js";
import { useAppContext } from "../App.jsx";
import { harem } from "../data/charactersHarem.js";
import { charactersSubordinate } from "../data/charactersSubordinate.js";
import { enemies } from "../data/charactersEnemy.js";
import { getCharacterPortrait } from "../data/imageGetter.js";
import { useEffect, useState } from "react";

export default function SubordinatesOverlay({ onClose }) {
  const BASE_WIDTH = 1300;
  const BASE_HEIGHT = 800;

  const [fitScale, setFitScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const widthScale = (window.innerWidth * 0.9) / BASE_WIDTH;
      const heightScale = (window.innerHeight * 0.9) / BASE_HEIGHT;

      const scale = Math.min(1, widthScale, heightScale);

      setFitScale(scale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const { setSelectedCharacterId, mode, setMode, censoredMode } =
    useAppContext();
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
        style={{
          transform: `scale(${fitScale})`,
          transformOrigin: "center",
        }}
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
            const censored =
              character?.censorType?.includes("Portrait") && censoredMode;
            const portraits =
              censored ?
                Array.isArray(character.censoredPortrait) ?
                  character.censoredPortrait
                : [character.censoredPortrait]
              : Array.isArray(character.portrait) ? character.portrait
              : [character.portrait];

            return (
              <img
                key={character.id}
                src={getCharacterPortrait(portraits[0])}
                alt={character.id}
                className="subordinate-portrait"
                onClick={() =>
                  (
                    getCharacterRole(character.id) === "Harem" ||
                    mode === "Harem"
                  ) ?
                    (setMode("Harem"), setSelectedCharacterId(character.id))
                  : (
                    getCharacterRole(character.id) === "Enemy" ||
                    mode === "Enemies"
                  ) ?
                    (setMode("Enemies"), setSelectedCharacterId(character.id))
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
