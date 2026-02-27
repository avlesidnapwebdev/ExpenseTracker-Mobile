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
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenContainer from "../../components/ScreenContainer";
import Header from "../../components/AppHeader";
import FloatingAddButton from "../../components/FloatingAddButton";

import { AuthContext } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/currencies";

import {
    getIncomes,
    deleteIncome,
} from "../../api/api";

type IncomeTx = {
    id: string;
    source: string;
    amount: number;
    date: string;
};

export default function Income() {
    const auth = useContext(AuthContext);
    const currency = auth?.user?.currency || "USD";

    const insets = useSafeAreaInsets();
    const tabBarHeight = useBottomTabBarHeight();

    const [transactions, setTransactions] = useState<IncomeTx[]>([]);
    const [summary, setSummary] = useState(0);
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

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleDelete = async (tx: IncomeTx) => {
        await deleteIncome(tx.id);
        loadData();
    };

    const renderRight = (item: IncomeTx) => (
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

            <View
                style={[
                    styles.container,
                    { paddingBottom: tabBarHeight + insets.bottom + 20 },
                ]}
            >
                <StatusBar barStyle="dark-content" />

                {/* SUMMARY CARDS */}
                <Summary
                    label="Total Income"
                    value={summary}
                    color="#16a34a"
                    currency={currency}
                />


                {/* TITLE */}
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Recent Incomes</Text>
                    <Text style={styles.hint}>← Swipe right to delete</Text>
                </View>

                {/* COMPACT LIST BOX */}
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
                                            <Text style={styles.name}>{item.source}</Text>
                                            <Text style={{ color: "#666", fontSize: 12 }}>
                                                {item.date}
                                            </Text>
                                        </View>

                                        <Text style={styles.amount}>
                                            {formatCurrency(item.amount, currency)}
                                        </Text>
                                    </View>
                                </Swipeable>
                            </Animated.View>
                        )}
                    />
                </View>

                <FloatingAddButton onAdded={loadData} />
            </View>
        </ScreenContainer>
    );
}

/* ===== SUMMARY CARD ===== */
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

/* ===== STYLES ===== */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FA",
        padding: 16,
    },

    summary: {
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
    },

    titleRow: {
        marginTop: 16,
        marginBottom: 6,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    title: {
        fontSize: 17,
        fontWeight: "700",
    },

    hint: {
        fontSize: 11,
        color: "#777",
    },

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

    amount: {
        color: "#16a34a",
        fontWeight: "700",
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