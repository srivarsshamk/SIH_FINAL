import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { PlayCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SnakeLadderRulesScreen = () => {
  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('../../fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../../fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Regular': require('../../fonts/Montserrat-Regular.ttf'),
  });

  const navigation = useNavigation();

  const handleStartGame = () => {
    navigation.navigate('Simulation');
  };

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <View style={styles.container}>
      <View style={styles.rulesContainer}>
        <Text style={styles.title}>Snake & Ladder Game Rules</Text>
        
        <View style={styles.ruleSection}>
          <Text style={styles.ruleHeader}>Objective</Text>
          <Text style={styles.ruleText}>
            Be the first player to reach the 100th square by rolling the dice and navigating through snakes and ladders.
          </Text>
        </View>

        <View style={styles.ruleSection}>
          <Text style={styles.ruleHeader}>Gameplay</Text>
          <Text style={styles.ruleText}>
            • Players take turns rolling a single die.{"\n"}
            • Move your token forward by the number of squares shown on the die.{"\n"}
            • If you land on the bottom of a ladder, climb up to the top square.{"\n"}
            • If you land on the head of a snake, slide down to its tail.{"\n"}
            • The first player to reach exactly 100 wins the game.
          </Text>
        </View>

        <View style={styles.ruleSection}>
          <Text style={styles.ruleHeader}>Special Rules</Text>
          <Text style={styles.ruleText}>
            • If you roll a 6, you get an extra turn.{"\n"}
            • To win, you must land exactly on square 100.{"\n"}
            • If your move would take you beyond 100, stay in your current position.
          </Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <PlayCircle color="#000" size={24} style={{marginRight: 10}}/>
          <Text style={styles.startButtonText}>Start Game</Text>
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

export default SnakeLadderRulesScreen;