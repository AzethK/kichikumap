import { characters } from "../data/characters.js";
export const characterNameMap = Object.values(characters).reduce((map, c) => {
  const firstName = c.id.charAt(0).toUpperCase() + c.id.slice(1);
  map[firstName] = c.id;
  return map;
}, {});

// for testing
// console.log("Character name map:", characterNameMap);
