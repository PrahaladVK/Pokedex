import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4 dark:bg-slate-900">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</Text>
      {children}
    </View>
  );
}
