import { useState } from "react";
import {
  getCharacterPortrait,
  getCharacterSprite,
  getTroopSprite,
  getHaremSprite,
} from "../data/imageGetter";
import { characters } from "../data/characters";
import { harem } from "../data/charactersHarem";
import { charactersSubordinate } from "../data/charactersSubordinate";
import { troops } from "../data/troops";
import ConditionText from "../util/ConditionText";
import { useAppContext } from "../App";

export default function CharacterDetail({ characterId, onClose }) {
  const { setSelectedCharacterId, mode, setMode } = useAppContext();

  const getCharacterRole = (characterId) => {
    const inHarem = Boolean(harem[characterId]);
    const inSubordinate = Boolean(charactersSubordinate[characterId]);

    if (inHarem && inSubordinate) return "Both";
    if (inHarem) return "Harem";
    if (inSubordinate) return "Subordinate";

    return null;
  };

  const role = getCharacterRole(characterId);

  const [troopSpriteIndex, setTroopSpriteIndex] = useState(0);
  const haremCharacter = mode === "Harem" ? harem[characterId] : null;
  const character = characters[characterId];
  const characterSubordinate = charactersSubordinate[characterId];
  var troop = null;
  var troopSprites = null;
  var currentTroopSprite = null;

  if (!character) return null;

  if (mode != "Harem") {
    troop = troops[characterSubordinate.unitType];

    troopSprites =
      characterSubordinate.battleSprite ?
        Array.isArray(characterSubordinate.battleSprite) ?
          characterSubordinate.battleSprite
        : [characterSubordinate.battleSprite]
      : [];

    currentTroopSprite =
      troopSprites.length > 0 ?
        getTroopSprite(troopSprites[troopSpriteIndex])
      : null;
  }

  /* ---------------- Portraits & Sprites ---------------- */

  const portraits =
    Array.isArray(character.portrait) ?
      character.portrait
    : [character.portrait];

  const sprites =
    Array.isArray(character.sprite) ? character.sprite : [character.sprite];

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [spriteIndex, setSpriteIndex] = useState(0);

  const currentPortrait = getCharacterPortrait(portraits[portraitIndex]);
  const currentSprite =
    mode === "Harem" ?
      getHaremSprite(sprites[spriteIndex])
    : getCharacterSprite(sprites[spriteIndex]);

  /* ---------------- Recruitment Conditions ---------------- */

  const conditions =
    mode === "Harem" && haremCharacter.recruitmentOverride ?
      (haremCharacter.recruitmentOverride ?? [])
    : (character.recruitCondition ?? []);

  /* ---------------- Helpers ---------------- */

  const Stat = ({ label, value }) =>
    value !== undefined && value !== null ?
      <div>
        <strong>{label}:</strong> {value}
        {label === "Strategy" ? "%" : ""}
      </div>
    : null;

  /* ---------------- Render ---------------- */

  return (
    <div className="overlay-backdrop">
      <div className="subordinates-overlay">
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>

        <div className="character-detail-layout">
          {/* ================= HEADER ================= */}
          <div className="character-header">
            <div className="character-detail-name">
              <h2>{character.name}</h2>
            </div>

            {mode != "Harem" && (
              <div className="character-troop-name">
                <h2>Commander Stats</h2>
              </div>
            )}

            {mode != "Harem" && (
              <div className="character-troop-name">
                <h2>Troops: {troop ? troop.name : "None"}</h2>
              </div>
            )}
          </div>
          {role === "Both" && (
            <div className="character-tabs">
              <button
                className={`tab-btn`}
                onClick={() => {
                  mode === "Harem" ? setMode("Subordinates") : setMode("Harem");
                }}
              >
                {mode === "Harem" ? "Subordinate" : "Harem"}
              </button>
            </div>
          )}

          {/* ================= TOP GRID ================= */}
          <div className="character-main">
            {/* Portrait */}
            <div className="character-portrait">
              <img src={currentPortrait} alt={character.name} />

              {portraits.length > 1 && (
                <div className="portrait-nav">
                  <button
                    onClick={() => setPortraitIndex((i) => Math.max(0, i - 1))}
                    disabled={portraitIndex === 0}
                  >
                    ◀
                  </button>
                  <span>
                    {portraitIndex + 1} / {portraits.length}
                  </span>
                  <button
                    onClick={() =>
                      setPortraitIndex((i) =>
                        Math.min(portraits.length - 1, i + 1),
                      )
                    }
                    disabled={portraitIndex === portraits.length - 1}
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>

            {/* Character Sprite */}
            <div className="character-sprite">
              <img src={currentSprite} alt="" />

              {sprites.length > 1 && (
                <div className="sprite-nav">
                  <button
                    onClick={() => setSpriteIndex((i) => Math.max(0, i - 1))}
                    disabled={spriteIndex === 0}
                  >
                    ◀
                  </button>
                  <span>
                    {spriteIndex + 1} / {sprites.length}
                  </span>
                  <button
                    onClick={() =>
                      setSpriteIndex((i) => Math.min(sprites.length - 1, i + 1))
                    }
                    disabled={spriteIndex === sprites.length - 1}
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>

            {/* Commander Stats */}
            {mode != "Harem" && (
              <div className="character-stats">
                <Stat label="Unit Size" value={characterSubordinate.unitSize} />
                <Stat
                  label="Deploy Cost"
                  value={characterSubordinate.deployCost}
                />
                <Stat label="HP" value={characterSubordinate.hp} />
                <Stat label="Strikes" value={characterSubordinate.strikes} />
                <Stat
                  label="ATK"
                  value={
                    characterSubordinate.variants ?
                      characterSubordinate.variants.atk ?
                        `${characterSubordinate.atk}→${characterSubordinate.variants.atk}`
                      : characterSubordinate.atk
                    : characterSubordinate.atk
                  }
                />
                <Stat label="DEF" value={characterSubordinate.def} />
                <Stat label="MAG" value={characterSubordinate.magic} />
                <Stat label="Strategy" value={characterSubordinate.strategy} />
                <Stat
                  label="Replenish Rate"
                  value={characterSubordinate.replenishRate}
                />
                {characterSubordinate.specialName && (
                  <div className="wide">
                    <strong>Special:</strong> {characterSubordinate.specialName}
                    {characterSubordinate.specialType &&
                      ` (${characterSubordinate.specialType})`}
                  </div>
                )}
                {Array.isArray(characterSubordinate.sca) && (
                  <div className="wide">
                    <strong>SCA:</strong>
                    <div>Offense: {characterSubordinate.sca[0]}</div>
                    <div>Defense: {characterSubordinate.sca[1]}</div>
                    <div>Dungeons: {characterSubordinate.sca[2]}</div>
                  </div>
                )}
                {characterSubordinate.surge && (
                  <div>
                    <strong>Surge:</strong>{" "}
                    <span
                      className="character-link"
                      onClick={() =>
                        setSelectedCharacterId(
                          characters[characterSubordinate.surge].id,
                        )
                      }
                    >
                      {characters[characterSubordinate.surge].name}
                    </span>
                  </div>
                )}
                {characterSubordinate.variants && (
                  <div className="wide">
                    Stats change: {characterSubordinate.variants.label}
                  </div>
                )}
              </div>
            )}

            {/* Troop Stats */}
            {mode != "Harem" && (
              <div className="character-troop-stats">
                {troop ?
                  <>
                    <Stat label="Attack Type" value={troop.attackType} />
                    <Stat
                      label="ATK"
                      value={
                        characterSubordinate.variants ?
                          characterSubordinate.variants.troopAtk ?
                            `${troop.atk}→${characterSubordinate.variants.troopAtk}`
                          : troop.atk
                        : troop.atk
                      }
                    />
                    <Stat label="DEF" value={troop.def} />
                    <Stat label="Upgrade" value={troop.upgrade || "N/A"} />
                  </>
                : <em>No troop data</em>}
              </div>
            )}
          </div>

          {/* ================= BOTTOM GRID ================= */}
          <div className="character-bottom">
            {/* Recruitment */}
            <div className="character-recruitment">
              <h2>Recruitment Conditions</h2>

              {conditions.length > 0 ?
                <div className="character-detail-condition-box">
                  <div className="character-condition-step">
                    {conditions.map((c, i) => (
                      <div key={i}>
                        • <ConditionText text={c} />
                      </div>
                    ))}
                  </div>
                </div>
              : <div className="character-condition-step">
                  • Recruited automatically
                </div>
              }
            </div>

            {/* Troop Sprites */}
            {/* CHANGE THIS TO THE THREE SPRITES EACH UNIT HAS */}
            {mode != "Harem" && (
              <div className="character-troop-sprites">
                {currentTroopSprite ?
                  <>
                    <img src={currentTroopSprite} alt="" />

                    {troopSprites.length > 1 && (
                      <div className="sprite-nav">
                        <button
                          onClick={() =>
                            setTroopSpriteIndex((i) => Math.max(0, i - 1))
                          }
                          disabled={troopSpriteIndex === 0}
                        >
                          ◀
                        </button>
                        <span>
                          {troopSpriteIndex + 1} / {troopSprites.length}
                        </span>
                        <button
                          onClick={() =>
                            setTroopSpriteIndex((i) =>
                              Math.min(troopSprites.length - 1, i + 1),
                            )
                          }
                          disabled={
                            troopSpriteIndex === troopSprites.length - 1
                          }
                        >
                          ▶
                        </button>
                      </div>
                    )}
                  </>
                : <em>No troop sprites</em>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
