const portraits = import.meta.glob(
  "../assets/characterPortraits/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

const characterSprites = import.meta.glob(
  "../assets/characterSprites/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

const troopSprites = import.meta.glob(
  "../assets/troops/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

const haremSprites = import.meta.glob("../assets/harem/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

const itemSprites = import.meta.glob("../assets/items/*.{png,jpg,jpeg,webp}", {
  eager: true,
});

export function getCharacterPortrait(filename) {
  return portraits[`../assets/characterPortraits/${filename}`]?.default;
}

export function getCharacterSprite(filename) {
  return characterSprites[`../assets/characterSprites/${filename}`]?.default;
}

export function getTroopSprite(filename) {
  return troopSprites[`../assets/troops/${filename}`]?.default;
}

export function getHaremSprite(filename) {
  return haremSprites[`../assets/harem/${filename}`]?.default;
}

export function getItemSprite(filename) {
  return itemSprites[`../assets/items/${filename}`]?.default;
}
