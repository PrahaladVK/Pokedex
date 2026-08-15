import { Pressable, Text } from "react-native";
import { useFavorites } from "../lib/favorites";

export function FavoriteButton({ speciesId, size = "md" }: { speciesId: string; size?: "sm" | "md" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(speciesId);
  const fontSize = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation();
        toggleFavorite(speciesId);
      }}
      hitSlop={8}
      className="px-2"
    >
      <Text className={`${fontSize} ${active ? "text-rose-500" : "text-slate-300 dark:text-slate-600"}`}>
        {active ? "♥" : "♡"}
      </Text>
    </Pressable>
  );
}
