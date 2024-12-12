import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import ConfettiCannon from 'react-native-confetti-cannon';
import { ArrowLeft } from 'lucide-react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CrosswordGame1 = ({ navigation }) => {
  // Updated puzzle data with new words and positions
  const puzzleData = {
    words: [
      {
        id: 1,
        word: 'STEROIDS',
        clue: '1. Across: Substance similair to testosterone',
        direction: 'across',
        row: 0,
        col: 0,
      },
      {
        id: 2,
        word: 'SAMPLE',
        clue: '2. Down: Process of collecting a small amount of substance for testing',
        direction: 'down',
        row: 0,
        col: 0,
      },
      {
        id: 3,
        word: 'APPLY',
        clue: '3. Across: Process of submitting for doping tests',
        direction: 'across',
        row: 2,
        col: 1,
      },
      {
        id: 4,
        word: 'DOPE',
        clue: '4. Down: Process of taking illegal substances',
        direction: 'down',
        row: 0,
        col: 6,
      },
      {
        id: 5,
        word: 'BLOOD',
        clue: '5. Across: __ doping that invloves epo',
        direction: 'across',
        row: 3,
        col: 1,
      },
      {
        id: 6,
        word: 'REPORT',
        clue: '6. Down: Process of submitting evidence against illegal doping',
        direction: 'down',
        row: 0,
        col: 3,
      }
    ],
    size: 9,
  };

  // State management
  const [grid, setGrid] = useState(Array(puzzleData.size).fill().map(() => 
    Array(puzzleData.size).fill().map(() => ({ 
      value: '', 
      number: null, 
      isActive: false 
    }))
  ));
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState('across');
  const [cellAnimations] = useState(
    Array(puzzleData.size).fill().map(() => 
      Array(puzzleData.size).fill().map(() => new Animated.Value(0))
    )
  );
  const [completed, setCompleted] = useState(false);
  const confettiRef = useRef(null);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [gameScore, setGameScore] = useState(0);

  useEffect(() => {
    setGameStartTime(Date.now());
  }, []);
  
  // New method to submit score
  const submitScore = async (finalScore) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const userId = parsedData.id;
        const scoreData = {
          game_name: 'anti-doping-crossword',
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
  
  // Initialize the grid
  useEffect(() => {
    const newGrid = Array(puzzleData.size).fill().map(() => 
      Array(puzzleData.size).fill().map(() => ({ 
        value: '', 
        number: null, 
        isActive: false 
      }))
    );
    
    // Mark active cells and add word numbers
    puzzleData.words.forEach(wordData => {
      const { id, word, row, col, direction } = wordData;
      
      for (let i = 0; i < word.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        
        if (currentRow < puzzleData.size && currentCol < puzzleData.size) {
          newGrid[currentRow][currentCol].isActive = true;
          if (i === 0) {
            newGrid[currentRow][currentCol].number = id;
          }
        }
      }
    });
    
    setGrid(newGrid);
    animateGrid();
  }, []);

  // Animate grid cells appearing
  const animateGrid = () => {
    const animations = cellAnimations.flat().map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    
    Animated.stagger(50, animations).start();
  };

  // Handle cell selection
  const handleCellPress = (row, col) => {
    if (grid[row][col].isActive) {
      setSelectedCell({ row, col });
      if (selectedCell?.row === row && selectedCell?.col === col) {
        setSelectedDirection(selectedDirection === 'across' ? 'down' : 'across');
      }
    }
  };

  // Handle input changes
  const handleInput = (row, col, value) => {
    if (grid[row][col].isActive) {
      const newGrid = [...grid];
      newGrid[row][col] = { ...newGrid[row][col], value: value.toUpperCase() };
      setGrid(newGrid);
      
      // Move to next cell
      if (value !== '') {
        moveToNextCell(row, col);
      }
      
      checkCompletion();
    }
  };

  // Move to next cell
  const moveToNextCell = (row, col) => {
    if (selectedDirection === 'across') {
      if (col + 1 < puzzleData.size && grid[row][col + 1].isActive) {
        setSelectedCell({ row, col: col + 1 });
      }
    } else {
      if (row + 1 < puzzleData.size && grid[row + 1][col].isActive) {
        setSelectedCell({ row: row + 1, col });
      }
    }
  };

  // Check completion
  // Modify the checkCompletion method to calculate score
  const checkCompletion = () => {
    let isComplete = true;
    let wordsCompleted = 0;
    
    puzzleData.words.forEach(wordData => {
      const { word, row, col, direction } = wordData;
      let wordComplete = true;
      
      for (let i = 0; i < word.length; i++) {
        const currentRow = direction === 'across' ? row : row + i;
        const currentCol = direction === 'across' ? col + i : col;
        
        if (!grid[currentRow][currentCol]?.value || 
            grid[currentRow][currentCol].value !== word[i]) {
          isComplete = false;
          wordComplete = false;
        }
      }
      
      if (wordComplete) {
        wordsCompleted++;
      }
    });
    
    if (isComplete && !completed) {
      // Calculate time bonus
      const timeTaken = (Date.now() - gameStartTime) / 1000; // in seconds
      const timeBonus = Math.max(0, Math.floor(300 - timeTaken)); // Max 300 seconds bonus window
      
      // Calculate score
      const wordScore = wordsCompleted * 10;
      const completionBonus = 50;
      const totalScore = wordScore + completionBonus + timeBonus;
      
      setGameScore(totalScore);
      setCompleted(true);
      
      if (confettiRef.current) {
        confettiRef.current.start();
      }
      
      const handleScoreSubmission = async () => {
        try {
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsedData = JSON.parse(userData);
            const userId = parsedData.id;
            const scoreData = {
              game_name: 'anti-doping-crossword',
              score: totalScore,
              user_id: userId
            };
            
            await axios.post('http://127.0.0.1:8000/game-scores', scoreData);
            
            Alert.alert(
              'Congratulations! 🎉',
              `You have completed the Anti-Doping Crossword!\n\nScore: ${totalScore} points\n\nYour score has been submitted successfully!`,
              [{ text: 'OK', onPress: () => {} }]
            );
          } else {
            throw new Error('User data not found');
          }
        } catch (error) {
          console.error('Error submitting score:', error);
          Alert.alert(
            'Score Submission',
            `You scored ${totalScore} points!\n\nFailed to submit score. Please check your connection.`,
            [{ text: 'OK', onPress: () => {} }]
          );
        }
      };
  
      // Call the async function
      handleScoreSubmission();
    }
  };
  // Render cell
  const renderCell = (row, col) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const cellData = grid[row][col];
    
    if (!cellData.isActive) {
      return (
        <Animated.View
          style={[
            styles.cell,
            styles.inactiveCell,
            {
              opacity: cellAnimations[row][col],
              transform: [{
                scale: cellAnimations[row][col].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              }],
            },
          ]}
        />
      );
    }
    
    // Special handling for (0,0) cell to show both numbers
    const isStartCell = row === 0 && col === 0;
    
    return (
      <Animated.View
        style={[
          styles.cell,
          {
            opacity: cellAnimations[row][col],
            transform: [{
              scale: cellAnimations[row][col].interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            }],
          },
          isSelected && styles.selectedCell,
        ]}
      >
        <TouchableOpacity
          style={styles.cellContent}
          onPress={() => handleCellPress(row, col)}
        >
          {isStartCell ? (
            <View style={styles.multipleNumbers}>
              <Text style={styles.cellNumber}>1,2</Text>
            </View>
          ) : (
            cellData.number && (
              <Text style={styles.cellNumber}>{cellData.number}</Text>
            )
          )}
          <TextInput
            style={styles.cellInput}
            value={cellData.value}
            onChangeText={(value) => handleInput(row, col, value)}
            maxLength={1}
            autoCapitalize="characters"
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render grid
  const renderGrid = () => (
    <View style={styles.gridContainer}>
      <View style={styles.grid}>
        {Array(puzzleData.size).fill().map((_, row) => (
          <View key={row} style={styles.row}>
            {Array(puzzleData.size).fill().map((_, col) => (
              <View key={`${row}-${col}`}>
                {renderCell(row, col)}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );

  // Render clues
  const renderClues = () => (
    <View style={styles.cluesContainer}>
      <View style={styles.clueSection}>
        <Text style={styles.clueHeader}>Across</Text>
        {puzzleData.words
          .filter(word => word.direction === 'across')
          .sort((a, b) => a.id - b.id)
          .map((word) => (
            <Text key={word.id} style={styles.clueText}>
              {word.clue}
            </Text>
          ))}
      </View>
      <View style={styles.clueSection}>
        <Text style={styles.clueHeader}>Down</Text>
        {puzzleData.words
          .filter(word => word.direction === 'down')
          .sort((a, b) => a.id - b.id)
          .map((word) => (
            <Text key={word.id} style={styles.clueText}>
              {word.clue}
            </Text>
          ))}
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      indicatorStyle="black" // for iOS
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Crossword Level')} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.title}>Anti-Doping Crossword Level 2</Text>
      </View>
      {renderGrid()}
      <ScrollView 
        style={styles.cluesContainer}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        nestedScrollEnabled={true}
      >
        <View style={styles.clueSection}>
          <Text style={styles.clueHeader}>Across</Text>
          {puzzleData.words
            .filter(word => word.direction === 'across')
            .sort((a, b) => a.id - b.id)
            .map((word) => (
              <Text key={word.id} style={styles.clueText}>
                {word.clue}
              </Text>
            ))}
        </View>
        <View style={styles.clueSection}>
          <Text style={styles.clueHeader}>Down</Text>
          {puzzleData.words
            .filter(word => word.direction === 'down')
            .sort((a, b) => a.id - b.id)
            .map((word) => (
              <Text key={word.id} style={styles.clueText}>
                {word.clue}
              </Text>
            ))}
        </View>
      </ScrollView>
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{x: -10, y: 0}}
        autoStart={false}
        fadeOut={true}
        fallSpeed={3000}
        explosionSpeed={350}
        colors={['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98']}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // To center the title accounting for the back button
  },
  gridContainer: {
    width: SCREEN_WIDTH - 20,
    maxWidth: 400,
    alignSelf: 'center',
  },
  grid: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inactiveCell: {
    backgroundColor: '#2c3e50',
    borderColor: '#2c3e50',
  },
  selectedCell: {
    backgroundColor: '#e8f0fe',
    borderColor: '#3498db',
  },
  cellContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Added for absolute positioning of children
  },
  
  multipleNumbers: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: 'transparent',
    zIndex: 1, // Ensure number appears above input
  },
  
  cellNumber: {
    fontSize: 10,
    color: '#7f8c8d',
    fontWeight: '500',
    position: 'absolute',
    top: 2,
    left: 2,
    zIndex: 1,
  },
  
  cellInput: {
    position: 'absolute',
    fontSize: 20,
    color: '#2c3e50',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center', // for Android
    paddingTop: 0, // Remove default padding
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    margin: 0,
    includeFontPadding: false, // for Android
    backgroundColor: 'transparent',
  },
  
  cluesContainer: {
    maxHeight: 300, // Limit height to enable scrolling
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  
  clueSection: {
    padding: 15,
    paddingTop: 10,
  },
  
  clueText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#34495e',
    lineHeight: 20,
    paddingHorizontal: 5,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default CrosswordGame1;