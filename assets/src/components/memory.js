import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView, Dimensions } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const images = [
  require('../../images/image1.png'),
  require('../../images/image2.png'),
  require('../../images/image3.png'),
  require('../../images/image4.png'),
  require('../../images/image5.png'),
  require('../../images/image6.png'),
  require('../../images/image7.png'),
  require('../../images/image8.png'),
];

const shuffleArray = (array) => {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const submitScore = async (finalScore) => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      const userId = parsedData.id;

      const scoreData = {
        game_name: 'memory',
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

const App = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    const shuffledCards = shuffleArray([...images, ...images].map((img, index) => ({ id: index, image: img, flipped: false, matched: false })));
    setCards(shuffledCards);
  }, []);

  useEffect(() => {
    if (gameActive) {
      const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameActive]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const updatedCards = [...cards];
      if (updatedCards[firstIndex].image === updatedCards[secondIndex].image) {
        updatedCards[firstIndex].matched = true;
        updatedCards[secondIndex].matched = true;
        setMatchedPairs((prev) => prev + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
      } else {
        setTimeout(() => {
          updatedCards[firstIndex].flipped = false;
          updatedCards[secondIndex].flipped = false;
          setCards(updatedCards);
        }, 1000);
      }
      setCards(updatedCards);
      setFlippedIndices([]);
    }
  }, [flippedIndices]);

  useEffect(() => {
    if (matchedPairs === images.length) {
      setGameActive(false);
      const finalScore = Math.max(0, 1000 - elapsedTime * 10);
      setScore(finalScore);
      setTimeout(async () => {
        await submitScore(finalScore);
        Alert.alert(
          'Congratulations!', 
          `You matched all pairs in ${elapsedTime} seconds! Your score: ${finalScore}`
        );
      }, 1000);
    }
  }, [matchedPairs]);

  const handleCardPress = (index) => {
    if (cards[index].flipped || cards[index].matched) return;

    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);

    setFlippedIndices((prev) => [...prev, index]);
  };

  const restartGame = () => {
    const shuffledCards = shuffleArray([...images, ...images].map((img, index) => ({ id: index, image: img, flipped: false, matched: false })));
    setCards(shuffledCards);
    setMatchedPairs(0);
    setShowConfetti(false);
    setElapsedTime(0);
    setScore(0);
    setGameStarted(false);
    setGameActive(false);
  };

  const [showInstructions, setShowInstructions] = useState(true);

  const startGame = () => {
    setShowInstructions(false);
    setGameStarted(true);
    setGameActive(true);
    setElapsedTime(0);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
      {showInstructions ? (
        <View style={styles.startScreen}>
          <Text style={styles.title}>Anti Doping Memory Match</Text>
          <Text style={styles.startText}>Ready to test your memory?</Text>
          <Text style={styles.instructions}>
            Instructions:
            {"\n\n"}
            1. Flip two cards at a time to find matching pairs.
            {"\n"}
            2. If the cards match, they stay flipped.
            {"\n"}
            3. If the cards don't match, they will flip back after a short time.
            {"\n"}
            4. Try to match all pairs in the shortest time possible.
          </Text>
          <Button mode="contained" onPress={startGame} style={styles.startButton}>
            Start Game
          </Button>
        </View>
      ) : (
        <View style={styles.content}>
          {showConfetti &&<ConfettiCannon count={150} origin={{ x: width / 2, y: height / 3 }} />}
          <View style={styles.stats}>
            <Text style={styles.timer}>Time: {elapsedTime}s</Text>
            <Text style={styles.score}>Score: {score}</Text>
          </View>
          <View style={styles.grid}>
            {cards.map((card, index) => (
              <TouchableOpacity key={index} onPress={() => handleCardPress(index)} style={styles.card}>
                <View style={[styles.cardInner, card.flipped || card.matched ? styles.flipped : null]}>
                  <Image source={card.flipped || card.matched ? card.image : null} style={[styles.cardImage, {backgroundColor: card.flipped || card.matched ? 'transparent' : '#03615b'}]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <Button
  mode="contained"
  onPress={restartGame}
  style={[styles.restartButton, { justifyContent: 'center', alignItems: 'center' }]}
>
  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#03615b' }}>
    Restart Game
  </Text>
</Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    color: '#33FFBD',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  startText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#33FFBD',
    textAlign: 'center',
  },
  instructions: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#03615b',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#33FFBD',
  },
  timer: {
    fontSize: 18,
    color: '#000',
  },
  score: {
    fontSize: 18,
    color: '#000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    width: width * 0.4,
  },
  card: {
    margin: 5,
    width: '20%',
    height: 120,
  },
  cardInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#03615b',
    borderRadius: 10,
  },
  flipped: {
    backgroundColor: '#33FFBD',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  restartButton: {
    backgroundColor: '#33FFBD',
    marginTop: 20,
    width: '15%',
    height: '6%',
    padding: 10,
  },
});

export default App;


