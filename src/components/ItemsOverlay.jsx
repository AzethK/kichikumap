import { items } from "../data/items";
import { useAppContext } from "../App.jsx";
import { getItemSprite } from "../data/imageGetter.js";
import { useEffect, useState } from "react";

export default function ItemsOverlay({ onClose }) {
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

  const [searchQuery, setSearchQuery] = useState("");

  let filteredItems = Object.values(items);

  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();

    filteredItems = filteredItems.filter((item) => {
      if (typeof item.name === "string") {
        return item.name.toLowerCase().includes(query);
      }

      return false;
    });
  }

  const activeItems = filteredItems;
  const { setSelectedItemId } = useAppContext();

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="subordinates-overlay"
        style={{
          transform: `scale(${fitScale})`,
          transformOrigin: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>
        <h2>Items</h2>
        <div className="character-search">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

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
