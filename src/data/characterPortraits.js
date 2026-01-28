const portraits = import.meta.glob(
  "../assets/characterPortraits/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

const sprites = import.meta.glob(
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

export function getCharacterPortrait(filename) {
  return portraits[`../assets/characterPortraits/${filename}`]?.default;
}

export function getCharacterSprite(filename) {
  return sprites[`../assets/characterSprites/${filename}`]?.default;
}

export function getTroopSprite(filename) {
  return troopSprites[`../assets/troops/${filename}`]?.default;
}

export function getHaremSprite(filename) {
  return haremSprites[`../assets/harem/${filename}`]?.default;
}
