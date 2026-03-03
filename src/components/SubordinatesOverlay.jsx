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
  const [showFilters, setShowFilters] = useState(false);
  const [attackTypeFilter, setAttackTypeFilter] = useState(null);
  const [specialAttackOnly, setSpecialAttackOnly] = useState(false);
  const [specialTypeFilter, setSpecialTypeFilter] = useState(null);

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

  useEffect(() => {
    if (!specialAttackOnly) {
      setSpecialTypeFilter(null);
    }
  }, [specialAttackOnly]);

  const { setSelectedCharacterId, mode, setMode, censoredMode } =
    useAppContext();

  const getCharacterRole = (characterId) => {
    const roles = [];

    if (charactersSubordinate[characterId]) roles.push("Subordinates");
    if (harem[characterId]) roles.push("Harem");
    if (enemies[characterId]) roles.push("Enemies");

    return roles;
  };

  const handleCharacterClick = (character) => {
    const role = getCharacterRole(character.id);

    // If in a specific mode, select based on mode
    if (mode === "Harem" || mode === "Enemies" || mode === "Subordinates") {
      setSelectedCharacterId(character.id);
      return;
    }

    // If mode is "Characters" decide based on role
    if (role.includes("Subordinates")) {
      setMode("Subordinates");
    } else if (role.includes("Harem")) {
      setMode("Harem");
    } else if (role.includes("Enemies")) {
      setMode("Enemies");
    }

    setSelectedCharacterId(character.id);
  };

  const baseCharacters =
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

  const activeCharacters = baseCharacters.filter((character) => {
    const role = getCharacterRole(character.id);

    // ---------- Special Attack Filter ----------
    if (specialAttackOnly) {
      if (!role.includes("Subordinates")) return false;

      const subordinateData = charactersSubordinate[character.id];

      if (!subordinateData?.specialName) return false;

      // Special Type filter (only applies if selected)
      if (specialTypeFilter) {
        if (subordinateData?.specialType !== specialTypeFilter) {
          return false;
        }
      }
    }

    // ---------- Attack Type Filter ----------
    if (attackTypeFilter) {
      if (role.includes("Subordinates")) {
        const subordinateData = charactersSubordinate[character.id];
        if (subordinateData?.attackType !== attackTypeFilter) return false;
      } else if (role.includes("Enemies")) {
        const enemyData = enemies[character.id];
        if (enemyData?.attackType !== attackTypeFilter) return false;
      } else {
        return false;
      }
    }

    return true;
  });

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

          <button
            className={`tab-btn ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filters-row">
              <div className="filter-group">
                <label>Attack Type:</label>
                <select
                  value={attackTypeFilter || ""}
                  onChange={(e) =>
                    setAttackTypeFilter(
                      e.target.value === "" ? null : e.target.value,
                    )
                  }
                >
                  <option value="">All</option>
                  <option value="Direct">Direct</option>
                  <option value="Bow">Bow</option>
                  <option value="Magic">Magic</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Fiend Assault">Fiend Assault</option>
                  <option value="Fiend Magic">Fiend Magic</option>
                </select>
              </div>

              <div className="filter-group">
                <label>
                  <input
                    type="checkbox"
                    checked={specialAttackOnly}
                    onChange={(e) => setSpecialAttackOnly(e.target.checked)}
                  />
                  Special Attack
                </label>
              </div>
              {specialAttackOnly && (
                <div className="filter-group">
                  <label>Special Type:</label>
                  <select
                    value={specialTypeFilter || ""}
                    onChange={(e) =>
                      setSpecialTypeFilter(
                        e.target.value === "" ? null : e.target.value,
                      )
                    }
                  >
                    <option value="">All</option>
                    <option value="Snipe">Snipe</option>
                    <option value="Bomb">Bomb</option>
                    <option value="Pseudo Snipe">Pseudo Snipe</option>
                    <option value="Unique">Unique</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="subordinates-grid">
          {activeCharacters.map((character) => {
            const role = getCharacterRole(character.id);
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
                onClick={() => handleCharacterClick(character)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
