"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Modal, TextInput, Alert } from "react-native"

export default function SettingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("account")
  const [notifications, setNotifications] = useState({
    sales: true,
    inventory: true,
    expenses: false,
    reports: true,
  })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@business.com",
    phone: "+233 123 456 789",
  })

  const toggleNotification = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const updateProfile = () => {
    setShowProfileModal(false)
    Alert.alert("Success", "Profile updated successfully")
  }

  const resetSettings = () => {
    Alert.alert("Reset Settings", "This will reset all settings to default. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setNotifications({ sales: true, inventory: true, expenses: false, reports: true })
          Alert.alert("Success", "Settings reset to default")
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: "account", label: "Account" },
          { key: "business", label: "Business" },
          { key: "notifications", label: "Notifications" },
          { key: "security", label: "Security" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {/* Account Tab */}
        {activeTab === "account" && (
          <View>
            <Text style={styles.sectionTitle}>Account Settings</Text>

            <View style={styles.settingCard}>
              <View style={styles.profileSection}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.avatarText}>AU</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileEmail}>{profile.email}</Text>
                  <Text style={styles.profilePhone}>{profile.phone}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => setShowProfileModal(true)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingCard}>
              <Text style={styles.cardTitle}>Preferences</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingValue}>English</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Currency</Text>
                <Text style={styles.settingValue}>GHS (₵)</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Time Zone</Text>
                <Text style={styles.settingValue}>GMT+0</Text>
              </View>
            </View>
          </View>
        )}

        {/* Business Tab */}
        {activeTab === "business" && (
          <View>
            <Text style={styles.sectionTitle}>Business Settings</Text>

            <View style={styles.settingCard}>
              <Text style={styles.cardTitle}>Company Information</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Business Name</Text>
                <Text style={styles.settingValue}>Multi-Business Enterprise</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Registration Number</Text>
                <Text style={styles.settingValue}>BN-2024-001</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Tax ID</Text>
                <Text style={styles.settingValue}>TAX-123456789</Text>
              </View>
            </View>

            <View style={styles.settingCard}>
              <Text style={styles.cardTitle}>Business Locations</Text>
              {["Boutique", "Cold Store", "Hardware"].map((business, index) => (
                <View key={index} style={styles.businessItem}>
                  <View style={styles.businessInfo}>
                    <Text style={styles.businessName}>{business}</Text>
                    <Text style={styles.businessStatus}>Active</Text>
                  </View>
                  <TouchableOpacity style={styles.configButton}>
                    <Text style={styles.configButtonText}>Configure</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <View>
            <Text style={styles.sectionTitle}>Notification Settings</Text>

            <View style={styles.settingCard}>
              <Text style={styles.cardTitle}>Push Notifications</Text>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>Sales Alerts</Text>
                  <Text style={styles.notificationDesc}>Get notified of new sales</Text>
                </View>
                <Switch
                  value={notifications.sales}
                  onValueChange={() => toggleNotification("sales")}
                  trackColor={{ false: "#d1d5db", true: "#22c55e" }}
                  thumbColor={notifications.sales ? "#fff" : "#f4f3f4"}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>Inventory Alerts</Text>
                  <Text style={styles.notificationDesc}>Low stock notifications</Text>
                </View>
                <Switch
                  value={notifications.inventory}
                  onValueChange={() => toggleNotification("inventory")}
                  trackColor={{ false: "#d1d5db", true: "#22c55e" }}
                  thumbColor={notifications.inventory ? "#fff" : "#f4f3f4"}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>Expense Approvals</Text>
                  <Text style={styles.notificationDesc}>Pending expense notifications</Text>
                </View>
                <Switch
                  value={notifications.expenses}
                  onValueChange={() => toggleNotification("expenses")}
                  trackColor={{ false: "#d1d5db", true: "#22c55e" }}
                  thumbColor={notifications.expenses ? "#fff" : "#f4f3f4"}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationLabel}>Report Generation</Text>
                  <Text style={styles.notificationDesc}>Report completion alerts</Text>
                </View>
                <Switch
                  value={notifications.reports}
                  onValueChange={() => toggleNotification("reports")}
                  trackColor={{ false: "#d1d5db", true: "#22c55e" }}
                  thumbColor={notifications.reports ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>
          </View>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <View>
            <Text style={styles.sectionTitle}>Security Settings</Text>

            <View style={styles.settingCard}>
              <Text style={styles.cardTitle}>Authentication</Text>
              <TouchableOpacity style={styles.securityButton}>
                <Text style={styles.securityButtonText}>🔑 Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.securityButton}>
                <Text style={styles.securityButtonText}>📱 Enable 2FA</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.securityButton}>
                <Text style={styles.securityButtonText}>📋 View Login History</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingCard}>
              <Text style={styles.cardTitle}>Data & Privacy</Text>
              <TouchableOpacity style={styles.securityButton}>
                <Text style={styles.securityButtonText}>📤 Export My Data</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.securityButton}>
                <Text style={styles.securityButtonText}>🗑️ Delete Account</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dangerZone}>
              <Text style={styles.dangerTitle}>Danger Zone</Text>
              <TouchableOpacity style={styles.dangerButton} onPress={resetSettings}>
                <Text style={styles.dangerButtonText}>Reset All Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal visible={showProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowProfileModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
                <Text style={styles.saveButtonText}>Save</Text>
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
  tabContainer: { flexDirection: "row", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tab: { flex: 1, paddingVertical: 15, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#3b82f6" },
  tabText: { fontSize: 14, color: "#6b7280", fontWeight: "500" },
  activeTabText: { color: "#3b82f6", fontWeight: "600" },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#1f2937" },
  settingCard: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937", marginBottom: 15 },
  profileSection: { flexDirection: "row", alignItems: "center" },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "600", color: "#1f2937" },
  profileEmail: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  profilePhone: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  editButton: { backgroundColor: "#3b82f6", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  editButtonText: { color: "#fff", fontWeight: "600" },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  settingLabel: { fontSize: 16, color: "#374151" },
  settingValue: { fontSize: 16, color: "#6b7280" },
  businessItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  businessInfo: { flex: 1 },
  businessName: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  businessStatus: { fontSize: 14, color: "#22c55e", marginTop: 2 },
  configButton: { backgroundColor: "#f59e0b", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  configButtonText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  notificationInfo: { flex: 1 },
  notificationLabel: { fontSize: 16, color: "#374151", fontWeight: "500" },
  notificationDesc: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  securityButton: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  securityButtonText: { fontSize: 16, color: "#374151", fontWeight: "500" },
  dangerZone: { backgroundColor: "#fff", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#fecaca" },
  dangerTitle: { fontSize: 16, fontWeight: "600", color: "#dc2626", marginBottom: 15 },
  dangerButton: { backgroundColor: "#ef4444", padding: 12, borderRadius: 8, alignItems: "center" },
  dangerButtonText: { color: "#fff", fontWeight: "600" },
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
