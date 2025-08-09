import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function AdminDashboard({ navigation }) {
  const businesses = ['Boutique', 'Hardware', 'Cold Store'];
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      
      {/* Business Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Businesses</Text>
        <View style={styles.businessContainer}>
          {businesses.map((business, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.businessCard}
              onPress={() => navigation.navigate('Inventory', { business })}
            >
              <Text style={styles.businessText}>{business}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Summary Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Total Sales</Title>
              <Paragraph>$24,500</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Inventory Value</Title>
              <Paragraph>$56,200</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Expenses</Title>
              <Paragraph>$8,750</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Profit</Title>
              <Paragraph>$15,750</Paragraph>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
      
      {/* Sales Trends Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sales Trends</Text>
        <View style={styles.chartPlaceholder}>
          <Text>Chart will be displayed here</Text>
        </View>
      </View>
      
      {/* Recent Sales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Sales</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Date</Text>
            <Text style={styles.tableHeader}>Business</Text>
            <Text style={styles.tableHeader}>Amount</Text>
          </View>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>2023-06-{10 + index}</Text>
              <Text style={styles.tableCell}>{businesses[index % 3]}</Text>
              <Text style={styles.tableCell}>${(500 + index * 100).toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  businessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  businessCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    elevation: 2,
  },
  businessText: {
    fontWeight: 'bold',
  },
  card: {
    width: 150,
    marginRight: 16,
    elevation: 2,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
  },
});