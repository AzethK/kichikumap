import { useState } from "react";
import { getItemSprite } from "../data/imageGetter";
import { items } from "../data/items";
import { characters } from "../data/characters";
import { harem } from "../data/charactersHarem";
import ConditionText from "../util/ConditionText";

export default function CharacterDetail({
  itemId,
  onClose,
  setSelectedCharacterId,
  setMode,
}) {
  const item = items[itemId];
  if (!item) return null;
  const sprite = getItemSprite(item.sprite);

  const conditions = item.acquisition ?? [];

  /* ---------------- Render ---------------- */

  return (
    <div className="overlay-backdrop">
      <div className="item-overlay">
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>

        <div className="character-detail-layout">
          {/* ================= HEADER ================= */}
          <div className="character-header">
            <div className="character-detail-name">
              <h2>{item.name}</h2>
            </div>
          </div>

          {/* ================= TOP GRID ================= */}
          <div className="item-main">
            {/* Character Sprite */}
            <div className="character-sprite">
              <img src={sprite} alt="" />
            </div>
            <div className="item-effect">
              <span>{item.effect}</span>
            </div>
          </div>

          {/* ================= BOTTOM GRID ================= */}
          <div className="character-bottom">
            {/* Recruitment */}
            <div className="character-recruitment">
              <h2>Acquisition Conditions</h2>

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
                  • Acquired automatically
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
