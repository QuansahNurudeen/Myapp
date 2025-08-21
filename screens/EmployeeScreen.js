import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  StatusBar,
} from "react-native"

export default function EmployeeScreen({ navigation, route }) {
  const { selectedBusiness: businessFromRoute } = route.params || {};
  const [selectedBusiness] = useState(businessFromRoute || "Hardware");
  const [activeTab, setActiveTab] = useState("sales")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Sales form state
  const [selectedItem, setSelectedItem] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [customerName, setCustomerName] = useState("")
  const RECENT_SALES_KEY = `@myapp_recent_sales_${selectedBusiness}`
  const [showItemModal, setShowItemModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Sample data
  const businesses = ["Hardware", "Boutique", "Cold Store"]
  const items = {
    Hardware: [
      { name: "Hammer", price: 25.0 },
      { name: "Screwdriver Set", price: 15.0 },
      { name: "Paint Brush", price: 8.0 },
      { name: "Nails (1kg)", price: 12.0 },
      { name: "Drill Bits", price: 20.0 },
    ],
    Boutique: [
      { name: "T-Shirt", price: 35.0 },
      { name: "Jeans", price: 65.0 },
      { name: "Dress", price: 85.0 },
      { name: "Shoes", price: 120.0 },
      { name: "Handbag", price: 95.0 },
    ],
    "Cold Store": [
      { name: "Frozen Chicken", price: 18.0 },
      { name: "Ice Cream", price: 12.0 },
      { name: "Frozen Vegetables", price: 8.0 },
      { name: "Fish Fillets", price: 25.0 },
      { name: "Frozen Pizza", price: 15.0 },
    ],
  }

  const [todayStats, setTodayStats] = useState({
    salesCount: 23,
    totalAmount: 1250.0,
    topItem: "Hammer",
  })

  const [recentSales, setRecentSales] = useState([
    { id: 1, item: "Hammer", quantity: 2, time: "10:30 AM", amount: 50.0 },
    { id: 2, item: "Paint Brush", quantity: 1, time: "10:15 AM", amount: 8.0 },
    { id: 3, item: "Screwdriver Set", quantity: 3, time: "09:45 AM", amount: 45.0 },
  ])

  const paymentMethods = ["Cash", "Mobile Money", "Card"]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (selectedItem) {
      const item = items[selectedBusiness].find((i) => i.name === selectedItem)
      if (item) {
        setPrice(item.price)
      }
    }
  }, [selectedItem, selectedBusiness])

  useEffect(() => {
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(RECENT_SALES_KEY)
        if (raw) setRecentSales(JSON.parse(raw))
      } catch (e) {
        console.warn("Failed to load recent sales", e)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        await AsyncStorage.setItem(RECENT_SALES_KEY, JSON.stringify(recentSales))
      } catch (e) {
        console.warn("Failed to save recent sales", e)
      }
    })()
  }, [recentSales])

  const handleSubmitSale = () => {
    if (!selectedItem || quantity <= 0) {
      Alert.alert("Error", "Please select an item and enter valid quantity")
      return
    }

    const total = price * quantity
    const newSale = {
      id: Date.now(),
      item: selectedItem,
      quantity,
      time: currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      amount: total,
      paymentMethod,
      customerName,
    }

    // add to the front of the full recentSales list (no slice) so history shows all recorded sales
    setRecentSales((prev) => [newSale, ...prev])
    setTodayStats((prev) => ({
      ...prev,
      salesCount: prev.salesCount + 1,
      totalAmount: prev.totalAmount + total,
    }))

    // Reset form
    setSelectedItem("")
    setQuantity(1)
    setPrice(0)
    setCustomerName("")
    setPaymentMethod("cash")

    Alert.alert("Success", "Sale recorded successfully!")
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.businessName}>Trace - {selectedBusiness}</Text>
        <Text style={styles.dateTime}>
          {currentTime.toLocaleDateString()} •{" "}
          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.goBack()}>
        <Text style={styles.profileText}>👤 Logout</Text>
      </TouchableOpacity>
    </View>
  )

  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "sales" && styles.activeTab]}
        onPress={() => setActiveTab("sales")}
      >
        <Text style={[styles.tabText, activeTab === "sales" && styles.activeTabText]}>Sales Entry</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "history" && styles.activeTab]}
        onPress={() => setActiveTab("history")}
      >
        <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>My Sales</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "info" && styles.activeTab]}
        onPress={() => setActiveTab("info")}
      >
        <Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>Business Info</Text>
      </TouchableOpacity>
    </View>
  )

  const renderSalesEntry = () => (
    <ScrollView style={styles.content}>
      {/* Item Entry Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Item Entry (Trace)</Text>

        <TouchableOpacity style={styles.dropdown} onPress={() => setShowItemModal(true)}>
          <Text style={[styles.dropdownText, !selectedItem && styles.placeholder]}>
            {selectedItem || "Select an item"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <View style={styles.quantityContainer}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepperButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <Text style={styles.stepperText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.stepperButton} onPress={() => setQuantity(quantity + 1)}>
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.label}>Unit Price</Text>
            <Text style={styles.priceText}>₵{price.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total: ₵{(price * quantity).toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details (Trace)</Text>

        <TouchableOpacity style={styles.dropdown} onPress={() => setShowPaymentModal(true)}>
          <Text style={styles.dropdownText}>{paymentMethod}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Customer Name (Optional)"
          value={customerName}
          onChangeText={setCustomerName}
          placeholderTextColor="#999"
        />
      </View>

      {/* Form Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitSale}>
          <Text style={styles.submitText}>Submit Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setSelectedItem("")
            setQuantity(1)
            setPrice(0)
            setCustomerName("")
            setPaymentMethod("cash")
          }}
        >
          <Text style={styles.cancelText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats Panel */}
      <View style={styles.statsPanel}>
        <Text style={styles.statsPanelTitle}>Today's Summary (Trace)</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayStats.salesCount}</Text>
            <Text style={styles.statLabel}>Sales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₵{todayStats.totalAmount.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayStats.topItem}</Text>
            <Text style={styles.statLabel}>Top Item</Text>
          </View>
        </View>
      </View>

      {/* Recent Sales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Sales (Trace)</Text>
        {recentSales.map((sale) => (
          <View key={sale.id} style={styles.saleItem}>
            <View style={styles.saleInfo}>
              <Text style={styles.saleItemName}>{sale.item}</Text>
              <Text style={styles.saleDetails}>
                Qty: {sale.quantity} • {sale.time}
              </Text>
            </View>
            <Text style={styles.saleAmount}>₵{sale.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )

  const renderSalesHistory = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>My Sales History (Trace)</Text>
      {recentSales.length === 0 ? (
        <Text style={styles.comingSoon}>No recorded sales yet.</Text>
      ) : (
        recentSales.map((sale) => (
          <View key={sale.id} style={styles.saleItem}>
            <View style={styles.saleInfo}>
              <Text style={styles.saleItemName}>{sale.item}</Text>
              <Text style={styles.saleDetails}>
                Qty: {sale.quantity} • {sale.time} • {sale.paymentMethod}
              </Text>
              {sale.customerName ? <Text style={styles.saleDetails}>Customer: {sale.customerName}</Text> : null}
            </View>
            <Text style={styles.saleAmount}>₵{Number(sale.amount).toFixed(2)}</Text>
          </View>
        ))
      )}
    </ScrollView>
  )

  const renderBusinessInfo = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Business Information (Trace)</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Trace - {selectedBusiness}</Text>
        <Text style={styles.infoText}>Business Type: {selectedBusiness}</Text>
        <Text style={styles.infoText}>Employee: John Doe</Text>
        <Text style={styles.infoText}>Shift: Morning (8:00 AM - 4:00 PM)</Text>
        <Text style={styles.infoText}>Contact: +233 123 456 789</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      {renderHeader()}
      {renderTabNavigation()}

      {activeTab === "sales" && renderSalesEntry()}
      {activeTab === "history" && renderSalesHistory()}
      {activeTab === "info" && renderBusinessInfo()}

      {/* Floating Action Button */}
      {activeTab !== "sales" && (
        <TouchableOpacity style={styles.fab} onPress={() => setActiveTab("sales")}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Item Selection Modal */}
      <Modal visible={showItemModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select Item</Text>
            <FlatList
              data={items[selectedBusiness]}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedItem(item.name)
                    setShowItemModal(false)
                  }}
                >
                  <Text style={styles.modalItemName}>{item.name}</Text>
                  <Text style={styles.modalItemPrice}>₵{item.price.toFixed(2)}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowItemModal(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Method Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Payment Method</Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={styles.modalItem}
                onPress={() => {
                  setPaymentMethod(method.toLowerCase())
                  setShowPaymentModal(false)
                }}
              >
                <Text style={styles.modalItemName}>{method}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowPaymentModal(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: 16,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  businessName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  dateTime: {
    color: "#e2e8f0",
    fontSize: 14,
    marginTop: 4,
  },
  profileButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  profileText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  tabContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
  },
  tabText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: "#374151",
  },
  placeholder: {
    color: "#9ca3af",
  },
  dropdownArrow: {
    color: "#6b7280",
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  quantityContainer: {
    flex: 1,
  },
  priceContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  stepperButton: {
    padding: 12,
    backgroundColor: "#f9fafb",
  },
  stepperText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  quantityText: {
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: "500",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#059669",
    padding: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    textAlign: "center",
  },
  totalContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "500",
  },
  statsPanel: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsPanelTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  saleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  saleInfo: {
    flex: 1,
  },
  saleItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  saleDetails: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  saleAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  comingSoon: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 40,
  },
  infoCard: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalItemName: {
    fontSize: 16,
    color: "#1f2937",
  },
  modalItemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  modalClose: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
})
