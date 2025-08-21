"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from "react-native"

export default function InventoryManagementScreen({ navigation }) {
  const [selectedBusiness, setSelectedBusiness] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Premium Jacket",
      sku: "BT-001",
      category: "Clothing",
      stock: 25,
      reorderLevel: 10,
      price: 150,
      business: "Boutique",
    },
    {
      id: 2,
      name: "Frozen Chicken",
      sku: "CS-001",
      category: "Meat",
      stock: 5,
      reorderLevel: 15,
      price: 45,
      business: "Cold Store",
    },
    {
      id: 3,
      name: "Power Drill",
      sku: "HW-001",
      category: "Tools",
      stock: 12,
      reorderLevel: 5,
      price: 89,
      business: "Hardware",
    },
    {
      id: 4,
      name: "Designer Shoes",
      sku: "BT-002",
      category: "Footwear",
      stock: 8,
      reorderLevel: 12,
      price: 120,
      business: "Boutique",
    },
    {
      id: 5,
      name: "Ice Cream",
      sku: "CS-002",
      category: "Dairy",
      stock: 0,
      reorderLevel: 20,
      price: 8,
      business: "Cold Store",
    },
  ])

  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    category: "",
    stock: "",
    reorderLevel: "",
    price: "",
    business: "Boutique",
  })

  const businesses = ["All", "Boutique", "Cold Store", "Hardware"]
  const categories = ["Clothing", "Footwear", "Meat", "Dairy", "Tools", "Electronics"]

  const filteredInventory = inventory.filter((item) => {
    const matchesBusiness = selectedBusiness === "All" || item.business === selectedBusiness
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesBusiness && matchesSearch
  })

  const lowStockItems = filteredInventory.filter((item) => item.stock <= item.reorderLevel)
  const outOfStockItems = filteredInventory.filter((item) => item.stock === 0)
  const totalValue = filteredInventory.reduce((sum, item) => sum + item.stock * item.price, 0)

  const addItem = () => {
    if (newItem.name && newItem.sku && newItem.stock && newItem.price) {
      setInventory([
        ...inventory,
        {
          id: Date.now(),
          ...newItem,
          stock: Number.parseInt(newItem.stock),
          reorderLevel: Number.parseInt(newItem.reorderLevel) || 5,
          price: Number.parseFloat(newItem.price),
        },
      ])
      setNewItem({
        name: "",
        sku: "",
        category: "",
        stock: "",
        reorderLevel: "",
        price: "",
        business: "Boutique",
      })
      setShowAddModal(false)
      Alert.alert("Success", "Item added successfully")
    }
  }

  const adjustStock = (itemId, adjustment) => {
    setInventory(
      inventory.map((item) => (item.id === itemId ? { ...item, stock: Math.max(0, item.stock + adjustment) } : item)),
    )
  }

  const deleteItem = (itemId) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setInventory(inventory.filter((item) => item.id !== itemId))
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
        <Text style={styles.headerTitle}>Inventory Management</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
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
          <Text style={styles.summaryTitle}>Total Items</Text>
          <Text style={styles.summaryValue}>{filteredInventory.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Low Stock</Text>
          <Text style={[styles.summaryValue, styles.warningText]}>{lowStockItems.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Out of Stock</Text>
          <Text style={[styles.summaryValue, styles.dangerText]}>{outOfStockItems.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Value</Text>
          <Text style={styles.summaryValue}>₵{totalValue.toFixed(0)}</Text>
        </View>
      </View>

      {/* Inventory List */}
      <ScrollView style={styles.inventoryList}>
        <Text style={styles.sectionTitle}>Inventory Items</Text>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>⚠️ Low Stock Alert</Text>
            <Text style={styles.alertText}>{lowStockItems.length} items are running low on stock</Text>
          </View>
        )}

        {filteredInventory.map((item) => (
          <View key={item.id} style={styles.inventoryCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                SKU: {item.sku} • {item.category}
              </Text>
              <Text style={styles.itemBusiness}>{item.business}</Text>
              <View style={styles.stockInfo}>
                <Text
                  style={[
                    styles.stockText,
                    item.stock === 0
                      ? styles.outOfStock
                      : item.stock <= item.reorderLevel
                        ? styles.lowStock
                        : styles.inStock,
                  ]}
                >
                  Stock: {item.stock}
                </Text>
                <Text style={styles.reorderText}>Reorder at: {item.reorderLevel}</Text>
              </View>
            </View>

            <View style={styles.itemActions}>
              <Text style={styles.itemPrice}>₵{item.price}</Text>

              <View style={styles.stockControls}>
                <TouchableOpacity style={styles.stockButton} onPress={() => adjustStock(item.id, -1)}>
                  <Text style={styles.stockButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stockDisplay}>{item.stock}</Text>
                <TouchableOpacity style={styles.stockButton} onPress={() => adjustStock(item.id, 1)}>
                  <Text style={styles.stockButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Item Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="SKU"
              value={newItem.sku}
              onChangeText={(text) => setNewItem({ ...newItem, sku: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={newItem.category}
              onChangeText={(text) => setNewItem({ ...newItem, category: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Stock Quantity"
              value={newItem.stock}
              onChangeText={(text) => setNewItem({ ...newItem, stock: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Reorder Level"
              value={newItem.reorderLevel}
              onChangeText={(text) => setNewItem({ ...newItem, reorderLevel: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={newItem.price}
              onChangeText={(text) => setNewItem({ ...newItem, price: text })}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addItem}>
                <Text style={styles.saveButtonText}>Add Item</Text>
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
  searchContainer: { flexDirection: "row", padding: 20, gap: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "600" },
  filterContainer: { paddingHorizontal: 20, marginBottom: 20 },
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
  summaryCard: { flex: 1, backgroundColor: "#fff", padding: 12, borderRadius: 8, alignItems: "center" },
  summaryTitle: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  warningText: { color: "#f59e0b" },
  dangerText: { color: "#ef4444" },
  inventoryList: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#1f2937" },
  alertCard: {
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  alertTitle: { fontSize: 14, fontWeight: "600", color: "#92400e", marginBottom: 4 },
  alertText: { fontSize: 12, color: "#92400e" },
  inventoryCard: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 10, flexDirection: "row" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  itemDetails: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  itemBusiness: { fontSize: 12, color: "#3b82f6", marginTop: 2, fontWeight: "500" },
  stockInfo: { flexDirection: "row", marginTop: 8, gap: 15 },
  stockText: { fontSize: 14, fontWeight: "600" },
  inStock: { color: "#22c55e" },
  lowStock: { color: "#f59e0b" },
  outOfStock: { color: "#ef4444" },
  reorderText: { fontSize: 12, color: "#6b7280" },
  itemActions: { alignItems: "flex-end" },
  itemPrice: { fontSize: 16, fontWeight: "bold", color: "#1f2937", marginBottom: 10 },
  stockControls: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  stockButton: {
    backgroundColor: "#3b82f6",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  stockButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  stockDisplay: { marginHorizontal: 15, fontSize: 16, fontWeight: "600", minWidth: 30, textAlign: "center" },
  deleteButton: { backgroundColor: "#ef4444", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  deleteButtonText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modal: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "90%", maxHeight: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#d1d5db", padding: 12, borderRadius: 8, marginBottom: 15 },
  modalButtons: { flexDirection: "row", gap: 10 },
  cancelButton: { flex: 1, backgroundColor: "#6b7280", padding: 12, borderRadius: 8, alignItems: "center" },
  cancelButtonText: { color: "#fff", fontWeight: "600" },
  saveButton: { flex: 1, backgroundColor: "#22c55e", padding: 12, borderRadius: 8, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "600" },
})
