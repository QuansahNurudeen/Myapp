import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function UserAccessScreen() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Admin User', email: 'admin@ad.example.com', role: 'Owner', status: 'Active', lastActive: 'Today' },
    { id: '2', name: 'Manager 1', email: 'manager1@bq.example.com', role: 'Manager', status: 'Active', lastActive: 'Today' },
    { id: '3', name: 'Employee 1', email: 'emp1@bq.example.com', role: 'Employee', status: 'Active', lastActive: 'Yesterday' },
    { id: '4', name: 'Employee 2', email: 'emp2@hd.example.com', role: 'Employee', status: 'Inactive', lastActive: '1 week ago' },
    { id: '5', name: 'Pending User', email: 'pending@cd.example.com', role: 'Employee', status: 'Pending', lastActive: 'Never' },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Employee',
    business: 'Boutique'
  });

  const filteredUsers = users.filter(user => {
    // Apply search filter
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && user.status === 'Active') ||
      (activeFilter === 'inactive' && user.status === 'Inactive') ||
      (activeFilter === 'pending' && user.status === 'Pending');
    
    return matchesSearch && matchesFilter;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const newUserObj = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Pending',
      lastActive: 'Never'
    };
    
    setUsers([...users, newUserObj]);
    setNewUser({ name: '', email: '', role: 'Employee', business: 'Boutique' });
    setShowAddUser(false);
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Access Control</Text>
      
      {/* Search and Filters */}
      <View style={styles.controls}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
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
            style={[styles.filterButton, activeFilter === 'active' && styles.activeFilter]}
            onPress={() => setActiveFilter('active')}
          >
            <Text style={[styles.filterText, activeFilter === 'active' && styles.activeFilterText]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'inactive' && styles.activeFilter]}
            onPress={() => setActiveFilter('inactive')}
          >
            <Text style={[styles.filterText, activeFilter === 'inactive' && styles.activeFilterText]}>Inactive</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'pending' && styles.activeFilter]}
            onPress={() => setActiveFilter('pending')}
          >
            <Text style={[styles.filterText, activeFilter === 'pending' && styles.activeFilterText]}>Pending</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Add User Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddUser(true)}
      >
        <Text style={styles.addButtonText}>+ Add User</Text>
      </TouchableOpacity>
      
      {/* Add User Form */}
      {showAddUser && (
        <View style={styles.addUserForm}>
          <Text style={styles.formTitle}>Add New User</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={newUser.name}
            onChangeText={(text) => setNewUser({...newUser, name: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={newUser.email}
            onChangeText={(text) => setNewUser({...newUser, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Picker
            selectedValue={newUser.role}
            style={styles.picker}
            onValueChange={(itemValue) => setNewUser({...newUser, role: itemValue})}
          >
            <Picker.Item label="Owner" value="Owner" />
            <Picker.Item label="Manager" value="Manager" />
            <Picker.Item label="Employee" value="Employee" />
          </Picker>
          
          <Picker
            selectedValue={newUser.business}
            style={styles.picker}
            onValueChange={(itemValue) => setNewUser({...newUser, business: itemValue})}
          >
            <Picker.Item label="Boutique" value="Boutique" />
            <Picker.Item label="Hardware" value="Hardware" />
            <Picker.Item label="Cold Store" value="Cold Store" />
          </Picker>
          
          <View style={styles.formButtons}>
            <TouchableOpacity 
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => setShowAddUser(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.formButton, styles.saveButton]}
              onPress={handleAddUser}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Users List */}
      <View style={styles.listHeader}>
        <Text style={[styles.headerText, styles.nameColumn]}>Name</Text>
        <Text style={[styles.headerText, styles.emailColumn]}>Email</Text>
        <Text style={[styles.headerText, styles.roleColumn]}>Role</Text>
        <Text style={[styles.headerText, styles.statusColumn]}>Status</Text>
        <Text style={[styles.headerText, styles.actionsColumn]}>Actions</Text>
      </View>
      
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Text style={[styles.userCell, styles.nameColumn]}>{item.name}</Text>
            <Text style={[styles.userCell, styles.emailColumn]}>{item.email}</Text>
            <Text style={[styles.userCell, styles.roleColumn]}>{item.role}</Text>
            <View style={[styles.userCell, styles.statusColumn]}>
              <View style={[
                styles.statusBadge,
                item.status === 'Active' && styles.activeBadge,
                item.status === 'Inactive' && styles.inactiveBadge,
                item.status === 'Pending' && styles.pendingBadge,
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <View style={[styles.userCell, styles.actionsColumn]}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
                  handleStatusChange(item.id, newStatus);
                }}
                disabled={item.status === 'Pending'}
              >
                <Text style={styles.actionButtonText}>
                  {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text>No users found</Text>
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
  addUserForm: {
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
  nameColumn: {
    flex: 2,
  },
  emailColumn: {
    flex: 3,
  },
  roleColumn: {
    flex: 1,
  },
  statusColumn: {
    flex: 1,
  },
  actionsColumn: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userCell: {
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
  },
  inactiveBadge: {
    backgroundColor: '#E0E0E0',
  },
  pendingBadge: {
    backgroundColor: '#FFF8E1',
  },
  statusText: {
    fontSize: 12,
  },
  actionButton: {
    backgroundColor: '#4D73FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
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