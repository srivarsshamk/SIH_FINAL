import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userCache, setUserCache] = useState({});
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const navigation = useNavigation(); 

  useEffect(() => {
    const loadConversationDetails = async () => {
        try {
          // Retrieve sender and receiver IDs from AsyncStorage
          const storedSenderId = await AsyncStorage.getItem('messageSenderId');
          const storedReceiverId = await AsyncStorage.getItem('messageReceiverId');
  
          if (!storedSenderId || !storedReceiverId) {
            Alert.alert('Error', 'Connection information not found');
            return;
          }
  
          setSenderId(storedSenderId);
          setReceiverId(storedReceiverId);
  
          // Fetch messages for this specific conversation
          const response = await fetch(`http://127.0.0.1:8000/messages/conversation?user1_id=${storedSenderId}&user2_id=${storedReceiverId}`);
          
          if (!response.ok) throw new Error("Failed to fetch messages");
  
          const data = await response.json();
          
          // Robust handling of different possible response formats
          const messagesArray = Array.isArray(data) 
            ? data 
            : data.messages 
              ? data.messages 
              : data.data 
                ? data.data 
                : [];
  
          // Sort messages in reverse chronological order
          const sortedMessages = messagesArray.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
  
          setMessages(sortedMessages);
  
          // Get unique user IDs to fetch details
          const uniqueUserIds = Array.from(
            new Set(sortedMessages.flatMap((msg) => [msg.sender_id, msg.receiver_id]))
          );
          await fetchUserDetails(uniqueUserIds);
        } catch (error) {
          console.error("Error fetching conversation details:", error);
          Alert.alert('Error', 'Failed to load conversation');
        }
      };
  
      loadConversationDetails();
    }, []);

  const fetchUserDetails = async (userIds) => {
    const uncachedIds = userIds.filter((id) => !userCache[id]);
    const userDetails = {};

    await Promise.all(
      uncachedIds.map(async (id) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/users/${id}`);
          if (!response.ok) throw new Error("Failed to fetch user details");

          const data = await response.json();
          userDetails[id] = data.name;
        } catch (error) {
          console.error(`Error fetching user details for ID ${id}:`, error);
        }
      })
    );

    setUserCache((prevCache) => ({ ...prevCache, ...userDetails }));
  };

  const sendMessage = async () => {
    try {
      if (!senderId || !receiverId) {
        Alert.alert('Error', 'Connection information not found');
        return;
      }
  
      if (message.trim()) {
        const newMessage = {
          sender_id: senderId,
          receiver_id: receiverId,
          message
        };
  
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
  
        try {
          const response = await fetch("http://127.0.0.1:8000/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMessage),
          });
  
          if (!response.ok) throw new Error("Failed to send message");
        } catch (error) {
          console.error("Error sending message:", error);
          Alert.alert('Error', 'Failed to send message');
        }
  
        setMessage(""); // Clear the input
        Keyboard.dismiss(); // Dismiss the keyboard
      }
    } catch (error) {
      console.error("Message sending error:", error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender_id === senderId ? styles.userMessage : styles.otherUserMessage,
      ]}
    >
      <Text style={styles.messageSender}>
        {item.sender_id === senderId ? "You" : userCache[item.sender_id] || "Loading..."}
      </Text>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>

      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          inverted
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessage}
          style={styles.chatArea}
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#aaa"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={sendMessage}
          ref={inputRef}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Light black background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#028e76",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatArea: {
    flex: 1,
    marginBottom: 60, // Ensure some space for the input area at the bottom
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#03615b",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#333333", // Dark gray for other user's messages
  },
  messageSender: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 12,
    color: "white",
  },
  messageText: {
    fontSize: 16,
    color: "white", // White text for messages
  },
  messageTime: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: "flex-end",
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#028e76",
    position: "absolute", // Position at the bottom of the screen
    bottom: 0,
    width: "100%",
  },
  input: {
    flex: 1,
    backgroundColor: "#333333",
    borderRadius: 20,
    padding: 10,
    color: "white",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#03615b",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});