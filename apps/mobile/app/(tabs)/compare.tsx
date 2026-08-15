import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import type { Species } from "@pokedex/schema";
import { PokemonPicker } from "../../components/pokemon-picker";
import { TypeBadge } from "../../components/type-badge";
import { CompareStatRow } from "../../components/compare-stat-row";

const STAT_KEYS = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"] as const;

export default function CompareScreen() {
  const [speciesA, setSpeciesA] = useState<Species | undefined>(undefined);
  const [speciesB, setSpeciesB] = useState<Species | undefined>(undefined);

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerStyle={{ padding: 16 }}>
      <View className="mb-4 flex-row gap-3">
        <PokemonPicker label="Pokémon A" selected={speciesA} onSelect={setSpeciesA} />
        <PokemonPicker label="Pokémon B" selected={speciesB} onSelect={setSpeciesB} />
      </View>

      {speciesA && speciesB ? (
        <View className="rounded-2xl bg-white p-4 dark:bg-slate-900">
          <View className="mb-4 flex-row justify-between">
            <View className="flex-row flex-wrap gap-1.5">
              {speciesA.types.map((t) => (
                <TypeBadge key={t} type={t} size="sm" />
              ))}
            </View>
            <View className="flex-row flex-wrap justify-end gap-1.5">
              {speciesB.types.map((t) => (
                <TypeBadge key={t} type={t} size="sm" />
              ))}
            </View>
          </View>

          {STAT_KEYS.map((key) => (
            <CompareStatRow key={key} statKey={key} valueA={speciesA.baseStats[key]} valueB={speciesB.baseStats[key]} />
          ))}

          <View className="mt-2 flex-row items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-700">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Total: {STAT_KEYS.reduce((sum, k) => sum + speciesA.baseStats[k], 0)}
            </Text>
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Total: {STAT_KEYS.reduce((sum, k) => sum + speciesB.baseStats[k], 0)}
            </Text>
          </View>
        </View>
      ) : (
        <View className="items-center py-16 px-8">
          <Text className="text-center text-slate-400">Pick two Pokémon to compare their types and base stats.</Text>
        </View>
      )}
    </ScrollView>
  );
}
