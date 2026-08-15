import { Image, Pressable, Text, View } from "react-native";
import type { Species } from "@pokedex/schema";
import { TypeBadge } from "./type-badge";

export function PokemonCard({
  species,
  spriteUrl,
  onPress,
}: {
  species: Species;
  spriteUrl: string | undefined;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl bg-white p-3 shadow-sm active:opacity-70 dark:bg-slate-800"
    >
      <View className="mr-3 h-16 w-16 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
        {spriteUrl ? (
          <Image source={{ uri: spriteUrl }} style={{ width: 56, height: 56 }} resizeMode="contain" />
        ) : (
          <Text className="text-slate-400">?</Text>
        )}
      </View>
      <View className="flex-1">
        <Text className="text-xs font-medium text-slate-400 dark:text-slate-500">
          #{String(species.nationalDexNumber).padStart(4, "0")}
        </Text>
        <Text className="text-base font-semibold text-slate-900 dark:text-white">{species.name}</Text>
        <View className="mt-1 flex-row gap-1.5">
          {species.types.map((type) => (
            <TypeBadge key={type} type={type} size="sm" />
          ))}
        </View>
      </View>
    </Pressable>
  );
}
