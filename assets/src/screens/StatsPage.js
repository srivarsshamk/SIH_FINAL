import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const StatsPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Overview');

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const renderContent = () => {
   
    return <Text style={styles.placeholder}>Content for {activeTab} coming soon!</Text>;
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="home" size={28} color="#008000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistics Overview</Text>
        <Text style={styles.headerSubtitle}>A Deep Dive into the Numbers</Text>
        <View style={styles.headerUnderline} />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        {['Overview', 'Testing', 'Violation'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.categoryButton, activeTab === tab && styles.activeCategory]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.categoryText, activeTab === tab && styles.activeCategoryText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#a0a0a0',
    fontSize: 16,
    textAlign: 'center',
  },
  headerUnderline: {
    height: 3,
    width: 100,
    backgroundColor: '#008000',
    marginTop: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#202020',
  },
  activeCategory: {
    backgroundColor: '#008000',
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 16,
  },
  activeCategoryText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  contentScroll: {
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    color: '#008000',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
 
  placeholder: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default StatsPage;
