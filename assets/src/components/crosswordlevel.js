import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

const CrosswordLevelSelector = ({ navigation }) => {
  const [displayedLetters, setDisplayedLetters] = useState([]);
  const title = "Choose Your Crossword";

  useEffect(() => {
    const timer = setInterval(() => {
      if (displayedLetters.length < title.length) {
        setDisplayedLetters(prev => [...prev, title[prev.length]]);
      }
    }, 200);

    return () => clearInterval(timer);
  }, [displayedLetters]);

  const levels = [
    { name: 'Level 1', route: 'Crossword' },
    { name: 'Level 2', route: 'Crossword1' },
    { name: 'Level 3', route: 'Crossword2' },
    { name: 'Level 4', route: 'Crossword3' }
  ];

  return (
    <View 
      style={{
        flex: 1,
        backgroundColor: 'black', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}
    >
      {/* Back Arrow */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Game')}
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 50 : 20,
          left: 20,
          zIndex: 10
        }}
      >
        <Ionicons 
          name="arrow-back" 
          size={30} 
          color="green" 
        />
      </TouchableOpacity>

      <Text 
        style={{ 
          fontSize: 32, 
          fontWeight: 'bold', 
          color: 'green', 
          marginBottom: 40,
          textAlign: 'center',
          height: 50 
        }}
      >
        {displayedLetters.join('')}
      </Text>

      <View 
        style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          gap: 20 
        }}
      >
        {levels.map((level, index) => {
          const isFirstRow = index < 2;
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate(level.route);
              }}
              style={{
                backgroundColor: 'rgba(0, 255, 0, 0.2)', 
                borderWidth: 2,
                borderColor: 'white', 
                padding: 20,
                borderRadius: 15,
                width: isFirstRow ? '45%' : '90%',
                margin: 5,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text 
                style={{ 
                  color: 'green', 
                  fontSize: 20, 
                  fontWeight: 'bold' 
                }}
              >
                {level.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CrosswordLevelSelector;