import { useState } from "react";
import { getCharacterPortrait } from "../data/imageGetter";

export default function CharacterCard({ character, setChar }) {
  //Support multiple portraits per character
  const portraits =
    Array.isArray(character.portrait) ?
      character.portrait
    : [character.portrait];

  const currentPortrait = getCharacterPortrait(portraits[0]);
  //

  const conditions = character.recruitCondition ?? [];
  const [step, setStep] = useState(0);

  const hasConditions = conditions.length > 0;

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(conditions.length - 1, s + 1));

  return (
    <div className="character-card">
      <div className="subordinate-portrait">
        <img src={currentPortrait} alt={character.name} onClick={setChar} />
      </div>

      <div className="character-info">
        <div className="character-name">
          {" "}
          <strong>{character.name}</strong>
        </div>

        <>
          <div className="condition-box">
            {hasConditions ?
              <div className="condition-step">{conditions[step]}</div>
            : <p className="condition-step">Recruited automatically</p>}
          </div>

          {conditions.length > 1 && (
            <div className="condition-nav">
              <button onClick={prev} disabled={step === 0}>
                ◀
              </button>

              <span>
                {step + 1} / {conditions.length}
              </span>

              <button onClick={next} disabled={step === conditions.length - 1}>
                ▶
              </button>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
