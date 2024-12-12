import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomePopup from '../components/welcomepopup';
import Leaderboard from '../components/leaderboard';
import SpaceBackground from '../components/SpaceBackground';

export default function GameScreen({ navigation }) {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [userName, setUserName] = useState('Player');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const leftDrawerAnimation = useRef(new Animated.Value(-250)).current;
  const rightDrawerAnimation = useRef(new Animated.Value(250)).current;
  const soundRef = useRef(null);

  // Load user name from AsyncStorage
  useEffect(() => {
    const loadUserName = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserName(parsedData.first_name || 'Player');
        }
      } catch (error) {
        console.error('Error loading user name:', error);
      }
    };

    const setupAudio = async () => {
      try {
        // Request audio permissions
        const { status } = await Audio.requestPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('Audio permissions not granted');
          return;
        }

        // Set up audio mode for background music
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        // Load audio 
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'http://127.0.0.1:8000/images/78d68446-d5b5-4fa5-aa29-46ed49cc192f.wav' },
          { 
            shouldPlay: false, 
            isLooping: true,
            volume: 0.5 
          }
        );
        
        soundRef.current = sound;
      } catch (error) {
        console.error('Detailed Error setting up audio:', error);
        console.log('Error Name:', error.name);
        console.log('Error Message:', error.message);
        console.log('Error Stack:', error.stack);
      }

      loadUserName();
    };

    setupAudio();

    // Cleanup function to stop audio when component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const toggleAudio = async () => {
    try {
      if (!soundRef.current) {
        console.log('Sound not initialized');
        return;
      }

      if (isAudioPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setIsAudioPlaying(!isAudioPlaying);
    } catch (error) {
      console.error('Error toggling audio:', error);
      console.log('Error Name:', error.name);
      console.log('Error Message:', error.message);
    }
  };
  const toggleLeftDrawer = () => {
    const toValue = leftDrawerOpen ? -250 : 0;
    Animated.timing(leftDrawerAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setLeftDrawerOpen(!leftDrawerOpen);
    if (rightDrawerOpen) toggleRightDrawer(); // Close right drawer if open
  };

  const toggleRightDrawer = () => {
    const toValue = rightDrawerOpen ? 250 : 0;
    Animated.timing(rightDrawerAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setRightDrawerOpen(!rightDrawerOpen);
    if (leftDrawerOpen) toggleLeftDrawer(); // Close left drawer if open
  };

  const leftGameIcons = [
    { 
      name: 'Hangman', 
      icon: 'body-outline',
      component: 'Hangman Rules',
      available: true
    },
    { 
      name: 'Word Scramble', 
      icon: 'text-outline',
      component: 'Scramble',
      available: true
    },
    { 
      name: 'Sort', 
      icon: 'swap-vertical-outline',
      component: 'Sort Rules',
      available: true
    },
    { 
      name: 'Quiz', 
      icon: 'clipboard-outline',
      component: 'Quiz Rules',
      available: true
    }
  ];

  const rightGameIcons = [
    {
      name: 'Memory Game',
      icon: 'brain-outline',
      component: 'Memory Game',
      available: true
    },
    {
      name: 'Pill Race',
      icon: 'fitness-outline',
      component: 'Pill Race',
      available: true
    },
    {
      name: 'Crossword',
      icon: 'grid-outline',
      component: 'Crossword Rules',
      available: true
    },
    {
      name: 'Snake And Ladder',
      icon: 'cube-outline',
      component: 'Snake And Ladder',
      available: true
    }
  ];

  const handleGameSelect = (game, drawer) => {
    if (game.available) {
      navigation.navigate(game.component);
    } else {
      alert('Coming Soon!');
    }
    if (drawer === 'left') {
      toggleLeftDrawer();
    } else {
      toggleRightDrawer();
    }
  };

  return (
    <View style={styles.containerWithBlackBackground}>
            <SpaceBackground style={styles.backgroundContainer} />
  
      <View style={styles.container}>
        {/* Menu Buttons */}
        <TouchableOpacity onPress={toggleLeftDrawer} style={styles.leftMenuButton}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleRightDrawer} style={styles.rightMenuButton}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>

        {/* Top Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("ModuleScreen")}>
            <Text style={styles.navButtonText}>Infographics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Post")}>
            <Text style={styles.navButtonText}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Forum")}>
            <Text style={styles.navButtonText}>Discussion Forum</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Play</Text>
          </TouchableOpacity>
        </View>

        {/* Left Drawer */}
        <Animated.View
          style={[
            styles.leftDrawer,
            {
              transform: [{ translateX: leftDrawerAnimation }],
            },
          ]}
        >
          {leftGameIcons.map((game, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.drawerItem,
                !game.available && styles.drawerItemDisabled
              ]}
              onPress={() => handleGameSelect(game, 'left')}
            >
              <Ionicons
                name={game.icon}
                size={24}
                color={game.available ? "white" : "rgba(255, 255, 255, 0.5)"}
              />
              <Text
                style={[
                  styles.drawerItemText,
                  !game.available && styles.drawerItemTextDisabled
                ]}
              >
                {game.name}
                {!game.available && " (Coming Soon)"}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Right Drawer */}
        <Animated.View
          style={[
            styles.rightDrawer,
            {
              transform: [{ translateX: rightDrawerAnimation }],
            },
          ]}
        >
          {rightGameIcons.map((game, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.drawerItem,
                !game.available && styles.drawerItemDisabled
              ]}
              onPress={() => handleGameSelect(game, 'right')}
            >
              <Ionicons
                name={game.icon}
                size={24}
                color={game.available ? "white" : "rgba(255, 255, 255, 0.5)"}
              />
              <Text
                style={[
                  styles.drawerItemText,
                  !game.available && styles.drawerItemTextDisabled
                ]}
              >
                {game.name}
                {!game.available && " (Coming Soon)"}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
  <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
  <Text style={styles.subWelcomeText}>Select a game from either menu to begin!</Text>
  <Leaderboard />
</View>

        {/* Welcome Popup */}
        {showWelcomePopup && <WelcomePopup onClose={() => setShowWelcomePopup(false)} />}

        <StatusBar style="auto" />
        <TouchableOpacity 
          style={styles.audioPlayerButton} 
          onPress={toggleAudio}
        >
          <Ionicons 
            name={isAudioPlaying ? "volume-high" : "volume-mute"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  // ... keeping existing styles ...
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  containerWithBlackBackground: {
    flex: 1,
    backgroundColor: 'black',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  subWelcomeText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  leftMenuButton: {
    position: 'absolute',
    top: 30,
    left: 15,
    zIndex: 1001,
    backgroundColor: '#002D04',
    padding: 10,
    borderRadius: 50,
  },
  rightMenuButton: {
    position: 'absolute',
    top: 30,
    right: 15,
    zIndex: 1001,
    backgroundColor: '#002D04',
    padding: 10,
    borderRadius: 50,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  leftDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#002D04',
    paddingTop: 100,
    zIndex: 900,
  },
  rightDrawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#002D04',
    paddingTop: 100,
    zIndex: 900,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  drawerItemDisabled: {
    opacity: 0.7,
  },
  drawerItemText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 15,
  },
  drawerItemTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginTop: 20,
    borderRadius: 10,
    width: '80%',
  },
  progressBar: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#002D04',
    borderRadius: 10,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#002D04',
    fontWeight: 'bold',
  },
  audioPlayerButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#002D04',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002,
  },
});