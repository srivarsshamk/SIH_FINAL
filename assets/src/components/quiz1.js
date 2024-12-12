import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { ArrowLeft } from 'lucide-react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';


const questions = [
  {
    id: 1,
    question: "Which of these substances is considered a stimulant?",
    options: [
      "Caffeine",
      "Creatine",
      "Glutamine",
      "Vitamin C"
    ],
    correct: 0
  },
  {
    id: 2,
    question: "Which substance is commonly used to enhance muscle mass?",
    options: [
      "Alcohol",
      "Caffeine",
      "Anabolic steroids",
      "Carbohydrates"
    ],
    correct: 2
  },
  {
    id: 3,
    question: "Which of these substances can increase red blood cell production?",
    options: [
      "Insulin",
      "Caffeine",
      "Creatine",
      "Erythropoietin (EPO)"
    ],
    correct: 3
  },
  {
    id: 4,
    question: "Which substance is most commonly found in pre-workout supplements?",
    options: [
      "Beta-Alanine",
      "Caffeine",
      "Vitamin D",
      "Zinc"
    ],
    correct: 1
  },
  {
    id: 5,
    question: "What is a common health risk of using anabolic steroids?",
    options: [
      "High blood pressure",
      "Hair loss",
      "Liver damage",
      "All of the above"
    ],
    correct: 3
  },
  {
    id: 6,
    question: "Which of these substances is banned for athletes due to its performance-enhancing effects?",
    options: [
      "EPO",
      "Omega-3 fatty acids",
      "Vitamin C",
      "Zinc"
    ],
    correct: 0
  },
  {
    id: 7,
    question: "What is the primary function of diuretics in doping?",
    options: [
      "Reducing body fat",
      "Increasing muscle mass",
      "Enhancing endurance",
      "Masking drugs"
    ],
    correct: 3
  },
  {
    id: 8,
    question: "Which substance is used to increase the oxygen-carrying capacity of the blood?",
    options: [
      "Erythropoietin (EPO)",
      "Testosterone",
      "Caffeine",
      "Insulin"
    ],
    correct: 0
  },
  {
    id: 9,
    question: "Which drug is a common stimulant that can improve focus and reaction time?",
    options: [
      "Amphetamines",
      "EPO",
      "Caffeine",
      "Anabolic steroids"
    ],
    correct: 0
  },
  {
    id: 10,
    question: "Which of these is considered a corticosteroid?",
    options: [
      "Testosterone",
      "Prednisone",
      "Creatine",
      "Caffeine"
    ],
    correct: 1
  },
  {
    id: 11,
    question: "Which substance is often used by athletes to improve recovery time?",
    options: [
      "Magnesium",
      "Vitamin D",
      "Human Growth Hormone (HGH)",
      "Protein"
    ],
    correct: 2
  },
  {
    id: 12,
    question: "Which of these substances is banned for its potential to enhance muscle growth?",
    options: [
      "Creatine",
      "Caffeine",
      "Protein powder",
      "Anabolic steroids"
    ],
    correct: 3
  },
  {
    id: 13,
    question: "What is a common use of human growth hormone (HGH) in sports?",
    options: [
      "Enhancing muscle recovery",
      "Boosting energy levels",
      "Increasing endurance",
      "Masking other drugs"
    ],
    correct: 0
  },
  {
    id: 14,
    question: "Which substance is typically used in blood doping?",
    options: [
      "Erythropoietin (EPO)",
      "Caffeine",
      "Alcohol",
      "Steroids"
    ],
    correct: 0
  },
  {
    id: 15,
    question: "Which drug is banned for its ability to increase alertness and reduce fatigue?",
    options: [
      "Creatine",
      "Steroids",
      "Amphetamines",
      "Beta-blockers"
    ],
    correct: 2
  },
  {
    id: 16,
    question: "What is the purpose of using insulin in doping?",
    options: [
      "Improving sleep quality",
      "Enhancing muscle mass",
      "Reducing body fat",
      "Increasing blood sugar levels"
    ],
    correct: 1
  },
  {
    id: 17,
    question: "Which of these substances is a common component in fat burners?",
    options: [
      "Ephedrine",
      "Caffeine",
      "L-carnitine",
      "Creatine"
    ],
    correct: 0
  },
  {
    id: 18,
    question: "What is a potential side effect of using diuretics in sports?",
    options: [
      "Heart palpitations",
      "Increased muscle mass",
      "Improved endurance",
      "Dehydration"
    ],
    correct: 3
  },
  {
    id: 19,
    question: "Which of the following is NOT an example of a banned stimulant?",
    options: [
      "Caffeine",
      "Erythropoietin (EPO)",
      "Methamphetamine",
      "Cocaine"
    ],
    correct: 0
  },
  {
    id: 20,
    question: "What is one of the main purposes of using blood transfusions in blood doping?",
    options: [
      "To reduce recovery time",
      "To improve muscle function",
      "To increase red blood cells",
      "To boost energy levels"
    ],
    correct: 2
  }
];

