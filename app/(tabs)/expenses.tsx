import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";

import { LineChart } from "react-native-chart-kit";
import { AuthContext } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/currencies";
import Header from "../../components/AppHeader";
import {
  getExpenses,
  addExpense,
  deleteExpense,
} from "../../api/api";
import Colors from "@/services/Colors";

type ExpenseTx = {
  id: string;
  name: string;
  amount: number;
  date: string;
};

const screenWidth = Dimensions.get("window").width;

function buildTimeline(data: ExpenseTx[], mode: string) {
  const map = new Map<string, number>();

  data.forEach((t) => {
    const d = new Date(t.date);
    let key = "";

    if (mode === "day") key = d.toISOString().substring(0, 10);
    else if (mode === "month")
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    else key = `${d.getFullYear()}`;

    map.set(key, (map.get(key) || 0) + Number(t.amount));
  });

  return Array.from(map.entries()).map(([label, value]) => ({
    label,
    value,
  }));
}

export default function Expenses() {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const currency = user?.currency || "USD";

  const today = new Date().toISOString().split("T")[0];

  const [transactions, setTransactions] = useState<ExpenseTx[]>([]);
  const [summary, setSummary] = useState(0);

  const [mode, setMode] = useState("day");

  const [form, setForm] = useState({
    name: "",
    amount: "",
    date: today,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getExpenses();

      const mapped: ExpenseTx[] = res.data.map((e: any) => ({
        id: e._id,
        name: e.category,
        amount: Number(e.amount),
        date: e.date.substring(0, 10),
      }));

      setTransactions(
        mapped.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );

      setSummary(
        mapped.reduce((sum, tx) => sum + Number(tx.amount), 0)
      );
    } catch {
      Alert.alert("Error", "Failed loading expenses");
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.amount)
      return Alert.alert("Fill all fields");

    try {
      const res = await addExpense({
        category: form.name,
        amount: form.amount,
        date: form.date,
      });

      const newTx: ExpenseTx = {
        id: res.data._id || Date.now().toString(),
        name: form.name,
        amount: Number(form.amount),
        date: form.date,
      };

      setTransactions((p) => [newTx, ...p]);
      setSummary((p) => p + Number(form.amount));

      setForm({ name: "", amount: "", date: today });
    } catch {
      Alert.alert("Error", "Add failed");
    }
  };

  const handleDelete = async (tx: ExpenseTx) => {
    try {
      await deleteExpense(tx.id);

      setTransactions((p) => p.filter((i) => i.id !== tx.id));
      setSummary((p) => p - tx.amount);
    } catch {
      Alert.alert("Error", "Delete failed");
    }
  };

  const timeline = buildTimeline(transactions, mode);

  return (
    <>
    <View style={{ height: 50 }}></View>
    <Header />
    <View style={styles.container}>
      {/* ADD EXPENSE */}
      <View style={styles.card}>
        <Text style={styles.title}>Add Expense</Text>

        <TextInput
          placeholder="Expense Name"
          placeholderTextColor= "#000"
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
          style={styles.input}
        />

        <TextInput
          placeholder="Amount"
          placeholderTextColor= "#000"
          keyboardType="numeric"
          value={form.amount}
          onChangeText={(v) => setForm({ ...form, amount: v })}
          style={styles.input}
        />

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* SUMMARY */}
      <View style={styles.card}>
        <Text style={styles.title}>Total Expense</Text>
        <Text style={styles.total}>
          {formatCurrency(summary, currency)}
        </Text>
      </View>

      {/* MODE SWITCH */}
      {/* <View style={styles.row}>
        {["day", "month", "year"].map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.modeBtn,
              mode === m && styles.modeActive,
            ]}
            onPress={() => setMode(m)}
          >
            <Text
              style={{
                color: mode === m ? "#fff" : "#333",
                fontWeight: "600",
              }}
            >
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}

      {/* CHART */}
      {/* {timeline.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.title}>Expense Trend</Text>

          <LineChart
            data={{
              labels: timeline.map((t) => t.label),
              datasets: [{ data: timeline.map((t) => t.value) }],
            }}
            width={screenWidth - 40}
            height={220}
            fromZero
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (o = 1) => `rgba(220,38,38,${o})`,
            }}
            style={{ borderRadius: 12 }}
          />
        </View>
      )} */}

      {/* TRANSACTIONS */}
      <ScrollView style={styles.card}>
        <Text style={styles.title}>Recent Expenses</Text>

        <FlatList
          scrollEnabled={false}
          data={transactions}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.txItem}>
              <View>
                <Text style={styles.txName}>{item.name}</Text>
                <Text style={{ color: "#666" }}>{item.date}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.amount}>
                  {formatCurrency(item.amount, currency)}
                </Text>

                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                >
                  <Text style={{ color: "red" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
    </>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color:"#000"
  },

  addBtn: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  addText: {
    color: "#fff",
    fontWeight: "700",
  },

  total: {
    fontSize: 22,
    fontWeight: "700",
    color: "#dc2626",
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  modeBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#eee",
    alignItems: "center",
  },

  modeActive: {
    backgroundColor: "#dc2626",
  },

  txItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  txName: {
    fontWeight: "600",
    fontSize: 15,
  },

  amount: {
    color: "#dc2626",
    fontWeight: "700",
  },
});