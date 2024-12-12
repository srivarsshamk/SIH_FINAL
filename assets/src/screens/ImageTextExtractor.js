import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Tesseract from "tesseract.js";
import { Ionicons } from "@expo/vector-icons";

const GEMINI_API_URL = "http://127.0.0.1:8000/gemini";

const WADASubstanceChecker = ({ extractedText }) => {
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const analyzeText = async (text) => {
    if (!text?.trim()) {
      setError("No text provided for analysis");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        prompt: `Analyze the following text and identify any substances that are banned according to the WADA Prohibited List.Also provide food first alternatives. Text to analyze: ${text}.`,
        max_tokens: 500,
      });

      const response = await fetch(`${GEMINI_API_URL}?${params}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "success" || !data.data) {
        throw new Error("Invalid response format from API");
      }

      setAnalysis(data.data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze substances. Please try again later.");
      Alert.alert("Error", "Failed to analyze substances. Please try again.");
    } finally {
      setAnalyzing(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    if (extractedText) {
      analyzeText(extractedText);
    }
  }, [extractedText]);

  if (!extractedText) return null;

  return (
    <View style={styles.analysisContainer}>
      <View style={styles.analysisHeaderContainer}>
        <Ionicons name="shield-checkmark" size={24} color="#2ECC71" />
        <Text style={styles.analysisHeaderText}>Substance Analysis</Text>
      </View>

      {analyzing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Scanning substances...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={24} color="#E74C3C" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => analyzeText(extractedText)}
          >
            <Text style={styles.retryButtonText}>Retry Analysis</Text>
          </TouchableOpacity>
        </View>
      )}

      {analysis && !analyzing && !error && (
        <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
          {analysis.toLowerCase().includes("no banned substances") ? (
            <View style={styles.safeContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#2ECC71" />
              <Text style={styles.safeText}>Safe Substances</Text>
              <Text style={styles.safeSubtext}>
                No prohibited substances detected
              </Text>
            </View>
          ) : (
            <View style={styles.warningContainer}>
              <Ionicons name="close-circle" size={48} color="#E74C3C" />
              <Text style={styles.warningText}>Banned Substances Detected</Text>
              
                {analysis.split("\n").map((line, index) => (
                  <Text key={index} style={[
                    styles.analysisText,
                    line.includes("*") && { color: "#FFFFFF", fontWeight: "700" }
                  ]}>
                    {line.replace(/\*/g, "")}
                  </Text>
                ))}
           
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const ImageTextExtractor = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSupplementImage, setShowSupplementImage] = useState(true);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera roll permissions are needed to upload images",
          [{ text: "OK" }]
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageUri(imageUrl);
            setShowSupplementImage(false);
            await extractText(file);
          }
        };
        input.click();
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
          setImageUri(result.assets[0].uri);
          setShowSupplementImage(false);
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          await extractText(blob);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const extractText = async (imageFile) => {
    try {
      setLoading(true);
      setExtractedText("");

      const result = await Tesseract.recognize(imageFile, "eng", {
        logger: (info) => {
          if (info.status === "recognizing text") {
            console.log(
              `Recognition progress: ${(info.progress * 100).toFixed(2)}%`
            );
          }
        },
      });

      if (!result?.data?.text) {
        throw new Error("No text extracted from image");
      }

      setExtractedText(result.data.text);
    } catch (error) {
      console.error("Error extracting text:", error);
      Alert.alert(
        "Error",
        "Failed to extract text from the image. Please try a clearer image.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentWrapper}>
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#2ECC71" />
            </TouchableOpacity>
            
            <Ionicons name="medical" size={40} color="#2ECC71" />
            <Text style={styles.headerTitle}>WADA Substance Scanner</Text>
            <Text style={styles.subHeaderText}>
              Upload an image to check for prohibited substances
            </Text>
          </View>

          {showSupplementImage && (
            <Image
              source={require('../../images/supplement.jpg')}
              style={styles.supplementImage}
            />
          )}

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickImage}
            disabled={loading}
          >
            <Ionicons name="cloud-upload" size={24} color="white" />
            <Text style={styles.uploadButtonText}>
              {loading ? "Processing..." : "Upload Image"}
            </Text>
          </TouchableOpacity>

          {imageUri && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
            </View>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3498DB" />
              <Text style={styles.loadingText}>Extracting text...</Text>
            </View>
          )}

          {extractedText && !loading && (
            <WADASubstanceChecker extractedText={extractedText} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    width: '90%',
    alignItems: 'center',
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: '#002D04',
    borderRadius: 10,
    backgroundColor: '#000',
    minHeight: 600,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ECC71',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#002D04',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
  },
  imagePreviewContainer: {
    marginBottom: 20,
    width: '80%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  supplementImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 150,
  },
  analysisContainer: {
    width: '70%',
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 600, // Ensures the content doesn't overflow
    
  },
  analysisHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  analysisHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 18,
    color: 'white',
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
  },
  errorText: {
    marginLeft: 10,
    fontSize: 18,
    color: 'white',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  resultsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  safeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  safeSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  warningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  analysisText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
});


export default ImageTextExtractor;