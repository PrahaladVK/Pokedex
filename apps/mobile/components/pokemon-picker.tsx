import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { createSearchIndex } from "@pokedex/core";
import type { Species } from "@pokedex/schema";
import { repository } from "../lib/repository";
import { formatDexNumber } from "../lib/format";

const searchIndex = createSearchIndex(repository.allSpecies);

export function PokemonPicker({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: Species | undefined;
  onSelect: (species: Species) => void;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query.trim() ? searchIndex.search(query).slice(0, 6) : []), [query]);

  return (
    <View className="flex-1">
      <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</Text>
      {selected ? (
        <Pressable
          onPress={() => {
            setQuery("");
            onSelect(undefined as unknown as Species);
          }}
          className="rounded-xl bg-indigo-600 px-3 py-2.5"
        >
          <Text className="text-center font-medium text-white">
            {formatDexNumber(selected.nationalDexNumber)} {selected.name}
          </Text>
        </Pressable>
      ) : (
        <>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Pokémon"
            placeholderTextColor="#94a3b8"
            className="rounded-xl bg-slate-100 px-3 py-2.5 text-slate-900 dark:bg-slate-800 dark:text-white"
          />
          {results.length > 0 && (
            <ScrollView className="mt-1 max-h-48 rounded-xl bg-white shadow-sm dark:bg-slate-800">
              {results.map((s, i) => (
                <Pressable
                  key={s.id}
                  onPress={() => {
                    onSelect(s);
                    setQuery("");
                  }}
                  className={`px-3 py-2 ${i < results.length - 1 ? "border-b border-slate-100 dark:border-slate-700" : ""}`}
                >
                  <Text className="text-slate-800 dark:text-slate-100">
                    {formatDexNumber(s.nationalDexNumber)} {s.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}
