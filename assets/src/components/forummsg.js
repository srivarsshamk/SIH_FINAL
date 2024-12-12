import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');
const GRID_SIZE = width * 0.1;

const ForumDetailScreen = ({ route, navigation }) => {
  const { forum } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(0));
  const [forumMembers, setForumMembers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadUserData();
    fetchMessages();
    fetchForumMembers();
  }, []);

  useEffect(() => {
    Animated.timing(drawerAnimation, {
      toValue: drawerOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [drawerOpen]);

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

  const fetchForumMembers = async () => {
    try {
      const membersResponse = await axios.get(`http://127.0.0.1:8000/forums/${forum.id}/members`);
      const memberDetailsPromises = membersResponse.data.data.map(async member => {
        const userResponse = await axios.get(`http://127.0.0.1:8000/users/${member.user_id}`);
        return userResponse.data;
      });
      const memberDetails = await Promise.all(memberDetailsPromises);
      setForumMembers(memberDetails);
    } catch (error) {
      console.error('Error fetching forum members:', error);
    }
  };

  const navigateToMessage = async (receiverId, receiverUsername) => {
    try {
      await AsyncStorage.setItem('messageSenderId', userId);
      await AsyncStorage.setItem('messageReceiverId', receiverId);
      await AsyncStorage.setItem('receiverUsername', receiverUsername);

      navigation.navigate("Message", { 
        senderId: userId,
        receiverId: receiverId, 
        receiverName: receiverUsername
      });
    } catch (error) {
      console.error('Connect error:', error);
      Alert.alert('Error', 'Could not establish connection');
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.memberItem}
      onPress={() => navigateToMessage(item.id, item.first_name)}
    >
      <Text style={styles.memberName}>{item.first_name}</Text>
    </TouchableOpacity>
  );

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/forums/${forum.id}/messages`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const pickMedia = async () => {
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*';
        input.onchange = handleWebMediaPick;
        input.click();
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Sorry, we need media library permissions.");
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled) {
          await uploadMedia(result.assets[0]);
        }
      }
    } catch (err) {
      console.error("Media pick error: " + err.message);
      Alert.alert('Error', 'Could not pick media');
    }
  };

  const handleWebMediaPick = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImageUri(previewUrl);
        await uploadMedia(file);
      }
    } catch (err) {
      console.error("Web media pick error: " + err.message);
      Alert.alert('Error', 'Could not process media');
    }
  };

  const uploadMedia = async (mediaFile) => {
    try {
      const formData = new FormData();
      
      if (mediaFile instanceof File) {
        formData.append('file', mediaFile);
      } else {
        const fileExtension = mediaFile.uri.split('.').pop();
        formData.append('file', { 
          uri: mediaFile.uri, 
          type: `image/${fileExtension}`, 
          name: `message_media.${fileExtension}` 
        });
      }

      const response = await axios.post('http://127.0.0.1:8000/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImageUri(`${response.data.image_url}`);
    } catch (error) {
      console.error('Media upload error:', error);
      Alert.alert('Error', 'Could not upload media');
    }
  };
  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !imageUri) || !userId) return;

    try {
      await axios.post('http://127.0.0.1:8000/forums/messages', {
        forum_id: forum.id,
        user_id: userId,
        message: newMessage,
        image_url: imageUri || ''
      });

      // Clear input and refresh messages
      setNewMessage('');
      setImageUri(null);
      fetchMessages();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Assuming 403 is the status for spam detection
        setErrorMessage('Spam detected. You can\'t send this message.');
      } else {
        console.error('Error sending message:', error);
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageUsername}>{item.user_name}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
      {item.image_url && (
        <Image 
          source={{ uri: `http://127.0.0.1:8000${item.image_url}` }} 
          style={styles.messageImage} 
        />
      )}
      <Text style={styles.messageTime}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Error Message Display */}
      {errorMessage && (
        <View style={styles.errorMessageContainer}>
          <View style={styles.errorMessageContent}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity 
              style={styles.errorCloseButton} 
              onPress={clearErrorMessage}
            >
              <Icon name="close" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Header */}
      <View style={styles.header}>
  <TouchableOpacity 
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Icon name="arrow-back" size={24} color="white" />
  </TouchableOpacity>
  <Image 
    source={{ uri: `http://127.0.0.1:8000/images/${forum.image_url.split('/').pop()}` }}
    style={styles.headerImage}
  />
  <Text style={styles.headerTitle}>{forum.forum_name}</Text>
  <TouchableOpacity 
    style={styles.membersButton}
    onPress={toggleDrawer}
  >
    <Icon name="people" size={24} color="white" />
  </TouchableOpacity>
</View>

      {/* Messages List */}
      <FlatList
  data={messages}
  renderItem={renderMessageItem}
  keyExtractor={(item) => item.id}
  style={styles.messagesList}
  contentContainerStyle={[
    styles.messagesListContent,
    styles.scrollViewContainer, // Add this for padding and minHeight
  ]}
  inverted
  showsVerticalScrollIndicator={true} // Enables the scrollbar
/>

      {/* Image Preview */}
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <View style={styles.imageGridContainer}>
            <Image 
              source={{ 
                uri: imageUri.startsWith('blob:') 
                  ? imageUri 
                  : `http://127.0.0.1:8000${imageUri}` 
              }} 
              style={styles.imagePreview} 
              resizeMode="cover"
            />
          </View>
          <TouchableOpacity 
            style={styles.removeImageButton} 
            onPress={() => setImageUri(null)}
          >
            <Icon name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={pickMedia}
        >
          <Icon name="attach" size={24} color="white" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Icon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* Right Drawer */}
      <Animated.View 
        style={[
          styles.drawer, 
          {
            right: drawerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-width * 0.7, 0]
            })
          }
        ]}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Forum Members</Text>
          <TouchableOpacity onPress={toggleDrawer}>
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={forumMembers}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.id}
          style={styles.membersList}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorMessageContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorMessageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  errorMessage: {
    color: 'red',
    flex: 1,
    marginRight: 10,
    fontSize: 14,
  },
  errorCloseButton: {
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  errorMessageContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorMessageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  errorMessage: {
    color: 'red',
    flex: 1,
    marginRight: 10,
    fontSize: 14,
  },
  errorCloseButton: {
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  messageContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  messageUsername: {
    color: '#4287f5',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    color: 'white',
    marginBottom: 5,
  },
  messageTime: {
    color: '#888',
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  messageImage: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderRadius: 10,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  scrollViewContainer: {
    paddingVertical: 20, // Adds extra vertical space
    minHeight: "120%", // Forces scrolling
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  attachButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: 'white',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4287f5',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 10,
  },
  imageGridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  membersButton: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  drawerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  membersList: {
    flex: 1,
  },
  memberItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  memberName: {
    color: 'white',
    fontSize: 16,
  },
  errorMessageContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ForumDetailScreen;

