import { Pressable, Text } from "react-native";

export function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 rounded-full px-3 py-1.5 ${active ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
    >
      <Text className={`text-xs font-medium ${active ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>
        {label}
      </Text>
    </Pressable>
  );
}
