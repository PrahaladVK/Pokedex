import { Text, View } from "react-native";
import type { Breeding } from "@pokedex/schema";
import { humanize } from "../lib/format";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className="text-sm text-slate-500 dark:text-slate-400">{label}</Text>
      <Text className="text-sm font-medium text-slate-800 dark:text-slate-100">{value}</Text>
    </View>
  );
}

function genderLabel(genderRate: number): string {
  if (genderRate === -1) return "Genderless";
  const female = (genderRate / 8) * 100;
  const male = 100 - female;
  return `${male}% male, ${female}% female`;
}

export function BreedingCard({ breeding }: { breeding: Breeding }) {
  return (
    <View>
      <Row label="Egg groups" value={breeding.eggGroups.map(humanize).join(", ") || "Unknown"} />
      <Row label="Gender" value={genderLabel(breeding.genderRate)} />
      {breeding.eggCycles !== undefined && <Row label="Egg cycles" value={String(breeding.eggCycles)} />}
    </View>
  );
}
