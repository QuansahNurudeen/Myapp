"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from "react-native"

export default function ExpenseManagementScreen({ navigation }) {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      description: "Office Supplies",
      category: "Operations",
      amount: 250,
      business: "Boutique",
      date: "2024-08-20",
      status: "Approved",
      paymentMethod: "Cash",
    },
    {
      id: 2,
      description: "Equipment Repair",
      category: "Maintenance",
      amount: 450,
      business: "Hardware",
      date: "2024-08-19",
      status: "Pending",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 3,
      description: "Inventory Purchase",
      category: "Stock",
      amount: 1200,
      business: "Cold Store",
      date: "2024-08-18",
      status: "Approved",
      paymentMethod: "Credit Card",
    },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState("All")
  const [newExpense, setNewExpense] = useState({
    description: "",
    category: "Operations",
    amount: "",
    business: "Boutique",
    paymentMethod: "Cash",
  })

  const businesses = ["All", "Boutique", "Cold Store", "Hardware"]
  const categories = ["Operations", "Maintenance", "Stock", "Marketing", "Utilities"]
  const paymentMethods = ["Cash", "Bank Transfer", "Credit Card", "Mobile Money"]

  const filteredExpenses =
    selectedBusiness === "All" ? expenses : expenses.filter((expense) => expense.business === selectedBusiness)

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const pendingExpenses = filteredExpenses.filter((expense) => expense.status === "Pending").length
  const avgDailySpending = totalExpenses / 30 // Assuming 30 days

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          ...newExpense,
          amount: Number.parseFloat(newExpense.amount),
          date: new Date().toISOString().split("T")[0],
          status: "Pending",
        },
      ])
      setNewExpense({
        description: "",
        category: "Operations",
        amount: "",
        business: "Boutique",
        paymentMethod: "Cash",
      })
      setShowAddModal(false)
      Alert.alert("Success", "Expense added successfully")
    }
  }

  const approveExpense = (expenseId) => {
    setExpenses(expenses.map((expense) => (expense.id === expenseId ? { ...expense, status: "Approved" } : expense)))
    Alert.alert("Success", "Expense approved")
  }

  const rejectExpense = (expenseId) => {
    Alert.alert("Reject Expense", "Are you sure you want to reject this expense?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => {
          setExpenses(
            expenses.map((expense) => (expense.id === expenseId ? { ...expense, status: "Rejected" } : expense)),
          )
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Management</Text>
      </View>

      {/* Business Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {businesses.map((business) => (
            <TouchableOpacity
              key={business}
              style={[styles.filterButton, selectedBusiness === business && styles.filterButtonActive]}
              onPress={() => setSelectedBusiness(business)}
            >
              <Text style={[styles.filterButtonText, selectedBusiness === business && styles.filterButtonTextActive]}>
                {business}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Expenses</Text>
          <Text style={styles.summaryValue}>₵{totalExpenses.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Avg. Daily</Text>
          <Text style={styles.summaryValue}>₵{avgDailySpending.toFixed(0)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Pending</Text>
          <Text style={styles.summaryValue}>{pendingExpenses}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>+ Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📊 Generate Report</Text>
        </TouchableOpacity>
      </View>

      {/* Expense List */}
      <ScrollView style={styles.expenseList}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {filteredExpenses.map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseDescription}>{expense.description}</Text>
              <Text style={styles.expenseDetails}>
                {expense.category} • {expense.business} • {expense.date}
              </Text>
              <Text style={styles.expensePayment}>Payment: {expense.paymentMethod}</Text>
            </View>
            <View style={styles.expenseActions}>
              <Text style={styles.expenseAmount}>₵{expense.amount}</Text>
              <View
                style={[
                  styles.statusBadge,
                  expense.status === "Approved"
                    ? styles.approvedStatus
                    : expense.status === "Pending"
                      ? styles.pendingStatus
                      : styles.rejectedStatus,
                ]}
              >
                <Text style={styles.statusText}>{expense.status}</Text>
              </View>
              {expense.status === "Pending" && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.approveButton} onPress={() => approveExpense(expense.id)}>
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={() => rejectExpense(expense.id)}>
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add New Expense</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newExpense.description}
              onChangeText={(text) => setNewExpense({ ...newExpense, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addExpense}>
                <Text style={styles.saveButtonText}>Add Expense</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: { fontSize: 16, color: "#3b82f6", marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1f2937" },
  filterContainer: { padding: 20 },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterButtonActive: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
  filterButtonText: { color: "#374151", fontWeight: "500" },
  filterButtonTextActive: { color: "#fff" },
  summaryContainer: { flexDirection: "row", paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  summaryCard: { flex: 1, backgroundColor: "#fff", padding: 16, borderRadius: 8, alignItems: "center" },
  summaryTitle: { fontSize: 14, color: "#6b7280", marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: "bold", color: "#1f2937" },
  quickActions: { flexDirection: "row", paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  addButton: { flex: 1, backgroundColor: "#22c55e", padding: 12, borderRadius: 8, alignItems: "center" },
  addButtonText: { color: "#fff", fontWeight: "600" },
  actionButton: { flex: 1, backgroundColor: "#3b82f6", padding: 12, borderRadius: 8, alignItems: "center" },
  actionButtonText: { color: "#fff", fontWeight: "600" },
  expenseList: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#1f2937" },
  expenseCard: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 10, flexDirection: "row" },
  expenseInfo: { flex: 1 },
  expenseDescription: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  expenseDetails: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  expensePayment: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  expenseActions: { alignItems: "flex-end" },
  expenseAmount: { fontSize: 18, fontWeight: "bold", color: "#1f2937", marginBottom: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  approvedStatus: { backgroundColor: "#dcfce7" },
  pendingStatus: { backgroundColor: "#fef3c7" },
  rejectedStatus: { backgroundColor: "#fee2e2" },
  statusText: { fontSize: 12, fontWeight: "600" },
  actionButtons: { flexDirection: "row", gap: 5 },
  approveButton: { backgroundColor: "#22c55e", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  approveButtonText: { color: "#fff", fontSize: 12 },
  rejectButton: { backgroundColor: "#ef4444", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  rejectButtonText: { color: "#fff", fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modal: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "90%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#d1d5db", padding: 12, borderRadius: 8, marginBottom: 15 },
  modalButtons: { flexDirection: "row", gap: 10 },
  cancelButton: { flex: 1, backgroundColor: "#6b7280", padding: 12, borderRadius: 8, alignItems: "center" },
  cancelButtonText: { color: "#fff", fontWeight: "600" },
  saveButton: { flex: 1, backgroundColor: "#22c55e", padding: 12, borderRadius: 8, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "600" },
})
