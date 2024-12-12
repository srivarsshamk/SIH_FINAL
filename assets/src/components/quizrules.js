import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const QuizRulesScreen = () => {
  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('../../fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../../fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Medium': require('../../fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../../fonts/Montserrat-Regular.ttf'),
  });

  const navigation = useNavigation();

  const handleStartGame = () => {
    navigation.navigate('Quiz Category');
  };

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <View style={styles.container}>
      <View style={styles.rulesContainer}>
        <Text style={styles.title}>Quiz Game Rules</Text>
        
        <View style={styles.ruleSection}>
          <Text style={styles.ruleHeader}>Game Structure</Text>
          <View style={styles.ruleTextContainer}>
            <Text style={styles.ruleText}>• Total of 20 questions per category</Text>
            <Text style={styles.ruleText}>• Each correct answer: +1 point</Text>
            <Text style={styles.ruleText}>• Wrong answer: 0 points</Text>
          </View>
        </View>

        <View style={styles.ruleSection}>
          <Text style={styles.ruleHeader}>Time Management</Text>
          <View style={styles.ruleTextContainer}>
            <Text style={styles.ruleText}>• 30 seconds timer per question</Text>
            <Text style={styles.ruleText}>• Timer starts immediately</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartGame}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
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
    width: width * 0.85,
    backgroundColor: '#000', 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00FF66',
    padding: 25,
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#00FF66', 
    textAlign: 'center',
    marginBottom: 25,
    letterSpacing: 1,
  },
  ruleSection: {
    marginBottom: 25,
  },
  ruleHeader: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#00CC55', 
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  ruleTextContainer: {
    backgroundColor: 'rgba(0, 255, 102, 0.05)',
    borderRadius: 10,
    padding: 15,
  },
  ruleText: {
    fontFamily: 'Montserrat-Medium',
    color: '#00A040', 
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 22,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#00FF66', 
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: '#000', 
    fontSize: 16,
    letterSpacing: 1,
  }
});

export default QuizRulesScreen;