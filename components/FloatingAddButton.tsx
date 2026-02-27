import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { addExpense, addIncome } from "../api/api";

type Props = {
  onAdded?: () => void; // reload callback
};

export default function FloatingAddButton({ onAdded }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    type: "income",
    name: "",
    amount: "",
    date: today,
  });

  const handleAdd = async () => {
    if (!form.name || !form.amount) return;

    try {
      if (form.type === "income") {
        await addIncome({
          source: form.name,
          amount: form.amount,
          date: form.date,
        });
      } else {
        await addExpense({
          category: form.name,
          amount: form.amount,
          date: form.date,
        });
      }

      setOpen(false);
      setForm({
        type: "income",
        name: "",
        amount: "",
        date: today,
      });

      onAdded?.(); // refresh page
    } catch (e) {
      console.log("Add failed", e);
    }
  };

  return (
    <>
      {/* FLOAT ICON */}
      <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)}>
        <Feather name="plus" size={26} color="#fff" />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            
            {/* CLOSE */}
            <TouchableOpacity
              style={styles.close}
              onPress={() => setOpen(false)}
            >
              <Feather name="x" size={22} />
            </TouchableOpacity>

            <Text style={styles.title}>Add Transaction</Text>

            {/* TYPE */}
            <View style={styles.row}>
              {["income", "expense"].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeBtn,
                    form.type === t && styles.typeActive,
                  ]}
                  onPress={() => setForm({ ...form, type: t })}
                >
                  <Text
                    style={{
                      color: form.type === t ? "#fff" : "#000",
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* NAME */}
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />

            {/* AMOUNT */}
            <TextInput
              placeholder="Amount"
              keyboardType="numeric"
              style={styles.input}
              value={form.amount}
              onChangeText={(v) => setForm({ ...form, amount: v })}
            />

            {/* DATE */}
            <TextInput
              placeholder="YYYY-MM-DD"
              style={styles.input}
              value={form.date}
              onChangeText={(v) => setForm({ ...form, date: v })}
            />

            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Add Transaction
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
    bottom: -20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
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
    marginBottom: 180,
  },

  close: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 10,
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

  typeActive: {
    backgroundColor: "#7C3AED",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },

  addBtn: {
    backgroundColor: "#7C3AED",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
});