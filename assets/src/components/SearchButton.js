import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Install if not installed: npm install react-native-vector-icons

const SearchButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name="search" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF', // Change to your brand color
    padding: 10,
    borderRadius: 25,
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
  },
});

export default SearchButton;
