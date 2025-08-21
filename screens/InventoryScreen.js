// filepath: c:\Projects\Myapp\screens\InventoryScreen.js
import React, { useEffect, useMemo, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Share,
} from "react-native"

export default function InventoryScreen({ navigation, route }) {
  const isAdmin = route?.params?.isAdmin === true

  useEffect(() => {
    if (!isAdmin) {
      // If not launched with admin flag, prevent deep access: show Access Denied view
      navigation.setOptions({ headerShown: false })
    }
  }, [isAdmin, navigation])

  const [items, setItems] = useState([
    { id: "1", name: "Premium Jacket", sku: "JCK-001", quantity: 24, price: 289.5, category: "Apparel" },
    { id: "2", name: "Designer Shoes", sku: "SHO-010", quantity: 12, price: 195.0, category: "Footwear" },
    { id: "3", name: "Cooling Unit", sku: "CLU-100", quantity: 5, price: 1250.0, category: "Equipment" },
    { id: "4", name: "Hammer Pro", sku: "HAM-020", quantity: 40, price: 25.0, category: "Hardware" },
  ])

  const [searchText, setSearchText] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name") // name | quantity | price
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState({ name: "", sku: "", quantity: "", price: "", category: "" })

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items])

  useEffect(() => {
    if (!modalVisible) {
      setEditingItem(null)
      setForm({ name: "", sku: "", quantity: "", price: "", category: "" })
    }
  }, [modalVisible])

  const openAddModal = () => {
    setEditingItem(null)
    setForm({ name: "", sku: "", quantity: "", price: "", category: "" })
    setModalVisible(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setForm({
      name: item.name,
      sku: item.sku,
      quantity: String(item.quantity),
      price: String(item.price),
      category: item.category || "",
    })
    setModalVisible(true)
  }

  const saveItem = () => {
    const name = form.name.trim()
    const sku = form.sku.trim()
    const quantity = Number(form.quantity)
    const price = Number(form.price)
    const category = form.category.trim() || "Uncategorized"

    if (!name || !sku || Number.isNaN(quantity) || Number.isNaN(price)) {
      Alert.alert("Validation", "Please provide valid name, SKU, quantity and price.")
      return
    }

    if (editingItem) {
      setItems((prev) => prev.map((it) => (it.id === editingItem.id ? { ...it, name, sku, quantity, price, category } : it)))
    } else {
      const newItem = {
        id: String(Date.now()),
        name,
        sku,
        quantity,
        price,
        category,
      }
      setItems((prev) => [newItem, ...prev])
    }

    setModalVisible(false)
  }

  const confirmDelete = (item) => {
    Alert.alert("Delete Item", `Delete "${item.name}"? This action cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setItems((prev) => prev.filter((it) => it.id !== item.id)),
      },
    ])
  }

  const adjustStock = (itemId, delta) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it
        const nextQty = Math.max(0, it.quantity + delta)
        return { ...it, quantity: nextQty }
      })
    )
  }

  const filteredSortedItems = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    let list = items.filter((it) => {
      const matchesSearch =
        !q ||
        it.name.toLowerCase().includes(q) ||
        it.sku.toLowerCase().includes(q) ||
        (it.category || "").toLowerCase().includes(q)
      const matchesCategory = filterCategory === "All" || it.category === filterCategory
      return matchesSearch && matchesCategory
    })

    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === "quantity") list.sort((a, b) => b.quantity - a.quantity)
    else if (sortBy === "price") list.sort((a, b) => b.price - a.price)

    return list
  }, [items, searchText, filterCategory, sortBy])

  const exportCSV = async () => {
    if (items.length === 0) {
      Alert.alert("Export", "No items to export.")
      return
    }
    const header = ["id", "name", "sku", "quantity", "price", "category"]
    const rows = items.map((it) => [it.id, it.name, it.sku, String(it.quantity), String(it.price), it.category || ""])
    const csv = [header, ...rows].map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")

    try {
      await Share.share({ message: csv, title: "Inventory Export (CSV)" })
    } catch (e) {
      // Fall back to console log
      console.log("Inventory CSV:\n", csv)
      Alert.alert("Export", "CSV generated and logged to console.")
    }
  }

  if (!isAdmin) {
    return (
      <View style={styles.accessDeniedContainer}>
        <Text style={styles.accessDeniedTitle}>Access Denied</Text>
        <Text style={styles.accessDeniedText}>This screen is only accessible from the Admin Dashboard.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Return</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory Management</Text>
        <TouchableOpacity onPress={() => exportCSV()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TextInput
          placeholder="Search by name, SKU or category"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          returnKeyType="search"
        />

        <View style={styles.row}>
          <View style={styles.pillGroup}>
            <TouchableOpacity
              style={[styles.pill, filterCategory === "All" && styles.pillActive]}
              onPress={() => setFilterCategory("All")}
            >
              <Text style={[styles.pillText, filterCategory === "All" && styles.pillTextActive]}>All</Text>
            </TouchableOpacity>

            {categories
              .filter((c) => c !== "All")
              .slice(0, 4)
              .map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pill, filterCategory === cat && styles.pillActive]}
                  onPress={() => setFilterCategory(cat)}
                >
                  <Text style={[styles.pillText, filterCategory === cat && styles.pillTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
          </View>

          <View style={styles.sortGroup}>
            <TouchableOpacity style={[styles.sortButton, sortBy === "name" && styles.sortActive]} onPress={() => setSortBy("name")}>
              <Text style={[styles.sortText, sortBy === "name" && styles.sortTextActive]}>Name</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sortButton, sortBy === "quantity" && styles.sortActive]} onPress={() => setSortBy("quantity")}>
              <Text style={[styles.sortText, sortBy === "quantity" && styles.sortTextActive]}>Qty</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sortButton, sortBy === "price" && styles.sortActive]} onPress={() => setSortBy("price")}>
              <Text style={[styles.sortText, sortBy === "price" && styles.sortTextActive]}>Price</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredSortedItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No items found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.sku} • {item.category}</Text>
            </View>

            <View style={styles.itemRight}>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              <Text style={styles.itemPrice}>₵{Number(item.price).toFixed(2)}</Text>

              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.smallBtn} onPress={() => adjustStock(item.id, 1)}>
                  <Text style={styles.smallBtnText}>+1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallBtn} onPress={() => adjustStock(item.id, -1)}>
                  <Text style={styles.smallBtnText}>-1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Text style={styles.fabText}>＋ Add Item</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{editingItem ? "Edit Item" : "Add Item"}</Text>

            <TextInput placeholder="Name" value={form.name} onChangeText={(v) => setForm((s) => ({ ...s, name: v }))} style={styles.input} />
            <TextInput placeholder="SKU" value={form.sku} onChangeText={(v) => setForm((s) => ({ ...s, sku: v }))} style={styles.input} />
            <TextInput placeholder="Category" value={form.category} onChangeText={(v) => setForm((s) => ({ ...s, category: v }))} style={styles.input} />
            <TextInput placeholder="Quantity" value={form.quantity} onChangeText={(v) => setForm((s) => ({ ...s, quantity: v }))} style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="Price" value={form.price} onChangeText={(v) => setForm((s) => ({ ...s, price: v }))} style={styles.input} keyboardType="numeric" />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={saveItem}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#1f2937" },
  headerButton: { padding: 8 },
  headerButtonText: { color: "#2563eb", fontWeight: "600" },
  controls: { padding: 12 },
  searchInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6eef6",
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pillGroup: { flexDirection: "row", alignItems: "center", flex: 1, gap: 8 },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginRight: 8,
  },
  pillActive: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
  pillText: { color: "#374151", fontWeight: "600" },
  pillTextActive: { color: "#fff" },
  sortGroup: { flexDirection: "row", marginLeft: 8 },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginLeft: 6,
  },
  sortActive: { backgroundColor: "#10b981", borderColor: "#10b981" },
  sortText: { color: "#374151", fontWeight: "600" },
  sortTextActive: { color: "#fff" },
  list: { padding: 12, paddingBottom: 120 },
  emptyText: { textAlign: "center", color: "#6b7280", marginTop: 20 },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e6eef6",
  },
  itemLeft: { flex: 1, paddingRight: 8 },
  itemRight: { alignItems: "flex-end" },
  itemName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  itemMeta: { color: "#6b7280", marginTop: 4 },
  itemQty: { fontWeight: "600", color: "#111827" },
  itemPrice: { color: "#16a34a", fontWeight: "700", marginTop: 4 },
  itemActions: { flexDirection: "row", marginTop: 8, alignItems: "center" },
  smallBtn: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  smallBtnText: { color: "#374151", fontWeight: "600" },
  editBtn: { backgroundColor: "#2563eb", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, marginLeft: 6 },
  editBtnText: { color: "#fff", fontWeight: "600" },
  deleteBtn: { backgroundColor: "#ef4444", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, marginLeft: 6 },
  deleteBtnText: { color: "#fff", fontWeight: "600" },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    backgroundColor: "#10b981",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 28,
    elevation: 4,
  },
  fabText: { color: "#fff", fontWeight: "700" },
  modalOverlay: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "rgba(0,0,0,0.4)" },
  modal: { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6eef6",
    marginBottom: 10,
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 6 },
  modalCancel: { paddingHorizontal: 12, paddingVertical: 10, marginRight: 8 },
  modalCancelText: { color: "#6b7280", fontWeight: "600" },
  modalSave: { backgroundColor: "#2563eb", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  modalSaveText: { color: "#fff", fontWeight: "700" },

  accessDeniedContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  accessDeniedTitle: { fontSize: 20, fontWeight: "800", color: "#ef4444", marginBottom: 8 },
  accessDeniedText: { color: "#6b7280", textAlign: "center", marginBottom: 20 },
  backButton: { backgroundColor: "#2563eb", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  backButtonText: { color: "#fff", fontWeight: "700" },
})