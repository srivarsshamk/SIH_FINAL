import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { chapterQuestions } from '../components/QuizQuestions';
import axios from 'axios';

export default function QuizScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { chapter, lessonId } = route.params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [previousBestScore, setPreviousBestScore] = useState(0);

  const questions = chapterQuestions[chapter];

  useEffect(() => {
    // Fetch previous best score when component mounts
    const fetchPreviousBestScore = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/lesson-quizzes/${lessonId}`);
        setPreviousBestScore(response.data.l_quizscore || 0);
      } catch (error) {
        console.error('Error fetching previous best score:', error);
      }
    };

    fetchPreviousBestScore();
  }, [lessonId]);

  const handleSubmitQuiz = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    setAnswerChecked(true);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    // Delay to allow user to see the result before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setAnswerChecked(false);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  const handleRestartQuiz = async () => {
    // Reset quiz state
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setAnswerChecked(false);

    // Patch the quiz score
    try {
      await axios.patch(`http://127.0.0.1:8000/lesson-quizzes/${lessonId}/score`, {
        l_quizscore: Math.max(score, previousBestScore)
      });
    } catch (error) {
      console.error('Error updating quiz score:', error);
      Alert.alert('Error', 'Unable to update quiz score');
    }
  };

  const navigateToChapterList = async () => {
    // Patch the quiz score before navigating back
    try {
      await axios.patch(`http://127.0.0.1:8000/lesson-quizzes/${lessonId}/score`, {
        l_quizscore: Math.max(score, previousBestScore)
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating quiz score:', error);
      Alert.alert('Error', 'Unable to update quiz score');
    }
  };

  const getOptionStyle = (optionId) => {
    if (!answerChecked) return styles.optionButton;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (optionId === currentQuestion.correctAnswer) {
      return styles.correctOption;
    }
    if (optionId === selectedAnswer && optionId !== currentQuestion.correctAnswer) {
      return styles.wrongOption;
    }
    return styles.optionButton;
  };

  const getOptionTextStyle = (optionId) => {
    if (!answerChecked) return styles.optionText;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (optionId === currentQuestion.correctAnswer) {
      return styles.correctOptionText;
    }
    if (optionId === selectedAnswer && optionId !== currentQuestion.correctAnswer) {
      return styles.wrongOptionText;
    }
    return styles.optionText;
  };

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultTitle}>Quiz Completed!</Text>
        <Text style={styles.resultText}>
          Your Score: {score} out of {questions.length}
        </Text>
        <Text style={styles.previousScoreText}>
          Previous Best Score: {previousBestScore} out of {questions.length}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleRestartQuiz}
          >
            <Text style={styles.buttonText}>Restart Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={navigateToChapterList}
          >
            <Text style={styles.buttonText}>Back to Modules</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.chapterTitle}>Quiz: {chapter}</Text>
      <Text style={styles.previousScoreText}>
        Previous Best Score: {previousBestScore} out of {questions.length}
      </Text>
      <View style={styles.questionContainer}>
        <Text style={styles.questionProgress}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {currentQuestion.options.map((option) => (
          <TouchableOpacity 
            key={option.id}
            style={[
              getOptionStyle(option.id),
              selectedAnswer === option.id && !answerChecked && styles.selectedOption
            ]}
            onPress={() => !answerChecked && setSelectedAnswer(option.id)}
            disabled={answerChecked}
          >
            <Text style={getOptionTextStyle(option.id)}>{option.text}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmitQuiz}
          disabled={answerChecked}
        >
          <Text style={styles.submitButtonText}>
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03615b',
    marginBottom: 20,
  },
  previousScoreText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionContainer: {
    width: '100%',
    backgroundColor: '#D8D2C2',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  questionProgress: {
    fontSize: 16,
    color: '#03615b',
    marginBottom: 10,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  correctOption: {
    backgroundColor: '#2E8B57', // Green for correct answer
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  wrongOption: {
    backgroundColor: '#DC143C', // Red for wrong answer
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  optionText: {
    color: '#03615b',
    fontSize: 16,
  },
  correctOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wrongOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#03615b',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03615b',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  actionButton: {
    backgroundColor: '#03615b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});