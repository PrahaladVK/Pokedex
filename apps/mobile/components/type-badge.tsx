import { Text, View } from "react-native";
import type { PokemonType } from "@pokedex/schema";

// Full literal classnames (not interpolated) so Tailwind's JIT scanner picks them all up.
const TYPE_BG: Record<PokemonType, string> = {
  normal: "bg-type-normal",
  fire: "bg-type-fire",
  water: "bg-type-water",
  electric: "bg-type-electric",
  grass: "bg-type-grass",
  ice: "bg-type-ice",
  fighting: "bg-type-fighting",
  poison: "bg-type-poison",
  ground: "bg-type-ground",
  flying: "bg-type-flying",
  psychic: "bg-type-psychic",
  bug: "bg-type-bug",
  rock: "bg-type-rock",
  ghost: "bg-type-ghost",
  dragon: "bg-type-dragon",
  dark: "bg-type-dark",
  steel: "bg-type-steel",
  fairy: "bg-type-fairy",
  stellar: "bg-type-stellar",
};

export function TypeBadge({ type, size = "md" }: { type: PokemonType; size?: "sm" | "md" }) {
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  return (
    <View className={`rounded-full ${padding} ${TYPE_BG[type]}`}>
      <Text className={`${textSize} font-semibold uppercase tracking-wide text-white`}>{type}</Text>
    </View>
  );
}
