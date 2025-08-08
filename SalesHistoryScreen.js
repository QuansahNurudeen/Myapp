import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SalesHistoryScreen = () => {
  const salesHistory = [
    { id: 1, items: ['Product A (2)', 'Product B (1)'], total: 55, profit: 15, date: '2023-06-15 10:30' },
    { id: 2, items: ['Product C (1)'], total: 25, profit: 8, date: '2023-06-14 16:45' },
    { id: 3, items: ['Product A (3)'], total: 60, profit: 18, date: '2023-06-14 09:15' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Sales History</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Recent Sales</Title>
          
          {salesHistory.map(sale => (
            <View key={sale.id} style={styles.saleItem}>
              <View style={styles.saleInfo}>
                <Text style={styles.saleDate}>{sale.date}</Text>
                <Text style={styles.saleItems}>{sale.items.join(', ')}</Text>
              </View>
              <View style={styles.saleAmounts}>
                <Text style={styles.saleTotal}>${sale.total}</Text>
                <Text style={styles.saleProfit}>Profit: ${sale.profit}</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Sales Summary</Title>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Icon name="today" size={24} color="#4D73FF" />
              <Text style={styles.summaryLabel}>Today</Text>
              <Text style={styles.summaryValue}>$125</Text>
            </View>
            <View style={styles.summaryItem}>
              <Icon name="date-range" size={24} color="#4D73FF" />
              <Text style={styles.summaryLabel}>This Week</Text>
              <Text style={styles.summaryValue}>$580</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Icon name="star" size={24} color="#4D73FF" />
              <Text style={styles.summaryLabel}>Top Product</Text>
              <Text style={styles.summaryValue}>Product A</Text>
            </View>
            <View style={styles.summaryItem}>
              <Icon name="trending-up" size={24} color="#4D73FF" />
              <Text style={styles.summaryLabel}>Total Profit</Text>
              <Text style={styles.summaryValue}>$215</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    marginBottom: 20,
    elevation: 2,
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saleInfo: {
    flex: 2,
  },
  saleDate: {
    fontSize: 12,
    color: '#666',
  },
  saleItems: {
    fontWeight: 'bold',
  },
  saleAmounts: {
    alignItems: 'flex-end',
  },
  saleTotal: {
    fontWeight: 'bold',
  },
  saleProfit: {
    fontSize: 12,
    color: '#4CAF50',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  summaryValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SalesHistoryScreen;