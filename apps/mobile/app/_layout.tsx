import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: isDark ? "#111827" : "#ffffff" },
            headerTintColor: isDark ? "#ffffff" : "#111827",
            contentStyle: { backgroundColor: isDark ? "#0b1120" : "#f8fafc" },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Pokédex" }} />
          <Stack.Screen name="pokemon/[id]" options={{ title: "" }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
