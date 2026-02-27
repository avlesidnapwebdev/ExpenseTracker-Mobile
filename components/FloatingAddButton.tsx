import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { addExpense, addIncome } from "../api/api";

type Props = {
  onAdded?: () => void;
  defaultType?: "income" | "expense";
  pageType?: "home" | "income" | "expense";
};

export default function FloatingAddButton({
  onAdded,
  defaultType = "income",
  pageType = "home",
}: Props) {

  const formatDate = (date: Date) =>
    date.toISOString().split("T")[0];

  const [open, setOpen] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [form, setForm] = useState({
    type: defaultType,
    name: "",
    amount: "",
    date: new Date(),
  });

  /* ---------- POPUP ---------- */
  const [popupMsg, setPopupMsg] = useState("");
  const [popupColor, setPopupColor] = useState("#16a34a");
  const popupAnim = useRef(new Animated.Value(0)).current;

  const showPopup = (msg: string, color: string) => {
    setPopupMsg(msg);
    setPopupColor(color);

    Animated.sequence([
      Animated.timing(popupAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(popupAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };
  /* -------------------------------- */

  const closeModal = () => {
    setOpen(false);
    setForm({
      type: defaultType,
      name: "",
      amount: "",
      date: new Date(),
    });
  };

  const handleAdd = async () => {
    if (!form.name || !form.amount) {
      showPopup("Fill all fields", "#dc2626");
      return;
    }

    try {
      const formattedDate = formatDate(form.date);

      if (form.type === "income") {
        await addIncome({
          source: form.name,
          amount: form.amount,
          date: formattedDate,
        });
      } else {
        await addExpense({
          category: form.name,
          amount: form.amount,
          date: formattedDate,
        });
      }

      setOpen(false);

      showPopup(
        `${form.type} added successfully`,
        form.type === "income" ? "#16a34a" : "#dc2626"
      );

      setForm({
        type: defaultType,
        name: "",
        amount: "",
        date: new Date(),
      });

      onAdded?.();
    } catch {
      showPopup("Add failed", "#dc2626");
    }
  };

  /* FAB COLOR BASED ON PAGE */
  const themeColor =
    pageType === "income"
      ? "#16a34a"
      : pageType === "expense"
        ? "#dc2626"
        : "#7C3AED";

  const namePlaceholder =
    form.type === "income"
      ? "Income Source"
      : "Expense Name";

  return (
    <>
      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: themeColor }]}
        onPress={() => {
          setForm({
            type: defaultType,
            name: "",
            amount: "",
            date: new Date(),
          });
          setOpen(true);
        }}
      >
        <Feather name="plus" size={26} color="#fff" />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={open} transparent animationType="fade">

        {/* POPUP FRONT */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.popup,
            {
              backgroundColor: popupColor,
              opacity: popupAnim,
              transform: [
                {
                  scale: popupAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.popupText}>{popupMsg}</Text>
        </Animated.View>

        <Pressable style={styles.overlay} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={() => { }}>

            <TouchableOpacity style={styles.close} onPress={closeModal}>
              <Feather name="x" size={22} />
            </TouchableOpacity>

            <Text style={styles.title}>Add Transaction</Text>

            {/* TYPE SWITCH */}
            <View style={styles.row}>
              {["income", "expense"].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeBtn,
                    form.type === t && {
                      backgroundColor:
                        t === "income" ? "#16a34a" : "#dc2626",
                    },
                  ]}
                  onPress={() =>
                    setForm({ ...form, type: t as any })
                  }
                >
                  <Text
                    style={{
                      color: form.type === t ? "#fff" : "#000",
                      fontWeight: "600",
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder={namePlaceholder}
              placeholderTextColor="#000"
              style={styles.input}
              value={form.name}
              onChangeText={(v) =>
                setForm({ ...form, name: v })
              }
            />

            <TextInput
              placeholder="Amount"
              placeholderTextColor="#000"
              keyboardType="numeric"
              style={styles.input}
              value={form.amount}
              onChangeText={(v) =>
                setForm({ ...form, amount: v })
              }
            />

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDate(true)}
            >
              <Text>{formatDate(form.date)}</Text>
            </TouchableOpacity>

            {showDate && (
              <DateTimePicker
                value={form.date}
                mode="date"
                maximumDate={new Date()}
                display="default"
                onChange={(_, selected) => {
                  setShowDate(false);
                  if (selected) {
                    setForm({ ...form, date: selected });
                  }
                }}
              />
            )}

            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: themeColor }]}
              onPress={handleAdd}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Add {form.type}
              </Text>
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 0,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  popup: {
    position: "absolute",
    top: 70,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 9999,
    elevation: 50,
  },

  popupText: {
    color: "#fff",
    fontWeight: "700",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 200,
  },

  close: {
    position: "absolute",
    right: 12,
    top: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  typeBtn: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },

  addBtn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
});