import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WelcomePopup = ({ onClose }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const sentences = [
    "Welcome to the games!",
    "We have games like ..",
    "hangman, simulation, sort,",
    "word scramble, puzzles",
    "and many more...",
    "Feel free to play and enjoy!"
  ];
  
  useEffect(() => {
    const startBounceAnimation = () => {
      Animated.sequence([
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start(() => startBounceAnimation());
    };

    startBounceAnimation();
  }, []);

  const fadeOut = () => {
    return new Promise((resolve) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        resolve();
        fadeAnim.setValue(1);
      });
    });
  };

  useEffect(() => {
    if (currentSentenceIndex >= sentences.length) {
      setCurrentSentenceIndex(0);
      return;
    }

    const currentText = sentences[currentSentenceIndex];
    let currentCharIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentCharIndex <= currentText.length) {
        setDisplayText(currentText.slice(0, currentCharIndex));
        currentCharIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(async () => {
          await fadeOut();
          setDisplayText('');
          setCurrentSentenceIndex(prev => prev + 1);
        }, 1000);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentSentenceIndex]);

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => {
          setIsVisible(false);
          onClose &&onClose();
        }}
      >
        <Ionicons name="close-circle" size={24} color="white" />
      </TouchableOpacity>
      
      <Animated.View
        style={[
          styles.avatarContainer,
          {
            transform: [
              {
                translateY: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require('../../images/avatar.png')}
          style={styles.avatar}
          resizeMode="contain"
        />
      </Animated.View>
      
      <View style={styles.textBubble}>
        <Animated.Text 
          style={[
            styles.text,
            {
              opacity: fadeAnim
            }
          ]}
        >
          {displayText}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    alignItems: 'center',
    maxWidth: 300,
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1001,
    backgroundColor: '#002D04',
    borderRadius: 12,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  textBubble: {
    backgroundColor: '#002D04',
    padding: 15,
    borderRadius: 15,
    width: 250,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: 'white',
    textAlign: 'center',
  },
});

export default WelcomePopup;

