import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
  Dimensions,
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react-native';
import ActivitySection from "../components/profile/activity";


const { width, height } = Dimensions.get('window');


const colors = {
  background: '#1a1a1a',
  cardBackground: '#2d2d2d',
  primary: '#00A86B',
  text: '#ffffff',
  secondaryText: '#b0b0b0',
  border: '#404040',
  promoBackground: '#363636',
  headerBackground: '#424242',
};

const suggestedProfiles = [
  {
    id: 1,
    name: 'Dr. Alex Johnson',
    title: 'Senior Doping Control Officer at USADA',
    image: 'https://via.placeholder.com/50',
    connections: '500+',
  },
  {
    id: 2,
    name: 'Dr. Sarah Chen',
    title: 'Laboratory Director at WADA',
    image: 'https://via.placeholder.com/50',
    connections: '432',
  },
  {
    id: 3,
    name: 'Michael Park',
    title: 'Anti-Doping Education Coordinator',
    image: 'https://via.placeholder.com/50',
    connections: '892',
  },
];

const SuggestedProfile = ({ profile, mini = false }) => {
  const navigation = useNavigation();

  // Construct the profile picture URL
  const profileImageUrl = profile.dp_url 
    ? `http://127.0.0.1:8000/images/${profile.dp_url.split('/').pop()}`
    : 'https://via.placeholder.com/50';

  // Handle connect button press
  const handleConnectPress = async () => {
    try {
      // Retrieve the current user's ID
      const storedUserData = await AsyncStorage.getItem('userData');
      const currentUser = storedUserData ? JSON.parse(storedUserData) : null;

      if (!currentUser) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      // Navigate to Message screen
      navigation.navigate("Message", { 
        senderId: currentUser.id,
        receiverId: profile.id, 
        receiverName: `${profile.first_name} ${profile.last_name}`
      });
    } catch (error) {
      console.error('Connect navigation error:', error);
      Alert.alert('Error', 'Could not initiate conversation');
    }
  };

  if (mini) {
    return (
      <View style={styles.connectionPreview}>
        <Image 
          source={{ uri: profileImageUrl }} 
          style={styles.connectionPreviewImage} 
        />
        <Text style={styles.connectionPreviewName}>
          {`${profile.first_name} ${profile.last_name}`}
        </Text>
        <TouchableOpacity 
          style={styles.miniConnectButton}
          onPress={handleConnectPress}
        >
          <Text style={styles.miniConnectButtonText}>Connect</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.suggestedProfile}>
      <Image 
        source={{ uri: profileImageUrl }} 
        style={styles.suggestedProfileImage} 
      />
      <View style={styles.suggestedProfileInfo}>
        <Text style={styles.suggestedProfileName}>
          {`${profile.first_name} ${profile.last_name}`}
        </Text>
        <Text style={styles.suggestedProfileTitle}>
          {profile.bio || 'Anti-Doping Professional'}
        </Text>
        <Text style={styles.suggestedProfileConnections}>
          {profile.state && profile.country 
            ? `${profile.state}, ${profile.country}`
            : 'Location not specified'}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.connectButton}
        onPress={handleConnectPress}
      >
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
};

