import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import SpaceBackground from '../components/SpaceBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New state for validation errors
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    category: ''
  });

  const navigation = useNavigation();

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '', category: '' };

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    // Category validation
    if (!category) {
      newErrors.category = 'Please select a category';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    // First validate the form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password, category }),
      });

      const responseData = await response.json();
      console.log(responseData)

      if (response.ok) {
        // Store user data in AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(responseData));
  
        // Navigate to the appropriate screen based on the category
        switch (category) {
          case 'coach':
            navigation.navigate('HomeCoach', { updateProfile: true });
            break;
          case 'experts':
            navigation.navigate('HomeExpert', { updateProfile: true });
            break;
          case 'student':
          case 'athlete':
            navigation.navigate('Home', { updateProfile: true });
            break;
          default:
            Alert.alert('Error', 'Invalid category');
        }
      } else {
        Alert.alert('Login Failed', responseData.detail || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.mainContainer}>
      <SpaceBackground />
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formContainer}
          >
            <Text style={styles.title}>Sign In</Text>

            <View style={styles.inputWrapper}>
              <Mail width={20} height={20} color="#00A86B" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mail"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  // Clear email error when user starts typing
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
                editable={!loading}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <View style={styles.inputWrapper}>
              <Lock width={20} height={20} color="#00A86B" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  // Clear password error when user starts typing
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                editable={!loading}
              />
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <DropDownPicker
              open={dropdownOpen}
              value={category}
              items={[
                { label: 'Athlete', value: 'athlete' },
                { label: 'Student', value: 'student' },
                { label: 'Coach', value: 'coach' },
                { label: 'Experts', value: 'experts' },
                { label: 'Others', value: 'others' },
              ]}
              setOpen={setDropdownOpen}
              setValue={(val) => {
                setCategory(val);
                // Clear category error when user selects a category
                setErrors(prev => ({ ...prev, category: '' }));
              }}
              placeholder="Select Category"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              disabled={loading}
            />
            {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToSignup} style={styles.signupLink}>
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text style={styles.signupTextt}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
};




const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
    width: '100%',
    paddingHorizontal: 16,
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: '20%',
    height: '60%',
    backdropFilter: 'blur(10px)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formContainer: {
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    marginTop: 40,
    marginVertical:60
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26,26,26,0.8)',
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
    width: '100%',
    backgroundColor: 'transparent',
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26,26,26,0.8)',
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
    width: '100%',
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF'
  },
  dropdownText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 47,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom:10,
  },
  loginButtonDisabled: {
    backgroundColor: '#666666'
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  signupLink: {
    marginTop: 16,
    alignItems: 'center'
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: 16
  },
  signupTextt: {
    color: '#00A86B',
    fontSize: 16
  }
});


export default LoginScreen;