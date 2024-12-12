import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { ChevronRight } from 'lucide-react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CrosswordRulesScreen = ({ navigation }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Animate elements on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Button press animation
  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      navigation.navigate('Crossword Level');
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.contentContainer,
          { 
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
            ]
          }
        ]}
      >
        <Text style={styles.title}>Anti-Doping Crossword</Text>
        
        <View style={styles.rulesSection}>
          <Text style={styles.rulesHeader}>Game Rules</Text>
          <Text style={styles.rulesText}>
            • Fill in the crossword grid with words related to anti-doping
            • Each word corresponds to a clue provided below the grid
            • Click on a cell to select it
            • Toggle between across and down directions by clicking the same cell
            • Use the on-screen keyboard to enter letters
            • Complete all words to win the game!
          </Text>
        </View>
        
        <View style={styles.scoringSection}>
          <Text style={styles.rulesHeader}>Scoring</Text>
          <Text style={styles.rulesText}>
            • 10 points for each correctly filled word
            • Bonus 50 points for completing the entire crossword
            • Time bonus: Faster completion yields higher score
            • Minimum goal: Fill 70% of the crossword
          </Text>
        </View>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            transform: [
              { scale: buttonScale }
            ]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleButtonPress}
        >
          <Text style={styles.nextButtonText}>Start Game</Text>
          <ChevronRight color="#ffffff" size={24} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  rulesSection: {
    width: '100%',
    marginBottom: 20,
  },
  scoringSection: {
    width: '100%',
  },
  rulesHeader: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  rulesText: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default CrosswordRulesScreen;