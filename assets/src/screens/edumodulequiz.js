import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function edumodulequiz() {
  const route = useRoute();
  const navigation = useNavigation();
  const { module, moduleId } = route.params;
  const [previousQuizScore, setPreviousQuizScore] = useState(0);

  const quizQuestions = [
    {
      question: "Which system is most affected by anabolic steroid abuse?",
      options: [
        { id: 'A', text: "Respiratory system", isCorrect: false },
        { id: 'B', text: "Endocrine system", isCorrect: true },
        { id: 'C', text: "Digestive system", isCorrect: false },
        { id: 'D', text: "Skeletal system", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What does WADA primarily do?",
      options: [
        { id: 'A', text: "Train athletes", isCorrect: false },
        { id: 'B', text: "Create and enforce global anti-doping regulations", isCorrect: true },
        { id: 'C', text: "Manufacture sports equipment", isCorrect: false },
        { id: 'D', text: "Manage international competitions", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "The Whereabouts Rule requires athletes to do what?",
      options: [
        { id: 'A', text: "Share their training routines with fans", isCorrect: false },
        { id: 'B', text: "Inform authorities of their location for random testing", isCorrect: true },
        { id: 'C', text: "Report their performance metrics daily", isCorrect: false },
        { id: 'D', text: "Disclose their dietary plans to coaches", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What is a Therapeutic Use Exemption (TUE) primarily used for?",
      options: [
        { id: 'A', text: "To enhance performance", isCorrect: false },
        { id: 'B', text: "To legally use prohibited medication for medical reasons", isCorrect: true },
        { id: 'C', text: "To bypass drug testing", isCorrect: false },
        { id: 'D', text: "To extend competition time", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Which athlete lost their Olympic gold medal due to doping?",
      options: [
        { id: 'A', text: "Maria Sharapova", isCorrect: false },
        { id: 'B', text: "Ben Johnson", isCorrect: true },
        { id: 'C', text: "Lance Armstrong", isCorrect: false },
        { id: 'D', text: "Marion Jones", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What potential health risks are associated with performance-enhancing drugs?",
      options: [
        { id: 'A', text: "Minor temporary side effects", isCorrect: false },
        { id: 'B', text: "Severe health issues like heart problems and hormonal imbalances", isCorrect: true },
        { id: 'C', text: "No significant health risks", isCorrect: false },
        { id: 'D', text: "Only psychological impacts", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What is the primary goal of surprise drug tests?",
      options: [
        { id: 'A', text: "To embarrass athletes", isCorrect: false },
        { id: 'B', text: "To maintain the integrity of sports", isCorrect: true },
        { id: 'C', text: "To generate media attention", isCorrect: false },
        { id: 'D', text: "To collect athlete data", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Which type of substances are more likely to have reduced sanctions?",
      options: [
        { id: 'A', text: "Non-Specified Substances", isCorrect: false },
        { id: 'B', text: "Specified Substances", isCorrect: true },
        { id: 'C', text: "Anabolic Agents", isCorrect: false },
        { id: 'D', text: "Stimulants", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What critical document must athletes complete before international competitions?",
      options: [
        { id: 'A', text: "Fan interaction form", isCorrect: false },
        { id: 'B', text: "Anti-Doping Registration Form", isCorrect: true },
        { id: 'C', text: "Social media consent", isCorrect: false },
        { id: 'D', text: "Entertainment contract", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Which institution played a crucial role in reducing doping incidents through awareness programs?",
      options: [
        { id: 'A', text: "World Health Organization", isCorrect: false },
        { id: 'B', text: "National Institute of Sports, Patiala", isCorrect: true },
        { id: 'C', text: "International Olympic Committee", isCorrect: false },
        { id: 'D', text: "United Nations Sports Department", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "How long typically do drug test results take to process?",
      options: [
        { id: 'A', text: "24 hours", isCorrect: false },
        { id: 'B', text: "A few weeks", isCorrect: true },
        { id: 'C', text: "Immediately after the test", isCorrect: false },
        { id: 'D', text: "One month", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What must athletes do to ensure clean sports participation?",
      options: [
        { id: 'A', text: "Win at all costs", isCorrect: false },
        { id: 'B', text: "Understand and comply with anti-doping regulations", isCorrect: true },
        { id: 'C', text: "Ignore testing procedures", isCorrect: false },
        { id: 'D', text: "Minimize medical documentation", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What is the most effective method to prevent doping?",
      options: [
        { id: 'A', text: "Harsh punishments", isCorrect: false },
        { id: 'B', text: "Comprehensive education", isCorrect: true },
        { id: 'C', text: "More frequent testing", isCorrect: false },
        { id: 'D', text: "Higher athlete salaries", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Which of these is a prohibited method of performance enhancement?",
      options: [
        { id: 'A', text: "Drinking water", isCorrect: false },
        { id: 'B', text: "Gene and Cell Doping", isCorrect: true },
        { id: 'C', text: "Regular vitamin intake", isCorrect: false },
        { id: 'D', text: "Proper nutrition", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What is Erythropoietin (EPO) primarily used for?",
      options: [
        { id: 'A', text: "Pain relief", isCorrect: false },
        { id: 'B', text: "Increasing red blood cell production", isCorrect: true },
        { id: 'C', text: "Muscle building", isCorrect: false },
        { id: 'D', text: "Weight loss", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Why should society care about anti-doping efforts?",
      options: [
        { id: 'A', text: "To reduce sports entertainment", isCorrect: false },
        { id: 'B', text: "To protect athlete health and promote fair competition", isCorrect: true },
        { id: 'C', text: "To create more rules", isCorrect: false },
        { id: 'D', text: "To increase testing budgets", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What happens if an athlete tests positive for a banned substance?",
      options: [
        { id: 'A', text: "Nothing", isCorrect: false },
        { id: 'B', text: "Potential disqualification and ban", isCorrect: true },
        { id: 'C', text: "A small fine", isCorrect: false },
        { id: 'D', text: "Public apology", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Which organization updates the Prohibited List annually?",
      options: [
        { id: 'A', text: "International Olympic Committee", isCorrect: false },
        { id: 'B', text: "World Anti-Doping Agency (WADA)", isCorrect: true },
        { id: 'C', text: "United Nations Sports Department", isCorrect: false },
        { id: 'D', text: "Global Athletics Federation", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What is a key role of coaches in preventing doping?",
      options: [
        { id: 'A', text: "Reporting all athletes", isCorrect: false },
        { id: 'B', text: "Creating a culture of trust and ethical decision-making", isCorrect: true },
        { id: 'C', text: "Conducting drug tests", isCorrect: false },
        { id: 'D', text: "Punishing athletes", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "When are Beta-Blockers prohibited?",
      options: [
        { id: 'A', text: "Always", isCorrect: false },
        { id: 'B', text: "In-Competition for certain sports", isCorrect: true },
        { id: 'C', text: "Never", isCorrect: false },
        { id: 'D', text: "Only during Olympic games", isCorrect: false }
      ],
      correctAnswer: 'B'
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
  
    // Pass newScore directly to both functions
    postQuizScore(newScore);
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
    // Check if an answer is selected
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
    // If results are not shown, use standard selection logic
    if (!showResults) {
      return selectedAnswers[currentQuestion] === optionIndex 
        ? styles.selectedOption 
        : styles.optionButton;
    }
    
    // When showing results
    const currentQuestionData = quizQuestions[currentQuestion];
    const correctOptionIndex = currentQuestionData.options.findIndex(option => option.isCorrect);
    
    // Always highlight the correct answer in green
    if (correctOptionIndex === optionIndex) {
      return styles.correctOption;
    }
    
    // If a wrong answer was selected, highlight it in red
    if (selectedAnswers[currentQuestion] === optionIndex && 
        !currentQuestionData.options[optionIndex].isCorrect) {
      return styles.incorrectOption;
    }
    
    // Default style for other options
    return styles.optionButton;
  };

  const getOptionTextStyle = (optionIndex) => {
    if (!showResults) {
      return styles.optionText;
    }

    const currentQuestionData = quizQuestions[currentQuestion];
    const correctOptionIndex = currentQuestionData.options.findIndex(option => option.isCorrect);
    
    // Green text for correct answer
    if (correctOptionIndex === optionIndex) {
      return [styles.optionText, { color: 'white' }];
    }
    
    // Red text for incorrect selected answer
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