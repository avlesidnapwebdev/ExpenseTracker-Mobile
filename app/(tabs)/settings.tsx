import { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";

import { AuthContext } from "../../context/AuthContext";
import { updateProfile } from "../../api/api";
import { currencies } from "../../utils/currencies";

export default function Settings() {
    const { user, setUser, logout } = useContext(AuthContext);
    const router = useRouter();

    const [draftName, setDraftName] = useState("");
    const [draftCurrency, setDraftCurrency] = useState("USD");

    useEffect(() => {
        if (user) {
            setDraftName(user.name || "");
            setDraftCurrency(user.currency || "USD");
        }
    }, [user]);

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("name", draftName);
            formData.append("currency", draftCurrency);

            const res = await updateProfile(formData);
            setUser(res.data);

            Alert.alert("Success", "Profile updated successfully");
        } catch (err) {
            Alert.alert("Error", "Profile update failed");
        }
    };

    const handleCancel = () => {
        setDraftName(user?.name || "");
        setDraftCurrency(user?.currency || "USD");
    };

    const handleLogout = async () => {
        await logout();

        // 🔥 go back to login page
        router.replace("/(auth)/login");
    };

    if (!user) return null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
            {/* PROFILE CARD */}
            <View style={styles.card}>
                <View style={styles.profileRow}>
                    <Image
                        source={
                            user.avatar
                                ? { uri: user.avatar }
                                : require("../../assets/images/default-avatar.png")
                        }
                        style={styles.avatar}
                    />

                    <View>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                    </View>
                </View>
            </View>

            {/* NAME */}
            <View style={styles.card}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    value={draftName}
                    onChangeText={setDraftName}
                    style={styles.input}
                    placeholder="Enter name"
                />
            </View>

            {/* CURRENCY */}
            <View style={styles.card}>
                <Text style={styles.label}>Currency</Text>

                <ScrollView style={{ maxHeight: 220 }}>
                    {currencies.map((c) => (
                        <TouchableOpacity
                            key={c.code}
                            onPress={() => setDraftCurrency(c.code)}
                            style={[
                                styles.currencyItem,
                                draftCurrency === c.code && styles.currencyActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.currencyText,
                                    draftCurrency === c.code && { color: "#7C3AED" },
                                ]}
                            >
                                {c.symbol} {c.code} — {c.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.row}>
                <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                    <Text style={styles.btnText}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                    <Text style={{ fontWeight: "600" }}>Cancel</Text>
                </TouchableOpacity>
            </View>

            {/* LOGOUT */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FA",
        padding: 16,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        elevation: 3,
    },

    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    currencyText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },

    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: "#7C3AED",
    },

    name: {
        fontSize: 18,
        fontWeight: "700",
    },

    email: {
        color: "#666",
        marginTop: 2,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        backgroundColor: "#fff",
    },

    currencyItem: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 6,
        backgroundColor: "#F9FAFB",
    },

    currencyActive: {
        backgroundColor: "#F3E8FF",
    },

    row: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10,
    },

    updateBtn: {
        flex: 1,
        backgroundColor: "#7C3AED",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    cancelBtn: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
    },

    btnText: {
        color: "#fff",
        fontWeight: "700",
    },

    logoutBtn: {
        marginTop: 20,
        backgroundColor: "#EF4444",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    logoutText: {
        color: "#fff",
        fontWeight: "700",
    },
});