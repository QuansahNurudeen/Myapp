import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { FloatingAction } from "react-native-floating-action";

export default function EmployeeScreen() {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    quantity: '',
    price: ''
  });
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.quantity || !currentItem.price) return;
    
    setItems([...items, {
      ...currentItem,
      id: Date.now().toString(),
      total: (parseFloat(currentItem.quantity) * parseFloat(currentItem.price)).toFixed(2)
    }]);
    
    setCurrentItem({
      name: '',
      quantity: '',
      price: ''
    });
  };

  const handleSubmitSale = () => {
    // Submit sale logic here
    Alert.alert("Success", "Sale recorded successfully");
    setItems([]);
    setCustomerName('');
  };

  const actions = [
    {
      text: "New Sale",
      icon: require("../assets/add.png"),
      name: "new_sale",
      position: 1
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Sales Entry</Text>
        
        {/* Item Entry Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Items</Text>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={currentItem.name}
            onChangeText={(text) => setCurrentItem({...currentItem, name: text})}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.quantityInput]}
              placeholder="Qty"
              keyboardType="numeric"
              value={currentItem.quantity}
              onChangeText={(text) => setCurrentItem({...currentItem, quantity: text})}
            />
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="Price"
              keyboardType="numeric"
              value={currentItem.price}
              onChangeText={(text) => setCurrentItem({...currentItem, price: text})}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Items List */}
        {items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items in Sale</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.nameColumn]}>Item</Text>
              <Text style={[styles.tableHeaderText, styles.quantityColumn]}>Qty</Text>
              <Text style={[styles.tableHeaderText, styles.priceColumn]}>Price</Text>
              <Text style={[styles.tableHeaderText, styles.totalColumn]}>Total</Text>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.nameColumn]}>{item.name}</Text>
                  <Text style={[styles.tableCell, styles.quantityColumn]}>{item.quantity}</Text>
                  <Text style={[styles.tableCell, styles.priceColumn]}>${item.price}</Text>
                  <Text style={[styles.tableCell, styles.totalColumn]}>${item.total}</Text>
                </View>
              )}
            />
          </View>
        )}
        
        {/* Payment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <TextInput
            style={styles.input}
            placeholder="Customer Name (Optional)"
            value={customerName}
            onChangeText={setCustomerName}
          />
          <View style={styles.paymentMethods}>
            <TouchableOpacity 
              style={[styles.paymentButton, paymentMethod === 'cash' && styles.paymentButtonActive]}
              onPress={() => setPaymentMethod('cash')}
            >
              <Text style={paymentMethod === 'cash' ? styles.paymentButtonTextActive : styles.paymentButtonText}>Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.paymentButton, paymentMethod === 'card' && styles.paymentButtonActive]}
              onPress={() => setPaymentMethod('card')}
            >
              <Text style={paymentMethod === 'card' ? styles.paymentButtonTextActive : styles.paymentButtonText}>Card</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.paymentButton, paymentMethod === 'mobile' && styles.paymentButtonActive]}
              onPress={() => setPaymentMethod('mobile')}
            >
              <Text style={paymentMethod === 'mobile' ? styles.paymentButtonTextActive : styles.paymentButtonText}>Mobile</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.totalText}>
            Total: ${items.reduce((sum, item) => sum + parseFloat(item.total), 0).toFixed(2)}
          </Text>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmitSale}
            disabled={items.length === 0}
          >
            <Text style={styles.submitButtonText}>Submit Sale</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <FloatingAction
        actions={actions}
        onPressItem={() => {
          setItems([]);
          setCustomerName('');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityInput: {
    width: '20%',
  },
  priceInput: {
    width: '30%',
  },
  addButton: {
    width: '40%',
    backgroundColor: '#4D73FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    fontSize: 14,
  },
  nameColumn: {
    flex: 2,
  },
  quantityColumn: {
    flex: 1,
    textAlign: 'center',
  },
  priceColumn: {
    flex: 1,
    textAlign: 'right',
  },
  totalColumn: {
    flex: 1,
    textAlign: 'right',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  paymentButton: {
    width: '30%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentButtonActive: {
    backgroundColor: '#4D73FF',
    borderColor: '#4D73FF',
  },
  paymentButtonText: {
    color: '#555',
  },
  paymentButtonTextActive: {
    color: '#fff',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 15,
  },
  submitButton: {
    backgroundColor: '#4D73FF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});