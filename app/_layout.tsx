import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Header } from "../components/Header";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Header userName="John" userLastName="Doe" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
