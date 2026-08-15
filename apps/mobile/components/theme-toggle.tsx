import { Pressable, Text, View } from "react-native";
import { useThemePreference, type ThemePreference } from "../lib/theme";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "Auto" },
];

export function ThemeToggle() {
  const { preference, choose } = useThemePreference();

  return (
    <View className="flex-row rounded-full bg-slate-100 p-1 dark:bg-slate-800">
      {OPTIONS.map((option) => {
        const active = preference === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => choose(option.value)}
            className={`rounded-full px-3 py-1 ${active ? "bg-white shadow-sm dark:bg-slate-600" : ""}`}
          >
            <Text
              className={`text-xs font-medium ${
                active ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
