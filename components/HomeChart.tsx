import React, { useMemo, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import {
    VictoryChart,
    VictoryAxis,
    VictoryBar,
    VictoryGroup,
    VictoryLegend,
    VictoryTheme,
} from "victory-native";

/* ================= TYPES ================= */

type ViewType = "week" | "month";

export type Transaction = {
    id?: string | number;
    type: "income" | "expense";
    amount: number;
    date: string;
};

type HomeChartProps = {
    transactions: Transaction[];
};

const screenWidth = Dimensions.get("window").width;

/* ================= BUILD DATA ================= */

function buildTimeline(transactions: Transaction[], view: ViewType) {
    const map = new Map<
        string,
        { period: string; income: number; expense: number; sortKey: number }
    >();

    transactions.forEach((t) => {
        const date = new Date(t.date);
        let key = "";
        let sortKey = 0;

        if (view === "week") {
            const week = Math.ceil((date.getDate() - date.getDay()) / 7) + 1;
            key = `W${week}`;
            sortKey = date.getTime();
        } else {
            key = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;
            sortKey = new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            ).getTime();
        }

        if (!map.has(key)) {
            map.set(key, {
                period: key,
                income: 0,
                expense: 0,
                sortKey,
            });
        }

        const item = map.get(key)!;

        if (t.type === "income") item.income += t.amount;
        else item.expense += t.amount;
    });

    return Array.from(map.values()).sort(
        (a, b) => a.sortKey - b.sortKey
    );
}

/* ================= COMPONENT ================= */

export default function HomeChart({ transactions }: HomeChartProps) {
    const [view, setView] = useState<ViewType>("week");

    const timeline = useMemo(
        () => buildTimeline(transactions, view),
        [transactions, view]
    );

    if (!timeline.length) {
        return (
            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    padding: 14,
                    marginTop: 10,
                }}
            >
                <Text>No chart data</Text>
            </View>
        );
    }

    const incomeData = timeline.map((t) => ({
        x: t.period,
        y: t.income,
    }));

    const expenseData = timeline.map((t) => ({
        x: t.period,
        y: t.expense,
    }));

    return (
        <View
            style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 14,
                marginTop: 10,
            }}
        >
            {/* HEADER + SWITCH */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    alignItems: "center",
                }}
            >
                <Text style={{ fontWeight: "700" }}>Income Overview</Text>

                <View style={{ flexDirection: "row", gap: 8 }}>
                    {["week", "month"].map((v) => (
                        <Text
                            key={v}
                            onPress={() => setView(v as ViewType)}
                            style={{
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 8,
                                backgroundColor:
                                    view === v ? "#7C3AED" : "#E5E7EB",
                                color: view === v ? "#fff" : "#000",
                            }}
                        >
                            {v}
                        </Text>
                    ))}
                </View>
            </View>

            <VictoryChart
                width={screenWidth - 30}
                theme={VictoryTheme.material}
                domainPadding={{ x: 20, y: 10 }}
            >
                <VictoryLegend
                    x={40}
                    y={0}
                    orientation="horizontal"
                    gutter={20}
                    data={[
                        { name: "Income", symbol: { fill: "#16a34a" } },
                        { name: "Expense", symbol: { fill: "#dc2626" } },
                    ]}
                />

                <VictoryAxis
                    style={{
                        tickLabels: {
                            fontSize: 10,
                            angle: -20,
                            padding: 15,
                        },
                    }}
                />

                <VictoryAxis dependentAxis />

                <VictoryGroup offset={12}>
                    <VictoryBar
                        data={incomeData}
                        style={{
                            data: {
                                fill: "#16a34a",
                                width: 10,
                                borderRadius: 4,
                            },
                        }}
                    />

                    <VictoryBar
                        data={expenseData}
                        style={{
                            data: {
                                fill: "#dc2626",
                                width: 10,
                                borderRadius: 4,
                            },
                        }}
                    />
                </VictoryGroup>
            </VictoryChart>
        </View>
    );
}