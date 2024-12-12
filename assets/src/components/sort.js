import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react-native';

const substances = [
  { id: 1, name: 'Anabolic Steroids', category: 'Banned' },
  { id: 2, name: 'Caffeine', category: 'Permitted' },
  { id: 3, name: 'Erythropoietin (EPO)', category: 'Banned' },
  { id: 4, name: 'Creatine', category: 'Permitted' },
  { id: 5, name: 'Testosterone', category: 'Banned' },
  { id: 6, name: 'Hydrocortisone', category: 'Requires Medical Exception' },
  { id: 7, name: 'Hydration Tablets', category: 'Permitted' },
  { id: 8, name: 'Human Growth Hormone', category: 'Banned' },
  { id: 9, name: 'Adrenaline', category: 'Permitted' },
  { id: 10, name: 'Cannabis', category: 'Requires Medical Exception' }
];

const ItemTypes = {
  SUBSTANCE: 'substance',
};

const SubstanceDragPreview = ({ substance }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SUBSTANCE,
    item: { id: substance.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <View
      ref={drag}
      style={[
        styles.draggableItem,
        { opacity: isDragging ? 0.5 : 1, backgroundColor: isDragging ? 'lightgray' : 'orange' },
      ]}
    >
      <Text>{substance.name}</Text>
    </View>
  );
};

const SubstanceDropTarget = ({ category, items, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.SUBSTANCE,
    drop: (item) => onDrop(item.id, category),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <View
      ref={drop}
      style={[
        styles.droppableArea,
        { borderColor: isOver ? 'green' : '#ccc', borderWidth: isOver ? 3 : 2 },
      ]}
    >
      <Text style={styles.categoryTitle}>{category}</Text>
      <View style={styles.droppedItems}>
        {items.map((item) => (
          <View key={item.id} style={styles.droppedItem}>
            <Text style={styles.droppedItemText}>{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const SubstanceSortGame = () => {
  const navigation = useNavigation();
  const [bannedItems, setBannedItems] = useState([]);
  const [permittedItems, setPermittedItems] = useState([]);
  const [requiresMedicalExceptionItems, setRequiresMedicalExceptionItems] = useState([]);
  const [score, setScore] = useState(0);
  const [availableSubstances, setAvailableSubstances] = useState([...substances]);
  const [userName, setUserName] = useState('Player');

  useEffect(() => {
    loadUserName();
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
      if (!userData) {
        console.error('No user data found');
        return;
      }

      const parsedData = JSON.parse(userData);
      const userId = parsedData.id;

      console.log('Submitting score:', {
        game_name: 'substance_sort',
        score: finalScore,
        user_id: userId
      });

      const response = await axios.post('http://127.0.0.1:8000/game-scores', {
        game_name: 'substance_sort',
        score: finalScore,
        user_id: userId
      });

      console.log('Score submission response:', response.data);
      Alert.alert('Score Submitted', `You scored ${finalScore} points!`);
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert(
        'Score Submission Failed', 
        error.response?.data?.detail || 'Please check your connection and try again.'
      );
    }
  };

  const handleDrop = (id, category) => {
    const droppedSubstance = availableSubstances.find((substance) => substance.id === id);
  
    if (!droppedSubstance) return;
  
    // Remove substance from available substances
    setAvailableSubstances((prevAvailableSubstances) =>
      prevAvailableSubstances.filter((substance) => substance.id !== id)
    );
  
    // Add substance to the corresponding category
    if (category === 'Banned') {
      setBannedItems((prevItems) => [...prevItems, droppedSubstance]);
      setScore((prevScore) => prevScore + (droppedSubstance.category === 'Banned' ? 1 : -1));
    } else if (category === 'Permitted') {
      setPermittedItems((prevItems) => [...prevItems, droppedSubstance]);
      setScore((prevScore) => prevScore + (droppedSubstance.category === 'Permitted' ? 1 : -1));
    } else if (category === 'Requires Medical Exception') {
      setRequiresMedicalExceptionItems((prevItems) => [...prevItems, droppedSubstance]);
      setScore((prevScore) => prevScore + (droppedSubstance.category === 'Requires Medical Exception' ? 1 : -1));
    }
  
    // Check if all substances are sorted
    const totalSorted = bannedItems.length + permittedItems.length + requiresMedicalExceptionItems.length;
    const completionPercentage = Math.round((totalSorted / substances.length) * 100);
  
    if (completionPercentage === 100) {
      Alert.alert('Game Completed', 'You have successfully sorted all the substances!');
    }
  };
  

  const resetGame = () => {
    setBannedItems([]);
    setPermittedItems([]);
    setRequiresMedicalExceptionItems([]);
    setScore(0);
    setAvailableSubstances([...substances]);
  };

  const handleTryAgain = () => {
    submitScore(score);  // Submit the score when "Try Again" is clicked
    resetGame(); // Reset game state after submitting the score
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        
        <View style={[styles.category, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={[styles.categoryTitle, styles.scoreBox]}>Score: {score}</Text>
          <Text style={[styles.categoryTitle, styles.scoreBox]}>
            {Math.round(
              ((bannedItems.length + permittedItems.length + requiresMedicalExceptionItems.length) /
                substances.length) *
                100
            )}
            % Complete
          </Text>
        </View>
        <Text style={styles.subtitle}>Drag and drop substances into the correct categories:</Text>

        <View style={styles.substanceBox}>
          <Text style={styles.substanceBoxTitle}>Substances to Sort:</Text>
          <View style={styles.substanceList}>
            {availableSubstances.map((substance) => (
              <SubstanceDragPreview key={substance.id} substance={substance} />
            ))}
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <SubstanceDropTarget category="Banned" items={bannedItems} onDrop={handleDrop} />
          <SubstanceDropTarget category="Permitted" items={permittedItems} onDrop={handleDrop} />
          <SubstanceDropTarget category="Requires Medical Exception" items={requiresMedicalExceptionItems} onDrop={handleDrop} />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTryAgain}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DndProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  backButton: {
    position: 'absolute', 
    top: 40, 
    left: 20, 
    zIndex: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  substanceBox: {
    backgroundColor: '#333333',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginTop: 10,
  },
  substanceBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  substanceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  draggableItem: {
    marginHorizontal: 10,
    marginVertical: 10,
    width: 150,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  category: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#222222',
    borderRadius: 10,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: '#444444',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
  },
  scoreBox: {
    fontSize: 16,
    marginBottom: 0,
    color: 'white',
  },
  droppableArea: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#222222',
    borderRadius: 10,
  },
  droppedItems: {
    marginTop: 10,
  },
  droppedItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#444444',
  },
  droppedItemText: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: 200,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SubstanceSortGame;