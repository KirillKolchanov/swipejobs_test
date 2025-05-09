import { View } from "react-native";
import Jobs from "../components/Jobs";

export default function Home() {
  return (
    <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
      <Jobs />
    </View>
  );
}
