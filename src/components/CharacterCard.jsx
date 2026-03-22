import { useState } from "react";
import { getCharacterPortrait } from "../data/imageGetter";
import { harem } from "../data/charactersHarem";
import { charactersSubordinate } from "../data/charactersSubordinate";
import { enemies } from "../data/charactersEnemy";
import { useAppContext } from "../App";
import ConditionText from "../util/ConditionText";

export default function CharacterCard({ character }) {
  const { setMode, setSelectedCharacterId, censoredMode } = useAppContext();
  //Support multiple portraits per character

  const censored = character?.censorType?.includes("Portrait") && censoredMode;
  const portraits =
    censored ?
      Array.isArray(character.censoredPortrait) ?
        character.censoredPortrait
      : [character.censoredPortrait]
    : Array.isArray(character.portrait) ? character.portrait
    : [character.portrait];

  const currentPortrait = getCharacterPortrait(portraits[0]);

  // Sets mode depending on the roles the character has
  const getCharacterRole = (characterId) => {
    const inHarem = Boolean(harem[characterId]);
    const inSubordinate = Boolean(charactersSubordinate[characterId]);
    const inEnemy = Boolean(enemies[characterId]);

    if (inHarem && inSubordinate) {
      setMode("Subordinates");
    } else if (inSubordinate) {
      setMode("Subordinates");
    } else if (inEnemy) {
      setMode("Enemies");
    } else {
      setMode("Harem");
    }

    return null;
  };

  // Gets a role array of the character
  const getRole = (characterId) => {
    const roles = [];

    if (charactersSubordinate[characterId]) roles.push("Subordinates");
    if (harem[characterId]) roles.push("Harem");
    if (enemies[characterId]) roles.push("Enemies");

    return roles;
  };

  const role = getRole(character.id);

  const conditions = character.recruitCondition ?? [];
  const [step, setStep] = useState(0);

  const hasConditions = conditions.length > 0;

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(conditions.length - 1, s + 1));

  return (
    <div className="character-card">
      <div className="subordinate-portrait">
        <img
          src={currentPortrait}
          alt={character.name}
          onClick={() => {
            getCharacterRole(character.id);
            setSelectedCharacterId(character.id);
          }}
        />
      </div>

      <div>
        <div className="character-name">
          {" "}
          <strong>
            {Array.isArray(character.name) ?
              character.genericName
            : character.name}
          </strong>
        </div>
        {/* Only displays condition box if character can be recruited */}
        {(role.includes("Harem") || role.includes("Subordinates")) && (
          <>
            <div className="condition-box">
              {hasConditions ?
                <div className="condition-step">
                  {<ConditionText text={conditions[step]} />}
                </div>
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

                <button
                  onClick={next}
                  disabled={step === conditions.length - 1}
                >
                  ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
