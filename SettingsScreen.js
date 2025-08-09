import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    notifications: true,
    lowStockThreshold: 10,
    defaultTaxRate: 7.5,
    twoFactorAuth: false,
    sessionTimeout: 30,
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      
      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Profile Photo</Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value="John Doe"
            onChangeText={(text) => console.log(text)}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value="john@example.com"
            onChangeText={(text) => console.log(text)}
            keyboardType="email-address"
            editable={false}
          />
        </View>
      </View>
      
      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Theme</Text>
          <Picker
            selectedValue={settings.theme}
            style={styles.picker}
            onValueChange={(itemValue) => handleSettingChange('theme', itemValue)}
          >
            <Picker.Item label="Light" value="light" />
            <Picker.Item label="Dark" value="dark" />
            <Picker.Item label="System Default" value="system" />
          </Picker>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Language</Text>
          <Picker
            selectedValue={settings.language}
            style={styles.picker}
            onValueChange={(itemValue) => handleSettingChange('language', itemValue)}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Spanish" value="es" />
            <Picker.Item label="French" value="fr" />
          </Picker>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Date Format</Text>
          <Picker
            selectedValue={settings.dateFormat}
            style={styles.picker}
            onValueChange={(itemValue) => handleSettingChange('dateFormat', itemValue)}
          >
            <Picker.Item label="MM/DD/YYYY" value="MM/DD/YYYY" />
            <Picker.Item label="DD/MM/YYYY" value="DD/MM/YYYY" />
            <Picker.Item label="YYYY-MM-DD" value="YYYY-MM-DD" />
          </Picker>
        </View>
      </View>
      
      {/* Business Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Business Name</Text>
          <TextInput
            style={styles.input}
            value="My Business"
            onChangeText={(text) => console.log(text)}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Default Tax Rate (%)</Text>
          <TextInput
            style={styles.input}
            value={settings.defaultTaxRate.toString()}
            onChangeText={(text) => handleSettingChange('defaultTaxRate', parseFloat(text) || 0)}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Low Stock Threshold</Text>
          <TextInput
            style={styles.input}
            value={settings.lowStockThreshold.toString()}
            onChangeText={(text) => handleSettingChange('lowStockThreshold', parseInt(text) || 0)}
            keyboardType="numeric"
          />
        </View>
      </View>
      
      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
          <Switch
            value={settings.twoFactorAuth}
            onValueChange={(value) => handleSettingChange('twoFactorAuth', value)}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Session Timeout (minutes)</Text>
          <Picker
            selectedValue={settings.sessionTimeout}
            style={styles.picker}
            onValueChange={(itemValue) => handleSettingChange('sessionTimeout', itemValue)}
          >
            <Picker.Item label="15 minutes" value={15} />
            <Picker.Item label="30 minutes" value={30} />
            <Picker.Item label="60 minutes" value={60} />
          </Picker>
        </View>
      </View>
      
      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => handleSettingChange('notifications', value)}
          />
        </View>
      </View>
      
      {/* Danger Zone */}
      <View style={[styles.section, styles.dangerZone]}>
        <Text style={[styles.sectionTitle, styles.dangerText]}>Danger Zone</Text>
        
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Reset All Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.dangerButton, styles.deleteButton]}>
          <Text style={styles.dangerButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save All Changes</Text>
      </TouchableOpacity>
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginLeft: 16,
  },
  picker: {
    flex: 1,
    height: 40,
    marginLeft: 16,
  },
  uploadButton: {
    backgroundColor: '#4D73FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 16,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dangerZone: {
    borderColor: '#FF4500',
    borderWidth: 1,
  },
  dangerText: {
    color: '#FF4500',
  },
  dangerButton: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF4500',
    borderWidth: 1,
  },
  dangerButtonText: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4D73FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});