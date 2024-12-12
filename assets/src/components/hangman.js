import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Animated, Alert } from 'react-native';
import { Svg, Circle, Line } from 'react-native-svg';
import Confetti from 'react-native-confetti';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const wordBank = [
  { 
    word: 'LIVER_DAMAGE', 
    clue: 'Harm to the liver caused by anabolic steroid use', 
    fact: 'Long-term use of anabolic steroids can cause liver tumors and a condition called peliosis hepatis, where blood-filled cysts form in the liver.'
  },
  { 
    word: 'HEART_DISEASE', 
    clue: 'Cardiovascular issues from stimulant or steroid use', 
    fact: 'Substances like anabolic steroids and EPO can increase the risk of heart attacks, strokes, and high blood pressure.'
  },
  { 
    word: 'HORMONAL_IMBALANCE', 
    clue: 'Disruption of natural hormone production', 
    fact: 'Doping substances like testosterone can suppress natural hormone production, leading to infertility and other endocrine disorders.'
  },
  { 
    word: 'PSYCHOLOGICAL_DEPENDENCE', 
    clue: 'Addiction to performance-enhancing drugs', 
    fact: 'Some substances, such as stimulants and anabolic steroids, can lead to psychological addiction and withdrawal symptoms.'
  },
  { 
    word: 'IMMUNE_SYSTEM_DAMAGE', 
    clue: 'Weakened immune defenses due to doping', 
    fact: 'Prolonged use of glucocorticoids can suppress the immune system, making athletes more susceptible to infections.'
  },
  { 
    word: 'BONE_DENSITY_LOSS', 
    clue: 'Weakened bones caused by glucocorticoid misuse', 
    fact: 'Long-term glucocorticoid use can lead to osteoporosis, making bones brittle and more prone to fractures.'
  },
  { 
    word: 'KIDNEY_FAILURE', 
    clue: 'Damage to the kidneys from excessive substance use', 
    fact: 'Misuse of EPO and diuretics can strain the kidneys, leading to dehydration and, in severe cases, kidney failure.'
  },
  { 
    word: 'PSYCHOSIS', 
    clue: 'Severe mental health issues linked to doping substances', 
    fact: 'Excessive use of stimulants like amphetamines can cause hallucinations, paranoia, and even psychosis in athletes.'
  },
  { 
    word: 'CANCER_RISK', 
    clue: 'Increased likelihood of developing cancer', 
    fact: 'Certain substances, such as unregulated hormone supplements, have been linked to an elevated risk of cancers like liver or prostate cancer.'
  },
  { 
    word: 'SKIN_CONDITIONS', 
    clue: 'Acne and skin infections from doping', 
    fact: 'Anabolic steroid misuse can cause severe acne, cyst formation, and increased risk of skin infections due to weakened immunity.'
  }
];


const MAX_TRIES = 6;

