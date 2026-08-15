import type { GenerationId, FormCategory, RegionalVariantKind } from "@pokedex/schema";

export const GEN_NUMBER_TO_ID: Record<number, GenerationId> = {
  1: "gen1",
  2: "gen2",
  3: "gen3",
  4: "gen4",
  5: "gen5",
  6: "gen6",
  7: "gen7",
  8: "gen8",
  9: "gen9",
};

/** PokeAPI's per-game `version.name` -> our version-group id (see packages/data/game-versions.json). */
export const VERSION_TO_GROUP: Record<string, string> = {
  red: "red-blue",
  blue: "red-blue",
  yellow: "yellow",
  gold: "gold-silver",
  silver: "gold-silver",
  crystal: "crystal",
  ruby: "ruby-sapphire",
  sapphire: "ruby-sapphire",
  emerald: "emerald",
  firered: "firered-leafgreen",
  leafgreen: "firered-leafgreen",
  diamond: "diamond-pearl",
  pearl: "diamond-pearl",
  platinum: "platinum",
  heartgold: "heartgold-soulsilver",
  soulsilver: "heartgold-soulsilver",
  black: "black-white",
  white: "black-white",
  "black-2": "black-2-white-2",
  "white-2": "black-2-white-2",
  x: "x-y",
  y: "x-y",
  "omega-ruby": "omega-ruby-alpha-sapphire",
  "alpha-sapphire": "omega-ruby-alpha-sapphire",
  sun: "sun-moon",
  moon: "sun-moon",
  "ultra-sun": "ultra-sun-ultra-moon",
  "ultra-moon": "ultra-sun-ultra-moon",
  "lets-go-pikachu": "lets-go-pikachu-eevee",
  "lets-go-eevee": "lets-go-pikachu-eevee",
  sword: "sword-shield",
  shield: "sword-shield",
  "brilliant-diamond": "brilliant-diamond-shining-pearl",
  "shining-pearl": "brilliant-diamond-shining-pearl",
  "legends-arceus": "legends-arceus",
  scarlet: "scarlet-violet",
  violet: "scarlet-violet",
};

// pokemon-form's version_group.name -> our version-group id. Z-A's new
// Megas are filed under "mega-dimension" on PokeAPI, folded into "legends-za"
// here. "champions" is a separate competitive title, not Z-A, so it's left
// unmapped (introducedIn just stays unset) rather than mislabeled. Same for
// DLC-only groups (Isle of Armor, Teal Mask) and side titles (Colosseum, XD).
export const VERSION_GROUP_SLUG_TO_ID: Record<string, string> = {
  "red-blue": "red-blue",
  yellow: "yellow",
  "gold-silver": "gold-silver",
  crystal: "crystal",
  "ruby-sapphire": "ruby-sapphire",
  emerald: "emerald",
  "firered-leafgreen": "firered-leafgreen",
  "diamond-pearl": "diamond-pearl",
  platinum: "platinum",
  "heartgold-soulsilver": "heartgold-soulsilver",
  "black-white": "black-white",
  "black-2-white-2": "black-2-white-2",
  "x-y": "x-y",
  "omega-ruby-alpha-sapphire": "omega-ruby-alpha-sapphire",
  "sun-moon": "sun-moon",
  "ultra-sun-ultra-moon": "ultra-sun-ultra-moon",
  "lets-go-pikachu-lets-go-eevee": "lets-go-pikachu-eevee",
  "sword-shield": "sword-shield",
  "brilliant-diamond-shining-pearl": "brilliant-diamond-shining-pearl",
  "legends-arceus": "legends-arceus",
  "scarlet-violet": "scarlet-violet",
  "legends-za": "legends-za",
  "mega-dimension": "legends-za",
};

const REGIONAL_SUFFIXES: Record<string, RegionalVariantKind> = {
  alola: "alolan",
  galar: "galarian",
  hisui: "hisuian",
  paldea: "paldean",
};

export function classifyForm(
  varietyName: string,
  isDefault: boolean,
): { category: FormCategory; regionalVariantKind?: RegionalVariantKind } {
  if (isDefault) return { category: "base" };
  if (/-mega-x$/.test(varietyName) || /-mega-y$/.test(varietyName) || /-mega$/.test(varietyName)) {
    return { category: "mega-evolution" };
  }
  if (/-gmax$/.test(varietyName)) return { category: "gigantamax" };
  if (/-primal$/.test(varietyName)) return { category: "primal-reversion" };
  for (const [suffix, kind] of Object.entries(REGIONAL_SUFFIXES)) {
    if (varietyName.endsWith(`-${suffix}`)) return { category: "regional-variant", regionalVariantKind: kind };
  }
  return { category: "other-gimmick" };
}

export function prettifyFormName(
  varietyName: string,
  speciesId: string,
  speciesName: string,
  category: FormCategory,
  regionalVariantKind: RegionalVariantKind | undefined,
): string {
  if (category === "base") return speciesName;
  if (category === "mega-evolution") {
    if (varietyName.endsWith("-mega-x")) return `Mega ${speciesName} X`;
    if (varietyName.endsWith("-mega-y")) return `Mega ${speciesName} Y`;
    return `Mega ${speciesName}`;
  }
  if (category === "gigantamax") return `Gigantamax ${speciesName}`;
  if (category === "primal-reversion") return `Primal ${speciesName}`;
  if (category === "regional-variant" && regionalVariantKind) {
    const label = regionalVariantKind[0].toUpperCase() + regionalVariantKind.slice(1);
    return `${label} ${speciesName}`;
  }
  const suffix = varietyName
    .slice(speciesId.length)
    .replace(/^-/, "")
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
  return suffix ? `${speciesName} (${suffix})` : speciesName;
}

export function humanize(slug: string): string {
  return slug
    .split("-")
    .map((word) => (word.length ? word[0]!.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export function cleanFlavorText(text: string): string {
  return text.replace(/[\n\f\r­]+/g, " ").replace(/\s+/g, " ").trim();
}
