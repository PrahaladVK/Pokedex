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

export function StatBar({ statKey, value }: { statKey: string; value: number }) {
  const pct = Math.min(100, Math.round((value / MAX_STAT) * 100));
  const barColor = pct > 66 ? "bg-emerald-500" : pct > 33 ? "bg-amber-500" : "bg-rose-500";
  return (
    <View className="flex-row items-center gap-3 py-1">
      <Text className="w-20 text-xs font-medium text-slate-500 dark:text-slate-400">
        {STAT_LABELS[statKey] ?? statKey}
      </Text>
      <Text className="w-8 text-right text-xs font-semibold text-slate-700 dark:text-slate-200">{value}</Text>
      <View className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <View className={`h-2 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </View>
    </View>
  );
}
