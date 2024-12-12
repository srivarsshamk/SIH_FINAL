import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function funmodulequiz() {
  const route = useRoute();
  const navigation = useNavigation();
  const { module, moduleId } = route.params;
  const [previousQuizScore, setPreviousQuizScore] = useState(0);

  const quizQuestions = [
    {
      question: "Which ancient civilization used aphrodisiacs and medicinal plants to enhance strength and stamina?",
      options: [
        { id: 'A', text: "Ancient Greeks", isCorrect: false },
        { id: 'B', text: "Roman Gladiators", isCorrect: false },
        { id: 'C', text: "Medieval Knights", isCorrect: true },
        { id: 'D', text: "Persian Warriors", isCorrect: false }
      ],
      correctAnswer: 'C'
    },
    {
      question: "What role did the Industrial Revolution play in the rise of doping practices?",
      options: [
        { id: 'A', text: "It introduced new sporting events.", isCorrect: false },
        { id: 'B', text: "It led to the invention of new drugs and chemicals used for performance enhancement.", isCorrect: true },
        { id: 'C', text: "It established the first anti-doping agency.", isCorrect: false },
        { id: 'D', text: "It created stricter laws on drug use in sports.", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Which of the following is NOT a prohibited method under WADA's Anti-Doping Code?",
      options: [
        { id: 'A', text: "Blood doping", isCorrect: false },
        { id: 'B', text: "Gene doping", isCorrect: false },
        { id: 'C', text: "Use of masking agents", isCorrect: false },
        { id: 'D', text: "Consumption of caffeine", isCorrect: true }
      ],
      correctAnswer: 'D'
    },
    {
      question: "What triggered the creation of the World Anti-Doping Agency (WADA) in 1999?",
      options: [
        { id: 'A', text: "The rise of new performance-enhancing drugs", isCorrect: false },
        { id: 'B', text: "The exposure of state-sponsored doping in Russia", isCorrect: false },
        { id: 'C', text: "The doping scandals at the 1998 Tour de France", isCorrect: true },
        { id: 'D', text: "The increased demand for athlete health and safety", isCorrect: false }
      ],
      correctAnswer: 'C'
    },
    {
      question: "Which of the following is considered a 'masking agent' under anti-doping regulations?",
      options: [
        { id: 'A', text: "Erythropoietin (EPO)", isCorrect: false },
        { id: 'B', text: "Diuretics", isCorrect: true },
        { id: 'C', text: "Anabolic steroids", isCorrect: false },
        { id: 'D', text: "Human Growth Hormone (HGH)", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What is the main goal of Therapeutic Use Exemptions (TUEs) in anti-doping?",
      options: [
        { id: 'A', text: "To allow athletes to avoid drug testing.", isCorrect: false },
        { id: 'B', text: "To permit athletes to use prohibited substances for medical reasons.", isCorrect: true },
        { id: 'C', text: "To increase the frequency of random drug tests.", isCorrect: false },
        { id: 'D', text: "To exempt athletes from providing their whereabouts.", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Which of the following is considered a 'Prohibited Method' in anti-doping?",
      options: [
        { id: 'A', text: "Use of blood transfusions to increase oxygen capacity", isCorrect: true },
        { id: 'B', text: "Consumption of herbal supplements", isCorrect: false },
        { id: 'C', text: "Taking multivitamins for better recovery", isCorrect: false },
        { id: 'D', text: "Eating high-protein diets before competitions", isCorrect: false }
      ],
      correctAnswer: 'A'
    },
    {
      question: "Which key concept is central to the athlete's responsibility under the Anti-Doping Code?",
      options: [
        { id: 'A', text: "Athletes must undergo weekly drug testing.", isCorrect: false },
        { id: 'B', text: "Athletes are strictly liable for any prohibited substances found in their bodies.", isCorrect: true },
        { id: 'C', text: "Athletes must disclose their full health history to WADA.", isCorrect: false },
        { id: 'D', text: "Athletes are required to only participate in national competitions.", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Which of these is an example of 'out-of-competition' testing?",
      options: [
        { id: 'A', text: "Testing an athlete at the Olympic Games.", isCorrect: false },
        { id: 'B', text: "Testing an athlete while they are on vacation.", isCorrect: true },
        { id: 'C', text: "Testing an athlete just before a match.", isCorrect: false },
        { id: 'D', text: "Testing an athlete during a training camp.", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What is the primary purpose of the WADA Prohibited List?",
      options: [
        { id: 'A', text: "To classify banned sports equipment.", isCorrect: false },
        { id: 'B', text: "To list substances and methods that are prohibited in sports.", isCorrect: true },
        { id: 'C', text: "To highlight athletes who have been banned.", isCorrect: false },
        { id: 'D', text: "To inform athletes of competition schedules.", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Which of the following is a key function of National Anti-Doping Agencies (NADAs)?",
      options: [
        { id: 'A', text: "To provide grants for athlete development.", isCorrect: false },
        { id: 'B', text: "To enforce the Anti-Doping Code within their own countries.", isCorrect: true },
        { id: 'C', text: "To develop the global anti-doping rules and regulations.", isCorrect: false },
        { id: 'D', text: "To provide medals for clean athletes.", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What is one of the key indicators of potential doping in an athlete's biological passport?",
      options: [
        { id: 'A', text: "Changes in blood or urine sample color.", isCorrect: false },
        { id: 'B', text: "Abnormal fluctuations in blood markers over time.", isCorrect: true },
        { id: 'C', text: "Positive results from a single doping test.", isCorrect: false },
        { id: 'D', text: "Detection of herbal supplements in the system.", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What is the consequence for a coach or medical support staff member found to be complicit in an athlete's doping?",
      options: [
        { id: 'A', text: "They are banned from coaching for six months.", isCorrect: false },
        { id: 'B', text: "They can face sanctions and be banned from the sport.", isCorrect: true },
        { id: 'C', text: "They are required to pay a fine but continue working.", isCorrect: false },
        { id: 'D', text: "They are only given a warning letter.", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "What is the primary goal of anti-doping public education campaigns?",
      options: [
        { id: 'A', text: "To advertise the latest anti-doping technology.", isCorrect: false },
        { id: 'B', text: "To educate athletes and coaches on doping risks and clean sport values.", isCorrect: true },
        { id: 'C', text: "To promote supplements that are safe for athletes.", isCorrect: false },
        { id: 'D', text: "To raise funds for WADA's testing programs.", isCorrect: false }
      ],
      correctAnswer: 'B'
    },
    {
      question: "Which of the following substances is NOT classified as a stimulant on WADA's Prohibited List?",
      options: [
        { id: 'A', text: "Amphetamines", isCorrect: false },
        { id: 'B', text: "Caffeine", isCorrect: true },
        { id: 'C', text: "Cocaine", isCorrect: false },
        { id: 'D', text: "Ephedrine", isCorrect: false }
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
    postQuizScore(newScore);
  };

  const postQuizScore = async (finalScore) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/module-quizzes/${moduleId}/score`, {
        score: finalScore
      });
    } catch (error) {
      console.error('Error posting quiz score:', error);
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