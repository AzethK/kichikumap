import { useState } from "react";
import { getCharacterPortrait } from "../data/characterPortraits";

export default function CharacterCard({ character }) {
  const conditions = character.recruitCondition ?? [];
  const [step, setStep] = useState(0);

  const hasConditions = conditions.length > 0;

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(conditions.length - 1, s + 1));

  return (
    <div className="character-card">
      <img
        src={getCharacterPortrait(character.portrait)}
        alt={character.name}
      />

      <div className="character-info">
        <div className="character-name">
          {" "}
          <strong>{character.name}</strong>
          <p>
            <strong>Recruitment</strong>
          </p>
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
