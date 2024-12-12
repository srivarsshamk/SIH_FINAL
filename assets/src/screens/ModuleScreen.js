import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ModulesScreen() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [totalProgress, setTotalProgress] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserId(parsedData.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const modules = [
    {
      title: 'Fundamentals of Anti-Doping',
      thumbnail: require('../../images/module1.jpg'),
      chapters: [
        'History of Anti-Doping',
        'Understanding Doping and its Impacts',
        'Guardians of FairPlay',
        'Anti-Doping Codes-The Basics',
        'Complexities of Anti-Doping',
      ],
    },
    {
      title: 'Doping Methods and Their Impacts',
      thumbnail: require('../../images/module2.png'),
      chapters: [
        'Physical and Psychological Effects of Doping',
        'Types of Performance-Enhancing Drugs and Their Uses',
        'Techniques of Blood Doping and Gene Doping',
        'Short-Term and Long-Term Health Risks of Doping',
        'The Social and Psychological Pressure to Use Doping',
      ],
    },
    
    {
      title: 'Education and Prevention',
      thumbnail: require('../../images/educationmodule/educationandpreven.webp'),
      chapters: [
        'Education and Prevention Strategies in Anti-Doping',
        'Educating Athletes, Coaches, and all Stakeholders',
        'The Role of Schools and Universities',
        'Comprehensive Guide for Athlete Preparation',
        //'Integrating Anti-Doping in Training',
      ],
    },
    
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchModuleProgress();
    }
  }, [userId]);


  const fetchModuleProgress = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/module-quizzes/users/${userId}/module-progress`);
      setTotalProgress(response.data.total_progress);
      setTotalCompleted(response.data.total_completed);
    } catch (error) {
      console.error('Error fetching module progress:', error);
    }
  };

  const handleModulePress = async (module) => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    try {
      const postResponse = await axios.post('http://127.0.0.1:8000/module-quizzes', {
        module_name: module.title,
        module_progress: 0,
        module_completed: 0,
        m_quizscore: 0,
        user_id: userId
      });

      const moduleId = postResponse.data.id;

      await axios.patch(`http://127.0.0.1:8000/module-quizzes/${moduleId}/progress`, {
        module_progress: 0
      });

      navigation.navigate('ChaptersScreen', { module, moduleId });

    } catch (error) {
      console.error('Error processing module:', error);
      Alert.alert('Error', 'Failed to process module. Please try again.');
    }
  };

  const renderModuleCard = (module, index) => (
    <TouchableOpacity
      key={index}
      style={styles.moduleCard}
      onPress={() => handleModulePress(module)}
    >
      <Image source={module.thumbnail} style={styles.thumbnail} />
      <Text style={styles.moduleTitle}>{module.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {totalProgress}/6 Modules Completed: {totalCompleted}/6
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Anti-Doping Modules</Text>
        <View style={styles.modulesContainer}>
          {modules.map((module, index) => renderModuleCard(module, index))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f7f7f7',
    backgroundColor:'#000000',

  },
  scrollView: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#03615b',  // Green color for the header
    textAlign: 'center',
  },
  modulesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  progressContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moduleCard: {
    width: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 15,
    backgroundColor: '#ffffff', // White background for each module card
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03615b',  // Green color for module titles
    textAlign: 'center',
  },
});
