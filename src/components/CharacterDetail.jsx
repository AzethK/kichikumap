const ROLE_CONFIG = [
  { value: "Subordinates", label: "Subordinate" },
  { value: "Harem", label: "Harem" },
  { value: "Enemies", label: "Enemy" },
];
import { useState, useEffect } from "react";
import {
  getCharacterPortrait,
  getCharacterSprite,
  getTroopSprite,
  getHaremSprite,
} from "../data/imageGetter";
import { characters } from "../data/characters";
import { harem } from "../data/charactersHarem";
import { charactersSubordinate } from "../data/charactersSubordinate";
import { enemies } from "../data/charactersEnemy";
import { troops } from "../data/troops";
import ConditionText from "../util/ConditionText";
import { useAppContext } from "../App";

export default function CharacterDetail({ characterId, onClose }) {
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

  const [variantIndex, setVariantIndex] = useState(0);

  const { setSelectedCharacterId, mode, setMode, censoredMode } =
    useAppContext();

  const getCharacterRole = (characterId) => {
    const roles = [];

    if (charactersSubordinate[characterId]) roles.push("Subordinates");
    if (harem[characterId]) roles.push("Harem");
    if (enemies[characterId]) roles.push("Enemies");

    return roles;
  };

  const role = getCharacterRole(characterId);

  const [troopSpriteIndex, setTroopSpriteIndex] = useState(0);
  const haremCharacter = mode === "Harem" ? harem[characterId] : null;
  const character = characters[characterId];
  const characterSubordinate = charactersSubordinate[characterId];
  const enemy = enemies[characterId];
  var troop = null;
  var troopSprites = null;
  var currentTroopSprite = null;

  if (!character) return null;

  if (mode != "Harem") {
    const rawTroop =
      mode === "Subordinates" ? characterSubordinate.unitType : enemy.unitType;

    troop =
      Array.isArray(rawTroop) ?
        troops[rawTroop[variantIndex]]
      : troops[rawTroop];

    troopSprites =
      mode === "Subordinates" ?
        Array.isArray(characterSubordinate.battleSprite) ?
          characterSubordinate.battleSprite
        : [characterSubordinate.battleSprite]
      : Array.isArray(enemy.battleSprite) ? enemy.battleSprite
      : [enemy.battleSprite];

    currentTroopSprite =
      troopSprites.length > 0 ?
        getTroopSprite(troopSprites[troopSpriteIndex])
      : null;
  }

  /* ---------------- Portraits & Sprites ---------------- */

  const censoredP = character?.censorType?.includes("Portrait") && censoredMode;
  const censoredH = character?.censorType?.includes("Harem") && censoredMode;

  const portraits =
    censoredP ?
      Array.isArray(character.censoredPortrait) ?
        character.censoredPortrait
      : [character.censoredPortrait]
    : Array.isArray(character.portrait) ? character.portrait
    : [character.portrait];

  const sprites =
    Array.isArray(character.sprite) ? character.sprite : [character.sprite];

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [spriteIndex, setSpriteIndex] = useState(0);

  const currentPortrait = getCharacterPortrait(portraits[portraitIndex]);
  const currentSprite =
    mode === "Harem" ?
      censoredH ? getHaremSprite(character.censoredSprite)
      : getHaremSprite(sprites[spriteIndex])
    : getCharacterSprite(sprites[spriteIndex]);

  /* ---------------- Stats ---------------- */
  const rawUnitSize =
    mode != "Harem" ?
      mode === "Subordinates" ?
        characterSubordinate.unitSize
      : enemy.unitSize
    : null;

  const unitSize =
    Array.isArray(rawUnitSize) ? rawUnitSize[variantIndex] : rawUnitSize;

  const rawReplenishRate =
    mode != "Harem" ?
      mode === "Subordinates" ?
        characterSubordinate.replenishRate
      : enemy.replenishRate
    : null;

  const replenishRate =
    Array.isArray(rawReplenishRate) ?
      rawReplenishRate[variantIndex]
    : rawReplenishRate;

  const rawAtk =
    mode != "Harem" ?
      mode === "Subordinates" ?
        characterSubordinate.atk
      : enemy.atk
    : null;

  const atk = Array.isArray(rawAtk) ? rawAtk[variantIndex] : rawAtk;

  const rawDef =
    mode != "Harem" ?
      mode === "Subordinates" ?
        characterSubordinate.def
      : enemy.def
    : null;

  const def = Array.isArray(rawDef) ? rawDef[variantIndex] : rawDef;

  const rawMagic =
    mode != "Harem" ?
      mode === "Subordinates" ?
        characterSubordinate.mag
      : enemy.mag
    : null;

  const mag = Array.isArray(rawMagic) ? rawMagic[variantIndex] : rawMagic;

  const rawStrikes =
    mode != "Harem" ?
      mode === "Subordinates" ?
        characterSubordinate.strikes
      : enemy.strikes
    : null;

  const strikes =
    Array.isArray(rawStrikes) ? rawStrikes[variantIndex] : rawStrikes;

  const rawHp =
    mode != "Harem" ?
      mode === "Subordinates" ?
        characterSubordinate.hp
      : enemy.hp
    : null;

  const hp = Array.isArray(rawHp) ? rawHp[variantIndex] : rawHp;

  const rawStrategy =
    mode != "Harem" ?
      mode === "Subordinates" ?
        characterSubordinate.strategy
      : enemy.strategy
    : null;

  const strategy =
    Array.isArray(rawStrategy) ? rawStrategy[variantIndex] : rawStrategy;

  const rawOmniAtk = mode != "Enemies" ? null : enemy.omniAtk;

  const omniAtk =
    Array.isArray(rawOmniAtk) ? rawOmniAtk[variantIndex] : rawOmniAtk;

  const rawOmniDef = mode != "Enemies" ? null : enemy.omniDef;

  const omniDef =
    Array.isArray(rawOmniDef) ? rawOmniDef[variantIndex] : rawOmniDef;

  const stats = {
    exp: mode == "Harem" ? haremCharacter.exp : null,
    attackType:
      mode != "Harem" ?
        mode === "Subordinates" ?
          characterSubordinate.attackType
        : enemy.attackType
      : null,
    unitSize,
    deployCost:
      mode != "Harem" ?
        mode === "Subordinates" ?
          characterSubordinate.deployCost
        : enemy.deployCost
      : null,
    replenishRate,
    omniAtk,
    omniDef,
    atk,
    def,
    strikes,
    hp,
    strategy,
    mag,
    sca:
      mode != "Harem" ?
        mode === "Subordinates" ?
          characterSubordinate.sca
        : enemy.sca
      : null,

    variants: {
      unitSize:
        mode === "Subordinates" && characterSubordinate.variants?.unitSize ?
          characterSubordinate.variants.unitSize
        : mode === "Enemies" && enemy.variants?.unitSize ?
          enemy.variants.unitSize
        : null,

      replenishRate:
        (
          mode === "Subordinates" &&
          characterSubordinate.variants?.replenishRate
        ) ?
          characterSubordinate.variants.replenishRate
        : mode === "Enemies" && enemy.variants?.replenishRate ?
          enemy.variants.replenishRate
        : null,
      hp:
        mode === "Subordinates" && characterSubordinate.variants?.hp ?
          characterSubordinate.variants.hp
        : mode === "Enemies" && enemy.variants?.hp ? enemy.variants.hp
        : null,
      atk:
        mode === "Subordinates" && characterSubordinate.variants?.atk ?
          characterSubordinate.variants.atk
        : mode === "Enemies" && enemy.variants?.atk ? enemy.variants.atk
        : null,
      def:
        mode === "Subordinates" && characterSubordinate.variants?.def ?
          characterSubordinate.variants.def
        : mode === "Enemies" && enemy.variants?.def ? enemy.variants.def
        : null,
      troopAtk:
        mode === "Subordinates" && characterSubordinate.variants?.troopAtk ?
          characterSubordinate.variants.troopAtk
        : mode === "Enemies" && enemy.variants?.troopAtk ?
          enemy.variants.troopAtk
        : null,
      troopDef:
        mode === "Subordinates" && characterSubordinate.variants?.troopDef ?
          characterSubordinate.variants.troopDef
        : mode === "Enemies" && enemy.variants?.troopDef ?
          enemy.variants.troopDef
        : null,
      strikes:
        mode === "Subordinates" && characterSubordinate.variants?.strikes ?
          characterSubordinate.variants.strikes
        : mode === "Enemies" && enemy.variants?.strikes ? enemy.variants.strikes
        : null,
      mag:
        mode === "Subordinates" && characterSubordinate.variants?.mag ?
          characterSubordinate.variants.mag
        : mode === "Enemies" && enemy.variants?.mag ? enemy.variants.mag
        : null,
      strategy:
        mode === "Subordinates" && characterSubordinate.variants?.strategy ?
          characterSubordinate.variants.strategy
        : mode === "Enemies" && enemy.variants?.strategy ?
          enemy.variants.strategy
        : null,
      sca:
        mode === "Subordinates" && characterSubordinate.variants?.sca ?
          characterSubordinate.variants.sca
        : mode === "Enemies" && enemy.variants?.sca ? enemy.variants.sca
        : null,
    },
  };

  /* ---------------- Recruitment Conditions ---------------- */

  const conditions =
    mode === "Harem" && haremCharacter.recruitmentOverride ?
      (haremCharacter.recruitmentOverride ?? [])
    : (character.recruitCondition ?? []);

  /* ---------------- Helpers ---------------- */

  const Stat = ({ label, value }) =>
    value !== undefined && value !== null ?
      <div>
        <strong>{label}:</strong>{" "}
        {Array.isArray(value) ? value.join(", ") : value}
        {label === "Strategy" ? "%" : ""}
      </div>
    : null;

  /* ---------------- Render ---------------- */

  return (
    <div
      className="overlay-backdrop"
      onClick={() => {
        setSelectedCharacterId(null);
      }}
    >
      <div
        className="subordinates-overlay"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `scale(${fitScale})`,
          transformOrigin: "center",
        }}
      >
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>

        <div className="character-detail-layout">
          {/* ================= HEADER ================= */}
          <div className="character-header">
            <div className="character-detail-name">
              <h2>
                {Array.isArray(character.name) ?
                  character.name[variantIndex]
                : character.name}
              </h2>
              {Array.isArray(character.name) && (
                <div className="variant-nav">
                  <span>Variant</span>
                  <button
                    onClick={() => setVariantIndex((i) => Math.max(0, i - 1))}
                    disabled={variantIndex === 0}
                  >
                    ◀
                  </button>
                  <span>
                    {variantIndex + 1} / {character.name.length}
                  </span>
                  <button
                    onClick={() =>
                      setVariantIndex((i) =>
                        Math.min(character.name.length - 1, i + 1),
                      )
                    }
                    disabled={variantIndex === character.name.length - 1}
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>

            {mode != "Harem" && (
              <div className="character-troop-name">
                <h2>Commander Stats</h2>
              </div>
            )}

            {mode != "Harem" && (
              <div className="character-troop-name">
                <h2>
                  Troops:{" "}
                  {troop ?
                    Array.isArray(troop) ?
                      troop[variantIndex].name
                    : troop.name
                  : "None"}
                </h2>
              </div>
            )}
          </div>

          <div className="character-tabs">
            {ROLE_CONFIG.map(({ value, label }) => {
              const hasRole = role.includes(value);
              const isActive = mode === value;

              let variant = "disabled";
              if (hasRole && !isActive) variant = "available";
              if (isActive) variant = "active";

              return (
                <button
                  key={value}
                  className={`tab-btn ${variant}`}
                  disabled={!hasRole || isActive}
                  onClick={() => {
                    (setTroopSpriteIndex(0), setMode(value));
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ================= TOP GRID ================= */}
          <div className="character-main">
            {/* Portrait */}
            <div className="character-portrait">
              <img src={currentPortrait} alt={character.name} loading="lazy" />

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
              <img src={currentSprite} alt="" loading="lazy" />

              {sprites.length > 1 && (
                <div className="portrait-nav">
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
            {mode != "Harem" ?
              <div className="character-stats">
                <Stat label="Attack Type" value={stats.attackType} />
                <Stat
                  label="Unit Size"
                  value={
                    stats.variants.unitSize ?
                      <>
                        {stats.unitSize} → {stats.variants.unitSize}
                      </>
                    : stats.unitSize
                  }
                />
                <Stat label="Deploy Cost" value={stats.deployCost} />
                <Stat
                  label="HP"
                  value={
                    stats.variants.hp ?
                      <>
                        {stats.hp} → {stats.variants.hp}
                      </>
                    : stats.hp
                  }
                />
                <Stat
                  label="Strikes"
                  value={
                    stats.variants.strikes ?
                      <>
                        {stats.strikes} → {stats.variants.strikes}
                      </>
                    : stats.strikes
                  }
                />
                <Stat
                  label="ATK"
                  value={
                    stats.variants.atk ?
                      <>
                        {stats.atk} → {stats.variants.atk}
                      </>
                    : stats.atk
                  }
                />
                <Stat
                  label="DEF"
                  value={
                    stats.variants.def ?
                      <>
                        {stats.def} → {stats.variants.def}
                      </>
                    : stats.def
                  }
                />
                <Stat
                  label="MAG"
                  value={
                    stats.variants.mag ?
                      <>
                        {stats.mag} → {stats.variants.mag}
                      </>
                    : stats.mag
                  }
                />
                <Stat
                  label="Strategy"
                  value={
                    stats.variants.strategy ?
                      <>
                        {stats.strategy} → {stats.variants.strategy}
                      </>
                    : stats.strategy
                  }
                />
                <Stat
                  label="Replenish Rate"
                  value={
                    stats.replenishRate !== undefined ?
                      <>
                        {stats.replenishRate} → {stats.variants.replenishRate}
                      </>
                    : "N/A"
                  }
                />
                <Stat label="Omni ATK" value={stats.omniAtk} />
                <Stat label="Omni DEF" value={stats.omniDef} />

                {mode === "Subordinates" &&
                  characterSubordinate.specialName && (
                    <div className="wide">
                      <strong>Special:</strong>{" "}
                      {characterSubordinate.specialName}
                      {characterSubordinate.specialType &&
                        ` (${characterSubordinate.specialType})`}
                    </div>
                  )}

                {mode === "Subordinates" &&
                  Array.isArray(characterSubordinate.sca) && (
                    <div className="wide">
                      <strong>SCA:</strong>
                      <div>
                        Offense:{" "}
                        {stats.variants.sca ?
                          <>
                            {stats.sca[0]} → {stats.variants.sca[0]}
                          </>
                        : characterSubordinate.sca[0]}
                      </div>
                      <div>
                        Defense:{" "}
                        {stats.variants.sca ?
                          <>
                            {stats.sca[1]} → {stats.variants.sca[1]}
                          </>
                        : characterSubordinate.sca[1]}
                      </div>
                      <div>
                        Dungeons:{" "}
                        {stats.variants.sca ?
                          <>
                            {stats.sca[2]} → {stats.variants.sca[2]}
                          </>
                        : characterSubordinate.sca[2]}
                      </div>
                    </div>
                  )}
                {mode === "Subordinates" && characterSubordinate.surge && (
                  <div>
                    <strong>Surge:</strong>{" "}
                    <span
                      className="character-link"
                      onClick={() => {
                        setTroopSpriteIndex(0);
                        setSelectedCharacterId(
                          characters[characterSubordinate.surge].id,
                        );
                      }}
                    >
                      {characters[characterSubordinate.surge].name}
                    </span>
                  </div>
                )}
                {((mode === "Subordinates" && characterSubordinate.variants) ||
                  (mode === "Enemies" && enemy.variants)) && (
                  <div className="wide">
                    Stats change:{" "}
                    <ConditionText
                      text={
                        mode === "Subordinates" ?
                          characterSubordinate.variants.label
                        : enemy.variants.label
                      }
                    />
                  </div>
                )}
              </div>
            : <div className="character-stats">
                <Stat label="EXP Gain" value={stats.exp} />
              </div>
            }

            {/* Troop Stats */}
            {mode != "Harem" && (
              <div className="character-troop-stats">
                {troop ?
                  <>
                    <Stat
                      label="ATK"
                      value={
                        stats.variants.troopAtk !== null ?
                          <>
                            {troop.atk} → {stats.variants.troopAtk}
                          </>
                        : troop.atk
                      }
                    />
                    <Stat
                      label="DEF"
                      value={
                        stats.variants.troopDef !== null ?
                          <>
                            {troop.def} → {stats.variants.troopDef}
                          </>
                        : troop.def
                      }
                    />
                    <Stat label="Upgrade" value={troop.upgrade || "N/A"} />
                  </>
                : <em>No troop data</em>}
              </div>
            )}
          </div>

          {/* ================= BOTTOM GRID ================= */}
          <div className="character-bottom">
            {/* Recruitment Conditions*/}
            <div className="character-recruitment">
              <h2>Recruitment Conditions</h2>

              {(mode !== "Enemies" ||
                role.includes("Harem") ||
                role.includes("Subordinates")) &&
                (conditions.length > 0 ?
                  <div className="character-detail-condition-box">
                    <div className="character-condition-step">
                      {conditions.map((c, i) => (
                        <div key={i}>
                          •{" "}
                          <ConditionText
                            text={c}
                            onCharacterClick={() => {
                              setTroopSpriteIndex(0);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                : <div className="character-condition-step">
                    • Recruited automatically
                  </div>)}
              {!role.includes("Harem") && !role.includes("Subordinates") && (
                <div className="character-condition-step">
                  • Character is not recruitable
                </div>
              )}
            </div>

            {/* Troop Sprites */}

            {mode != "Harem" && (
              <div className="character-troop-sprites">
                {currentTroopSprite ?
                  <>
                    <img src={currentTroopSprite} alt="" loading="lazy" />

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
