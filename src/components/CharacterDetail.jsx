import { useState } from "react";
import {
  getCharacterPortrait,
  getCharacterSprite,
} from "../data/characterPortraits";
import { characters } from "../data/characters";
import { troops } from "../data/troops";

export default function CharacterDetail({ characterId, onClose }) {
  const character = characters[characterId];
  const troop = troops[character.unitType];

  if (!character) return null;

  const portraits =
    Array.isArray(character.portrait) ?
      character.portrait
    : [character.portrait];

  const [portraitIndex, setPortraitIndex] = useState(0);

  const hasMultiplePortraits = portraits.length > 1;

  const prevPortrait = () => setPortraitIndex((i) => Math.max(0, i - 1));

  const nextPortrait = () =>
    setPortraitIndex((i) => Math.min(portraits.length - 1, i + 1));

  const currentPortrait = getCharacterPortrait(portraits[portraitIndex]);

  const conditions = character.recruitCondition ?? [];
  const [step, setStep] = useState(0);

  const hasConditions = conditions.length > 0;

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(conditions.length - 1, s + 1));

  return (
    <div className="overlay-backdrop">
      <div className="subordinates-overlay">
        {/* Close */}
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>

        <div className="character-detail-layout">
          {/* Header */}
          <div className="character-header">
            <div className="character-detail-name">
              <h2>{character.name}</h2>
            </div>
            <div className="character-troop-name">
              <h2>Troops: {troop ? troop.name : "None"}</h2>
            </div>
          </div>
          <div className="character-main">
            <div className="character-portrait">
              <img src={currentPortrait} alt={character.name} />

              {hasMultiplePortraits && (
                <div className="portrait-nav">
                  <button onClick={prevPortrait} disabled={portraitIndex === 0}>
                    ◀
                  </button>

                  <span>
                    {portraitIndex + 1} / {portraits.length}
                  </span>

                  <button
                    onClick={nextPortrait}
                    disabled={portraitIndex === portraits.length - 1}
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>

            <div className="character-stats">{/* EMPTY FOR NOW */}</div>

            <div className="character-troop-image">{/* EMPTY FOR NOW */}</div>

            <div className="character-troop-stats">
              {troop && (
                <div>
                  <div>
                    <strong>Unit:</strong> {troop.name}
                  </div>
                  <div>
                    <strong>Attack Type:</strong> {troop.attackType}
                  </div>
                  <div>
                    <strong>ATK:</strong> {troop.atk}
                  </div>
                  <div>
                    <strong>DEF:</strong> {troop.def}
                  </div>
                  <div>
                    <strong>Upgrade:</strong>{" "}
                    {!troop.upgrade ? "N/A" : troop.upgrade}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2>
            <strong>Recruitment Conditions</strong>
          </h2>
          {hasConditions ?
            <>
              <div className="character-detail-condition-box">
                <div className="character-condition-step">
                  {conditions[step]}
                </div>
              </div>

              {conditions.length > 1 && (
                <div className="condition-nav">
                  <button onClick={prev} disabled={step === 0}>
                    ◀
                  </button>

                  <span>
                    {step + 1} / {conditions.length}
                  </span>

                  <button
                    onClick={next}
                    disabled={step === conditions.length - 1}
                  >
                    ▶
                  </button>
                </div>
              )}
            </>
          : <p className="condition-none">Recruited automatically</p>}
          <img src={currentSprite}></img>
        </div>
      </div>
    </div>
  );
}
