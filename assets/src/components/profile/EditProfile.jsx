import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = {
  background: '#1a1a1a',
  cardBackground: '#2d2d2d',
  primary: '#00A86B',
  text: '#00A86B',
  secondaryText: '#b0b0b0',
  border: '#404040',
  error: '#ff6b6b',
};

const EditProfile = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    bio: '',
    country: '',
    state: '',
    phoneNum: '',
    id: null,
  });
  const [errors, setErrors] = useState({});

  // Load user data from AsyncStorage or fetch from API
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        updateFormData(JSON.parse(storedUserData));
      } else {
        const response = await fetch('http://127.0.0.1:8000/users/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const userData = await response.json();
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          updateFormData(userData);
        } else {
          throw new Error('Failed to fetch user data');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (userData) => {
    setFormData({
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      email: userData.email || '',
      phoneNum: userData.phone_number || '',
      age: userData.age ? userData.age.toString() : '',
      bio: userData.bio || '',
      country: userData.country || '',
      state: userData.state || '',
      id: userData.id,
    });
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    if (formData.age) {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        newErrors.age = 'Age must be between 13 and 120';
      }
    }
    if (formData.bio && formData.bio.length > 250) {
      newErrors.bio = 'Bio must be less than 250 characters';
    }
    if (formData.phoneNum) {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(formData.phoneNum)) {
        newErrors.phoneNum = 'Invalid phone number format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/${formData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phoneNum || null,
            age: formData.age ? parseInt(formData.age, 10) : null,
            bio: formData.bio || null,
            country: formData.country || null,
            state: formData.state || null,
          }),
        });

        if (response.ok) {
          const updatedData = await response.json();
          await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
          // Replace Alert with navigation or toast
          navigation.navigate('Profile', { updatedData });
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.detail || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const renderInput = (label, key, placeholder, keyboardType = 'default', multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput, errors[key] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        value={formData[key]}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, [key]: text }))}
        keyboardType={keyboardType}
        multiline={multiline}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { updatedData })} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSubmit,{ updatedData }} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
            <Feather name="check" size={20} color="#fff" style={styles.saveIcon} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.row}>
            {renderInput('First Name', 'firstName', 'Enter first name')}
            {renderInput('Last Name', 'lastName', 'Enter last name')}
          </View>

          {renderInput('Email', 'email', 'Enter email address', 'email-address')}
          {renderInput('Age', 'age', 'Enter age (optional)', 'numeric')}
          {renderInput('Bio', 'bio', 'Write something about yourself (optional)', 'default', true)}

          <View style={styles.row}>
            {renderInput('Country', 'country', 'Enter country (optional)')}
            {renderInput('State', 'state', 'Enter state (optional)')}
          </View>

          {renderInput('Phone Number', 'phoneNum', 'Enter phone number (optional)', 'phone-pad')}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};







const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: colors.text,
      marginTop: 10,
    },
    outerContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: 8,
      height: '90%',
      width: '100%',
      maxWidth: 500,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    backButton: {
      padding: 8,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 13,
    },
    inputContainer: {
      flex: 1,
      marginBottom: 16,
    },
    label: {
      color: colors.text,
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    multilineInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    inputError: {
      borderColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      justifyContent: 'center',
    },
    saveButtonText: {
      color: '#fff',
      fontWeight: '600',
      marginRight: 4,
    },
    saveIcon: {
      marginLeft: 4,
    },
  });
  
  

export default EditProfile;
