"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from "react-native"

export default function DatabaseManagementScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showQueryModal, setShowQueryModal] = useState(false)
  const [sqlQuery, setSqlQuery] = useState("")
  const [queryResults, setQueryResults] = useState([])

  const databaseStats = {
    totalTables: 12,
    totalRecords: 15420,
    databaseSize: "245 MB",
    lastBackup: "2 hours ago",
    activeConnections: 3,
    queryPerformance: "Good",
  }

  const tables = [
    { name: "users", records: 156, size: "12 MB", lastModified: "1 hour ago" },
    { name: "products", records: 2340, size: "45 MB", lastModified: "30 min ago" },
    { name: "sales", records: 8920, size: "120 MB", lastModified: "5 min ago" },
    { name: "expenses", records: 1240, size: "18 MB", lastModified: "2 hours ago" },
    { name: "inventory", records: 2764, size: "50 MB", lastModified: "1 hour ago" },
  ]

  const executeQuery = () => {
    if (!sqlQuery.trim()) {
      Alert.alert("Error", "Please enter a SQL query")
      return
    }

    // Simulate query execution
    const mockResults = [
      { id: 1, name: "Sample Data 1", value: 100 },
      { id: 2, name: "Sample Data 2", value: 200 },
      { id: 3, name: "Sample Data 3", value: 300 },
    ]

    setQueryResults(mockResults)
    Alert.alert("Success", `Query executed successfully. ${mockResults.length} rows returned.`)
  }

  const performBackup = () => {
    Alert.alert("Database Backup", "This will create a full backup of the database. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Backup",
        onPress: () => {
          Alert.alert("Success", "Database backup completed successfully")
        },
      },
    ])
  }

  const clearCache = () => {
    Alert.alert("Clear Cache", "This will clear all cached data. This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          Alert.alert("Success", "Cache cleared successfully")
        },
      },
    ])
  }

  const exportData = () => {
    Alert.alert("Export Data", "Choose export format:", [
      { text: "Cancel", style: "cancel" },
      { text: "CSV", onPress: () => Alert.alert("Success", "Data exported as CSV") },
      { text: "JSON", onPress: () => Alert.alert("Success", "Data exported as JSON") },
    ])
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Database Management</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: "overview", label: "Overview" },
          { key: "tables", label: "Tables" },
          { key: "query", label: "Query" },
          { key: "backup", label: "Backup" },
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
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <View>
            <Text style={styles.sectionTitle}>Database Overview</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{databaseStats.totalTables}</Text>
                <Text style={styles.statLabel}>Total Tables</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{databaseStats.totalRecords.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Records</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{databaseStats.databaseSize}</Text>
                <Text style={styles.statLabel}>Database Size</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{databaseStats.activeConnections}</Text>
                <Text style={styles.statLabel}>Active Connections</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>System Status</Text>
              <Text style={styles.infoText}>Last Backup: {databaseStats.lastBackup}</Text>
              <Text style={styles.infoText}>Performance: {databaseStats.queryPerformance}</Text>
              <Text style={styles.infoText}>Status: Online</Text>
            </View>
          </View>
        )}

        {/* Tables Tab */}
        {activeTab === "tables" && (
          <View>
            <Text style={styles.sectionTitle}>Database Tables</Text>
            {tables.map((table, index) => (
              <View key={index} style={styles.tableCard}>
                <View style={styles.tableInfo}>
                  <Text style={styles.tableName}>{table.name}</Text>
                  <Text style={styles.tableDetails}>
                    {table.records.toLocaleString()} records • {table.size}
                  </Text>
                  <Text style={styles.tableModified}>Modified: {table.lastModified}</Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Query Tab */}
        {activeTab === "query" && (
          <View>
            <Text style={styles.sectionTitle}>SQL Query Interface</Text>
            <TouchableOpacity style={styles.queryButton} onPress={() => setShowQueryModal(true)}>
              <Text style={styles.queryButtonText}>🔍 Open Query Editor</Text>
            </TouchableOpacity>

            {queryResults.length > 0 && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Query Results</Text>
                {queryResults.map((result, index) => (
                  <View key={index} style={styles.resultRow}>
                    <Text style={styles.resultText}>
                      ID: {result.id} | Name: {result.name} | Value: {result.value}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Backup Tab */}
        {activeTab === "backup" && (
          <View>
            <Text style={styles.sectionTitle}>Backup & Maintenance</Text>

            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>Database Backup</Text>
              <Text style={styles.actionDescription}>Create a full backup of all data</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={performBackup}>
                <Text style={styles.primaryButtonText}>💾 Create Backup</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>Export Data</Text>
              <Text style={styles.actionDescription}>Export data in various formats</Text>
              <TouchableOpacity style={styles.secondaryButton} onPress={exportData}>
                <Text style={styles.secondaryButtonText}>📤 Export Data</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dangerZone}>
              <Text style={styles.dangerTitle}>Danger Zone</Text>
              <TouchableOpacity style={styles.dangerButton} onPress={clearCache}>
                <Text style={styles.dangerButtonText}>🗑️ Clear Cache</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Query Modal */}
      <Modal visible={showQueryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.queryModal}>
            <Text style={styles.modalTitle}>SQL Query Editor</Text>
            <TextInput
              style={styles.queryInput}
              placeholder="Enter your SQL query here..."
              value={sqlQuery}
              onChangeText={setSqlQuery}
              multiline
              numberOfLines={6}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowQueryModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.executeButton} onPress={executeQuery}>
                <Text style={styles.executeButtonText}>Execute</Text>
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
  statsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  statCard: { flex: 1, minWidth: "45%", backgroundColor: "#fff", padding: 16, borderRadius: 8, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  statLabel: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  infoCard: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 20 },
  infoTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937", marginBottom: 10 },
  infoText: { fontSize: 14, color: "#374151", marginBottom: 5 },
  tableCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  tableInfo: { flex: 1 },
  tableName: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  tableDetails: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  tableModified: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  viewButton: { backgroundColor: "#3b82f6", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  viewButtonText: { color: "#fff", fontWeight: "600" },
  queryButton: { backgroundColor: "#3b82f6", padding: 16, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  queryButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  resultsContainer: { backgroundColor: "#fff", padding: 16, borderRadius: 8 },
  resultsTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937", marginBottom: 10 },
  resultRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  resultText: { fontSize: 14, color: "#374151" },
  actionCard: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 15 },
  actionTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937", marginBottom: 5 },
  actionDescription: { fontSize: 14, color: "#6b7280", marginBottom: 15 },
  primaryButton: { backgroundColor: "#22c55e", padding: 12, borderRadius: 8, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  secondaryButton: { backgroundColor: "#3b82f6", padding: 12, borderRadius: 8, alignItems: "center" },
  secondaryButtonText: { color: "#fff", fontWeight: "600" },
  dangerZone: { backgroundColor: "#fff", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#fecaca" },
  dangerTitle: { fontSize: 16, fontWeight: "600", color: "#dc2626", marginBottom: 15 },
  dangerButton: { backgroundColor: "#ef4444", padding: 12, borderRadius: 8, alignItems: "center" },
  dangerButtonText: { color: "#fff", fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  queryModal: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "90%", maxHeight: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  queryInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  modalButtons: { flexDirection: "row", gap: 10 },
  cancelButton: { flex: 1, backgroundColor: "#6b7280", padding: 12, borderRadius: 8, alignItems: "center" },
  cancelButtonText: { color: "#fff", fontWeight: "600" },
  executeButton: { flex: 1, backgroundColor: "#22c55e", padding: 12, borderRadius: 8, alignItems: "center" },
  executeButtonText: { color: "#fff", fontWeight: "600" },
})
