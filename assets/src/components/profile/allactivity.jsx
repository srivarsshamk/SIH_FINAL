import React, { useState,useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Dimensions, 
  Platform,
  Button,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const { width } = Dimensions.get('window');

const BASE_URL = 'http://127.0.0.1:8000';

const colors = {
  background: '#1a1a1a',
  cardBackground: '#2d2d2d',
  primary: '#00A86B',
  text: '#ffffff',
  secondaryText: '#b0b0b0',
  border: '#404040',
  headerBackground: '#424242',
  error: '#FF6B6B',
  hashtag: '#00A86B',
};

const LinkedInStyleFeed = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    id: null,
    dp_url: null,
    bio: ""
  });

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const fileInputRef = useRef(null);
  // Edit Post State
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [image, setImage] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const handleBackNavigation = () => {
    navigation.goBack();
  };
  

  const handleCreatePost = () => {
    navigation.navigate('Post');
  };
  useEffect(() => {
    const loadUserDataAndProfile = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
          setUserId(parsedData.id);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load user profile');
      }
    };

    loadUserDataAndProfile();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId]);
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
        
        // Log detailed media file information for debugging
        console.log('Media File Details:', {
          uri: mediaFile.uri,
          type: type,
          name: `media.${fileExtension}`,
          mediaType: mediaType
        });
  
        formData.append('file', {
          uri: mediaFile.uri,
          type: type,
          name: `media.${fileExtension}`
        });
      }
  
      const response = await axios.post('http://127.0.0.1:8000/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      setImage(response.data.image_url);
    } catch (error) {
      // More detailed error logging
      console.error('Full Error Object:', error);
      console.error('Error Response:', error.response?.data);
      console.error('Error Config:', error.config);
  
      Alert.alert(
        'Upload Error', 
        error.response?.data?.detail || 
        'Could not upload media. Please try again.'
      );
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
  
      await axios.post('http://127.0.0.1:8000/posts', postData);
      
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

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/posts/user/${userId}`);
      
      console.log('Posts Response:', JSON.stringify(response.data, null, 2));
      
      const postsData = response.data.data || response.data;
      
      setPosts(postsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setError('Failed to load posts');
      setIsLoading(false);
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
  
  const handleShowAllPosts = () => {
    try {
      navigation.navigate('allactivity');
    } catch (error) {
      console.error('Navigation to AllActivity failed:', error);
      Alert.alert('Navigation Error', 'Could not open all activities');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchPosts} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  const renderPostItem = ({ item }) => {
    const mediaUrl = item.image_url.startsWith('http') 
      ? item.image_url 
      : `http://127.0.0.1:8000/images/${item.image_url.split('/').pop()}`;
    
    const isVideo = item.image_url.match(/\.(mp4|mov|avi|wmv)$/i);
  
    return (
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{item.title}</Text>
        
        <View style={styles.mediaContainer}>
          {isVideo ? (
            <Video
              source={{ uri: mediaUrl }}
              style={styles.media}
              useNativeControls
              resizeMode="contain"
              isLooping
            />
          ) : (
            <Image 
              source={{ uri: mediaUrl }} 
              style={styles.media}
              resizeMode="contain"
            />
          )}
        </View>
  
        <Text style={styles.postDescription}>{item.description}</Text>
        {item.hashtag && <Text style={styles.postHashtags}>{item.hashtag}</Text>}
        
        <View style={styles.postActions}>
          <TouchableOpacity onPress={() => prepareEditPost(item)}>
            <Feather name="edit" size={24} color="#00A86B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deletePost(item.id)}>
            <Feather name="trash-2" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const prepareEditPost = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setHashtags(post.hashtag || '');
    setImage(post.image_url);
    setEditModalVisible(true);
  };

  const updatePost = async () => {
    if (!title || !description) {
      Alert.alert('Validation Error', 'Title and description are required');
      return;
    }
  
    try {
      const postData = {
        title,
        description,
        hashtag: hashtags,
        image_url: image || null
      };
  
      await axios.patch(`http://127.0.0.1:8000/posts/${selectedPost.id}`, postData);
      
      resetPostForm();
      setEditModalVisible(false);
      fetchPosts();
    } catch (error) {
      console.error('Post update error:', error.response?.data || error.message);
      Alert.alert(
        'Error', 
        error.response?.data?.detail || 
        'Could not update post. Please check your input and try again.'
      );
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Delete post error:', error);
      Alert.alert('Error', 'Could not delete post');
    }
  };

  const resetPostForm = () => {
    setTitle('');
    setDescription('');
    setHashtags('');
    setImage(null);
    setSelectedPost(null);
  };

  const renderMediaPicker = (isEditMode) => (
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
              source={{ uri: mediaUrl }}
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
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBox}>
        <TouchableOpacity 
          onPress={handleBackNavigation} 
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>      My Activity</Text>
            <Text style={styles.followerCount}>
              {userData.first_name ? `        ${userData.first_name}'s Feed` : '276 followers'}
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity  onPress={() => setCreateModalVisible(true)}  style={styles.createPost}>
              <Text style={styles.createPostText}>Create a post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Posts</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {posts.length === 0 ? (
          <Text style={styles.noPostsText}>No posts available</Text>
        ) : (
          <>
            {posts.map(post => (
              <View key={post.id} style={styles.postContainer}>
                <View style={styles.postHeader}>
                  <Image 
                    source={{ 
                      uri: userData.dp_url 
                        ? `${BASE_URL}/images/${userData.dp_url.split('/').pop()}` 
                        : 'https://via.placeholder.com/50' 
                    }} 
                    style={styles.authorAvatar} 
                  />
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>
                      {`${userData.first_name} ${userData.last_name}`.trim()}
                    </Text>
                    <Text style={styles.postTime} numberOfLines={1} ellipsizeMode="tail">
                      {userData.bio || "No bio available"}
                    </Text>
                  </View>
                  <View style={styles.postActions}>
                    <TouchableOpacity 
                      style={styles.actionButton} 
                      onPress={() => prepareEditPost(post)}
                    >
                      <Feather name="edit-2" size={18} color="#00A86B" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton} 
                      onPress={() => deletePost(post.id)}
                    >
                      <Feather name="trash-2" size={18} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postContent}>{post.description}</Text>
                
                {post.image_url && (
                  <View style={styles.postMedia}>
                    <Image 
                      source={{ 
                        uri: `${BASE_URL}/images/${post.image_url.split('/').pop()}` 
                      }} 
                      style={styles.postImageSquare} 
                    />
                  </View>
                )}

                {post.hashtag && (
                  <View style={styles.hashtagContainer}>
                    <Text style={styles.hashtagText}>
                      {post.hashtag}
                    </Text>
                  </View>
                )}
              </View>
            ))}
            {posts.length > 3 && (
              <TouchableOpacity 
                style={styles.showMoreButton} 
                onPress={handleShowAllPosts}
              >
                <Text style={styles.showMoreText}>Show all posts →</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
      {/* create Post Modal */}
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

            {renderMediaPicker(false)}

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={createPost}
            >
              <Text style={styles.submitButtonText}>Create Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Post Modal */}
      <Modal 
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.verticalContainer]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Edit Post</Text>

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

            {renderMediaPicker()}

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={updatePost}
            >
              <Text style={styles.submitButtonText}>Update Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};






