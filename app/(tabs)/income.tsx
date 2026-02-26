import { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    ScrollView,
    Dimensions,
} from "react-native";

import { BarChart } from "react-native-chart-kit";
import Header from "../../components/AppHeader";
import { AuthContext } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/currencies";

import {
    getIncomes,
    addIncome,
    deleteIncome,
} from "../../api/api";

type IncomeTx = {
    id: string;
    source: string;
    amount: number;
    date: string;
};

const screenWidth = Dimensions.get("window").width;

function buildTimeline(
    data: IncomeTx[],
    mode: string
): { label: string; value: number }[] {
    const map = new Map();

    data.forEach((t) => {
        const date = new Date(t.date);
        let key = "";

        if (mode === "day") key = t.date;
        else if (mode === "month")
            key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        else key = `${date.getFullYear()}`;

        if (!map.has(key)) {
            map.set(key, 0);
        }

        map.set(key, map.get(key) + Number(t.amount));
    });

    return Array.from(map.entries()).map(([label, value]) => ({
        label,
        value,
    }));
}

export default function Income() {
    const auth = useContext(AuthContext);
    if (!auth) return null;

    const { user } = auth;
    const currency = user?.currency || "USD";

    const today = new Date().toISOString().split("T")[0];

    const [transactions, setTransactions] = useState<IncomeTx[]>([]);
    const [summary, setSummary] = useState(0);

    const [form, setForm] = useState({
        source: "",
        amount: "",
        date: today,
    });

    const [mode, setMode] = useState("day");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getIncomes();

            const mapped = res.data.map((i: any) => ({
                id: i._id,
                source: i.source,
                amount: Number(i.amount),
                date: i.date.substring(0, 10),
            }));

            setTransactions(mapped);

            setSummary(
                mapped.reduce((sum: number, t: IncomeTx) => sum + t.amount, 0)
            );
        } catch {
            Alert.alert("Error", "Failed loading incomes");
        }
    };

    const handleAdd = async () => {
        if (!form.source || !form.amount) {
            return Alert.alert("Fill all fields");
        }

        try {
            const res = await addIncome({
                source: form.source,
                amount: Number(form.amount),
                date: form.date,
            });

            const newTx = {
                id: res.data._id,
                source: form.source,
                amount: Number(form.amount),
                date: form.date,
            };

            setTransactions((prev) => [newTx, ...prev]);
            setSummary((prev) => prev + Number(form.amount));

            setForm({
                source: "",
                amount: "",
                date: today,
            });
        } catch {
            Alert.alert("Error", "Add income failed");
        }
    };

    const handleDelete = async (tx: IncomeTx) => {
        try {
            await deleteIncome(tx.id);

            setTransactions((prev) =>
                prev.filter((i) => i.id !== tx.id)
            );

            setSummary((prev) => prev - tx.amount);
        } catch {
            Alert.alert("Error", "Delete failed");
        }
    };
    type ChartItem = {
        label: string;
        value: number;
    };
    const timeline: ChartItem[] = buildTimeline(transactions, mode);

    return (
        <>
        <View style={{ height: 50 }}></View>
        <Header />
        <View style={styles.container}>
            {/* ADD INCOME */}
            <View style={styles.card}>
                <Text style={styles.title}>Add Income</Text>

                <TextInput
                    placeholder="Income Source"
                    placeholderTextColor="#000"
                    value={form.source}
                    onChangeText={(v) => setForm({ ...form, source: v })}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Amount"
                    placeholderTextColor="#000"
                    keyboardType="numeric"
                    value={form.amount}
                    onChangeText={(v) => setForm({ ...form, amount: v })}
                    style={styles.input}
                />

                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                    <Text style={styles.addText}>Add Income</Text>
                </TouchableOpacity>
            </View>

            {/* SUMMARY */}
            <View style={styles.card}>
                <Text style={styles.totalLabel}>Total Income</Text>
                <Text style={styles.totalValue}>
                    {formatCurrency(summary, currency)}
                </Text>
            </View>

            {/* MODE BUTTONS */}
            {/* <View style={styles.modeRow}>
                {["day", "month", "year"].map((m) => (
                    <TouchableOpacity
                        key={m}
                        style={[
                            styles.modeBtn,
                            mode === m && styles.modeActive,
                        ]}
                        onPress={() => setMode(m)}
                    >
                        <Text style={{ color: mode === m ? "#fff" : "#333" }}>
                            {m}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View> */}

            {/* CHART */}
            {/* {timeline.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.title}>Income Overview</Text>

                    <BarChart
                        data={{
                            labels: timeline.map((t) => String(t.label)),
                            datasets: [
                                {
                                    data: timeline.map((t) => Number(t.value)),
                                },
                            ],
                        }}
                        width={screenWidth - 40}
                        height={220}
                        fromZero
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(22,163,74,${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                        }}
                        style={{ borderRadius: 12 }}
                    />
                </View>
            )} */}

            {/* TRANSACTIONS */}
            <ScrollView style={styles.card}>
                <Text style={styles.title}>Recent Incomes</Text>

                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <View style={styles.txItem}>
                            <View>
                                <Text style={styles.txName}>{item.source}</Text>
                                <Text style={{ color: "#666" }}>{item.date}</Text>
                            </View>

                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={styles.txAmount}>
                                    {formatCurrency(item.amount, currency)}
                                </Text>

                                <TouchableOpacity onPress={() => handleDelete(item)}>
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
        borderRadius: 14,
        marginBottom: 14,
        elevation: 3,
    },

    title: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
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
        backgroundColor: "#16a34a",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },

    addText: {
        color: "#fff",
        fontWeight: "700",
    },

    totalLabel: {
        color: "#666",
    },

    totalValue: {
        fontSize: 22,
        fontWeight: "700",
        color: "#16a34a",
    },

    modeRow: {
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
        backgroundColor: "#7C3AED",
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
    },

    txAmount: {
        fontWeight: "700",
        color: "#16a34a",
    },
});