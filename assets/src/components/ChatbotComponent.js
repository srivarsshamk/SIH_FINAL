import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  FlatList,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import Lottie from 'react-lottie';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

// Dimensions
const { width, height } = Dimensions.get('window');

// Web Speech API
let recognition;
if (Platform.OS === 'web' && 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
}

const ChatbotComponent = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  // 3D Avatar Animation Options
  const avatarOptions = {
    loop: true,
    autoplay: true,
    animationData: require('../../3d-avatar.json'), // Ensure the correct path
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Start Speech Recognition
  const startListening = () => {
    if (Platform.OS === 'web' && recognition) {
      try {
        recognition.start();
        setIsListening(true);

        recognition.onstart = () => {
          console.log('Speech recognition started...');
        };

        recognition.onspeechend = () => {
          console.log('Speech ended.');
          setIsListening(false);
          recognition.stop();
        };

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          console.log('Speech recognized:', speechResult);
          setMessage(speechResult);
          setIsListening(false);
          sendMessage(true);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    } else {
      console.warn('Speech recognition is not supported on this platform.');
    }
  };

  // Stop Speech Recognition
  const stopListening = () => {
    if (Platform.OS === 'web' && recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Send Message to Chatbot
  const sendMessage = async (isSmallChat = false) => {
    if (!message.trim()) return;

    if (isSmallChat) {
      setResponse(''); // Clear previous response for small chat
    } else {
      setChatHistory((prev) => [...prev, { type: 'user', text: message }]);
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/api1/', { message });
      const botResponse = res.data.response_text || 'No response received.';

      if (isSmallChat) {
        setResponse(botResponse); // Update small chat response
      } else {
        setChatHistory((prev) => [...prev, { type: 'bot', text: botResponse }]);
      }
    } catch (error) {
      const errorMsg = 'Error occurred while connecting to the backend.';
      if (isSmallChat) {
        setResponse(errorMsg);
      } else {
        setChatHistory((prev) => [...prev, { type: 'bot', text: errorMsg }]);
      }
    } finally {
      setMessage('');
    }
  };

  // Open and Close Chatbot Modal
  const openChatbot = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: height * 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeChatbot = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      {/* 3D Avatar */}
      <TouchableOpacity style={styles.avatarContainer} onPress={openChatbot}>
        <Lottie options={avatarOptions} height={250} width={350} />
      </TouchableOpacity>

      {/* Small Chat Box */}
      <View style={styles.smallChatContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(true)}>
            <Icon name="send" size={24} color="#4caf50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.micButton} onPress={isListening ? stopListening : startListening}>
            <Icon name={isListening ? 'mic' : 'mic-outline'} size={24} color="#4caf50" />
          </TouchableOpacity>
        </View>
        {response ? (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        ) : null}
      </View>

      {/* Chatbot Modal */}
      {modalVisible && (
        <Modal transparent={true} visible={modalVisible} animationType="none">
          <Animated.View style={[styles.modalContainer, { top: slideAnim }]}>
            <TouchableOpacity style={styles.closeButtonContainer} onPress={closeChatbot}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <FlatList
              data={chatHistory}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageContainer,
                    item.type === 'user' ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              )}
              contentContainerStyle={styles.chatHistory}
              showsVerticalScrollIndicator={false}
            />

            {/* <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Type your message..."
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.modalSendButton} onPress={() => sendMessage(false)}>
                <Icon name="send" size={24} color="#4caf50" />
              </TouchableOpacity>
            </View> */}
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Type your message..."
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity
                style={styles.modalMicButton}
                onPress={isListening ? stopListening : startListening}
              >
                <Icon name={isListening ? 'mic' : 'mic-outline'} size={24} color="#4caf50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSendButton}
                onPress={() => sendMessage(false)}
              >
                <Icon name="send" size={24} color="#4caf50" />
              </TouchableOpacity>
            </View>

          </Animated.View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#f5f5f5',
    // padding: 0,
  },
  avatarContainer: {
    width: 350,
    height: 250,
    marginRight: 30,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  smallChatContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
    marginRight: 120,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 5,
    width:50,
    color: '#333',
    outlineColor: 'transparent',
  },
  sendButton: {
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseContainer: {
    width: 150,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  responseText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
    modalContainer: {
    position: 'absolute',
    right: 0,
    width: width * 0.5,
    height: height * 0.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    paddingTop: 60,
    paddingHorizontal: 20,
    overflow: 'hidden', // Ensures no content leaks outside
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#4caf50',
    padding: 5,
    borderRadius: 15,
    elevation: 5,
  },
  chatHistory: {
    flexGrow: 1,
    paddingBottom: 80,
    marginBottom:10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4caf50',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 18,
    color: '#000',
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
    position: 'absolute',
    bottom: 10,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    color: '#333',
    outlineColor: 'transparent',
  },
  modalSendButton: {
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMicButton: {
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7e8',
    borderRadius: 20,
    padding: 5,
  },
  
});

export default ChatbotComponent;
