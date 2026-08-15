import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import type { Form } from "@pokedex/schema";
import { TypeBadge } from "./type-badge";
import { StatBar } from "./stat-bar";
import { humanize } from "../lib/format";

export function FormExplorer({ forms }: { forms: Form[] }) {
  const [selectedId, setSelectedId] = useState(forms.find((f) => f.isDefault)?.id ?? forms[0]?.id);
  const selected = forms.find((f) => f.id === selectedId) ?? forms[0];
  if (!selected) return null;

  const spriteUri = selected.sprites.official ?? selected.sprites.front;

  return (
    <View>
      {forms.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          {forms.map((form) => {
            const active = form.id === selected.id;
            return (
              <Pressable
                key={form.id}
                onPress={() => setSelectedId(form.id)}
                className={`mr-2 rounded-full px-3 py-1.5 ${active ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
              >
                <Text className={`text-xs font-medium ${active ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>
                  {form.category === "base" ? "Base" : form.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <View className="mb-3 items-center">
        {spriteUri ? (
          <Image source={{ uri: spriteUri }} style={{ width: 140, height: 140 }} resizeMode="contain" />
        ) : null}
        <View className="mt-2 flex-row gap-2">
          {selected.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </View>
      </View>

      <View>
        <StatBar statKey="hp" value={selected.baseStats.hp} />
        <StatBar statKey="attack" value={selected.baseStats.attack} />
        <StatBar statKey="defense" value={selected.baseStats.defense} />
        <StatBar statKey="specialAttack" value={selected.baseStats.specialAttack} />
        <StatBar statKey="specialDefense" value={selected.baseStats.specialDefense} />
        <StatBar statKey="speed" value={selected.baseStats.speed} />
      </View>

      <View className="mt-4">
        <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Abilities</Text>
        <View className="flex-row flex-wrap gap-2">
          {selected.abilities.map((a) => (
            <View key={a.slot} className="rounded-lg bg-slate-100 px-2.5 py-1 dark:bg-slate-700">
              <Text className="text-xs text-slate-700 dark:text-slate-200">
                {humanize(a.name)}
                {a.isHidden ? " (Hidden)" : ""}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
