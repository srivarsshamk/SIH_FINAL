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
      question: "Which of the following is a short-term health risk of doping?",
      options: [
        "Liver damage",
        "Dehydration",
        "Infertility",
        "Chronic heart disease"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "Which of the following is a long-term health risk associated with anabolic steroid use?",
      options: [
        "Increased muscle strength",
        "Liver damage",
        "Increased bone density",
        "Enhanced cardiovascular health"
      ],
      correct: 1
    },
    {
      id: 3,
      question: "Which of these substances can cause high blood pressure as a short-term effect?",
      options: [
        "Anabolic steroids",
        "Erythropoietin (EPO)",
        "Caffeine",
        "Insulin"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "What is a potential mental health effect of long-term steroid use?",
      options: [
        "Improved mood",
        "Aggression and irritability",
        "Increased creativity",
        "Improved cognitive function"
      ],
      correct: 1
    },
    {
      id: 5,
      question: "Which of the following is a psychological side effect of doping?",
      options: [
        "Calmness",
        "Improved sleep",
        "Depression and anxiety",
        "Enhanced empathy"
      ],
      correct: 2
    },
    {
      id: 6,
      question: "What long-term effect can anabolic steroids have on the liver?",
      options: [
        "Liver regeneration",
        "Liver damage and failure",
        "No effect on the liver",
        "Increased liver size"
      ],
      correct: 1
    },
    {
      id: 7,
      question: "Which of these is a short-term health risk of Erythropoietin (EPO) use?",
      options: [
        "Fatigue",
        "Blood clotting",
        "Dehydration",
        "Impaired liver function"
      ],
      correct: 1
    },
    {
      id: 8,
      question: "What effect does long-term steroid use have on fertility?",
      options: [
        "Improves sperm count",
        "Decreases testosterone levels",
        "Increases fertility",
        "Has no effect on fertility"
      ],
      correct: 1
    },
    {
      id: 9,
      question: "Which of the following is a long-term effect of steroid abuse?",
      options: [
        "Reduced risk of cancer",
        "Enlarged heart and cardiovascular issues",
        "Improved cardiovascular health",
        "Faster muscle recovery"
      ],
      correct: 1
    },
    {
      id: 10,
      question: "Which of the following is NOT a potential psychological effect of doping?",
      options: [
        "Mood swings",
        "Increased aggression",
        "Hallucinations",
        "Improved social interactions"
      ],
      correct: 3
    },
    {
      id: 11,
      question: "What is the term for the withdrawal symptoms caused by long-term doping substance use?",
      options: [
        "Addiction",
        "Overtraining syndrome",
        "Doping-induced psychosis",
        "Doping fatigue"
      ],
      correct: 0
    },
    {
      id: 12,
      question: "Which of the following is a risk of using growth hormone as a doping substance?",
      options: [
        "Increased bone density",
        "Diabetes and joint pain",
        "Improved vision",
        "Cardiovascular health improvement"
      ],
      correct: 1
    },
    {
      id: 13,
      question: "How can anabolic steroids affect the cardiovascular system?",
      options: [
        "Increases heart rate and blood pressure",
        "Improves blood flow",
        "Decreases the risk of heart attack",
        "Strengthens the heart muscle"
      ],
      correct: 0
    },
    {
      id: 14,
      question: "What long-term effect can steroid use have on the mental state of an athlete?",
      options: [
        "Enhanced relaxation",
        "Increased risk of depression",
        "Improved social bonds",
        "Reduced anxiety"
      ],
      correct: 1
    },
    {
      id: 15,
      question: "Which of the following is a potential health risk of EPO use?",
      options: [
        "Increased red blood cell count",
        "Liver damage",
        "Higher risk of stroke and heart attack",
        "Reduced blood clotting"
      ],
      correct: 2
    },
    {
      id: 16,
      question: "What is a side effect of stimulants like amphetamines used in sports doping?",
      options: [
        "Decreased heart rate",
        "Increased aggression and anxiety",
        "Improved sleep",
        "Increased bone density"
      ],
      correct: 1
    },
    {
      id: 17,
      question: "What can the use of insulin as a performance-enhancing drug lead to?",
      options: [
        "Low blood sugar and hypoglycemia",
        "Improved cardiovascular health",
        "Enhanced digestion",
        "Increased muscle mass without side effects"
      ],
      correct: 0
    },
    {
      id: 18,
      question: "Which of these substances can contribute to heart disease over time?",
      options: [
        "Anabolic steroids",
        "Erythropoietin (EPO)",
        "Testosterone boosters",
        "All of the above"
      ],
      correct: 3
    },
    {
      id: 19,
      question: "What psychological effect is often associated with long-term steroid abuse?",
      options: [
        "Increased motivation",
        "Paranoia and hallucinations",
        "Improved cognitive function",
        "Increased energy and positivity"
      ],
      correct: 1
    },
    {
      id: 20,
      question: "What is a potential side effect of long-term stimulant use?",
      options: [
        "Increased muscle growth",
        "Decreased appetite and insomnia",
        "Improved joint flexibility",
        "Increased bone strength"
      ],
      correct: 1
    }
  ];
  
  // Educational facts for each question
  const facts = [
    "Anabolic steroids can cause short-term effects such as dehydration, high blood pressure, and increased heart rate.",
    "Chronic steroid use can lead to liver damage, cardiovascular problems, infertility, and mental health issues like depression.",
    "Substances like EPO can cause blood clotting, leading to increased risk of strokes and heart attacks.",
    "Long-term use of anabolic steroids can cause severe psychological effects, including aggression, paranoia, and depression.",
    "Psychological effects of doping can include mood swings, depression, and anxiety, as well as increased irritability and aggression.",
    "Steroid abuse can lead to liver damage, which may result in conditions like liver failure, jaundice, or cirrhosis.",
    "Using EPO can cause blood clotting and dehydration, which can lead to serious cardiovascular complications like heart attacks.",
    "Steroid use can result in reduced testosterone levels, which may lead to infertility, reduced libido, and erectile dysfunction.",
    "Chronic steroid use can lead to heart disease, including enlarged heart and artery blockages.",
    "Psychological issues like depression, mood swings, and increased aggression are common side effects of doping.",
    "Doping substances can cause withdrawal symptoms, including depression, anxiety, and physical discomfort when an athlete stops using them.",
    "Growth hormone abuse can lead to joint pain, diabetes, and cardiovascular issues due to an abnormal increase in insulin-like growth factors.",
    "Anabolic steroids can increase heart rate and blood pressure, raising the risk of heart attacks and strokes.",
    "Steroid abuse has been linked to increased risks of depression and mental instability, especially after prolonged use.",
    "EPO use can increase the risk of stroke and heart attack due to blood clot formation and thickening of the blood.",
    "Amphetamines and other stimulants can lead to anxiety, aggression, and behavioral changes due to their stimulating effects on the central nervous system.",
    "Insulin use as a doping agent can cause hypoglycemia (low blood sugar), which can be life-threatening without proper management.",
    "Long-term use of substances like anabolic steroids, EPO, and testosterone boosters can contribute to cardiovascular diseases, including heart attacks and strokes.",
    "Steroid abuse can cause paranoia, mood swings, and hallucinations, which are major psychological effects that impact an athlete's mental health.",
    "Stimulant abuse can result in decreased appetite, insomnia, and jitteriness, all of which are side effects of performance-enhancing drugs."
  ];

const TIME_PER_QUESTION = 30; // 30 seconds per question

const Quiz3 = ({ navigation }) => {
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

export default Quiz3;