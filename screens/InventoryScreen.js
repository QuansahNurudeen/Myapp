import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Card, Searchbar, Button } from 'react-native-paper';

export default function InventoryScreen({ route }) {
  const { business } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - in a real app, this would come from your database
  useEffect(() => {
    const mockInventory = [
      { id: '1', name: 'T-Shirt', category: 'Clothing', stock: 45, reorderLevel: 10, price: 15.99, location: 'Boutique' },
      { id: '2', name: 'Jeans', category: 'Clothing', stock: 22, reorderLevel: 15, price: 29.99, location: 'Boutique' },
      { id: '3', name: 'Hammer', category: 'Tools', stock: 8, reorderLevel: 5, price: 12.50, location: 'Hardware' },
      { id: '4', name: 'Nails (1kg)', category: 'Hardware', stock: 15, reorderLevel: 10, price: 5.99, location: 'Hardware' },
      { id: '5', name: 'Frozen Chicken', category: 'Food', stock: 3, reorderLevel: 20, price: 8.99, location: 'Cold Store' },
      { id: '6', name: 'Ice Cream', category: 'Food', stock: 12, reorderLevel: 15, price: 4.50, location: 'Cold Store' },
    ];
    
    // Filter by business if specified
    const filtered = business ? mockInventory.filter(item => item.location === business) : mockInventory;
    setInventory(filtered);
    setFilteredInventory(filtered);
  }, [business]);

  useEffect(() => {
    let filtered = [...inventory];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply stock status filter
    if (activeTab === 'low') {
      filtered = filtered.filter(item => item.stock <= item.reorderLevel && item.stock > 0);
    } else if (activeTab === 'out') {
      filtered = filtered.filter(item => item.stock === 0);
    }
    
    setFilteredInventory(filtered);
  }, [searchQuery, activeTab, inventory]);

  const handleStockUpdate = (id, action) => {
    // In a real app, this would update the database
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          stock: action === 'add' ? item.stock + 1 : Math.max(0, item.stock - 1)
        };
      }
      return item;
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {business ? `${business} Inventory` : 'All Inventory'}
      </Text>
      
      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search inventory..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <View style={styles.filterTabs}>
          <TouchableOpacity 
            style={[styles.filterTab, activeTab === 'all' && styles.activeFilterTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.filterTabText, activeTab === 'all' && styles.activeFilterTabText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, activeTab === 'low' && styles.activeFilterTab]}
            onPress={() => setActiveTab('low')}
          >
            <Text style={[styles.filterTabText, activeTab === 'low' && styles.activeFilterTabText]}>Low Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, activeTab === 'out' && styles.activeFilterTab]}
            onPress={() => setActiveTab('out')}
          >
            <Text style={[styles.filterTabText, activeTab === 'out' && styles.activeFilterTabText]}>Out of Stock</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Summary Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryCardTitle}>Total Products</Text>
            <Text style={styles.summaryCardValue}>{inventory.length}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryCardTitle}>Low Stock</Text>
            <Text style={[styles.summaryCardValue, styles.warningValue]}>
              {inventory.filter(item => item.stock <= item.reorderLevel && item.stock > 0).length}
            </Text>
          </Card.Content>
        </Card>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryCardTitle}>Out of Stock</Text>
            <Text style={[styles.summaryCardValue, styles.dangerValue]}>
              {inventory.filter(item => item.stock === 0).length}
            </Text>
          </Card.Content>
        </Card>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryCardTitle}>Inventory Value</Text>
            <Text style={styles.summaryCardValue}>
              ${inventory.reduce((sum, item) => sum + (item.stock * item.price), 0).toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* Inventory List */}
      <View style={styles.listHeader}>
        <Text style={[styles.listHeaderText, styles.nameColumn]}>Item</Text>
        <Text style={[styles.listHeaderText, styles.stockColumn]}>Stock</Text>
        <Text style={[styles.listHeaderText, styles.priceColumn]}>Price</Text>
        <Text style={[styles.listHeaderText, styles.actionsColumn]}>Actions</Text>
      </View>
      
      <FlatList
        data={filteredInventory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.listItem,
            item.stock === 0 && styles.outOfStockItem,
            item.stock <= item.reorderLevel && item.stock > 0 && styles.lowStockItem
          ]}>
            <View style={[styles.listItemCell, styles.nameColumn]}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <View style={[styles.listItemCell, styles.stockColumn]}>
              <Text style={item.stock <= item.reorderLevel ? styles.warningText : styles.normalText}>
                {item.stock}
              </Text>
              {item.stock <= item.reorderLevel && (
                <Text style={styles.reorderText}>Reorder at {item.reorderLevel}</Text>
              )}
            </View>
            <View style={[styles.listItemCell, styles.priceColumn]}>
              <Text>${item.price.toFixed(2)}</Text>
            </View>
            <View style={[styles.listItemCell, styles.actionsColumn]}>
              <TouchableOpacity 
                style={styles.stockButton}
                onPress={() => handleStockUpdate(item.id, 'add')}
              >
                <Text style={styles.stockButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.stockButton, styles.removeButton]}
                onPress={() => handleStockUpdate(item.id, 'remove')}
              >
                <Text style={styles.stockButtonText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text>No items found</Text>
          </View>
        }
      />
      
      <Button 
        mode="contained" 
        style={styles.addButton}
        onPress={() => console.log('Add new item')}
      >
        Add New Item
      </Button>
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
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 12,
    elevation: 1,
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: '#4D73FF',
  },
  filterTabText: {
    color: '#666',
  },
  activeFilterTabText: {
    color: '#4D73FF',
    fontWeight: 'bold',
  },
  cardContainer: {
    marginBottom: 16,
  },
  summaryCard: {
    width: 150,
    marginRight: 12,
    elevation: 2,
  },
  summaryCardTitle: {
    fontSize: 14,
    color: '#666',
  },
  summaryCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  warningValue: {
    color: '#FFA500',
  },
  dangerValue: {
    color: '#FF4500',
  },
  listHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    elevation: 1,
  },
  listHeaderText: {
    fontWeight: 'bold',
    color: '#666',
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lowStockItem: {
    backgroundColor: '#FFF9E6',
  },
  outOfStockItem: {
    backgroundColor: '#FFEBEE',
  },
  listItemCell: {
    justifyContent: 'center',
  },
  nameColumn: {
    flex: 2,
  },
  stockColumn: {
    flex: 1,
    alignItems: 'center',
  },
  priceColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionsColumn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
  },
  normalText: {
    color: '#000',
  },
  warningText: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
  reorderText: {
    fontSize: 10,
    color: '#FFA500',
  },
  stockButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4D73FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButton: {
    backgroundColor: '#FF4500',
  },
  stockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#4D73FF',
    paddingVertical: 8,
  },
});