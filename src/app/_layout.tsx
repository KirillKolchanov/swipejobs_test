import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { StatusBar } from "react-native";
import { JobsProvider } from "../context/JobsContext";

export default function Layout() {
  return (
    <JobsProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={"light-content"} backgroundColor={"#000"} />
        <Header />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </JobsProvider>
  );
}
