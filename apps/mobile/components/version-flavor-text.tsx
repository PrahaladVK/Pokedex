import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { VersionGroup } from "@pokedex/schema";

export function VersionFlavorText({
  flavorText,
  versionGroups,
}: {
  flavorText: Record<string, string>;
  versionGroups: VersionGroup[];
}) {
  const available = versionGroups.filter((vg) => flavorText[vg.id]);
  const [selectedId, setSelectedId] = useState(available[0]?.id);
  if (available.length === 0) return null;
  const text = selectedId ? flavorText[selectedId] : undefined;

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
        {available.map((vg) => {
          const active = vg.id === selectedId;
          return (
            <Pressable
              key={vg.id}
              onPress={() => setSelectedId(vg.id)}
              className={`mr-2 rounded-full px-3 py-1.5 ${active ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <Text className={`text-xs font-medium ${active ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>
                {vg.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {text ? <Text className="text-sm leading-5 text-slate-600 dark:text-slate-300">{text}</Text> : null}
    </View>
  );
}
