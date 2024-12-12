import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { PlayCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const HangmanRulesScreen = () => {
  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('../../fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../../fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Regular': require('../../fonts/Montserrat-Regular.ttf'),
  });

  const navigation = useNavigation();

  const handleStartGame = () => {
    navigation.navigate('Hangman Level');
  };

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <View style={styles.container}>
      <View style={styles.rulesContainer}>
        <Text style={styles.title}>Hangman Game Rules</Text>

        <View style={styles.ruleSection}>
          <Text style={styles.ruleHeader}>Objective</Text>
          <Text style={styles.ruleText}>
            Guess the hidden word by selecting letters before you run out of attempts.
          </Text>
        </View>

        <View style={styles.ruleSection}>
          <Text style={styles.ruleHeader}>Scoring</Text>
          <Text style={styles.ruleText}>
            For every correctly guessed word, you earn points equal to the number of letters in the word.
          </Text>
        </View>

        <View style={styles.ruleSection}>
          <Text style={styles.ruleHeader}>Gameplay</Text>
          <Text style={styles.ruleText}>
            • Select letters one at a time.{"\n"}
            • Incorrect guesses will cost you attempts.{"\n"}
            • Game ends when all words in the level are completed or attempts run out.
          </Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
          <PlayCircle size={24} color="#000" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  rulesContainer: {
    width: width * 0.9,
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 26,
    color: '#00FF66',
    textAlign: 'center',
    marginBottom: 20,
  },
  ruleSection: {
    marginBottom: 20,
  },
  ruleHeader: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#00FF66',
    marginBottom: 10,
  },
  ruleText: {
    fontFamily: 'Montserrat-Regular',
    color: '#FFF',
    fontSize: 16,
    lineHeight: 22,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#00FF66',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  startButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: '#000',
    fontSize: 18,
  },
});

export default HangmanRulesScreen;
