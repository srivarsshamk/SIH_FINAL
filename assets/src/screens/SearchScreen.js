import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';

const screens = [
  { id: '1', key: 'Modules', value: 'ModuleScreen' },
  { id: '2', key: 'Games', value: 'Game' },
  { id: '3', key: 'Substance Scanner', value: 'ImageTextExtractor' },
  { id: '4', key: 'Post', value: 'Post' },
  { id: '5', key: 'Forum', value: 'Forum' },
  { id: '6', key: 'Quiz', value: 'ModuleScreen'},
];

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);
    if (text) {
      const newData = screens.filter(item => item.key.toLowerCase().includes(text.toLowerCase()));
      setFilteredData(newData);
    } else {
      setFilteredData([]);
    }
  };

  const handleNavigate = (item) => {
    navigation.navigate(item.value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileIcon}></View>
      <TextInput 
        style={styles.input} 
        placeholder="Type here..." 
        placeholderTextColor="#888" 
        value={query} 
        onChangeText={handleSearch} 
      />
      {query.length > 0 && (
        <FlatList 
          data={filteredData} 
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.reportContainer} 
              activeOpacity={0.8} 
              onPress={() => handleNavigate(item)}
            >
              <Text style={styles.title}>{item.key}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No results found</Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "220%",
    paddingTop: 20,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    padding: 10,
    backgroundColor: "#002D04",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 30,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: "#C9D1D9",
    fontSize: 18,
    fontWeight: "500",
    marginHorizontal: 15,
    letterSpacing: 0.5,
  },
  reportContainer: {
    width: "70%",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 100,
  },
  scanButton: {
    position: "absolute",
    bottom: 30,
    left: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#002D04",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  chatFab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#002D04",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 2,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});

export default SearchScreen;
