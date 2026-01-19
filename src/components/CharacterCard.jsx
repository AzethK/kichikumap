import { useState } from "react";
import { getCharacterPortrait } from "../data/characterPortraits";

export default function CharacterCard({ character }) {
  //Support multiple portraits per character
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
  //

  const conditions = character.recruitCondition ?? [];
  const [step, setStep] = useState(0);

  const hasConditions = conditions.length > 0;

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(conditions.length - 1, s + 1));

  return (
    <div className="character-card">
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

      <div className="character-info">
        <div className="character-name">
          {" "}
          <strong>{character.name}</strong>
        </div>

        {hasConditions ?
          <>
            <div className="condition-box">
              <div className="condition-step">{conditions[step]}</div>
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
      </div>
    </div>
  );
}
