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
  ScrollView,
} from 'react-native';
import { Mail, Lock, User, Phone } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import SpaceBackground from '../components/SpaceBackground';
import { Picker } from '@react-native-picker/picker';

const SignupScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);

  // New validation state
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    userType: ''
  });

  const navigation = useNavigation();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      userType: ''
    };

    // First Name Validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First Name is required';
      valid = false;
    }

    // Last Name Validation
    if (!lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
      valid = false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    // Password Validation
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    // Phone Number Validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
      valid = false;
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number (10 digits required)';
      valid = false;
    }

    // User Type Validation
    if (!userType) {
      newErrors.userType = 'User Type is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone_number: phoneNumber,
        category: userType,
        age: null,
        bio: null
      };

      const response = await fetch('http://127.0.0.1:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Navigate to Home screen instead of showing an alert
        navigation.navigate('Home');
      } else {
        const errorMessage = responseData.detail
          ? Array.isArray(responseData.detail)
            ? responseData.detail.map((error) => `${error.loc.join('.')}: ${error.msg}`).join('\n')
            : responseData.detail
          : 'Registration failed. Please try again.';

        Alert.alert('Registration Error', errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.mainContainer}>
      <SpaceBackground />
      <View style={styles.container}>
        <View style={styles.signupContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formContainer}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.title}>Create Account</Text>

              <View style={styles.inputWrapper}>
                <User width={20} height={20} color="#00A86B" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    setErrors(prev => ({ ...prev, firstName: '' }));
                  }}
                  editable={!loading}
                />
              </View>
              {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

              <View style={styles.inputWrapper}>
                <User width={20} height={20} color="#00A86B" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    setErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                  editable={!loading}
                />
              </View>
              {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

              <View style={styles.inputWrapper}>
                <Mail width={20} height={20} color="#00A86B" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  editable={!loading}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

              <View style={styles.inputWrapper}>
                <Phone width={20} height={20} color="#00A86B" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setErrors(prev => ({ ...prev, phoneNumber: '' }));
                  }}
                  editable={!loading}
                />
              </View>
              {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}

              <View style={styles.inputWrapper}>
                <Lock width={20} height={20} color="#00A86B" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  editable={!loading}
                />
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

              <View style={styles.inputWrapper}>
                <Picker
                  selectedValue={userType}
                  onValueChange={(itemValue) => {
                    setUserType(itemValue);
                    setErrors(prev => ({ ...prev, userType: '' }));
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select User Type" value="" />
                  <Picker.Item label="Student" value="student" />
                  <Picker.Item label="Athlete" value="athlete" />
                  <Picker.Item label="Coach" value="coach" />
                  <Picker.Item label="Experts" value="experts" />
                  <Picker.Item label="Others" value="others" />
                </Picker>
              </View>
              {errors.userType ? <Text style={styles.errorText}>{errors.userType}</Text> : null}

              <TouchableOpacity
                style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity  style={styles.loginLink}>
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text style={styles.signupText}>Login</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
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
    marginLeft: 16,
    alignSelf: 'flex-start',
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupContainer: {
    width: '80%', // Adjusted to avoid covering the button
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    marginTop: 40,
    textAlign: 'center',
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
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  picker: {
    flex: 1,
    color: 'black',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupButtonDisabled: {
    backgroundColor: '#666666',
  },
  signupButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  signupText: {
    color: '#00A86B',
    fontSize: 16,
  },
});

export default SignupScreen;