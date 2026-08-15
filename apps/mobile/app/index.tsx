import { useMemo, useState } from "react";
import { FlatList, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { createSearchIndex } from "@pokedex/core";
import { GENERATION_IDS, POKEMON_TYPES, type GenerationId, type PokemonType, type Species } from "@pokedex/schema";
import { repository } from "../lib/repository";
import { PokemonCard } from "../components/pokemon-card";
import { FilterChip } from "../components/filter-chip";
import { humanize } from "../lib/format";

const GENERATION_LABELS: Record<GenerationId, string> = {
  gen1: "Gen 1",
  gen2: "Gen 2",
  gen3: "Gen 3",
  gen4: "Gen 4",
  gen5: "Gen 5",
  gen6: "Gen 6",
  gen7: "Gen 7",
  gen8: "Gen 8",
  gen9: "Gen 9",
  "legends-za": "Legends Z-A",
};

const FILTERABLE_TYPES = POKEMON_TYPES.filter((t) => t !== "stellar");

export default function DexListScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [generationId, setGenerationId] = useState<GenerationId | undefined>(undefined);
  const [type, setType] = useState<PokemonType | undefined>(undefined);

  const filtered = useMemo(
    () => repository.listSpecies({ generationId, type }),
    [generationId, type],
  );
  const searchIndex = useMemo(() => createSearchIndex(filtered), [filtered]);
  const results = useMemo(
    () => (query.trim() ? searchIndex.search(query) : filtered),
    [query, filtered, searchIndex],
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="border-b border-slate-200 bg-white px-4 pb-3 pt-2 dark:border-slate-800 dark:bg-slate-900">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or number"
          placeholderTextColor="#94a3b8"
          className="mb-3 rounded-xl bg-slate-100 px-4 py-2.5 text-base text-slate-900 dark:bg-slate-800 dark:text-white"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          <FilterChip label="All Gens" active={!generationId} onPress={() => setGenerationId(undefined)} />
          {GENERATION_IDS.map((id) => (
            <FilterChip
              key={id}
              label={GENERATION_LABELS[id]}
              active={generationId === id}
              onPress={() => setGenerationId(generationId === id ? undefined : id)}
            />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterChip label="All Types" active={!type} onPress={() => setType(undefined)} />
          {FILTERABLE_TYPES.map((t) => (
            <FilterChip
              key={t}
              label={humanize(t)}
              active={type === t}
              onPress={() => setType(type === t ? undefined : t)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList<Species>
        data={results}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <PokemonCard
            species={item}
            spriteUrl={repository.getForm(item.defaultFormId)?.sprites.official ?? repository.getForm(item.defaultFormId)?.sprites.front}
            onPress={() => router.push(`/pokemon/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="text-slate-400">No Pokémon match your filters yet.</Text>
          </View>
        }
        initialNumToRender={16}
        windowSize={9}
      />
    </View>
  );
}
