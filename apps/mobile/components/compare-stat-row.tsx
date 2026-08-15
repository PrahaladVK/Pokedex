import { Text, View } from "react-native";

const MAX_STAT = 255;

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  specialAttack: "Sp. Atk",
  specialDefense: "Sp. Def",
  speed: "Speed",
};

function Bar({ value, highlight, align }: { value: number; highlight: boolean; align: "left" | "right" }) {
  const pct = Math.min(100, Math.round((value / MAX_STAT) * 100));
  return (
    <View className={`h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${align === "left" ? "flex-row-reverse" : ""}`}>
      <View
        className={`h-2 rounded-full ${highlight ? "bg-indigo-600" : "bg-slate-400 dark:bg-slate-500"}`}
        style={{ width: `${pct}%` }}
      />
    </View>
  );
}

export function CompareStatRow({ statKey, valueA, valueB }: { statKey: string; valueA: number; valueB: number }) {
  return (
    <View className="flex-row items-center gap-2 py-1.5">
      <Text className="w-8 text-right text-xs font-semibold text-slate-700 dark:text-slate-200">{valueA}</Text>
      <Bar value={valueA} highlight={valueA >= valueB} align="left" />
      <Text className="w-16 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
        {STAT_LABELS[statKey] ?? statKey}
      </Text>
      <Bar value={valueB} highlight={valueB >= valueA} align="right" />
      <Text className="w-8 text-xs font-semibold text-slate-700 dark:text-slate-200">{valueB}</Text>
    </View>
  );
}
