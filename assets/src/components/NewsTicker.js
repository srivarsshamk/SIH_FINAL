import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Image
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/news?page=1');
        if (response.data.status === 'success') {
          // Create a longer array for continuous scrolling
          const extendedNews = [
            ...response.data.data.slice(0, 6),
            ...response.data.data.slice(0, 6),
            ...response.data.data.slice(0, 6)
          ];
          setNews(extendedNews);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      const scrollDistance = -SCREEN_WIDTH * (news.length / 2);
      
      const animateScroll = () => {
        Animated.timing(scrollX, {
          toValue: scrollDistance,
          duration: 80000, // Increased duration for slower, smoother movement
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            // Reset position instantly
            scrollX.setValue(0);
            // Restart animation
            animateScroll();
          }
        });
      };

      // Start initial animation
      animateScroll();

      // Cleanup function
      return () => {
        scrollX.stopAnimation();
      };
    }
  }, [news, scrollX]);

  const handleSeeMore = () => {
    navigation.navigate('NewsDisplay');
  };

  const handleNewsPress = (article) => {
    navigation.navigate('NewsDetail', { article });
  };

  return (
    <View style={styles.newsTickerContainer}>
      <View style={styles.newsTickerHeader}>
        <Text style={styles.newsTickerTitle}>Latest News</Text>
        <TouchableOpacity 
          style={styles.seeMoreButton}
          onPress={handleSeeMore}
        >
          <Text style={styles.seeMoreButtonText}>See More</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.newsTickerContent}>
        <Animated.View 
          style={[ 
            styles.newsTickerScrollView, 
            { 
              transform: [{ 
                translateX: scrollX 
              }] 
            }
          ]}
        >
          {news.map((article, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.newsTickerItem}
              onPress={() => handleNewsPress(article)}
            >
              {article.urlToImage ? (
                <Image 
                  source={{ uri: article.urlToImage }}
                  style={styles.newsTickerImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.newsTickerPlaceholder}>
                  <Text style={styles.newsTickerPlaceholderText}>No Image</Text>
                </View>
              )}
              <View style={styles.newsTickerItemContent}>
                <Text 
                  style={styles.newsTickerItemTitle} 
                  numberOfLines={2}
                >
                  {article.title}
                </Text>
                <Text 
                  style={styles.newsTickerItemDescription} 
                  numberOfLines={2}
                >
                  {article.description || 'No description available'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  newsTickerContainer: {
    marginTop: 25,  // Increased size
    width: '100%',
    backgroundColor: '#000000', // Transparent black background
    borderRadius: 20,  // Increased border radius for larger container
    padding: 18,  // Increased padding
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  newsTickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,  // Increased margin
  },
  newsTickerTitle: {
    fontSize: 28,  // Increased font size
    fontWeight: '600',
    color: '#FFFFFF',
  },
  seeMoreButton: {
    paddingVertical: 8,  // Increased padding
    paddingHorizontal: 12,  // Increased padding
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  seeMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 18,  // Increased font size
  },
  newsTickerContent: {
    overflow: 'hidden',
    width: '100%',
  },
  newsTickerScrollView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsTickerItem: {
    marginRight: 40,  // Increased margin
    width: SCREEN_WIDTH * 0.95,  // Increased item width
    backgroundColor: '000000',
    borderRadius: 15,  // Increased border radius
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,  // Increased padding
  },
  newsTickerImage: {
    width: 250,  // Increased image size
    height: 250,  // Increased image size
    borderRadius: 15,  // Increased border radius
    marginRight: 20,  // Increased margin
  },
  newsTickerPlaceholder: {
    width: 250,  // Increased size
    height: 250,  // Increased size
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,  // Increased border radius
    marginRight: 20,  // Increased margin
  },
  newsTickerPlaceholderText: {
    color: '#888',
  },
  newsTickerItemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  newsTickerItemTitle: {
    color: '#FFFFFF',
    fontSize: 20,  // Increased font size
    fontWeight: '600',
    marginBottom: 8,  // Increased margin
  },
  newsTickerItemDescription: {
    color: '#CCCCCC',
    fontSize: 16,  // Increased font size
  },
});

export default NewsTicker;
