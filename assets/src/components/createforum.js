import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert, 
  Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const CreateForumModal = ({ isVisible, onClose, onCreateForum }) => {
  const [forumName, setForumName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const fileInputRef = useRef(null);

  const pickMedia = async () => {
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
          aspect: [16, 9],
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
      
      // For web
      if (mediaFile instanceof File) {
        formData.append('file', mediaFile);
      } 
      // For mobile
      else {
        const fileExtension = mediaFile.uri.split('.').pop();
        formData.append('file', { 
          uri: mediaFile.uri, 
          type: `image/${fileExtension}`, 
          name: `forum_image.${fileExtension}` 
        });
      }

      const response = await axios.post('http://127.0.0.1:8000/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set the image URI as the uploaded file path
      setImageUri(`${response.data.image_url}`);
    } catch (error) {
      console.error('Media upload error:', error);
      Alert.alert('Error', 'Could not upload media');
    }
  };

  const createForum = async () => {
    // Validate inputs
    if (!forumName || !description) {
      Alert.alert('Validation Error', 'Forum name and description are required');
      return;
    }

    try {
      const forumData = {
        forum_name: forumName,
        description: description,
        image_url: imageUri || ''
      };

      await axios.post('http://127.0.0.1:8000/forums', forumData);
      
      // Reset form and close modal
      setForumName('');
      setDescription('');
      setImageUri(null);
      onCreateForum();
      onClose();
    } catch (error) {
      console.error('Forum creation error:', error.response?.data || error.message);
      Alert.alert(
        'Error', 
        error.response?.data?.detail || 'Could not create forum. Please check your input and try again.'
      );
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="#03615b" />
        </TouchableOpacity>

        <Text style={styles.modalTitle}>Create New Forum</Text>

        <TextInput
          style={styles.input}
          placeholder="Forum Name"
          placeholderTextColor="#666"
          value={forumName}
          onChangeText={setForumName}
        />

        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Description"
          placeholderTextColor="#666"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        {/* Image Upload Section */}
        <TouchableOpacity style={styles.imageUploadButton} onPress={pickMedia}>
          {imageUri ? (
            <Image 
              source={{ 
                uri: imageUri.startsWith('blob:') 
                  ? imageUri 
                  : `http://127.0.0.1:8000${imageUri}` 
              }} 
              style={styles.uploadedImage} 
            />
          ) : (
            <>
              <Icon name="cloud-upload" size={40} color="#03615b" />
              <Text style={styles.imageUploadText}>Upload Forum Image</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Hidden file input for web */}
        {Platform.OS === 'web' && (
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleWebMediaPick}
          />
        )}

        <TouchableOpacity style={styles.createButton} onPress={createForum}>
          <Text style={styles.createButtonText}>Create Forum</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#282828',
    color: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUploadButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imageUploadText: {
    color: '#03615b',
    marginTop: 10,
  },
  createButton: {
    width: '100%',
    backgroundColor: '#03615b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateForumModal;