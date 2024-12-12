import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { ArrowLeftCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const levels = [
  { id: 1, name: 'Health Risks', screen: 'Hangman' },
  { id: 2, name: 'Doping Substances', screen: 'Hangman1' },
  { id: 3, name: 'Doping Procedures', screen: 'Hangman2' },
  { id: 4, name: 'Doping Consequences', screen: 'Hangman3' },
];

const LevelSelectorScreen = () => {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('../../fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../../fonts/Montserrat-SemiBold.ttf'),
  });

  const handleLevelSelect = (screen) => {
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
        <ArrowLeftCircle color="#00FF66" size={30} />
      </TouchableOpacity>

      <Text style={styles.title}>Select a Level</Text>

      <View style={styles.levelsContainer}>
        {levels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={styles.levelButton}
            onPress={() => handleLevelSelect(level.screen)}
          >
            <Text style={styles.levelText}>{level.name}</Text>
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
    alignItems: 'center',
    paddingTop: 50,
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
  },
  levelsContainer: {
    width: width * 0.85,
    alignItems: 'center',
  },
  levelButton: {
    width: '100%',
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderWidth: 1,
    borderColor: '#00FF66',
    borderRadius: 15,
    paddingVertical: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  levelText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFF',
    fontSize: 18,
  },
});

export default LevelSelectorScreen;