const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: colors.text,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: colors.background,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    color: colors.background,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  retryButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 10,
  },
  mediaPickerContainer: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  mediaButtonText: {
    color: colors.primary,
    marginLeft: 10,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: width * 0.4,
    height: width * 0.4,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    gap: 10,
  },
  authorInfo: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the title
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 5,
  },
  hashtagText: {
    color: colors.hashtag,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBox: {
    backgroundColor: colors.headerBackground,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 40,
  },
  followerCount: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerIcon: {
    marginLeft: 10,
  },
  createPost: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  createPostText: {
    color: colors.text,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.secondaryText,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    paddingHorizontal: 15,
  },
  postContainer: {
    backgroundColor: colors.cardBackground,
    marginVertical: 8,
    borderRadius: 10,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  noPostsText: {
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 20,
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  showMoreText: {
    color: colors.secondaryText,
    fontWeight: '600',
  },
  headerBox: {
    backgroundColor: colors.cardBackground,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  commentInput: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: colors.text,
    height: 40,
    marginRight: 10,
    marginTop: 5, // merged from duplicate
  },
  postImageSquare: {
    width: width * 0.3,
    height: width * 0.3, // Making image square
    borderRadius: 10,
  },
  commentContainer: {
    marginBottom: 10,
  },
  commentUserName: {
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  commentText: {
    color: colors.secondaryText,
    marginBottom: 5, // merged from duplicate
  },
  commentsSection: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 10,
  },
  menuButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  menuOptions: {
    position: 'absolute',
    top: 20,
    right: 0,
    backgroundColor: colors.cardBackground,
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  menuText: {
    marginLeft: 5,
    color: colors.text,
    

  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
  },
  scrollView: {
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    width: width * 0.75, // Occupy 3/4 of screen from left
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    minHeight: '180%',
  },
  postContainer: {
    backgroundColor: colors.cardBackground,
    marginVertical: 8,
    borderRadius: 10,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  postTime: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  postContent: {
    color: colors.secondaryText,
    marginBottom: 10,
  },
  postMedia: {
    marginBottom: 10,
    alignItems: 'center',
  },
  postImage: {
    width: width * 0.6,
    height: 300,
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    color: colors.secondaryText,
  },
});

export default LinkedInStyleFeed;
