import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? "#111827" : "#ffffff" },
        headerTintColor: isDark ? "#ffffff" : "#111827",
        tabBarStyle: { backgroundColor: isDark ? "#111827" : "#ffffff" },
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: isDark ? "#94a3b8" : "#64748b",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Pokédex", tabBarLabel: "Dex" }} />
      <Tabs.Screen name="favorites" options={{ title: "Favorites", tabBarLabel: "Favorites" }} />
      <Tabs.Screen name="compare" options={{ title: "Compare", tabBarLabel: "Compare" }} />
    </Tabs>
  );
}