const profilescreen = () => {
  
    // State to track the visibility of the modal
    const [modalVisible, setModalVisible] = useState(false);

    
    // User data
    
  const navigation = useNavigation();
  const [profilePicture, setProfilePicture] = useState('https://via.placeholder.com/100');
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    dp_url: '',
    id: null
  });
  const fileInputRef = useRef(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [suggestedProfiles, setSuggestedProfiles] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          await fetchProfileDetails(parsedUserData);
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
      }
    };

    fetchUserData();
  }, []);
  
  const fetchProfileDetails = async (baseUserData) => {
    try {
      if (!baseUserData?.id) return;
  
      const response = await axios.get(`http://127.0.0.1:8000/users/${baseUserData.id}`);
      if (response.data) {
        const updatedUserData = {
          ...baseUserData,
          first_name: response.data.first_name || baseUserData.first_name,
          last_name: response.data.last_name || baseUserData.last_name,
          bio: response.data.bio || " ",
          dp_url: response.data.dp_url || baseUserData.dp_url,
          state: response.data.state || '',  // Add these lines
        country: response.data.country || ''
        };
        
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        
        if (updatedUserData.dp_url) {
          // Modify profile picture URL construction
          const imageUrl = `http://127.0.0.1:8000/images/${updatedUserData.dp_url.split('/').pop()}`;
          setProfilePicture(imageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
    }
  };

  useEffect(() => {
    const fetchSuggestedProfiles = async () => {
      try {
        // Retrieve the logged-in user's data
        const storedUserData = await AsyncStorage.getItem('userData');
        const loggedInUser = storedUserData ? JSON.parse(storedUserData) : null;

        const response = await axios.get('http://127.0.0.1:8000/users');
        
        // Filter out the logged-in user and take the first 3 remaining users
        const filteredProfiles = response.data.data
          .filter(profile => profile.id !== loggedInUser?.id)
          .slice(0, 3);

        setSuggestedProfiles(filteredProfiles);
      } catch (error) {
        console.error('Error fetching suggested profiles:', error);
        // Fallback to default profiles if fetch fails
        setSuggestedProfiles([
          {
            id: 1,
            first_name: 'Dr. Alex',
            last_name: 'Johnson',
            bio: 'Senior Doping Control Officer',
            dp_url: null,
            state: 'California',
            country: 'USA'
          }
        ]);
      }
    };

    fetchSuggestedProfiles();
  }, []);

  

  const handleEditPress = () => {
    try {
      navigation.navigate('EditProfile');
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  const handleEditLanguages = () => {
    try {
      navigation.navigate('EditProfile', { section: 'languages' });
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  const handleEditWadaProfile = () => {
    try {
      navigation.navigate('EditProfile', { section: 'wada-profile' });
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  const pickProfilePicture = async () => {
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
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
  
        if (!result.canceled) {
          await uploadProfilePicture(result.assets[0]);
        }
      }
    } catch (err) {
      console.error("Profile picture pick error: " + err.message);
      Alert.alert('Error', 'Could not pick profile picture');
    }
  };

  const handleWebProfilePicturePick = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        await uploadProfilePicture(file, previewUrl);
      }
    } catch (err) {
      console.error("Web profile picture pick error: " + err.message);
      Alert.alert('Error', 'Could not process profile picture');
    }
  };

  const uploadProfilePicture = async (mediaFile, previewUrl = null) => {
    try {
      if (!userData) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }
  
      const formData = new FormData();
  
      if (mediaFile instanceof File) {
        formData.append('file', mediaFile);
        if (previewUrl) setProfilePicture(previewUrl);
      } else {
        const fileExtension = mediaFile.uri.split('.').pop();
        formData.append('file', {
          uri: mediaFile.uri,
          type: `image/${fileExtension},
          name: profile_picture.${fileExtension}`,
        });
        setProfilePicture(mediaFile.uri);
      }
  
      const uploadResponse = await axios.post('http://127.0.0.1:8000/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const imageUrl = uploadResponse.data.image_url;
  
      const userDataToUpdate = {
        dp_url: imageUrl,
      };
  
      const updateResponse = await axios.patch(`http://127.0.0.1:8000/users/${userData.id}`, userDataToUpdate, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (updateResponse.status === 200) {
        const updatedUserData = {
          ...userData,
          dp_url: imageUrl
        };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        
        // Modify profile picture URL construction
        const profileImageUrl = `http://127.0.0.1:8000/images/${imageUrl.split('/').pop()}`;
        setProfilePicture(profileImageUrl);
        
        Alert.alert('Success', 'Profile picture updated successfully.');
      } else {
        Alert.alert('Error', 'Failed to update profile picture in the backend.');
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      Alert.alert('Error', 'Could not upload profile picture');
    }
  };
  const handleContactInfoPress = () => {
    setModalVisible(true); // Open the modal
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };
  

  return (

    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
      {Platform.OS === 'web' && (
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleWebProfilePicturePick}
          style={{ display: 'none' }}
        />
      )}
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          
          
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={pickProfilePicture}>
              <Image
                source={{ uri: profilePicture }}
                style={styles.profileImage}
              />
              <View style={styles.editProfilePictureOverlay}>
                <Feather name="camera" size={10} color="white" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditPress}
              activeOpacity={0.7}
            >
              <Feather name="edit-2" size={20} color={colors.secondaryText} />
            </TouchableOpacity>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameSection}>
                <Text style={styles.name}>
                  {
                    `${userData.first_name} ${userData.last_name}` 
                   }
                </Text>
                <Feather name="check-circle" size={16} color={colors.primary} />
              </View>
              <Text style={styles.education}>
                {userData.bio}
              </Text>
              <Text style={styles.location}>
              {
                    `${userData.state}, ${userData.country}`
              }
              </Text>
              <View style={styles.container}>
      <TouchableOpacity style={styles.contactInfo} onPress={handleContactInfoPress}>
        <Text style={styles.contactInfoText}>Contact info</Text>
      </TouchableOpacity>

      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={closeModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Contact Info</Text>
      <Text style={styles.modalText}>Phone: {userData?.phone_number}</Text>
      <TouchableOpacity 
        style={styles.modalButton} 
        onPress={closeModal}
      >
        <Text style={styles.modalButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
              
            </View>

            <View style={styles.actionButtons}>
            
              <TouchableOpacity
      style={styles.secondaryButton}
      onPress={() => navigation.navigate('ModuleScreen')}
    >
                <Text style={styles.secondaryButtonText}>Add certification</Text>
              </TouchableOpacity>
              
              
            </View>

            <View style={styles.promoCards}>
              <View style={styles.promoCard}>
                <Feather name="briefcase" size={20} color={colors.secondaryText} />
                <Text style={styles.promoText}>
                  Share your expertise in anti-doping control and join our global network of professionals.
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Forum')}>
                  <Text style={styles.getStartedText}>Get started</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.activitySection}>
              <ActivitySection />
            </View>
          </View>
        </ScrollView>

        <View style={styles.sidebar}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.sidebarCard}>
            <Text style={styles.sidebarTitle}>Anti-Doping Professionals You May Know</Text>
            {suggestedProfiles.map((profile) => (
              <SuggestedProfile 
                key={profile.id} 
                profile={profile} 
              />
            ))}
          </View>

          <View style={styles.sidebarCard}>
            <Text style={styles.sidebarTitle}>Recommended Professionals</Text>
            <View style={styles.connectionsWidget}>
              {suggestedProfiles.slice(0, 2).map((profile) => (
                <SuggestedProfile 
                  key={profile.id} 
                  profile={profile} 
                  mini={true} 
                />
              ))}
            </View>
          </View>            

            

            
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};





   
const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '85%',
      backgroundColor: '#161B22', // Dark gray background
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderWidth: 1,
      borderColor: '#002D04', // Dark green border
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#00A86B', // Green text
      marginBottom: 15,
    },
    modalText: {
      color: '#C9D1D9', // Light gray text
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButton: {
      backgroundColor: '#00A86B', // Green button
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    modalButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      textAlign: 'center',
    },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  popupContainer: {
    width: '85%',
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15
  },
  nameText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  contactDetailsContainer: {
    width: '100%',
    marginTop: 15
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: colors.promoBackground,
    padding: 12,
    borderRadius: 10
  },
  contactText: {
    color: colors.text,
    marginLeft: 15,
    fontSize: 16
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    top: -50,
    left: 16,
    borderWidth: 3,
    borderColor: colors.cardBackground,
  },
  editProfilePictureOverlay: {
    position: 'absolute',
    top: -20,
    left: 66,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    minHeight: "180%",
    padding: 10,
  },
  sidebar: {
    flex: 0.3,
    padding: 30,
    backgroundColor: colors.background,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    minHeight: "140%",
  },
  // ... (rest of the styles remain the same)
 
  profileSection: {
    
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.cardBackground,
  },
  editButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
  },
  profileInfo: {
    marginTop: 16,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  education: {
    fontSize: 16,
    color: colors.secondaryText,
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
  },
  contactInfo: {
    marginTop: 8,
  },
  contactInfoText: {
    color: colors.primary,
    fontWeight: '600',
  },
  connections: {
    marginTop: 8,
    color: colors.secondaryText,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  activitySection: {
    marginTop: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  moreButton: {
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.secondaryText,
  },
  moreButtonText: {
    color: colors.secondaryText,
    fontWeight: '600',
  },

  promoCards: {
    marginTop: 16,
    gap: 16,
    marginBottom: 16,
  },
  promoCard: {
    padding: 16,
    backgroundColor: colors.promoBackground,
    borderRadius: 8,
    gap: 8,
  },
  promoText: {
    color: colors.secondaryText,
    fontSize: 14,
  },
  getStartedText: {
    color: colors.primary,
    fontWeight: '600',
  },
  sidebar: {
    flex: 0.3,
    padding: 16,
    backgroundColor: colors.background,
  },
  sidebarCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sidebarTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: colors.text,
  },
  sidebarText: {
    color: colors.secondaryText,
  },
  sidebarLink: {
    color: colors.primary,
    fontSize: 14,
  },
  suggestedProfilesSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  suggestedProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestedProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  suggestedProfileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  suggestedProfileName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  suggestedProfileTitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 2,
  },
  suggestedProfileConnections: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  connectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  connectButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  connectionsWidget: {
    marginTop: 12,
  },
  connectionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  connectionPreviewImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  connectionPreviewName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  miniConnectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  backButton: {
    position: 'absolute',
    top: 10, // Adjust based on your SafeAreaView padding
    left: 10,
    zIndex: 10,
    text: '#ffffff', 
  },
  miniConnectButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default profilescreen;