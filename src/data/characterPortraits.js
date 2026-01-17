const portraits = import.meta.glob(
  "../assets/characters/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

export function getCharacterPortrait(filename) {
  return portraits[`../assets/characters/${filename}`]?.default;
}
