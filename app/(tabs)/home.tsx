import { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Animated,
  RefreshControl,
  StatusBar,
} from "react-native";

import { Swipeable } from "react-native-gesture-handler";
import ScreenContainer from "../../components/ScreenContainer";
import Header from "../../components/AppHeader";
import FloatingAddButton from "../../components/FloatingAddButton";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/currencies";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getDashboard,
  getExpenses,
  getIncomes,
  deleteExpense,
  deleteIncome,
} from "../../api/api";

type Transaction = {
  id: string;
  type: "income" | "expense";
  name: string;
  amount: number;
  date: string;
  icon: string;
};

export default function Home() {
  const auth = useContext(AuthContext);
  const currency = auth?.user?.currency || "USD";
  const insets = useSafeAreaInsets();
  const [summary, setSummary] = useState({
    totalIncomes: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const tabBarHeight = useBottomTabBarHeight();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadData = async () => {
    try {
      const dash = await getDashboard();
      setSummary(dash.data);

      const expenses = await getExpenses();
      const incomes = await getIncomes();

      const merged = [
        ...expenses.data.map((e: any) => ({
          id: e._id,
          type: "expense",
          icon: "💸",
          name: e.category,
          amount: Number(e.amount),
          date: e.date.substring(0, 10),
        })),
        ...incomes.data.map((i: any) => ({
          id: i._id,
          type: "income",
          icon: "💰",
          name: i.source,
          amount: Number(i.amount),
          date: i.date.substring(0, 10),
        })),
      ];

      setTransactions(
        merged.sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        )
      );
    } catch {
      Alert.alert("Error", "Load failed");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDelete = async (tx: Transaction) => {
    if (tx.type === "income") await deleteIncome(tx.id);
    else await deleteExpense(tx.id);
    loadData();
  };

  const renderRight = (item: Transaction) => (
    <View style={styles.delete}>
      <Text
        onPress={() => handleDelete(item)}
        style={{ color: "#fff", fontWeight: "700" }}
      >
        Delete
      </Text>
    </View>
  );

  return (
    <ScreenContainer>
      <Header />
      <View style={[styles.container, { paddingBottom: tabBarHeight + insets.bottom + 20 }]}>

        <StatusBar barStyle="dark-content" />

        {/* SUMMARY CARDS */}
        <Summary label="Income" value={summary.totalIncomes} color="#16a34a" currency={currency} />
        <Summary label="Expense" value={summary.totalExpenses} color="#dc2626" currency={currency} />
        <Summary label="Balance" value={summary.balance} color="#7C3AED" currency={currency} />

        {/* TITLE */}
        <View style={[styles.titleRow, { marginTop: 18, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
          <Text style={styles.title}>Recent Transactions</Text>
          <Text style={styles.hint}>← Swipe right to delete</Text>
        </View>

        {/* ⭐ COMPACT BOX */}
        <View style={styles.compactBox}>
          <FlatList
            data={transactions}
            keyExtractor={(i) => i.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <Animated.View style={{ opacity: fadeAnim }}>
                <Swipeable renderRightActions={() => renderRight(item)}>
                  <View style={styles.tx}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>
                        {item.icon} {item.name}
                      </Text>
                      <Text style={{ color: "#666", fontSize: 12 }}>
                        {item.date}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color:
                          item.type === "income"
                            ? "#16a34a"
                            : "#dc2626",
                        fontWeight: "700",
                      }}
                    >
                      {formatCurrency(item.amount, currency)}
                    </Text>
                  </View>
                </Swipeable>
              </Animated.View>
            )}
          />
        </View>

        <FloatingAddButton pageType="home" defaultType="income" onAdded={loadData} />
      </View>
    </ScreenContainer>
  );
}

/* SUMMARY CARD */
function Summary({ label, value, color, currency }: any) {
  return (
    <View style={[styles.summary, { backgroundColor: color }]}>
      <Text style={{ color: "#fff" }}>{label}</Text>
      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>
        {formatCurrency(value, currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 16,
    paddingBottom: 0,
  },

  summary: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },

  titleRow: {
    marginTop: 8,
    marginBottom: 6,
    marginRight: 15,
    marginLeft: 15,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
  },

  hint: {
    fontSize: 11,
    color: "#777",
  },

  /* ⭐ COMPACT HEIGHT (shows ~5 items) */
  compactBox: {
    height: 320,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    elevation: 3,
  },

  tx: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontWeight: "600",
    fontSize: 14,
  },

  delete: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderRadius: 10,
    marginBottom: 8,
  },
});