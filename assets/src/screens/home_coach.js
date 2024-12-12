import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import ImageTextExtractor from "../screens/ImageTextExtractor";
import NewsDisplay from "../components/News";
import SpaceBackground from "../components/SpaceBackground";
import AntiDopingTimeline from "../components/AntiDopingTimeline";
import ReportComponent from "../components/ReportComponent";
import NewsTicker from "../components/NewsTicker";
import CustomDrawer from "../components/CustomDrawer";
import ChatbotComponent from "../components/ChatbotComponent";
export default function HomeCoachScreen() {
  const navigation = useNavigation();
  const [iconScale, setIconScale] = useState({});
  const [showNews, setShowNews] = useState(false);

  // Persistent animated value
  const scanButtonAnim = useRef(new Animated.Value(0)).current;

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Start animation only when the screen comes into focus
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanButtonAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scanButtonAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    return unsubscribe;
  }, [navigation, scanButtonAnim]);

  const handleIconPressIn = (icon) => {
    setIconScale((prev) => ({ ...prev, [icon]: 1.2 }));
  };

  const handleIconPressOut = (icon) => {
    setIconScale((prev) => ({ ...prev, [icon]: 1 }));
  };

  const handleNewsClick = () => {
    setShowNews(!showNews);
  };

  const shimmerStyle = {
    opacity: scanButtonAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  const scanButtonStyle = {
    opacity: scanButtonAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
  };

  return (
    <View style={styles.container}>
      <SpaceBackground style={styles.backgroundContainer} />
      <CustomDrawer />
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("ModuleScreen")}>
              <Text style={styles.navButtonText}>Infographics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={handleNewsClick}>
              <Text style={styles.navButtonText}>Latest News</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("Post")}
            >
              <Text style={styles.navButtonText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("Forum")}
            >
              <Text style={styles.navButtonText}>Discussion Forum</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate("Game")}
            >
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.profileIcon}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle" size={50} color="green" />
          </TouchableOpacity>

          {showNews && (
            <ScrollView style={styles.newsSection}>
              <NewsDisplay />
            </ScrollView>
          )}

          {/* AntiDopingTimeline */}
          <View style={styles.timelineContainer}>
            <AntiDopingTimeline />
          </View>
          <View style={styles.newsTickerContainer}>
            <NewsTicker />
          </View>
          <View style={styles.reportContainer}>
            <ReportComponent />
          </View>

          <StatusBar style="auto" />
        </ScrollView>

        {/* Existing Scan Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.push("ImageTextExtractor")}
        >
          <Animated.View style={scanButtonStyle}>
            <Ionicons name="scan-outline" size={30} color="white" />
          </Animated.View>
        </TouchableOpacity>
        <ChatbotComponent/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "220%",
    paddingTop: 20,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    padding: 10,
    backgroundColor: "#002D04",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 30,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: "#C9D1D9",
    fontSize: 18,
    fontWeight: "500",
    marginHorizontal: 15,
    letterSpacing: 0.5,
  },
  profileIcon: {
    position: "absolute",
    top: 60,
    right: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#002D04",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    zIndex: 2,
  },
  reportContainer: {
    width: "70%",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scanButton: {
    position: "absolute",
    bottom: 30,
    left: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#002D04",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  chatFab: {
    position: "absolute",
    bottom: 30,
    right: 30, // Position on the right
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#002D04", // Chat FAB color
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 2,
  },
  newsSection: {
    marginTop: 20,
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    padding: 10,
  },
  timelineContainer: {
    width: "50%",
    marginTop: 30,
    paddingHorizontal: 10,
  },
  newsTickerContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});