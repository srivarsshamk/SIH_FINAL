import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const categories = [
  { 
    id: 1, 
    name: 'Doping Substances', 
    screen: 'Quiz1' 
  },
  { 
    id: 2, 
    name: 'Doping Tests', 
    screen: 'Quiz2' 
  },
  { 
    id: 3, 
    name: 'Health Risks of Doping', 
    screen: 'Quiz3' 
  },
  { 
    id: 4, 
    name: 'Legal & Psychological Aspects', 
    screen: 'Quiz' 
  }
];

const CategorySelectionScreen = () => {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('../../fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../../fonts/Montserrat-SemiBold.ttf'),
  });

  const handleCategorySelect = (screen) => {
    navigation.navigate(screen);
  };

  const handleGoBack = () => {
    navigation.navigate('Game');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <ArrowLeft color="#00FF66" size={24} />
      </TouchableOpacity>

      <Text style={styles.title}>Choose Category</Text>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryButton}
            onPress={() => handleCategorySelect(category.screen)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    color: '#00FF66',
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 255, 102, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  categoriesContainer: {
    width: width * 0.85,
    alignItems: 'center',
  },
  categoryButton: {
    width: '100%',
    backgroundColor: 'rgba(0, 255, 102, 0.05)',
    borderWidth: 1,
    borderColor: '#00FF66',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#00FF66',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default CategorySelectionScreen;