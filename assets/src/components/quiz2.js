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

// Quiz questions database
const questions = [
    {
      id: 1,
      question: "Which of the following is NOT a method of drug testing for athletes?",
      options: [
        "Urine test",
        "Blood test",
        "Hair test",
        "Visual inspection"
      ],
      correct: 3
    },
    {
      id: 2,
      question: "What type of test is most commonly used to detect EPO (Erythropoietin)?",
      options: [
        "Urine test",
        "Hair test",
        "Blood test",
        "Saliva test"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "How can masking agents interfere with doping detection?",
      options: [
        "They enhance the effects of steroids",
        "They hide the presence of banned substances in the body",
        "They improve athletic performance",
        "They help athletes recover faster"
      ],
      correct: 1
    },
    {
      id: 4,
      question: "What does WADA stand for?",
      options: [
        "World Athletic Doping Agency",
        "World Anti-Doping Association",
        "World Anti-Doping Agency",
        "World Athlete Detection Association"
      ],
      correct: 2
    },
    {
      id: 5,
      question: "Which sample is typically used for detecting steroids in athletes?",
      options: [
        "Blood sample",
        "Hair sample",
        "Urine sample",
        "Sweat sample"
      ],
      correct: 2
    },
    {
      id: 6,
      question: "What is the primary purpose of a blood test in doping detection?",
      options: [
        "To detect banned substances directly",
        "To monitor an athlete's hydration levels",
        "To identify performance-enhancing substances like EPO",
        "To determine mental fatigue levels"
      ],
      correct: 2
    },
    {
      id: 7,
      question: "What is a common substance that is used as a masking agent in doping?",
      options: [
        "Caffeine",
        "Alcohol",
        "Diuretics",
        "Creatine"
      ],
      correct: 2
    },
    {
      id: 8,
      question: "How long can hair tests detect drug use after the substance has been ingested?",
      options: [
        "Up to 1 week",
        "Up to 1 month",
        "Up to 3 months",
        "Up to 6 months"
      ],
      correct: 2
    },
    {
      id: 9,
      question: "Which of the following is a primary challenge in detecting blood doping?",
      options: [
        "Lack of visible symptoms",
        "No blood tests available",
        "Blood volume testing issues",
        "Detection window is too short"
      ],
      correct: 0
    },
    {
      id: 10,
      question: "Which organization is responsible for creating and maintaining the banned substance list for athletes?",
      options: [
        "FIFA",
        "IOC",
        "WADA",
        "NFL"
      ],
      correct: 2
    },
    {
      id: 11,
      question: "Which of these substances is NOT typically detectable in a urine test?",
      options: [
        "Anabolic steroids",
        "Cocaine",
        "Human growth hormone (HGH)",
        "Blood doping agents"
      ],
      correct: 3
    },
    {
      id: 12,
      question: "What is the role of the Athlete Biological Passport?",
      options: [
        "To track drug use history",
        "To monitor an athlete's health and biological markers over time",
        "To track training sessions",
        "To ensure an athlete's eligibility"
      ],
      correct: 1
    },
    {
      id: 13,
      question: "Which of the following can cause a false positive result in a doping test?",
      options: [
        "Consuming caffeine",
        "Taking legal supplements",
        "Eating certain foods like poppy seeds",
        "Not eating before the test"
      ],
      correct: 2
    },
    {
      id: 14,
      question: "Which type of drug is most commonly associated with masking agents?",
      options: [
        "Stimulants",
        "Narcotics",
        "Diuretics",
        "Anabolic steroids"
      ],
      correct: 2
    },
    {
      id: 15,
      question: "What happens during the B sample analysis in doping tests?",
      options: [
        "The B sample is discarded",
        "A second test is performed on the B sample to confirm results",
        "A completely new sample is taken from the athlete",
        "The sample is sent to a different lab"
      ],
      correct: 1
    },
    {
      id: 16,
      question: "How does WADA ensure fairness in the testing process?",
      options: [
        "By only testing athletes during competitions",
        "By guaranteeing that all tests are anonymous",
        "By offering financial rewards for passing tests",
        "By keeping test results confidential until the event"
      ],
      correct: 1
    },
    {
      id: 17,
      question: "Which of the following substances is often used in blood doping?",
      options: [
        "Anabolic steroids",
        "Erythropoietin (EPO)",
        "Caffeine",
        "Nicotine"
      ],
      correct: 1
    },
    {
      id: 18,
      question: "What is one of the main challenges of detecting gene doping?",
      options: [
        "No standard testing method yet",
        "Gene doping is only detectable in hair samples",
        "Gene doping does not enhance performance",
        "Gene doping is only detectable after long periods"
      ],
      correct: 0
    },
    {
      id: 19,
      question: "What is the typical duration for a ban after an athlete is caught doping?",
      options: [
        "6 months",
        "1 year",
        "2-4 years",
        "Lifetime ban"
      ],
      correct: 2
    },
    {
      id: 20,
      question: "What is the minimum age for an athlete to be tested for doping?",
      options: [
        "14",
        "16",
        "18",
        "21"
      ],
      correct: 2
    }
  ];
  
  const facts = [
    "Blood, urine, and hair tests are the most common methods for detecting doping substances in athletes.",
    "Masking agents like diuretics can hide the presence of banned substances, but they can be detected through specialized tests.",
    "WADA (World Anti-Doping Agency) regularly updates the banned substance list based on scientific evidence and feedback.",
    "EPO (Erythropoietin) is a hormone used to boost red blood cell production and is commonly detected through blood tests.",
    "Athletes can be tested both in-competition and out-of-competition at any time and location.",
    "Urine tests are the most commonly used method to detect banned substances like anabolic steroids and stimulants.",
    "Hair tests can detect drug use for up to three months, offering a longer detection window than urine or blood tests.",
    "The Athlete Biological Passport tracks an athlete's biological data over time, making it harder to hide doping over long periods.",
    "While blood doping enhances athletic performance, it is difficult to detect without specialized blood tests.",
    "Diuretics, used to mask other drugs, are also banned by WADA and can be detected in both blood and urine samples.",
    "False positives in doping tests can occur due to factors like medication or contaminated supplements.",
    "Gene doping, which involves altering an athlete's genetic material, is a growing concern but lacks reliable detection methods.",
    "The B sample is a backup sample that allows for a second test to confirm the results of the initial test.",
    "A typical doping ban can range from 2 to 4 years depending on the severity of the violation and the type of drug involved.",
    "WADA testing procedures ensure fairness by maintaining rigorous standards and transparency in the testing process.",
    "Athletes are responsible for any banned substance found in their bodies, even if they unknowingly consumed it.",
    "Blood doping is illegal in sports and often involves the use of EPO or blood transfusions to improve oxygen capacity.",
    "Athletes are subject to out-of-competition testing, which can occur at any location and time to catch doping violations.",
    "A typical therapeutic use exemption (TUE) allows athletes to use banned substances for legitimate medical reasons under strict supervision.",
    "Gene doping involves introducing synthetic genes to enhance physical capabilities, but it remains challenging to detect with current methods."
  ];

const TIME_PER_QUESTION = 30; // 30 seconds per question

const Quiz2 = ({ navigation }) => {
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

export default Quiz2;