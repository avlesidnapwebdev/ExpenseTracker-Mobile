import { View, Text, Image, StyleSheet } from "react-native";

export default function AppHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Expense Tracker</Text>
      </View>

      <Image
        source={require("../assets/images/logo.png")}
        style={styles.avatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 65,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#7C3AED",
  },
});