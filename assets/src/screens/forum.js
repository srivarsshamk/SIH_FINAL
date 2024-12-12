import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateForumModal from '../components/createforum';

const { width, height } = Dimensions.get('window');

const DiscussionForumScreen = ({ navigation }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateForumModalVisible, setIsCreateForumModalVisible] = useState(false);
  const [forums, setForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [joinedForums, setJoinedForums] = useState([]);

  useEffect(() => {
    loadUserData();
    fetchForums();
    fetchUserJoinedForums();
  }, []);

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

  const fetchForums = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/forums');
      setForums(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching forums:', error);
      setIsLoading(false);
    }
  };

  const fetchUserJoinedForums = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`http://127.0.0.1:8000/users/${userId}/forums`);
      const joinedForumIds = response.data.data.map(forum => forum.id);
      setJoinedForums(joinedForumIds);
    } catch (error) {
      console.error('Error fetching joined forums:', error);
    }
  };

  const openCreateForumModal = () => {
    setIsCreateForumModalVisible(true);
  };

  const closeCreateForumModal = () => {
    setIsCreateForumModalVisible(false);
  };

  const handleForumCreation = () => {
    fetchForums();
  };

  const handleJoinForum = async (forum) => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/forums/members', {
        forum_id: forum.id,
        user_id: userId
      });

      if (response.status === 200 || response.status === 201) {
        const updatedJoinedForums = [...joinedForums, forum.id];
        setJoinedForums(updatedJoinedForums);
        
        // Navigate to forum messages
        navigation.navigate('Forum msg', { forum });
      }
    } catch (error) {
      console.error('Error joining forum:', error);
      Alert.alert('Error', 'Failed to join forum. Please try again.');
    }
  };

  const handleForumPress = (forum) => {
    // Check if user has already joined the forum
    if (joinedForums.includes(forum.id)) {
      navigation.navigate('Forum msg', { forum });
    } else {
      // Show join confirmation
      Alert.alert(
        'Join Forum',
        `${forum.forum_name}\n\n${forum.description}\n\nWould you like to join this forum?`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Join',
            onPress: () => handleJoinForum(forum)
          }
        ]
      );
    }
  };

  const ForumItem = ({ forum }) => {
    const imageUrl = `http://127.0.0.1:8000/images/${forum.image_url.split('/').pop()}`;

    return (
      <TouchableOpacity 
        style={styles.forumItemContainer}
        onPress={() => navigation.navigate('Forum msg', { forum })}
      >
        <View style={styles.forumItemContainer}>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.forumItemImage} 
          />
          <View style={styles.forumItemTextContainer}>
            <Text style={styles.forumItemName}>{forum.forum_name}</Text>
            <Text 
              style={styles.forumItemDescription} 
              numberOfLines={2}
            >
              {forum.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')} 
          style={styles.navButton}
        >
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ModuleScreen')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Infographics</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate("Post")}
        >
          <Text style={styles.navButtonText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Discussion Forum</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Game')}style={styles.navButton}>
          <Text style={styles.navButtonText}>Play</Text>
        </TouchableOpacity>
      </View>

      {/* Create Forum Section */}
      <View style={styles.createForumContainer}>
        <TouchableOpacity 
          style={styles.plusIconContainer}
          onPress={openCreateForumModal}
        >
          <Icon name="add-circle" size={60} color="#03615b" />
        </TouchableOpacity>
        <Text style={styles.createForumText}>Click to Create New Thread</Text>
      </View>

      {/* Forums Horizontal ScrollView */}
      <ScrollView
        style={[styles.forumsScrollContainer, { paddingVertical: 20 }]}
        contentContainerStyle={[styles.forumsContentContainer, { minHeight: '120%' }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Text style={styles.loadingText}>Loading forums...</Text>
        ) : forums.length === 0 ? (
          <Text style={styles.emptyListText}>No forums yet. Create one!</Text>
        ) : (
          forums.map((forum) => (
            <ForumItem key={forum.id} forum={forum} />
          ))
        )}
      </ScrollView>

      {/* Create Forum Modal */}
      <CreateForumModal
        isVisible={isCreateForumModalVisible}
        onClose={closeCreateForumModal}
        onCreateForum={handleForumCreation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  navBar: {
    position: "absolute",
    top: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
    left: "10%",
    padding: 10,
    backgroundColor: "#002D04",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#00A86B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    color: '#C9D1D9',
    fontSize: 14,
    fontWeight: '500',
  },
  createForumContainer: {
    marginTop: height * 0.15,
    alignItems: 'center',
  },
  plusIconContainer: {
    marginBottom: 10,
  },
  createForumText: {
    color: 'white',
    fontSize: 16,
  },
  forumsScrollContainer: {
    marginTop: 20,
    paddingVertical: 20, // Extra vertical space
  },
  forumsContentContainer: {
    paddingHorizontal: 10, // Padding for left and right
    paddingBottom: 20, // Additional padding at the bottom for scrollable content
  },
  forumItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 5,
    marginBottom: 10, // Space between items
    width: width * 0.9, // Adjust width for consistent spacing
    height: height * 0.25,
    alignSelf: 'center', // Center the container horizontally
  },
  forumItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  forumItemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  forumItemName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  forumItemDescription: {
    color: '#888',
    fontSize: 12,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyListText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  joinButtonText: {
    color: '#4287f5',
    marginLeft: 5,
    fontSize: 12,
  },
});

export default DiscussionForumScreen;