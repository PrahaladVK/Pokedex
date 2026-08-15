import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { buildEvolutionChain } from "@pokedex/core";
import { repository } from "../../lib/repository";
import { FormExplorer } from "../../components/form-explorer";
import { VersionFlavorText } from "../../components/version-flavor-text";
import { EvolutionChainView } from "../../components/evolution-chain-view";
import { formatDexNumber } from "../../lib/format";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const species = id ? repository.getSpecies(id) : undefined;
  const forms = species ? repository.getFormsForSpecies(species.id) : [];
  const evolutionChain = useMemo(
    () => (species ? buildEvolutionChain(species.id, repository.getSpecies) : undefined),
    [species],
  );

  if (!species) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <Text className="text-slate-400">Pokémon not found.</Text>
      </View>
    );
  }

  const showEvolution = evolutionChain && (evolutionChain.children.length > 0 || evolutionChain.viaConditions.length > 0);

  return (
    <>
      <Stack.Screen options={{ title: species.name }} />
      <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerStyle={{ padding: 16 }}>
        <Text className="text-sm font-medium text-slate-400">{formatDexNumber(species.nationalDexNumber)}</Text>
        <Text className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">{species.name}</Text>
        {species.genus ? <Text className="mb-4 text-sm text-slate-500 dark:text-slate-400">{species.genus}</Text> : null}

        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
          <FormExplorer forms={forms} />
        </View>

        {(species.heightM || species.weightKg) && (
          <View className="mb-4 flex-row gap-3">
            {species.heightM ? (
              <View className="flex-1 rounded-2xl bg-white p-3 dark:bg-slate-900">
                <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Height</Text>
                <Text className="text-base font-medium text-slate-800 dark:text-slate-100">{species.heightM.toFixed(1)} m</Text>
              </View>
            ) : null}
            {species.weightKg ? (
              <View className="flex-1 rounded-2xl bg-white p-3 dark:bg-slate-900">
                <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">Weight</Text>
                <Text className="text-base font-medium text-slate-800 dark:text-slate-100">{species.weightKg.toFixed(1)} kg</Text>
              </View>
            ) : null}
          </View>
        )}

        {Object.keys(species.flavorText).length > 0 && (
          <View className="mb-4 rounded-2xl bg-white p-4 dark:bg-slate-900">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Pokédex Entry</Text>
            <VersionFlavorText flavorText={species.flavorText} versionGroups={repository.versionRegistry.versionGroups} />
          </View>
        )}

        {showEvolution && evolutionChain ? (
          <View className="mb-4 rounded-2xl bg-white p-4 dark:bg-slate-900">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Evolution</Text>
            <EvolutionChainView node={evolutionChain} currentSpeciesId={species.id} />
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}
