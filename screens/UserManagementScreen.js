"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from "react-native"

export default function UserManagementScreen({ navigation }) {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@boutique.com",
      role: "Manager",
      business: "Boutique",
      status: "Active",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@coldstore.com",
      role: "Employee",
      business: "Cold Store",
      status: "Active",
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@hardware.com",
      role: "Owner",
      business: "Hardware",
      status: "Inactive",
      lastActive: "3 days ago",
    },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Employee", business: "Boutique" })

  const addUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([
        ...users,
        {
          id: Date.now(),
          ...newUser,
          status: "Active",
          lastActive: "Just now",
        },
      ])
      setNewUser({ name: "", email: "", role: "Employee", business: "Boutique" })
      setShowAddModal(false)
      Alert.alert("Success", "User added successfully")
    }
  }

  const deleteUser = (userId) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setUsers(users.filter((user) => user.id !== userId))
        },
      },
    ])
  }

  const toggleUserStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user,
      ),
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Access Control</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>+ Add User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📤 Export List</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Users</Text>
          <Text style={styles.summaryValue}>{users.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Active Users</Text>
          <Text style={styles.summaryValue}>{users.filter((u) => u.status === "Active").length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Managers</Text>
          <Text style={styles.summaryValue}>{users.filter((u) => u.role === "Manager").length}</Text>
        </View>
      </View>

      {/* User List */}
      <ScrollView style={styles.userList}>
        <Text style={styles.sectionTitle}>User Management</Text>
        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userDetails}>
                {user.role} • {user.business}
              </Text>
              <Text style={styles.userActivity}>Last active: {user.lastActive}</Text>
            </View>
            <View style={styles.userActions}>
              <View
                style={[styles.statusBadge, user.status === "Active" ? styles.activeStatus : styles.inactiveStatus]}
              >
                <Text style={styles.statusText}>{user.status}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setSelectedUser(user)
                    setShowEditModal(true)
                  }}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleButton} onPress={() => toggleUserStatus(user.id)}>
                  <Text style={styles.toggleButtonText}>{user.status === "Active" ? "Disable" : "Enable"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteUser(user.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add User Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add New User</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={newUser.name}
              onChangeText={(text) => setNewUser({ ...newUser, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={newUser.email}
              onChangeText={(text) => setNewUser({ ...newUser, email: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addUser}>
                <Text style={styles.saveButtonText}>Add User</Text>
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
  quickActions: { flexDirection: "row", padding: 20, gap: 10 },
  addButton: { flex: 1, backgroundColor: "#22c55e", padding: 12, borderRadius: 8, alignItems: "center" },
  addButtonText: { color: "#fff", fontWeight: "600" },
  actionButton: { flex: 1, backgroundColor: "#3b82f6", padding: 12, borderRadius: 8, alignItems: "center" },
  actionButtonText: { color: "#fff", fontWeight: "600" },
  summaryContainer: { flexDirection: "row", paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  summaryCard: { flex: 1, backgroundColor: "#fff", padding: 16, borderRadius: 8, alignItems: "center" },
  summaryTitle: { fontSize: 14, color: "#6b7280", marginBottom: 4 },
  summaryValue: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  userList: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#1f2937" },
  userCard: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 10, flexDirection: "row" },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  userEmail: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  userDetails: { fontSize: 14, color: "#374151", marginTop: 4 },
  userActivity: { fontSize: 12, color: "#9ca3af", marginTop: 4 },
  userActions: { alignItems: "flex-end" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  activeStatus: { backgroundColor: "#dcfce7" },
  inactiveStatus: { backgroundColor: "#fee2e2" },
  statusText: { fontSize: 12, fontWeight: "600" },
  actionButtons: { flexDirection: "row", gap: 5 },
  editButton: { backgroundColor: "#f59e0b", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  editButtonText: { color: "#fff", fontSize: 12 },
  toggleButton: { backgroundColor: "#6b7280", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  toggleButtonText: { color: "#fff", fontSize: 12 },
  deleteButton: { backgroundColor: "#ef4444", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  deleteButtonText: { color: "#fff", fontSize: 12 },
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
