import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming, 
  interpolate, 
  Extrapolate, 
  withSequence, 
  withDelay 
} from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons";
import { useState } from 'react';
import { useNavigation } from "@react-navigation/native";


const DRAWER_WIDTH = Dimensions.get('window').width * 0.3; // Reduced width
const ITEM_DELAY = 100;

const CustomDrawer = () => {
  const navigation = useNavigation();
  const translateX = useSharedValue(-DRAWER_WIDTH);
  const [isOpen, setIsOpen] = useState(false);
  const itemAnimations = Array(6).fill(0).map(() => useSharedValue(0)); // Updated to 6 items

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-DRAWER_WIDTH, 0],
      [0, 0.7],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      display: opacity === 0 ? 'none' : 'flex',
    };
  });

  const toggleDrawer = () => {
    if (isOpen) {
      translateX.value = withSpring(-DRAWER_WIDTH, {
        damping: 20,
        stiffness: 90,
      });
      itemAnimations.forEach(animation => {
        animation.value = withTiming(0, { duration: 200 });
      });
    } else {
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
      itemAnimations.forEach((animation, index) => {
        animation.value = withDelay(
          index * ITEM_DELAY,
          withSequence(
            withTiming(1.1, { duration: 200 }),
            withTiming(1, { duration: 100 })
          )
        );
      });
    }
    setIsOpen(!isOpen);
  };

  const getItemAnimatedStyle = (index) => {
    return useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: interpolate(itemAnimations[index].value, [0, 1], [-50, 0]) },
          { scale: itemAnimations[index].value }
        ],
        opacity: itemAnimations[index].value,
      };
    });
  };

  const MenuButton = ({ onPress, icon, text, index }) => (
    <Animated.View style={[styles.menuItemContainer, getItemAnimatedStyle(index)]}>
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => {
          onPress();
          toggleDrawer();
        }}
      >
        <View style={styles.menuItemBackground}>
          <Ionicons name={icon} size={24} color="#fff" />
          <Text style={styles.drawerItemText}>{text}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={toggleDrawer}
      >
        <View style={styles.menuButtonBackground}>
          <Ionicons name="menu" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      <Animated.View 
        style={[styles.overlay, overlayAnimatedStyle]} 
        onTouchStart={toggleDrawer}
      />

      <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
        <View style={styles.drawerBackground}>
          <View style={styles.drawerContent}>
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                toggleDrawer();  // Close the drawer first
                navigation.navigate('Home');  // Then navigate to the Home screen
              }}
            >
              <Ionicons name="arrow-back-outline" size={24} color="#fff" />
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>

            <MenuButton 
              icon="home-outline" 
              text="Home" 
              index={0}
              onPress={() => navigation.navigate('Home')}
            />
            <MenuButton 
              icon="information-circle-outline" 
              text="TUE" 
              index={1}
              onPress={() =>  navigation.navigate('TUE')}
            />
            <MenuButton 
              icon="stats-chart" 
              text="Discover Stats" 
              index={2}
              onPress={() => navigation.navigate('CaseStud')}
            />
            <MenuButton 
              icon="file-tray" 
              text="Case studies and Case Law" 
              index={3}
              onPress={() => navigation.navigate('CaseStudies')}  
            />
            <MenuButton 
              icon="game-controller-outline" 
              text="Play" 
              index={4}
              onPress={() => navigation.navigate('Game')}
            />
            {/* Added Podcast Button */}
            <MenuButton 
              icon="mic" 
              text="Podcast" 
              index={5}
              onPress={() => navigation.navigate('Podcast')}
            />
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    elevation: 5,
  },
  menuButtonBackground: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#2E7D32', // Dark green
    elevation: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 98,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    zIndex: 99,
    overflow: 'hidden',
  },
  drawerBackground: {
    flex: 1,
    backgroundColor: '#002D04', // Darker green
  },
  drawerContent: {
    padding: 16,
    marginTop: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemContainer: {
    marginVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  drawerItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuItemBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  drawerItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default CustomDrawer;
