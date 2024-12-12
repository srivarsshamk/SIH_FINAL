import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
  Alert,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Video } from 'expo-av';

const BASE_URL = 'http://127.0.0.1:8000';

export default function PostsScreen({ navigation }) {
  // User Data State
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    id: null,
    dp_url: null,
    bio: ""
  });
  
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [postComments, setPostComments] = useState({});

  // Post Creation State
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [commentText, setCommentText] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadUserDataAndProfile = async () => {
      try {
        // Retrieve user data from AsyncStorage
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          // Parse and set user data
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
          setUserId(parsedData.id);

          // Fetch additional user profile details
          await fetchUserProfile(parsedData.id);
        }

        // Fetch posts
        await fetchPosts();
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load user profile');
      }
    };

    loadUserDataAndProfile();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}`);
      setUserData(prevData => ({
        ...prevData,
        ...response.data
      }));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserFirstName = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}`);
      return response.data.first_name;
    } catch (error) {
      console.error(`Error fetching user for ID ${userId}:`, error);
      return 'Anonymous User';
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/posts`);
      const postsData = response.data.data;
      setPosts(postsData);

      // Fetch usernames for all posts concurrently
      const usernamePromises = postsData.map(async (post) => {
        const firstName = await fetchUserFirstName(post.user_id);
        return { [post.user_id]: firstName };
      });

      const usernameResults = await Promise.all(usernamePromises);
      const usernamesMap = usernameResults.reduce((acc, curr) => ({...acc, ...curr}), {});
      setUsernames(usernamesMap);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Could not fetch posts');
    }
  };

  const fetchPostComments = async (postId) => {
    try {
      const response = await axios.get(`${BASE_URL}/comments/post/${postId}`);
      setPostComments(prev => ({
        ...prev,
        [postId]: response.data.data
      }));
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
    }
  };

  const addComment = async (postId) => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }
  
    try {
      const commentData = {
        like_count: 0,
        comment: commentText,
        user_id: userId,
        post_id: postId
      };
  
      await axios.post(`${BASE_URL}/comments`, commentData);
      
      // Refresh comments for this post
      await fetchPostComments(postId);
      
      setCommentText('');
    } catch (error) {
      console.error('Comment addition error:', error);
      Alert.alert('Error', 'Could not add comment');
    }
  };

  const toggleLike = async (postId, isLiked) => {
    try {
      const likeEndpoint = isLiked 
        ? `${BASE_URL}/posts/${postId}/unlike`
        : `${BASE_URL}/posts/${postId}/like`;
  
      const response = await axios.post(likeEndpoint, {
        user_id: userId,
        post_id: postId
      });
  
      const updatedPost = response.data;
  
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                is_liked: !isLiked,
                likes_count: updatedPost.like_count
              }
            : post
        )
      );
    } catch (error) {
      console.error('Like/Unlike error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.detail || 'Could not update like status'
      );
    }
  }; 

  const handleConnect = async (postUserId) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Error', 'Please log in first');
        return;
      }
  
      const currentUser = JSON.parse(userData);
      const currentUserId = currentUser.id;
  
      const receiverUsername = usernames[postUserId] || 'Anonymous User';
  
      await AsyncStorage.setItem('messageSenderId', currentUserId);
      await AsyncStorage.setItem('messageReceiverId', postUserId);
      await AsyncStorage.setItem('receiverUsername', receiverUsername);
  
      navigation.navigate("Message", { 
        senderId: currentUserId,
        receiverId: postUserId, 
        receiverName: receiverUsername
      });
    } catch (error) {
      console.error('Connect error:', error);
      Alert.alert('Error', 'Could not establish connection');
    }
  };

  const pickMedia = async (type) => {
    try {
      if (Platform.OS === 'web') {
        fileInputRef.current?.click();
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Sorry, we need media library permissions.");
          return;
        }
  
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 1,
        });
  
        if (!result.canceled) {
          setMediaType(type);
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
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setMediaType(type);
        const previewUrl = URL.createObjectURL(file);
        setImage(previewUrl);
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
      
      // For web
      if (mediaFile instanceof File) {
        formData.append('file', mediaFile);
      } 
      // For mobile
      else {
        const fileExtension = mediaFile.uri.split('.').pop();
        const type = mediaType === 'video' ? `video/${fileExtension}` : `image/${fileExtension}`;
        formData.append('file', {
          uri: mediaFile.uri,
          type: type,
          name: `media.${fileExtension}`
        });
      }
  
      const response = await axios.post(`${BASE_URL}/uploads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      setImage(response.data.image_url);
    } catch (error) {
      console.error('Media upload error:', error);
      Alert.alert('Error', 'Could not upload media');
    }
  };

  const removeImage = () => {
    setImage(null);
    // If it's a web preview URL, revoke it to free up memory
    if (image && image.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }
  };

  const createPost = async () => {
    if (!title || !description) {
      Alert.alert('Validation Error', 'Title and description are required');
      return;
    }
  
    try {
      const postData = {
        title,
        description,
        hashtag: hashtags || '',
        user_id: userId,
        image_url: image || null
      };
  
      await axios.post(`${BASE_URL}/posts`, postData);
      
      resetPostForm();
      setCreateModalVisible(false);
      fetchPosts();
    } catch (error) {
      console.error('Post creation error:', error.response?.data || error.message);
      Alert.alert(
        'Error', 
        error.response?.data?.detail || 
        'Could not create post. Please check your input and try again.'
      );
    }
  };

  const resetPostForm = () => {
    setTitle('');
    setDescription('');
    setHashtags('');
    setImage(null);
  };

  return (
    <ImageBackground 
      source={require('../../images/post_bg.png')} 
      style={styles.backgroundImage}
    >
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ModuleScreen')}style={styles.navButton}>
          <Text style={styles.navButtonText}>Infographics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Forum')}style={styles.navButton}>
          <Text style={styles.navButtonText}>Discussion Forum</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Game')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Play</Text>
        </TouchableOpacity>
      </View>

      

      <View style={styles.experiencePromptContainer}>
        <View style={styles.experienceTextInputWrapper}>
          <TextInput 
            style={styles.experienceTextInput} 
            placeholder="Tell us about your recent experience or discovery"
            placeholderTextColor="#00A86B"
            multiline 
            numberOfLines={2} 
            onFocus={() => setCreateModalVisible(true)} 
          />
        </View>
        <TouchableOpacity 
          style={styles.createPostButton} 
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.createPostButtonText}>Create Post</Text>
          <Feather name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Posts Container with ScrollView */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        nestedScrollEnabled={true}
        scrollEnabled={true}
      >
        {posts.length === 0 ? (
          <Text style={styles.emptyListText}>No posts yet. Create one!</Text>
        ) : (
          <View style={styles.postsGridContainer}>
            {posts.map((item) => {
              const mediaUrl = `${BASE_URL}/images/${item.image_url.split('/').pop()}`;
              const isVideo = item.image_url.match(/\.(mp4|mov|avi|wmv)$/i);
              const username = usernames[item.user_id] || 'Anonymous User';
              const postCommentsList = postComments[item.id] || [];

              return (
                <View key={item.id} style={styles.postGridItem}>
                  {/* User Profile Header */}
                  <View style={styles.postHeader}>
                    <View style={styles.userProfileContainer}>
                      <Image 
                         source={{ 
                          uri: userData.dp_url 
                            ? `http://127.0.0.1:8000/images/${userData.dp_url.split('/').pop()}` 
                            : 'https://via.placeholder.com/100' 
                        }} 
                        style={styles.userProfileImage} 
                      />
                      <View style={styles.userInfoContainer}>
                        <Text style={styles.userName}>{username}</Text>
                        <Text style={styles.userBio}>{userData.bio || "No bio available"}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.connectButton} onPress={() => handleConnect(item.user_id)}>
                      <FontAwesome5 name="user-plus" size={16} color="#00A86B" />
                      <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
            </View>

            {/* Post Content */}
            <View style={styles.postContentContainer}>
              <View style={styles.postTextContainer}>
                <Text style={[styles.postTitle, { color: '#C9D1D9' }]}><Text style={{fontWeight: 'bold'}}>{item.title}</Text></Text>
                <Text style={styles.postDescription} numberOfLines={3}>{item.description}</Text>
                
                <View style={styles.mediaContainer}>
                  {isVideo ? (
                    <Video
                      source={{ uri: mediaUrl }}
                      style={styles.media}
                      useNativeControls
                      resizeMode="cover"
                      isLooping
                    />
                  ) : (
                    <Image 
                      source={{ uri: mediaUrl }} 
                      style={styles.media}
                      resizeMode="cover"
                    />
                  )}
                </View>

                {item.hashtag && <Text style={styles.postHashtags}>{item.hashtag}</Text>}
              </View>
            </View>

            {/* Post Interactions */}
            <View style={styles.postInteractions}>
              <TouchableOpacity 
                style={styles.likeButton}
                onPress={() => toggleLike(item.id, item.is_liked)}
              >
                <FontAwesome5 
                  name="heart" 
                  size={16} 
                  color={item.is_liked ? "#FF6B6B" : "#CCCCCC"} 
                />
                <Text style={styles.likeButtonText}>
                  {item.likes_count || 0} Likes
                </Text>
              </TouchableOpacity>
              
              {/* Compact Comments Section */}
              <View style={styles.commentsSection}>
                {postCommentsList.slice(0, 2).map(comment => (
                  <View key={comment.id} style={styles.commentBubble}>
                    <Text style={styles.commentText} numberOfLines={1}>
                      {userData.first_name} :{comment.comment}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity 
                  style={styles.sendCommentButton}
                  onPress={() => {
                    addComment(item.id);
                    fetchPostComments(item.id);
                  }}
                >
                  <Feather name="send" size={16} color="#00A86B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  )}
</ScrollView>

      

      {/* Create Post Modal */}
      <Modal 
        visible={isCreateModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.verticalContainer]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setCreateModalVisible(false)}
            >
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Create New Post</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Hashtags"
              value={hashtags}
              onChangeText={setHashtags}
            />

            <View style={styles.mediaPickerContainer}>
              {Platform.OS === 'web' && (
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={handleWebMediaPick}
                  style={{ display: 'none' }}
                />
              )}
              
              {image ? (
                <View style={styles.imagePreviewContainer}>
                  {mediaType === 'video' ? (
                    <Video
                      source={{ uri: image }}
                      style={styles.imagePreview}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                    />
                  ) : (
                    <Image 
                      source={{ 
                        uri: image.startsWith('http') 
                          ? `http://127.0.0.1:8000/images/${image.split('/').pop()}` 
                          : image 
                      }} 
                      style={styles.imagePreview} 
                      resizeMode="cover"
                    />
                  )}
                  <TouchableOpacity 
                    style={styles.removeImageButton} 
                    onPress={removeImage}
                  >
                    <Feather name="x" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.mediaButtons}>
                  <TouchableOpacity 
                    style={styles.mediaButton} 
                    onPress={() => pickMedia('image')}
                  >
                    <Feather name="image" size={24} color="#00A86B" />
                    <Text style={styles.mediaButtonText}>Select Image</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.mediaButton} 
                    onPress={() => pickMedia('video')}
                  >
                    <Feather name="video" size={24} color="#00A86B" />
                    <Text style={styles.mediaButtonText}>Select Video</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={createPost}
            >
              <Text style={styles.submitButtonText}>Create Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  userProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  userBio: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 5,
  },
  postsGridContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', // This ensures even spacing
    paddingHorizontal: 8, // Add some horizontal padding
  },
  postGridItem: {
    width: '49%', // Slightly less than 50% to allow for spacing
    marginBottom: 16,
    backgroundColor: '#161B22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00A86B',
    shadowColor: '#00A86B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    padding: 10,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postContentContainer: {
    marginBottom: 10,
  },
  postInteractions: {
    backgroundColor: '#010409',
    borderRadius: 8,
    padding: 8,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1, // Keeps the square shape
    height: 180, // Reduced height
    
    
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161B22',
  },
  media: {
    width: '100%',
    height: '100%',
     // Ensures image covers the entire container
  },
  experiencePromptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000000',
    borderRadius: 20,
    marginHorizontal: 15,
    marginRight: 20,
    marginTop: 100,
    marginBottom: -80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#00A86B',
  },
  experienceTextInputWrapper: {
    flex: 1,
    marginRight: 10,
    
  },
  experienceTextInput: {
    height: 50,
    backgroundColor: "#1f2227",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A86B',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#00A86B',
    color: '#00A86B'
  },
  createPostButtonText: {
    color: '#FFFFFF',  // Explicit white color
    fontWeight: 'bold',
    marginRight: 8,
  },


  postTitle: {
    fontSize: 16,
    marginBottom: 5,
    color:'White'
  },
  postDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  // Background and Container Styles
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#010409',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 100,
    marginBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#010409',
    ...(Platform.OS === 'web' ? {
      height: 'calc(100vh - 200px)',
      overflowY: 'auto',
    } : {}),
  },
  contentContainer: {
    paddingBottom: 80,
    flexGrow: 1,
  },

  // Navigation Bar Styles
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

  // Post Container Styles
  postContainer: {
    backgroundColor: '#161B22',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00A86B',
    shadowColor: '#00A86B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Post Header Styles
  
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
  },
  userLocation: {
    color: '#00A86B',
    fontSize: 12,
  },

  // Connect Button Styles
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#002D04',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connectButtonText: {
    color: '#00A86B',
    marginLeft: 8,
  },

  // Media Container Styles
  
  

  // Post Content Styles
 
  postTextContainer: {
    paddingHorizontal: 8,
  },
  postHashtags: {
    fontSize: 14,
    color: '#00A86B',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: '#C9D1D9',
    lineHeight: 20,
  },

  // Post Interactions Styles
  postInteractions: {
    backgroundColor: '#010409',
    borderRadius: 8,
    padding: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  likeButtonText: {
    color: '#C9D1D9',
    marginLeft: 8,
  },

  // Comments Styles
  commentsSection: {
    marginBottom: 12,
  },
  commentsScrollView: {
    maxHeight: 100,
  },
  commentBubble: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  commentText: {
    color: '#C9D1D9',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161B22',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  commentInput: {
    flex: 1,
    color: '#C9D1D9',
    paddingVertical: 8,
  },
  sendCommentButton: {
    padding: 8,
  },

  // Create Post Button Styles
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 4, 9, 0.8)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#161B22',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#00A86B',
  },
  modalTitle: {
    color: '#C9D1D9',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },

  // Input Styles
  input: {
    borderWidth: 1,
    borderColor: '#00A86B',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#010409',
    color: '#C9D1D9',
  },
  multilineInput: {
    height: 100,
  },

  // Media Picker Styles
  mediaPickerContainer: {
    width: '100%',
    marginVertical: 10,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  mediaButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#161B22',
    borderRadius: 8,
  },
  mediaButtonText: {
    color: '#00A86B',
    marginTop: 5,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Submit Button Styles
  submitButton: {
    backgroundColor: '#00A86B',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Empty List Styles
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#C9D1D9',
  },

  // Web-specific Scrollbar Styles
  ...(Platform.OS === 'web' && {
    '@global': {
      '::-webkit-scrollbar': {
        width: '10px',
      },
      '::-webkit-scrollbar-track': {
        background: '#010409',
        borderRadius: '10px',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#00A86B',
        borderRadius: '10px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#002D04',
      }
    }
  })
});
