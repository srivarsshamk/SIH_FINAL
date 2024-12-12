import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function ModuleQuizScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { module, moduleId } = route.params;
  const [previousQuizScore, setPreviousQuizScore] = useState(0);

  const quizQuestions = [
    {
      question: "What is the primary purpose of anti-doping efforts?",
      options: [
        { text: "To enhance athletic performance", isCorrect: false },
        { text: "To ensure fair competition", isCorrect: true },
        { text: "To reduce training costs", isCorrect: false },
        { text: "To increase media coverage", isCorrect: false }
      ]
    },
    {
      question: "Which of the following is a common method of blood doping?",
      options: [
        { text: "Caffeine injection", isCorrect: false },
        { text: "Erythropoietin (EPO) use", isCorrect: true },
        { text: "Vitamin supplementation", isCorrect: false },
        { text: "Massage therapy", isCorrect: false }
      ]
    },
    {
      question: "What is the primary health risk of anabolic steroid abuse?",
      options: [
        { text: "Improved muscle growth", isCorrect: false },
        { text: "Liver damage", isCorrect: true },
        { text: "Enhanced cardiovascular performance", isCorrect: false },
        { text: "Better sleep patterns", isCorrect: false }
      ]
    },
    {
      question: "Gene doping primarily involves manipulating which biological mechanism?",
      options: [
        { text: "Digestive system", isCorrect: false },
        { text: "Nervous system", isCorrect: false },
        { text: "Genetic expression", isCorrect: true },
        { text: "Immune system", isCorrect: false }
      ]
    },
    {
      question: "What psychological pressure contributes to doping in sports?",
      options: [
        { text: "Fear of failure", isCorrect: true },
        { text: "Lack of motivation", isCorrect: false },
        { text: "Financial stability", isCorrect: false },
        { text: "Family pressure", isCorrect: false }
      ]
    },
    {
      question: "Which organ is most critically affected by long-term EPO abuse?",
      options: [
        { text: "Kidneys", isCorrect: true },
        { text: "Lungs", isCorrect: false },
        { text: "Skin", isCorrect: false },
        { text: "Brain", isCorrect: false }
      ]
    },
    {
      question: "What is a short-term psychological effect of performance-enhancing drugs?",
      options: [
        { text: "Increased confidence", isCorrect: true },
        { text: "Reduced stress", isCorrect: false },
        { text: "Better sleep", isCorrect: false },
        { text: "Improved memory", isCorrect: false }
      ]
    },
    {
      question: "Which type of doping involves increasing oxygen-carrying capacity?",
      options: [
        { text: "Hormone doping", isCorrect: false },
        { text: "Blood doping", isCorrect: true },
        { text: "Genetic manipulation", isCorrect: false },
        { text: "Protein enhancement", isCorrect: false }
      ]
    },
    {
      question: "What social factor can influence an athlete's decision to dope?",
      options: [
        { text: "Peer pressure", isCorrect: true },
        { text: "Media attention", isCorrect: false },
        { text: "Family support", isCorrect: false },
        { text: "Academic performance", isCorrect: false }
      ]
    },
    {
      question: "Which hormone is commonly misused in performance enhancement?",
      options: [
        { text: "Insulin", isCorrect: false },
        { text: "Testosterone", isCorrect: true },
        { text: "Melatonin", isCorrect: false },
        { text: "Cortisol", isCorrect: false }
      ]
    },
    {
      question: "What is a potential long-term cardiovascular risk of doping?",
      options: [
        { text: "Increased endurance", isCorrect: false },
        { text: "Heart attack", isCorrect: true },
        { text: "Better muscle definition", isCorrect: false },
        { text: "Improved breathing", isCorrect: false }
      ]
    },
    {
      question: "Gene doping aims to do what?",
      options: [
        { text: "Modify genetic code permanently", isCorrect: false },
        { text: "Enhance athletic performance", isCorrect: true },
        { text: "Cure genetic diseases", isCorrect: false },
        { text: "Reduce training time", isCorrect: false }
      ]
    },
    {
      question: "What psychological impact can doping have on an athlete?",
      options: [
        { text: "Increased self-esteem", isCorrect: false },
        { text: "Guilt and moral conflict", isCorrect: true },
        { text: "Enhanced mental clarity", isCorrect: false },
        { text: "Reduced competition anxiety", isCorrect: false }
      ]
    },
    {
      question: "Which system is most affected by anabolic steroid abuse?",
      options: [
        { text: "Respiratory system", isCorrect: false },
        { text: "Endocrine system", isCorrect: true },
        { text: "Digestive system", isCorrect: false },
        { text: "Skeletal system", isCorrect: false }
      ]
    },
    {
      question: "What is a primary motivation for athletes to use performance-enhancing drugs?",
      options: [
        { text: "Financial rewards", isCorrect: true },
        { text: "Medical research", isCorrect: false },
        { text: "Personal challenge", isCorrect: false },
        { text: "Team building", isCorrect: false }
      ]
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchPreviousQuizScore();
  }, [moduleId]);

  const fetchPreviousQuizScore = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/module-quizzes/${moduleId}`);
      setPreviousQuizScore(response.data.m_quizscore);
    } catch (error) {
      console.error('Error fetching previous quiz score:', error);
    }
  };
 

  const calculateScore = () => {
    const newScore = selectedAnswers.reduce((total, answer, index) => {
      return answer !== null && quizQuestions[index].options[answer].isCorrect 
        ? total + 1 
        : total;
    }, 0);
    setScore(newScore);
    setShowResults(true);
    postQuizScore(newScore);
    // Pass newScore directly to both functions
    markModuleAsCompleted();
    
  };
  
  const markModuleAsCompleted = async () => {
    try {
      await axios.patch(`http://127.0.0.1:8000/module-quizzes/${moduleId}/completed`);
      console.log('Module marked as completed');
    } catch (error) {
      console.error('Error marking module as completed:', error.response?.data || error.message);
      
      
    }
  };
  const postQuizScore = async (finalScore) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/module-quizzes/${moduleId}/score`, {
        score: finalScore
      });
    } catch (error) {
      console.error('Error posting quiz score:', error);
      Alert.alert('Score Update', 'Unable to update quiz score.');
    }
  };
  const handleAnswerSelection = (optionIndex) => {
    if (showResults) return;

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const moveToNextQuestion = () => {
    if (selectedAnswers[currentQuestion] === null) {
      Alert.alert('Please select an answer');
      return;
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quizQuestions.length).fill(null));
    setShowResults(false);
    setScore(0);
  };

  const getOptionStyle = (optionIndex) => {
    if (!showResults) {
      return selectedAnswers[currentQuestion] === optionIndex 
        ? styles.selectedOption 
        : styles.optionButton;
    }
    
    const currentQuestionData = quizQuestions[currentQuestion];
    const correctOptionIndex = currentQuestionData.options.findIndex(option => option.isCorrect);
    
    if (correctOptionIndex === optionIndex) {
      return styles.correctOption;
    }
    
    if (selectedAnswers[currentQuestion] === optionIndex && 
        !currentQuestionData.options[optionIndex].isCorrect) {
      return styles.incorrectOption;
    }
    
    return styles.optionButton;
  };

  const getOptionTextStyle = (optionIndex) => {
    if (!showResults) {
      return styles.optionText;
    }

    const currentQuestionData = quizQuestions[currentQuestion];
    const correctOptionIndex = currentQuestionData.options.findIndex(option => option.isCorrect);
    
    if (correctOptionIndex === optionIndex) {
      return [styles.optionText, { color: 'white' }];
    }
    
    if (selectedAnswers[currentQuestion] === optionIndex && 
        !currentQuestionData.options[optionIndex].isCorrect) {
      return [styles.optionText, { color: 'white' }];
    }

    return styles.optionText;
  };

  if (showResults) {
    return (
      <View style={styles.container}>
        <Text style={styles.moduleTitle}>Quiz Results</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Your Score: {score} out of {quizQuestions.length}
          </Text>
          <Text style={styles.previousScoreText}>
            Previous Best Score: {previousQuizScore}
          </Text>
          <TouchableOpacity 
            style={styles.restartButton}
            onPress={() => {
              setCurrentQuestion(0);
              setSelectedAnswers(new Array(quizQuestions.length).fill(null));
              setShowResults(false);
              setScore(0);
            }}
          >
            <Text style={styles.submitButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.submitButtonText}>Back to Module</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.moduleTitle}>
        {module?.title || 'Doping Awareness Quiz'}
      </Text>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionCounter}>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </Text>
        
        <Text style={styles.question}>
          {quizQuestions[currentQuestion].question}
        </Text>

        {quizQuestions[currentQuestion].options.map((option, optionIndex) => (
          <TouchableOpacity
            key={optionIndex}
            style={[
              getOptionStyle(optionIndex),
              showResults && {
                borderWidth: 2,
                borderColor: 
                  optionIndex === quizQuestions[currentQuestion].options.findIndex(opt => opt.isCorrect)
                    ? 'green' 
                    : selectedAnswers[currentQuestion] === optionIndex 
                    ? 'red' 
                    : 'transparent'
              }
            ]}
            onPress={() => handleAnswerSelection(optionIndex)}
          >
            <Text style={getOptionTextStyle(optionIndex)}>{option.text}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            selectedAnswers[currentQuestion] === null ? styles.disabledSubmitButton : {}
          ]}
          onPress={moveToNextQuestion}
          disabled={selectedAnswers[currentQuestion] === null}
        >
          <Text style={styles.submitButtonText}>
            {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03615b',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  questionCounter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'right',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#03615b',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  correctOption: {
    backgroundColor: '#4CAF50', // Green for correct answer
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  incorrectOption: {
    backgroundColor: '#FF5252', // Red for incorrect answer
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  disabledSubmitButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#03615b',
  },
  restartButton: {
    backgroundColor: '#03615b',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  backButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
  },
});