import { Text, View } from "react-native";
import { getTypeDefenses } from "@pokedex/core";
import type { PokemonType } from "@pokedex/schema";
import { humanize } from "../lib/format";

function formatMultiplier(value: number): string {
  if (value === 0) return "0×";
  if (value === 0.25) return "¼×";
  if (value === 0.5) return "½×";
  return `${value}×`;
}

function multiplierClasses(value: number): string {
  if (value === 0) return "bg-slate-300 dark:bg-slate-600";
  if (value >= 2) return "bg-rose-500";
  if (value <= 0.5) return "bg-emerald-500";
  return "bg-slate-400";
}

export function TypeDefensesGrid({ types }: { types: PokemonType[] }) {
  const defenses = getTypeDefenses(types);
  const entries = Object.entries(defenses) as [PokemonType, number][];

  if (entries.length === 0) {
    return <Text className="text-sm text-slate-400">No notable weaknesses or resistances.</Text>;
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {entries
        .sort((a, b) => b[1] - a[1])
        .map(([type, multiplier]) => (
          <View key={type} className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${multiplierClasses(multiplier)}`}>
            <Text className="text-xs font-semibold text-white">{humanize(type)}</Text>
            <Text className="text-xs font-bold text-white">{formatMultiplier(multiplier)}</Text>
          </View>
        ))}
    </View>
  );
}