// Educational facts related to substances in sports
const facts = [
  "Anabolic steroids can cause severe health effects, including liver damage, high blood pressure, and psychiatric issues like aggression.",
  "Erythropoietin (EPO) is used in doping to increase the production of red blood cells, thereby improving oxygen transport and endurance.",
  "Creatine is a legal supplement that helps enhance short bursts of high-intensity exercise by improving energy production in muscles.",
  "Caffeine, when consumed in large amounts, can be considered a stimulant and may be banned in certain quantities by sports organizations.",
  "Human Growth Hormone (HGH) is used for muscle recovery and to promote muscle growth, but it is banned in most sports due to its performance-enhancing effects.",
  "Diuretics are banned because they can be used to mask the presence of other banned substances by flushing them out of the body.",
  "Testosterone is a banned substance in sports because it significantly enhances muscle growth and recovery.",
  "Beta-alanine, often found in pre-workout supplements, helps buffer acid build-up in muscles during high-intensity exercise, improving endurance.",
  "Amphetamines are used in sports for their stimulant properties, enhancing focus and reaction time, but they are banned due to potential health risks.",
  "Caffeine, when used in moderation, is legal in sports, but excessive intake may lead to disqualification due to its stimulant effects.",
  "Erythropoietin (EPO) is banned because it increases the body's red blood cell count, improving endurance, and is often associated with blood doping.",
  "Steroids are used to promote muscle mass and reduce recovery time but can lead to serious health issues, including cardiovascular problems.",
  "Insulin misuse can lead to dangerously low blood sugar levels, posing severe health risks for athletes.",
  "The use of blood transfusions in doping is intended to increase the number of red blood cells, improving oxygen transport and stamina.",
  "Diuretics are banned for masking other drugs in the system and increasing the risk of dehydration.",
  "The use of methamphetamine in sports is banned because it is a potent stimulant with significant health risks, including heart problems.",
  "Ephedrine is a stimulant found in many fat-burning supplements but is banned due to its potential to cause heart issues and dehydration.",
  "Caffeine is a common stimulant in sports but can only be used in certain amounts, beyond which it is considered a doping substance.",
  "Methamphetamine is a banned substance because of its stimulant effects, which can lead to severe psychological and physical health consequences.",
  "Steroids can have long-term health consequences, including liver damage, cardiovascular issues, and psychological problems.",
  "Blood doping is a form of performance enhancement that involves increasing the number of red blood cells to improve athletic performance by enhancing oxygen delivery."
];

const TIME_PER_QUESTION = 30; // 30 seconds per question

const Quiz1 = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [showFact, setShowFact] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
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
      if (userData) {
        const parsedData = JSON.parse(userData);
        const userId = parsedData.id;
  
        const scoreData = {
          game_name: 'doping-quiz',
          score: finalScore,
          user_id: userId
        };
  
        const response = await axios.post('http://127.0.0.1:8000/game-scores', scoreData);
        
        Alert.alert('Score Submitted', `You scored ${finalScore} points!`); // Fixed template literal
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      Alert.alert('Score Submission Failed', 'Please check your connection and try again.');
    }
  };


  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !selectedAnswer) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !selectedAnswer) {
      handleTimeout();
    }
    return () => clearInterval(timer);
  }, [timeLeft, selectedAnswer]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTimeout = () => {
    setSelectedAnswer(-1); // -1 indicates timeout
    setShowNext(true);
    setShowFact(true);
  };

  const handleAnswer = (selectedIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(selectedIndex);
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowNext(true);
    setShowFact(true);
  };

  const handleNext = () => {
    setShowFact(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowNext(false);
      setTimeLeft(TIME_PER_QUESTION);
    } else {
      setIsGameOver(true);
    }
  };

  const getOptionStyle = (index) => {
    if (selectedAnswer === null) return styles.option;
    
    if (index === questions[currentQuestion].correct) {
      return [styles.option, styles.correctAnswer];
    }
    
    if (index === selectedAnswer && selectedAnswer !== questions[currentQuestion].correct) {
      return [styles.option, styles.wrongAnswer];
    }
    
    return styles.option;
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (isGameOver) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>Quiz Complete!</Text>
          <Text style={styles.gameOverScore}>
            {userName}'s Score: {score}/{questions.length}
          </Text>
          <TouchableOpacity 
            style={styles.restartButton}
            onPress={() => {
              // Attempt to submit score first
              submitScore(score);
              
              // Reset game state
              setCurrentQuestion(0);
              setScore(0);
              setSelectedAnswer(null);
              setShowNext(false);
              setTimeLeft(TIME_PER_QUESTION);
              setShowFact(false);
              setIsGameOver(false);
            }}
          >
            <Text style={styles.restartButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
      >
        <ArrowLeft size={24} color="#ffffff" />
      </TouchableOpacity>

      <View style={[styles.header, { marginTop: 20 }]}>
        <Text style={styles.scoreText}>Score: {score}/{questions.length}</Text>
        <Text style={[
          styles.timer,
          timeLeft <= 10 && styles.timerWarning
        ]}>
          {formatTime(timeLeft)}
        </Text>
        <Text style={styles.questionNumber}>Q{currentQuestion + 1}/{questions.length}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{questions[currentQuestion].question}</Text>

        <View style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(index)}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={showFact}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.factModalContainer}>
            <View style={styles.factModal}>
              <Text style={styles.factTitle}>Did you know?</Text>
              <Text style={styles.factText}>{facts[currentQuestion]}</Text>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginLeft: 50, // Add margin to prevent overlap with back button
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timer: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerWarning: {
    color: '#ff4444',
  },
  questionNumber: {
    color: '#ffffff',
    fontSize: 16,
  },
  questionContainer: {
    flex: 1,
  },
  question: {
    color: '#ffffff',
    fontSize: 22,
    marginBottom: 30,
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 15,
  },
  option: {
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3c3c3c',
  },
  correctAnswer: {
    backgroundColor: '#1b5e20',
    borderColor: '#2e7d32',
  },
  wrongAnswer: {
    backgroundColor: '#b71c1c',
    borderColor: '#c62828',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
  },
  factModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  factModal: {
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  factTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  factText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    padding: 8,
  },
  nextButton: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameOverScore: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Quiz1;