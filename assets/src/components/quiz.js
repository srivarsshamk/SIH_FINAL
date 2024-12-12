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
    question: "What is a common psychological pressure that athletes face, leading to doping?",
    options: [
      "Desire for fame and recognition",
      "Fear of injury",
      "Fear of failing to meet expectations",
      "Lack of motivation"
    ],
    correct: 2
  },
  {
    id: 2,
    question: "What legal consequence can athletes face if caught doping?",
    options: [
      "Jail time",
      "Financial compensation",
      "Fines only",
      "Community service"
    ],
    correct: 0
  },
  {
    id: 3,
    question: "Which of the following professionals plays a significant role in preventing doping?",
    options: [
      "Coaches",
      "Doctors",
      "Trainers",
      "All of the above"
    ],
    correct: 3
  },
  {
    id: 4,
    question: "What is the primary legal consequence for trafficking banned substances?",
    options: [
      "Disqualification from competitions",
      "Fines",
      "Jail time",
      "Loss of sponsorship"
    ],
    correct: 2
  },
  {
    id: 5,
    question: "What psychological factor often pressures athletes to resort to doping?",
    options: [
      "Lack of competition",
      "Desire to recover from injury quickly",
      "Emotional support from friends",
      "Improved self-esteem"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "Which of the following is a key responsibility of coaches in preventing doping?",
    options: [
      "Encouraging athletes to push their limits",
      "Monitoring an athlete's health and well-being",
      "Ignoring signs of doping for better results",
      "Providing banned substances"
    ],
    correct: 1
  },
  {
    id: 7,
    question: "Which legal body is responsible for regulating anti-doping measures globally?",
    options: [
      "World Anti-Doping Agency (WADA)",
      "International Olympic Committee (IOC)",
      "FIFA",
      "World Health Organization (WHO)"
    ],
    correct: 0
  },
  {
    id: 8,
    question: "What is a psychological effect of doping on an athlete's mental state?",
    options: [
      "Increased happiness",
      "Chronic anxiety and paranoia",
      "Improved concentration",
      "Heightened optimism"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "Which of these is a common psychological stressor leading to doping?",
    options: [
      "Overconfidence",
      "Fear of failure",
      "Inability to perform under pressure",
      "Lack of sleep"
    ],
    correct: 1
  },
  {
    id: 10,
    question: "What legal punishment can an athlete face for a positive drug test?",
    options: [
      "Life ban from competitions",
      "Suspension and fines",
      "Probation",
      "Public apology"
    ],
    correct: 1
  },
  {
    id: 11,
    question: "What role does an athlete’s coach play in the prevention of doping?",
    options: [
      "Advising on the use of supplements",
      "Teaching athletes to avoid substances that could harm their health",
      "Pressuring athletes to take performance-enhancing drugs",
      "Pushing athletes to perform beyond their limits"
    ],
    correct: 1
  },
  {
    id: 12,
    question: "Which psychological issue can contribute to an athlete's decision to use doping substances?",
    options: [
      "Confidence in their natural ability",
      "Pressure to win at all costs",
      "Strong team support",
      "Enjoyment of the sport"
    ],
    correct: 1
  },
  {
    id: 13,
    question: "What is the maximum legal consequence for an athlete who tests positive for a banned substance?",
    options: [
      "Lifetime ban from sports",
      "Public reprimand",
      "Temporary suspension",
      "Requirement to attend therapy sessions"
    ],
    correct: 0
  },
  {
    id: 14,
    question: "What is a critical role of sports doctors in the prevention of doping?",
    options: [
      "Administering substances to enhance performance",
      "Ensuring that athletes are not using banned substances",
      "Providing athletes with performance-enhancing drugs",
      "Monitoring athletes for signs of doping"
    ],
    correct: 1
  },
  {
    id: 15,
    question: "What is the legal consequence of an athlete being found guilty of trafficking banned substances?",
    options: [
      "Suspension for one year",
      "Jail time and permanent ban",
      "A fine only",
      "Public apology"
    ],
    correct: 1
  },
  {
    id: 16,
    question: "Which of the following is a psychological pressure that athletes might feel leading them to doping?",
    options: [
      "Desire to improve performance and success",
      "Support from the sporting community",
      "Enjoyment of the competition",
      "Confidence in their abilities"
    ],
    correct: 0
  },
  {
    id: 17,
    question: "What legal body sets the list of banned substances in sports?",
    options: [
      "International Olympic Committee (IOC)",
      "World Anti-Doping Agency (WADA)",
      "FIFA",
      "World Health Organization (WHO)"
    ],
    correct: 1
  },
  {
    id: 18,
    question: "What is a key factor for athletes considering doping, from a psychological perspective?",
    options: [
      "The desire to recover from injury quickly",
      "Pride in natural performance",
      "Commitment to fair play",
      "Refusal to compete at a higher level"
    ],
    correct: 0
  },
  {
    id: 19,
    question: "What is the role of a coach in educating athletes about doping?",
    options: [
      "Encouraging the use of banned substances for better performance",
      "Providing education on the dangers of doping",
      "Ignoring the risk of doping for better results",
      "Offering athletes substances to help with recovery"
    ],
    correct: 1
  },
  {
    id: 20,
    question: "What psychological effect can the pressure to win have on athletes?",
    options: [
      "Increased determination",
      "Decreased desire to compete",
      "Increased likelihood of doping",
      "Stronger mental resilience"
    ],
    correct: 2
  }
];

// Educational facts for each question
const facts = [
  "Psychological pressures such as fear of failure or intense competition often drive athletes to consider doping as a way to improve performance.",
  "Athletes caught using doping substances may face legal consequences, including jail time, depending on the severity of the offense.",
  "Coaches, doctors, and trainers have a significant role in preventing doping by educating athletes and monitoring their health.",
  "Trafficking banned substances can result in serious legal consequences, including potential jail time for the trafficker.",
  "One of the psychological pressures that leads to doping is the desire to recover from injury quickly and return to competition.",
  "Coaches are responsible for ensuring that their athletes are not using banned substances and for promoting fair and safe training practices.",
  "The World Anti-Doping Agency (WADA) is the global organization responsible for setting regulations and ensuring compliance with anti-doping laws.",
  "Doping can cause psychological effects like anxiety, paranoia, and depression, which often worsen over time with prolonged use.",
  "Psychological factors such as fear of failure and the need to perform can influence an athlete's decision to use performance-enhancing substances.",
  "Athletes who test positive for doping face legal consequences, including fines, suspensions, and damage to their career and reputation.",
  "Coaches must ensure that athletes understand the risks of doping and guide them towards healthier alternatives for performance improvement.",
  "Pressure to win at all costs and competition anxiety can make athletes more susceptible to doping, as they seek ways to outperform others.",
  "Athletes caught doping may face a lifetime ban from competitions, especially in high-profile cases where fairness is compromised.",
  "Sports doctors should prioritize the health and well-being of athletes by ensuring they do not use harmful or banned substances.",
  "The legal consequences of trafficking banned substances can include jail time and lifelong bans from sports, severely impacting an individual's career.",
  "Athletes often face intense pressure to improve performance and meet expectations, which can push them toward doping as a quick solution.",
  "WADA is the governing body that determines which substances are banned in sports, updating the list annually to ensure fairness and safety.",
  "Athletes may consider doping when faced with the psychological pressure to recover quickly from injuries or improve performance under time constraints.",
  "Coaches should be role models in educating athletes about the dangers of doping and the importance of natural training methods.",
  "Psychological pressure, such as the need to win or achieve a specific goal, increases the likelihood that athletes will turn to doping for an edge."
];


const TIME_PER_QUESTION = 30; // 30 seconds per question

const Quiz = ({ navigation }) => {
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

export default Quiz;