import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://127.0.0.1:8000';

const colors = {
  background: '#1a1a1a',
  cardBackground: '#2d2d2d',
  primary: '#00A86B',
  text: '#ffffff',
  secondaryText: '#b0b0b0',
  border: '#404040',
  promoBackground: '#363636',
  headerBackground: '#424242',
  error: '#FF6B6B',
};

const ActivityPost = ({ post, userProfile }) => {
  const mediaUrl = post.image_url 
    ? `${BASE_URL}/images/${post.image_url.split('/').pop()}` 
    : null;

  const userName = `${userProfile.first_name} ${userProfile.last_name}`.trim();

  return (
    <View style={styles.postContainer}>
      <Image 
        source={{ 
          uri: userProfile.dp_url 
            ? `${BASE_URL}/images/${userProfile.dp_url.split('/').pop()}` 
            : 'https://via.placeholder.com/40' 
        }} 
        style={styles.userImage} 
        defaultSource={require('../../../images/post_bg.png')}
      />
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.postTime}>Recently</Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.textContent}>
            <Text style={styles.postText}>{post.description}</Text>
            {post.hashtag && (
              <Text style={styles.postHashtags}>{post.hashtag}</Text>
            )}
          </View>
          {mediaUrl && (
            <View style={styles.sideImageContainer}>
              <Image 
                source={{ uri: mediaUrl }} 
                style={styles.contentImage}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const Activity = () => {
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

  useEffect(() => {
    const loadUserDataAndProfile = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
          setUserId(parsedData.id);
          await fetchProfileDetails(parsedData);
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

  const fetchProfileDetails = async (baseUserData) => {
    try {
      if (!baseUserData?.id) return;

      const response = await axios.get(`${BASE_URL}/users/${baseUserData.id}`);
      if (response.data) {
        const updatedUserData = {
          ...baseUserData,
          first_name: response.data.first_name || baseUserData.first_name,
          last_name: response.data.last_name || baseUserData.last_name,
          bio: response.data.bio || " ",
          dp_url: response.data.dp_url || baseUserData.dp_url
        };
        
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
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

  const handleCreatePost = () => {
    try {
      navigation.navigate('allactivity');
    } catch (error) {
      console.error('Navigation to Post failed:', error);
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
      <View style={styles.container}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchPosts} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Activity</Text>
          <Text style={styles.followerCount}>
            {userData.first_name ? `${userData.first_name}'s Feed` : '276 followers'}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.createPost} onPress={handleCreatePost}>
            <Text style={styles.createPostText}>Create a post</Text>
          </TouchableOpacity>
          
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Posts</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
        {posts.length === 0 ? (
          <Text style={styles.noPostsText}>No posts available</Text>
        ) : (
          <>
            {posts.slice(0, 3).map(post => (
              <ActivityPost key={post.id} post={post} userProfile={userData} />
            ))}
            <TouchableOpacity 
              style={styles.showMoreButton} 
              onPress={handleShowAllPosts}
            >
              <Text style={styles.showMoreText}>Show all posts →</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  followerCount: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createPost: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  createPostText: {
    color: colors.text,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
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
  postsContainer: {
    maxHeight: 500,
  },
  postContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postContent: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    color: colors.text,
  },
  postTime: {
    color: colors.secondaryText,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textContent: {
    flex: 1,
  },
  postText: {
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  postHashtags: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 5,
  },
  sideImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  showMoreText: {
    color: colors.secondaryText,
    fontWeight: '600',
  },
  noPostsText: {
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
});

export default Activity;