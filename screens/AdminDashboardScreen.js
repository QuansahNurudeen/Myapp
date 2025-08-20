"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Modal } from "react-native"
import { LineChart } from "react-native-chart-kit"

const { width: screenWidth } = Dimensions.get("window")

export default function AdminDashboardScreen({ navigation }) {
  const [selectedBusiness, setSelectedBusiness] = useState("Boutique")
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const businesses = ["Boutique", "Cold Store", "Hardware"]

  // Sample data - replace with your actual data
  const businessData = {
    Boutique: {
      sales: 15420,
      profit: 4850,
      orders: 89,
      customers: 156,
      growth: 12.5,
    },
    "Cold Store": {
      sales: 28750,
      profit: 8920,
      orders: 145,
      customers: 203,
      growth: 8.3,
    },
    Hardware: {
      sales: 19680,
      profit: 6240,
      orders: 67,
      customers: 134,
      growth: 15.7,
    },
  }

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [12000, 15000, 18000, 16000, 22000, 25000],
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  }

  const topItems = [
    { id: 1, name: "Premium Jacket", sales: 145, profit: 2890 },
    { id: 2, name: "Designer Shoes", sales: 98, profit: 1960 },
    { id: 3, name: "Luxury Watch", sales: 67, profit: 3350 },
    { id: 4, name: "Leather Bag", sales: 89, profit: 1780 },
  ]

  const recentSales = [
    { id: 1, customer: "John Doe", amount: 250, time: "2 min ago", status: "completed" },
    { id: 2, customer: "Jane Smith", amount: 180, time: "5 min ago", status: "pending" },
    { id: 3, customer: "Mike Johnson", amount: 320, time: "8 min ago", status: "completed" },
    { id: 4, customer: "Sarah Wilson", amount: 95, time: "12 min ago", status: "completed" },
  ]

  const SidebarMenu = () => (
    <Modal
      visible={sidebarVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSidebarVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSidebarVisible(false)}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.sidebarTitle}>Admin Menu</Text>

          {[
            { name: "Dashboard", icon: "📊", screen: "AdminDashboard" },
            { name: "Inventory", icon: "📦", screen: "Inventory" },
            { name: "Sales", icon: "💰", screen: "Sales" },
            { name: "Reports", icon: "📈", screen: "Reports" },
            { name: "Settings", icon: "⚙️", screen: "Settings" },
            { name: "Database", icon: "🗄️", screen: "Database" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                setSidebarVisible(false)
                // navigation.navigate(item.screen);
              }}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  )

  const KPICard = ({ title, value, growth, icon }) => (
    <View style={styles.kpiCard}>
      <View style={styles.kpiHeader}>
        <Text style={styles.kpiIcon}>{icon}</Text>
        <Text style={styles.kpiTitle}>{title}</Text>
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={[styles.kpiGrowth, growth > 0 ? styles.positive : styles.negative]}>
        {growth > 0 ? "↗" : "↘"} {Math.abs(growth)}%
      </Text>
    </View>
  )

  const currentData = businessData[selectedBusiness]

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Trace Admin Dashboard</Text>

        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileText}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Business Selector */}
        <View style={styles.businessSelector}>
          <Text style={styles.sectionTitle}>Select Business (Trace)</Text>
          <View style={styles.businessButtons}>
            {businesses.map((business) => (
              <TouchableOpacity
                key={business}
                style={[styles.businessButton, selectedBusiness === business && styles.businessButtonActive]}
                onPress={() => setSelectedBusiness(business)}
              >
                <Text
                  style={[styles.businessButtonText, selectedBusiness === business && styles.businessButtonTextActive]}
                >
                  {business}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiContainer}>
          <KPICard
            title="Total Sales"
            value={`₵${currentData.sales.toLocaleString()}`}
            growth={currentData.growth}
            icon="💰"
          />
          <KPICard
            title="Profit"
            value={`₵${currentData.profit.toLocaleString()}`}
            growth={currentData.growth - 2}
            icon="📈"
          />
          <KPICard title="Orders" value={currentData.orders.toString()} growth={currentData.growth + 3} icon="📦" />
          <KPICard
            title="Customers"
            value={currentData.customers.toString()}
            growth={currentData.growth - 1}
            icon="👥"
          />
        </View>

        {/* Sales Trends Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Sales Trends (Trace)</Text>
          <LineChart
            data={salesData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#22c55e",
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Top Performing Items */}
        <View style={styles.topItemsContainer}>
          <Text style={styles.sectionTitle}>Top Performing Items (Trace)</Text>
          {topItems.map((item) => (
            <View key={item.id} style={styles.topItem}>
              <View style={styles.topItemInfo}>
                <Text style={styles.topItemName}>{item.name}</Text>
                <Text style={styles.topItemSales}>{item.sales} sales</Text>
              </View>
              <Text style={styles.topItemProfit}>₵{item.profit}</Text>
            </View>
          ))}
        </View>

        {/* Recent Sales Activity */}
        <View style={styles.recentSalesContainer}>
          <Text style={styles.sectionTitle}>Recent Sales Activity (Trace)</Text>
          {recentSales.map((sale) => (
            <View key={sale.id} style={styles.saleItem}>
              <View style={styles.saleInfo}>
                <Text style={styles.saleCustomer}>{sale.customer}</Text>
                <Text style={styles.saleTime}>{sale.time}</Text>
              </View>
              <View style={styles.saleRight}>
                <Text style={styles.saleAmount}>₵{sale.amount}</Text>
                <View
                  style={[
                    styles.saleStatus,
                    sale.status === "completed" ? styles.statusCompleted : styles.statusPending,
                  ]}
                >
                  <Text style={styles.saleStatusText}>{sale.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Report Generation Controls */}
        <View style={styles.reportsContainer}>
          <Text style={styles.sectionTitle}>Generate Reports (Trace)</Text>
          <View style={styles.reportButtons}>
            <TouchableOpacity style={styles.reportButton}>
              <Text style={styles.reportButtonText}>📊 Sales Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportButton}>
              <Text style={styles.reportButtonText}>💰 Profit Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportButton}>
              <Text style={styles.reportButtonText}>📦 Inventory Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Database Controls */}
        <View style={styles.databaseContainer}>
          <Text style={styles.sectionTitle}>Database Management (Trace)</Text>
          <View style={styles.databaseButtons}>
            <TouchableOpacity style={styles.databaseButton}>
              <Text style={styles.databaseButtonText}>💾 Backup Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.databaseButton}>
              <Text style={styles.databaseButtonText}>📤 Export Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.databaseButton, styles.dangerButton]}>
              <Text style={[styles.databaseButtonText, styles.dangerText]}>🗑️ Clear Cache</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <SidebarMenu />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 20,
    color: "#374151",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  profileButton: {
    padding: 8,
  },
  profileText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  businessSelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  businessButtons: {
    flexDirection: "row",
    gap: 10,
  },
  businessButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  businessButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  businessButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  businessButtonTextActive: {
    color: "#ffffff",
  },
  kpiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  kpiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  kpiIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  kpiTitle: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  kpiGrowth: {
    fontSize: 12,
    fontWeight: "600",
  },
  positive: {
    color: "#22c55e",
  },
  negative: {
    color: "#ef4444",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  topItemsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  topItemSales: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  topItemProfit: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#22c55e",
  },
  recentSalesContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  saleInfo: {
    flex: 1,
  },
  saleCustomer: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  saleTime: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  saleRight: {
    alignItems: "flex-end",
  },
  saleAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  saleStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: "#dcfce7",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  saleStatusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  reportsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportButtons: {
    gap: 12,
  },
  reportButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  reportButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  databaseContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  databaseButtons: {
    gap: 12,
  },
  databaseButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  dangerButton: {
    backgroundColor: "#ef4444",
  },
  databaseButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  dangerText: {
    color: "#ffffff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  sidebar: {
    width: "80%",
    height: "100%",
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#374151",
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    color: "#374151",
    fontWeight: "500",
  },
})
