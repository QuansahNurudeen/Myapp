import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState([
    { id: '1', date: '2023-06-01', description: 'Office Supplies', category: 'Supplies', amount: 125.50, paymentMethod: 'Cash', status: 'Approved' },
    { id: '2', date: '2023-06-02', description: 'Internet Bill', category: 'Utilities', amount: 89.99, paymentMethod: 'Bank Transfer', status: 'Approved' },
    { id: '3', date: '2023-06-03', description: 'Employee Lunch', category: 'Meals', amount: 45.75, paymentMethod: 'Mobile Money', status: 'Pending' },
    { id: '4', date: '2023-06-05', description: 'Rent Payment', category: 'Rent', amount: 1200.00, paymentMethod: 'Bank Transfer', status: 'Approved' },
    { id: '5', date: '2023-06-07', description: 'Marketing Materials', category: 'Marketing', amount: 67.30, paymentMethod: 'Cash', status: 'Rejected' },
  ]);
  
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Supplies',
    amount: '',
    paymentMethod: 'Cash',
    taxDeductible: false
  });
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses.filter(expense => {
    // Apply search filter
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'approved' && expense.status === 'Approved') ||
      (activeFilter === 'pending' && expense.status === 'Pending') ||
      (activeFilter === 'rejected' && expense.status === 'Rejected');
    
    return matchesSearch && matchesFilter;
  });

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;
    
    const newExpenseObj = {
      id: Date.now().toString(),
      date: newExpense.date,
      description: newExpense.description,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      paymentMethod: newExpense.paymentMethod,
      status: 'Pending'
    };
    
    setExpenses([...expenses, newExpenseObj]);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Supplies',
      amount: '',
      paymentMethod: 'Cash',
      taxDeductible: false
    });
    setShowAddExpense(false);
  };

  const handleStatusChange = (expenseId, newStatus) => {
    setExpenses(expenses.map(expense => 
      expense.id === expenseId ? { ...expense, status: newStatus } : expense
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Management</Text>
      
      {/* Summary Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Expenses</Text>
          <Text style={styles.summaryValue}>
            ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Pending Approval</Text>
          <Text style={[styles.summaryValue, styles.pendingValue]}>
            ${expenses.filter(e => e.status === 'Pending').reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Top Category</Text>
          <Text style={styles.summaryValue}>Supplies</Text>
        </View>
      </ScrollView>
      
      {/* Search and Filters */}
      <View style={styles.controls}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'approved' && styles.activeFilter]}
            onPress={() => setActiveFilter('approved')}
          >
            <Text style={[styles.filterText, activeFilter === 'approved' && styles.activeFilterText]}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'pending' && styles.activeFilter]}
            onPress={() => setActiveFilter('pending')}
          >
            <Text style={[styles.filterText, activeFilter === 'pending' && styles.activeFilterText]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'rejected' && styles.activeFilter]}
            onPress={() => setActiveFilter('rejected')}
          >
            <Text style={[styles.filterText, activeFilter === 'rejected' && styles.activeFilterText]}>Rejected</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Add Expense Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddExpense(true)}
      >
        <Text style={styles.addButtonText}>+ Add Expense</Text>
      </TouchableOpacity>
      
      {/* Add Expense Form */}
      {showAddExpense && (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>Add New Expense</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={newExpense.date}
            onChangeText={(text) => setNewExpense({...newExpense, date: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newExpense.description}
            onChangeText={(text) => setNewExpense({...newExpense, description: text})}
          />
          
          <Picker
            selectedValue={newExpense.category}
            style={styles.picker}
            onValueChange={(itemValue) => setNewExpense({...newExpense, category: itemValue})}
          >
            <Picker.Item label="Supplies" value="Supplies" />
            <Picker.Item label="Utilities" value="Utilities" />
            <Picker.Item label="Rent" value="Rent" />
            <Picker.Item label="Meals" value="Meals" />
            <Picker.Item label="Marketing" value="Marketing" />
            <Picker.Item label="Travel" value="Travel" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
          
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={newExpense.amount}
            onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
            keyboardType="numeric"
          />
          
          <Picker
            selectedValue={newExpense.paymentMethod}
            style={styles.picker}
            onValueChange={(itemValue) => setNewExpense({...newExpense, paymentMethod: itemValue})}
          >
            <Picker.Item label="Cash" value="Cash" />
            <Picker.Item label="Bank Transfer" value="Bank Transfer" />
            <Picker.Item label="Mobile Money" value="Mobile Money" />
            <Picker.Item label="Credit Card" value="Credit Card" />
          </Picker>
          
          <View style={styles.taxDeductible}>
            <Text>Tax Deductible:</Text>
            <Switch
              value={newExpense.taxDeductible}
              onValueChange={(value) => setNewExpense({...newExpense, taxDeductible: value})}
            />
          </View>
          
          <View style={styles.formButtons}>
            <TouchableOpacity 
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => setShowAddExpense(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.formButton, styles.saveButton]}
              onPress={handleAddExpense}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Expenses List */}
      <View style={styles.listHeader}>
        <Text style={[styles.headerText, styles.dateColumn]}>Date</Text>
        <Text style={[styles.headerText, styles.descColumn]}>Description</Text>
        <Text style={[styles.headerText, styles.amountColumn]}>Amount</Text>
        <Text style={[styles.headerText, styles.statusColumn]}>Status</Text>
      </View>
      
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.expenseRow,
              item.status === 'Approved' && styles.approvedRow,
              item.status === 'Rejected' && styles.rejectedRow
            ]}
            onPress={() => console.log('View expense details', item.id)}
          >
            <Text style={[styles.expenseCell, styles.dateColumn]}>{item.date}</Text>
            <View style={[styles.expenseCell, styles.descColumn]}>
              <Text style={styles.expenseDesc}>{item.description}</Text>
              <Text style={styles.expenseCategory}>{item.category}</Text>
            </View>
            <Text style={[styles.expenseCell, styles.amountColumn]}>${item.amount.toFixed(2)}</Text>
            <View style={[styles.expenseCell, styles.statusColumn]}>
              <View style={[
                styles.statusBadge,
                item.status === 'Approved' && styles.approvedBadge,
                item.status === 'Pending' && styles.pendingBadge,
                item.status === 'Rejected' && styles.rejectedBadge,
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              
              {item.status === 'Pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleStatusChange(item.id, 'Approved')}
                  >
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleStatusChange(item.id, 'Rejected')}
                  >
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text>No expenses found</Text>
          </View>
        }
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
  summaryContainer: {
    marginBottom: 16,
  },
  summaryCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pendingValue: {
    color: '#FFA500',
  },
  controls: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilter: {
    borderBottomColor: '#4D73FF',
  },
  filterText: {
    color: '#666',
  },
  activeFilterText: {
    color: '#4D73FF',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4D73FF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addForm: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taxDeductible: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#4D73FF',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    elevation: 1,
    paddingHorizontal: 8,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#666',
  },
  dateColumn: {
    flex: 1,
  },
  descColumn: {
    flex: 2,
  },
  amountColumn: {
    flex: 1,
  },
  statusColumn: {
    flex: 1.5,
  },
  expenseRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  approvedRow: {
    backgroundColor: '#E8F5E9',
  },
  rejectedRow: {
    backgroundColor: '#FFEBEE',
  },
  expenseCell: {
    justifyContent: 'center',
  },
  expenseDesc: {
    fontWeight: 'bold',
  },
  expenseCategory: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  approvedBadge: {
    backgroundColor: '#C8E6C9',
  },
  pendingBadge: {
    backgroundColor: '#FFF8E1',
  },
  rejectedBadge: {
    backgroundColor: '#FFCDD2',
  },
  statusText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    padding: 4,
    borderRadius: 4,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});