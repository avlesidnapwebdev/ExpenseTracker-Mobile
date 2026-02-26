import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import Header from "../../components/AppHeader";
import { LineChart } from "react-native-chart-kit";
import { AuthContext } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/currencies";

import {
  getDashboard,
  getExpenses,
  getIncomes,
  addExpense,
  addIncome,
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

const screenWidth = Dimensions.get("window").width;

function buildTimeline(data: Transaction[]) {
  const map = new Map<string, { income: number; expense: number }>();

  data.forEach((t) => {
    const key = t.date;

    if (!map.has(key)) {
      map.set(key, { income: 0, expense: 0 });
    }

    if (t.type === "income")
      map.get(key)!.income += Number(t.amount);
    else map.get(key)!.expense += Number(t.amount);
  });

  return Array.from(map.entries()).map(([label, val]) => ({
    label,
    income: val.income,
    expense: val.expense,
  }));
}

export default function Home() {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const currency = user?.currency || "USD";

  const today = new Date().toISOString().split("T")[0];

  const [summary, setSummary] = useState({
    totalIncomes: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [form, setForm] = useState({
    type: "income",
    name: "",
    amount: "",
    date: today,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dash = await getDashboard();
      setSummary(dash.data);

      const expenses = await getExpenses();
      const incomes = await getIncomes();

      const merged: Transaction[] = [
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
      Alert.alert("Error", "Failed loading dashboard");
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.amount)
      return Alert.alert("Fill all fields");

    try {
      let newTx: Transaction;

      if (form.type === "income") {
        const res = await addIncome({
          source: form.name,
          amount: form.amount,
          date: form.date,
        });

        newTx = {
          id: res.data._id,
          type: "income",
          icon: "💰",
          name: form.name,
          amount: Number(form.amount),
          date: form.date,
        };
      } else {
        const res = await addExpense({
          category: form.name,
          amount: form.amount,
          date: form.date,
        });

        newTx = {
          id: res.data._id,
          type: "expense",
          icon: "💸",
          name: form.name,
          amount: Number(form.amount),
          date: form.date,
        };
      }

      setTransactions((p) => [newTx, ...p]);

      setSummary((prev) => {
        const income =
          form.type === "income"
            ? prev.totalIncomes + Number(form.amount)
            : prev.totalIncomes;

        const expense =
          form.type === "expense"
            ? prev.totalExpenses + Number(form.amount)
            : prev.totalExpenses;

        return {
          totalIncomes: income,
          totalExpenses: expense,
          balance: income - expense,
        };
      });

      setForm({
        type: form.type,
        name: "",
        amount: "",
        date: today,
      });
    } catch {
      Alert.alert("Error", "Add failed");
    }
  };

  const handleDelete = async (tx: Transaction) => {
    try {
      if (tx.type === "income") await deleteIncome(tx.id);
      else await deleteExpense(tx.id);

      setTransactions((p) =>
        p.filter((i) => i.id !== tx.id)
      );

      loadData();
    } catch {
      Alert.alert("Error", "Delete failed");
    }
  };

  const timeline = buildTimeline(transactions);

  return (
    <>
    <View style={{ height: 50 }}></View>
      <Header />
      <View style={styles.container}>
        {/* ADD TRANSACTION */}
        <View style={styles.card}>
          <Text style={styles.title}>Add Transaction</Text>

          <View style={styles.row}>
            {["Income", "Expense"].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeBtn,
                  form.type === t && styles.typeActive,
                ]}
                onPress={() =>
                  setForm({ ...form, type: t })
                }
              >
                <Text
                  style={{
                    color: form.type === t ? "#fff" : "#333",
                  }}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#000"
            value={form.name}
            onChangeText={(v) =>
              setForm({ ...form, name: v })
            }
            style={styles.input}
          />

          <TextInput
            placeholder="Amount"
            placeholderTextColor="#000"
            keyboardType="numeric"
            value={form.amount}
            onChangeText={(v) =>
              setForm({ ...form, amount: v })
            }
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleAdd}
          >
            <Text style={styles.addText}>
              Add Transaction
            </Text>
          </TouchableOpacity>
        </View>

        {/* SUMMARY */}
        <View style={styles.row}>
          <Summary label="Income" value={summary.totalIncomes} color="#16a34a" currency={currency} />
          <Summary label="Expense" value={summary.totalExpenses} color="#dc2626" currency={currency} />
        <Summary label="Balance" value={summary.balance} color="#7C3AED" currency={currency} />
        </View>


        {/* CHART */}
        {/* {timeline.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.title}>Income vs Expense</Text>

          <LineChart
            data={{
              labels: timeline.map((t) => t.label),
              datasets: [
                { data: timeline.map((t) => t.income) },
                { data: timeline.map((t) => t.expense) },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (o = 1) =>
                `rgba(124,58,237,${o})`,
            }}
            bezier
            style={{ borderRadius: 12 }}
          />
        </View>
      )} */}

        {/* TRANSACTIONS */}
        <ScrollView style={styles.card}>
          <Text style={styles.title}>Recent Transactions</Text>

          <FlatList
            scrollEnabled={false}
            data={transactions}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={styles.txItem}>
                <View>
                  <Text style={styles.txName}>
                    {item.icon} {item.name}
                  </Text>
                  <Text style={{ color: "#666" }}>
                    {item.date}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      color:
                        item.type === "income"
                          ? "#16a34a"
                          : "#dc2626",
                      fontWeight: "700",
                    }}
                  >
                    {formatCurrency(
                      item.amount,
                      currency
                    )}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={{ color: "red" }}>
                      Delete
                    </Text>
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

/* ===== COMPONENT ===== */

function Summary({ label, value, color, currency }: any) {
  return (
    <View style={styles.summary}>
      <Text style={{ color: "#666" }}>{label}</Text>
      <Text style={{ fontWeight: "700", color }}>
        {formatCurrency(value, currency)}
      </Text>
    </View>
  );
}

/* ===== STYLES ===== */

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
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  typeBtn: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  typeActive: {
    backgroundColor: "#7C3AED",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: "#000",
  },

  addBtn: {
    backgroundColor: "#7C3AED",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  addText: {
    color: "#fff",
    fontWeight: "700",
  },

  summary: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    elevation: 2,
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
});