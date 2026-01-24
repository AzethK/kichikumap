import { useState } from "react";
import {
  getCharacterPortrait,
  getCharacterSprite,
  getTroopSprite,
} from "../data/characterPortraits";
import { characters } from "../data/characters";
import { troops } from "../data/troops";

export default function CharacterDetail({ characterId, onClose }) {
  const character = characters[characterId];
  if (!character) return null;

  const troop = troops[character.unitType];

  /* ---------------- Portraits & Sprites ---------------- */

  const portraits =
    Array.isArray(character.portrait) ?
      character.portrait
    : [character.portrait];

  const sprites =
    Array.isArray(character.sprite) ? character.sprite : [character.sprite];

  const troopSprites =
    troop && troop.sprite ?
      Array.isArray(troop.sprite) ?
        troop.sprite
      : [troop.sprite]
    : [];

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [spriteIndex, setSpriteIndex] = useState(0);
  const [troopSpriteIndex, setTroopSpriteIndex] = useState(0);

  const currentPortrait = getCharacterPortrait(portraits[portraitIndex]);
  const currentSprite = getCharacterSprite(sprites[spriteIndex]);
  const currentTroopSprite =
    troopSprites.length > 0 ?
      getTroopSprite(troopSprites[troopSpriteIndex])
    : null;

  /* ---------------- Recruitment Conditions ---------------- */

  const conditions = character.recruitCondition ?? [];
  const [conditionStep, setConditionStep] = useState(0);

  /* ---------------- Helpers ---------------- */

  const Stat = ({ label, value }) =>
    value !== undefined && value !== null ?
      <div>
        <strong>{label}:</strong> {value}
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
            <div className="character-troop-name">
              <h2>Troops: {troop ? troop.name : "None"}</h2>
            </div>
          </div>

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
            <div className="character-stats">
              <Stat label="Unit Size" value={character.unitSize} />
              <Stat label="Deploy Cost" value={character.deployCost} />
              <Stat label="HP" value={character.hp} />
              <Stat label="Strikes" value={character.strikes} />
              <Stat label="ATK" value={character.atk} />
              <Stat label="DEF" value={character.def} />
              <Stat label="MAG" value={character.magic} />

              {character.specialName && (
                <div>
                  <strong>Special:</strong> {character.specialName}
                  {character.specialType && ` (${character.specialType})`}
                </div>
              )}

              <Stat label="Replenish Rate" value={character.replenishRate} />
              <Stat label="Strategy" value={character.strategy} />

              {Array.isArray(character.sca) && (
                <div>
                  <strong>SCA:</strong>
                  <div>Offense: {character.sca[0]}</div>
                  <div>Defense: {character.sca[1]}</div>
                  <div>Dungeons: {character.sca[2]}</div>
                </div>
              )}

              {character.surge && (
                <div>
                  <strong>Surge:</strong> {character.surge}
                </div>
              )}
            </div>

            {/* Troop Stats */}
            <div className="character-troop-stats">
              {troop ?
                <>
                  <Stat label="Attack Type" value={troop.attackType} />
                  <Stat label="ATK" value={troop.atk} />
                  <Stat label="DEF" value={troop.def} />
                  <Stat label="Upgrade" value={troop.upgrade || "N/A"} />
                </>
              : <em>No troop data</em>}
            </div>
          </div>

          {/* ================= BOTTOM GRID ================= */}
          <div className="character-bottom">
            {/* Recruitment */}
            <div className="character-recruitment">
              <h3>Recruitment Conditions</h3>

              {conditions.length > 0 ?
                <>
                  <div className="character-detail-condition-box">
                    <div className="character-condition-step">
                      {conditions[conditionStep]}
                    </div>
                  </div>

                  {conditions.length > 1 && (
                    <div className="condition-nav">
                      <button
                        onClick={() =>
                          setConditionStep((s) => Math.max(0, s - 1))
                        }
                        disabled={conditionStep === 0}
                      >
                        ◀
                      </button>
                      <span>
                        {conditionStep + 1} / {conditions.length}
                      </span>
                      <button
                        onClick={() =>
                          setConditionStep((s) =>
                            Math.min(conditions.length - 1, s + 1),
                          )
                        }
                        disabled={conditionStep === conditions.length - 1}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </>
              : <p className="condition-none">Recruited automatically</p>}
            </div>

            {/* Troop Sprites */}
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
                        disabled={troopSpriteIndex === troopSprites.length - 1}
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </>
              : <em>No troop sprites</em>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
