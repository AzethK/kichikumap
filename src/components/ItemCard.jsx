import { getItemSprite } from "../data/imageGetter";
import { useAppContext } from "../App";

export default function ItemCard({ item }) {
  const { setSelectedItemId } = useAppContext();
  const sprite = item.sprite;

  const currentSprite = getItemSprite(sprite);

  return (
    <div className="character-card">
      <div className="item-sprite">
        <img
          src={currentSprite}
          alt={item.name}
          onClick={() => {
            setSelectedItemId(item.id);
          }}
        />
      </div>
    </div>
  );
}
