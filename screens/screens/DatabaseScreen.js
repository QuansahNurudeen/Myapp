import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function DatabaseScreen() {
  const [activeTab, setActiveTab] = useState('explorer');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM sales LIMIT 10');
  const [environment, setEnvironment] = useState('production');
  
  // Mock data for tables
  const tables = [
    { name: 'users', rowCount: 42, size: '1.2MB' },
    { name: 'sales', rowCount: 1250, size: '3.8MB' },
    { name: 'inventory', rowCount: 320, size: '2.1MB' },
    { name: 'expenses', rowCount: 180, size: '0.9MB' },
    { name: 'categories', rowCount: 15, size: '0.1MB' },
  ];

  // Mock query results
  const queryResults = [
    { id: 1, date: '2023-06-01', amount: 125.50, business: 'Boutique' },
    { id: 2, date: '2023-06-01', amount: 89.99, business: 'Hardware' },
    { id: 3, date: '2023-06-02', amount: 45.75, business: 'Boutique' },
    { id: 4, date: '2023-06-02', amount: 220.00, business: 'Cold Store' },
    { id: 5, date: '2023-06-03', amount: 67.30, business: 'Hardware' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Database Management</Text>
      
      {/* Environment Selector */}
      <View style={styles.environmentSelector}>
        <TouchableOpacity 
          style={[
            styles.envButton, 
            environment === 'production' && styles.envButtonActive
          ]}
          onPress={() => setEnvironment('production')}
        >
          <Text style={[
            styles.envButtonText,
            environment === 'production' && styles.envButtonTextActive
          ]}>
            Production
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.envButton, 
            environment === 'staging' && styles.envButtonActive
          ]}
          onPress={() => setEnvironment('staging')}
        >
          <Text style={[
            styles.envButtonText,
            environment === 'staging' && styles.envButtonTextActive
          ]}>
            Staging
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.envButton, 
            environment === 'development' && styles.envButtonActive
          ]}
          onPress={() => setEnvironment('development')}
        >
          <Text style={[
            styles.envButtonText,
            environment === 'development' && styles.envButtonTextActive
          ]}>
            Development
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Database Size</Text>
          <Text style={styles.statValue}>8.5 MB</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Uptime</Text>
          <Text style={styles.statValue}>99.9%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Last Backup</Text>
          <Text style={styles.statValue}>Today 02:00</Text>
        </View>
      </View>
      
      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'explorer' && styles.activeTab
          ]}
          onPress={() => setActiveTab('explorer')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'explorer' && styles.activeTabText
          ]}>
            Tables Explorer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'query' && styles.activeTab
          ]}
          onPress={() => setActiveTab('query')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'query' && styles.activeTabText
          ]}>
            Query Interface
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'backup' && styles.activeTab
          ]}
          onPress={() => setActiveTab('backup')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'backup' && styles.activeTabText
          ]}>
            Backup/Restore
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content Area */}
      {activeTab === 'explorer' && (
        <View style={styles.content}>
          <Text style={styles.subheader}>Database Tables</Text>
          <ScrollView style={styles.tableList}>
            {tables.map((table, index) => (
              <TouchableOpacity key={index} style={styles.tableCard}>
                <Text style={styles.tableName}>{table.name}</Text>
                <View style={styles.tableMeta}>
                  <Text style={styles.tableMetaText}>{table.rowCount} rows</Text>
                  <Text style={styles.tableMetaText}>{table.size}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      {activeTab === 'query' && (
        <View style={styles.content}>
          <Text style={styles.subheader}>SQL Query Interface</Text>
          <TextInput
            style={styles.queryInput}
            multiline
            value={sqlQuery}
            onChangeText={setSqlQuery}
            placeholder="Enter your SQL query here"
          />
          <TouchableOpacity style={styles.runButton}>
            <Text style={styles.runButtonText}>Run Query</Text>
          </TouchableOpacity>
          
          <Text style={styles.resultsHeader}>Results (5 rows)</Text>
          <View style={styles.resultsHeaderRow}>
            <Text style={[styles.columnHeader, { flex: 1 }]}>ID</Text>
            <Text style={[styles.columnHeader, { flex: 2 }]}>Date</Text>
            <Text style={[styles.columnHeader, { flex: 2 }]}>Amount</Text>
            <Text style={[styles.columnHeader, { flex: 2 }]}>Business</Text>
          </View>
          <ScrollView style={styles.resultsContainer}>
            {queryResults.map((row, index) => (
              <View key={index} style={styles.resultRow}>
                <Text style={[styles.resultCell, { flex: 1 }]}>{row.id}</Text>
                <Text style={[styles.resultCell, { flex: 2 }]}>{row.date}</Text>
                <Text style={[styles.resultCell, { flex: 2 }]}>${row.amount}</Text>
                <Text style={[styles.resultCell, { flex: 2 }]}>{row.business}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      
      {activeTab === 'backup' && (
        <View style={styles.content}>
          <Text style={styles.subheader}>Backup Management</Text>
          
          <View style={styles.backupOption}>
            <Text style={styles.optionTitle}>Create New Backup</Text>
            <Text style={styles.optionDescription}>Generate a complete snapshot of your database</Text>
            <View style={styles.backupSettings}>
              <Text style={styles.settingLabel}>Backup Type:</Text>
              <Picker
                style={styles.settingPicker}
                selectedValue="full"
              >
                <Picker.Item label="Full Backup" value="full" />
                <Picker.Item label="Partial Backup" value="partial" />
              </Picker>
            </View>
            <TouchableOpacity style={styles.backupButton}>
              <Text style={styles.backupButtonText}>Create Backup Now</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.backupOption}>
            <Text style={styles.optionTitle}>Restore Backup</Text>
            <Text style={styles.optionDescription}>Select a previous backup to restore</Text>
            <Picker
              style={styles.restorePicker}
              selectedValue="latest"
            >
              <Picker.Item label="Latest Backup (Today 02:00)" value="latest" />
              <Picker.Item label="Yesterday's Backup" value="yesterday" />
              <Picker.Item label="Weekly Backup (June 1)" value="weekly" />
            </Picker>
            <TouchableOpacity style={[styles.backupButton, styles.restoreButton]}>
              <Text style={styles.backupButtonText}>Restore Backup</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Danger Zone */}
      <View style={styles.dangerZone}>
        <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
        <Text style={styles.dangerZoneWarning}>These actions cannot be undone</Text>
        
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Reset Database</Text>
        </TouchableOpacity>
      </View>
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
  environmentSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  envButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  envButtonActive: {
    borderColor: '#4D73FF',
    backgroundColor: '#E6EEFF',
  },
  envButtonText: {
    color: '#666',
  },
  envButtonTextActive: {
    color: '#4D73FF',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomColor: '#4D73FF',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#4D73FF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginBottom: 16,
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tableList: {
    flex: 1,
  },
  tableCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  tableName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  tableMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableMetaText: {
    color: '#666',
    fontSize: 12,
  },
  queryInput: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    minHeight: 100,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  runButton: {
    backgroundColor: '#4D73FF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  runButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  columnHeader: {
    fontWeight: 'bold',
    color: '#666',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 8,
  },
  resultCell: {
    fontSize: 14,
  },
  backupOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    color: '#666',
    marginBottom: 12,
  },
  backupSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    marginRight: 8,
  },
  settingPicker: {
    flex: 1,
    height: 40,
  },
  backupButton: {
    backgroundColor: '#4D73FF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  restoreButton: {
    backgroundColor: '#FFA500',
  },
  backupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  restorePicker: {
    width: '100%',
    marginBottom: 12,
  },
  dangerZone: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  dangerZoneTitle: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  dangerZoneWarning: {
    color: '#D32F2F',
    fontSize: 12,
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});