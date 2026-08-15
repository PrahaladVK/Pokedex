import { Text, View } from "react-native";
import type { EvYield, Training } from "@pokedex/schema";
import { humanize } from "../lib/format";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  specialAttack: "Sp. Atk",
  specialDefense: "Sp. Def",
  speed: "Speed",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className="text-sm text-slate-500 dark:text-slate-400">{label}</Text>
      <Text className="text-sm font-medium text-slate-800 dark:text-slate-100">{value}</Text>
    </View>
  );
}

export function TrainingCard({ training, evYield }: { training: Training; evYield: EvYield }) {
  const evEntries = Object.entries(evYield).filter(([, v]) => (v ?? 0) > 0);

  return (
    <View>
      <Row label="Catch rate" value={`${training.catchRate} / 255`} />
      <Row label="Base friendship" value={String(training.baseFriendship)} />
      {training.baseExperience !== undefined && <Row label="Base experience" value={String(training.baseExperience)} />}
      <Row label="Growth rate" value={humanize(training.growthRate)} />
      <Row
        label="EV yield"
        value={evEntries.length > 0 ? evEntries.map(([k, v]) => `${v} ${STAT_LABELS[k] ?? k}`).join(", ") : "None"}
      />
    </View>
  );
}
