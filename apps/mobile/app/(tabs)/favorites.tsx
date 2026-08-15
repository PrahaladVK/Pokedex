import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { Species } from "@pokedex/schema";
import { repository } from "../../lib/repository";
import { PokemonCard } from "../../components/pokemon-card";
import { useFavorites } from "../../lib/favorites";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();

  const species = useMemo(
    () => repository.allSpecies.filter((s) => favorites.has(s.id)),
    [favorites],
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <FlatList<Species>
        data={species}
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
          <View className="items-center py-16 px-8">
            <Text className="text-center text-slate-400">
              No favorites yet. Tap the heart on any Pokémon to save it here.
            </Text>
          </View>
        }
      />
    </View>
  );
}
