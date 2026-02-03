import { items } from "../data/items";
import { useAppContext } from "../App.jsx";
import { getItemSprite } from "../data/imageGetter.js";

export default function ItemsOverlay({ onClose }) {
  const activeItems = Object.values(items);
  const { setSelectedItemId } = useAppContext();

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="subordinates-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>

        <h2>Items</h2>

        <div className="item-grid">
          {activeItems.map((item) => {
            const sprite = item.sprite;

            return (
              <img
                key={item.id}
                src={getItemSprite(sprite)}
                alt={item.id}
                className="item-sprite"
                onClick={() => setSelectedItemId(item.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