const Hangman = ({ navigation }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [currentClue, setCurrentClue] = useState('');
  const [currentFact, setCurrentFact] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [confettiRef] = useState(React.createRef());
  const [correctGuessAnim] = useState(new Animated.Value(0));
  const [showCorrectGuess, setShowCorrectGuess] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showWordFact, setShowWordFact] = useState(false);
  const [userName, setUserName] = useState('Player');

  useEffect(() => {
    loadUserName();
    startNewGame();
  }, []);

  const loadUserName = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserName(parsedData.first_name || 'Player');
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const submitScore = async (finalScore) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const userId = parsedData.id;
  
        const scoreData = {
          game_name: 'hangman',
          score: finalScore,
          user_id: userId
        };
  
        const response = await axios.post('http://127.0.0.1:8000/game-scores', scoreData);
        
        Alert.alert('Score Submitted', `You scored ${finalScore} points!`);
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      Alert.alert('Score Submission Failed', 'Please check your connection and try again.');
    }
  };

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * wordBank.length);
    const selectedWord = wordBank[randomIndex];
    setCurrentWord(selectedWord.word);
    setCurrentClue(selectedWord.clue);
    setCurrentFact(selectedWord.fact);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
    setShowCorrectGuess(false);
    setShowGameOver(false);
    setShowWordFact(false);
  };

  const handleLetterPress = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    // Remove spaces from the current word for checking
    const wordWithoutSpaces = currentWord.replace(/\s/g, '');

    if (!wordWithoutSpaces.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= MAX_TRIES) {
        setGameStatus('lost');
        setShowGameOver(true);
        submitScore(score);
      }
    } else {
      const newScore = score + 1;
      setScore(newScore);
      animateCorrectGuess();
      
      const isWordComplete = currentWord.split('').every(char => 
        char === ' ' || newGuessedLetters.includes(char)
      );
      
      if (isWordComplete) {
        setGameStatus('won');
        setShowGameOver(true);
        setShowWordFact(true);
        submitScore(newScore);
        if (confettiRef.current) {
          confettiRef.current.startConfetti();
        }
      }
    }
  };

  const animateCorrectGuess = () => {
    setShowCorrectGuess(true);
    Animated.sequence([
      Animated.timing(correctGuessAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(correctGuessAnim, {
        toValue: 0,
        duration: 500,
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCorrectGuess(false));
  };

  const renderHangman = () => (
    <Svg height="200" width="200" viewBox="0 0 200 200">
      <Line x1="40" y1="180" x2="160" y2="180" stroke="white" strokeWidth="4"/>
      <Line x1="100" y1="180" x2="100" y2="20" stroke="white" strokeWidth="4"/>
      <Line x1="100" y1="20" x2="140" y2="20" stroke="white" strokeWidth="4"/>
      <Line x1="140" y1="20" x2="140" y2="40" stroke="white" strokeWidth="4"/>
      
      {wrongGuesses >= 1 && (
        <Circle cx="140" cy="55" r="15" stroke="white" strokeWidth="4" fill="none"/>
      )}
      {wrongGuesses >= 2 && (
        <Line x1="140" y1="70" x2="140" y2="110" stroke="white" strokeWidth="4"/>
      )}
      {wrongGuesses >= 3 && (
        <Line x1="140" y1="80" x2="120" y2="100" stroke="white" strokeWidth="4"/>
      )}
      {wrongGuesses >= 4 && (
        <Line x1="140" y1="80" x2="160" y2="100" stroke="white" strokeWidth="4"/>
      )}
      {wrongGuesses >= 5 && (
        <Line x1="140" y1="110" x2="120" y2="140" stroke="white" strokeWidth="4"/>
      )}
      {wrongGuesses >= 6 && (
        <Line x1="140" y1="110" x2="160" y2="140" stroke="white" strokeWidth="4"/>
      )}
    </Svg>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Hangman</Text>
        <View style={styles.navRight} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((MAX_TRIES - wrongGuesses) / MAX_TRIES) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Tries Left: {MAX_TRIES - wrongGuesses}</Text>
      </View>

      <View style={styles.gameContainer}>
        <Confetti ref={confettiRef} />
        
        <View style={styles.hangmanContainer}>
          {renderHangman()}
        </View>

        <View style={styles.clueContainer}>
          <Text style={styles.clue}>Clue: {currentClue}</Text>
        </View>
        
        <View style={styles.wordContainer}>
          {currentWord.split('').map((letter, index) => (
            letter === ' ' ? (
              <View key={`space-${index}`} style={styles.spaceContainer} />
            ) : (
              <Text key={index} style={styles.letterSpace}>
                {guessedLetters.includes(letter) ? letter : '_'}
              </Text>
            )
          ))}
        </View>
        
        <View style={styles.keyboardContainer}>
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
            <TouchableOpacity
              key={letter}
              style={[
                styles.letterButton,
                guessedLetters.includes(letter) && (
                  currentWord.replace(/\s/g, '').includes(letter) ? styles.correctButton : styles.wrongButton
                )
              ]}
              onPress={() => handleLetterPress(letter)}
              disabled={guessedLetters.includes(letter)}
            >
              <Text style={styles.letterButtonText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {showGameOver && (
        <View style={styles.gameOverContainer}>
          <View style={styles.gameOverContent}>
            <Text style={styles.gameOverText}>
              {gameStatus === 'won' ? 'Congratulations!' : 'Game Over!'}
            </Text>
            <Text style={styles.gameOverSubtext}>
              {gameStatus === 'won' ? 'You guessed the word correctly!' : `The word was "${currentWord}"`}
            </Text>
            {showWordFact && (
              <View style={styles.factContainer}>
                <Text style={styles.factTitle}>Interesting Fact:</Text>
                <Text style={styles.factText}>{currentFact}</Text>
              </View>
            )}
            <TouchableOpacity 
              style={[styles.gameOverButton, styles.tryAgainButton]} 
              onPress={startNewGame}
            >
              <Text style={styles.gameOverButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showCorrectGuess && (
        <Animated.View style={[styles.correctGuessOverlay, {
          opacity: correctGuessAnim,
          transform: [{
            scale: correctGuessAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          }],
        }]}>
          <Text style={styles.correctGuessText}>Correct!</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    padding: 15,
    paddingTop: 50,
  },
  navTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  navRight: {
    width: 40,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
  },
  progressBar: {
    height: 20,
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'darkgreen',
    borderRadius: 10,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
    color: 'lightgreen',
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    padding: 20,
  },
  hangmanContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  clueContainer: {
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  clue: {
    fontSize: 16,
    textAlign: 'center',
    color: 'lightgray',
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  letterSpace: {
    fontSize: 30,
    marginHorizontal: 5,
    fontWeight: 'bold',
    color: 'white',
  },
  keyboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  letterButton: {
    width: 35,
    height: 35,
    margin: 3,
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: 'rgba(0, 200, 0, 0.7)',
  },
  wrongButton: {
    backgroundColor: 'rgba(200, 0, 0, 0.7)',
  },
  letterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContent: {
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  gameOverSubtext: {
    fontSize: 18,
    color: 'lightgray',
    textAlign: 'center',
    marginBottom: 20,
  },
  gameOverButton: {
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  tryAgainButton: {
    backgroundColor: 'rgba(0, 200, 0, 0.9)',
  },
  gameOverButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  correctGuessOverlay: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 200, 0, 0.9)',
    padding: 20,
    borderRadius: 10,
    zIndex: 1000,
  },
  correctGuessText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  factContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    width: '100%',
  },
  factTitle: {
    color: 'lightgreen',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  factText: {
    color: 'lightgray',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Hangman;