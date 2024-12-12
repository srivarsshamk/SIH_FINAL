import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
  Linking,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const News = () => {
  const navigation = useNavigation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async (pageNumber = 1, shouldAppend = false) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/news?page=${pageNumber}`);
      
      if (response.data.status === 'success') {
        const newArticles = response.data.data;
        setNews(prevNews => shouldAppend ? [...prevNews, ...newArticles] : newArticles);
        setHasMore(response.data.hasMore);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      const nextPage = page + 1; // Calculate next page
      console.log('Loading more, page:', nextPage);
      await fetchNews(nextPage, true); // Append new articles
      setPage(nextPage); // Update state after fetch
    }
  };
  

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchNews(1, false);
  };

  const handleArticlePress = (article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const handleBackNavigation = () => {
    navigation.navigate('Home');
  };

  const NewsCarousel = ({ title, articles }) => {
    const handleReadMore = (url) => {
      if (url) {
        Linking.openURL(url);
      }
    };

    return (
      <View style={styles.carouselContainer}>
        <Text style={styles.carouselSectionTitle}>{title}</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselScrollContainer}
        >
          {articles.map((article, index) => (
            <View key={index} style={styles.carouselNewsCard}>
              {article.urlToImage ? (
                <Image 
                  source={{ uri: article.urlToImage }}
                  style={styles.carouselNewsImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.carouselPlaceholderImage}>
                  <Text style={styles.carouselPlaceholderText}>No Image</Text>
                </View>
              )}
              
              <View style={styles.carouselNewsContent}>
                <Text style={styles.carouselNewsTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                
                <Text style={styles.carouselNewsDescription} numberOfLines={3}>
                  {article.description}
                </Text>
                
                <TouchableOpacity 
                  style={styles.carouselLearnMoreButton}
                  onPress={() => handleReadMore(article.url)}
                >
                  <Text style={styles.carouselLearnMoreText}>Learn More</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const ArticleDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setModalVisible(false)}
        >
          <ArrowLeft color="#00e676" size={24} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <ScrollView style={styles.detailContainer}>
          {selectedArticle?.urlToImage && (
            <Image
              source={{ uri: selectedArticle.urlToImage }}
              style={styles.detailImage}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.detailContent}>
            <Text style={styles.detailTitle}>{selectedArticle?.title}</Text>
            
            <View style={styles.detailMeta}>
              <Text style={styles.detailSource}>
                {selectedArticle?.source?.name}
              </Text>
              <Text style={styles.detailDate}>
                {selectedArticle?.publishedAt && 
                  new Date(selectedArticle.publishedAt).toLocaleDateString()}
              </Text>
            </View>
            
            <Text style={styles.detailDescription}>
              {selectedArticle?.description}
            </Text>
            
            <Text style={styles.detailBody}>
              {selectedArticle?.content}
            </Text>
            
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => selectedArticle?.url && Linking.openURL(selectedArticle.url)}
            >
              <Text style={styles.readMoreButtonText}>
                Learn More
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#006400" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backHeaderButton}
            onPress={handleBackNavigation}
          >
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>News Updates</Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#00e676']}
            />
          }
        >
          <NewsCarousel title="Breaking News" articles={news.slice(0, 6)} />
          <NewsCarousel title="Latest Updates" articles={news.slice(6, 12)} />
          <NewsCarousel title="More Stories" articles={news.slice(12)} />

          {loading && !refreshing && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#00e676" />
            </View>
          )}
          
          {hasMore && !loading && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
            >
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <ArticleDetailModal />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#000000',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backHeaderButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  carouselContainer: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    marginBottom: 16,
  },
  carouselSectionTitle: {
    color: '#00e676',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  carouselScrollContainer: {
    paddingHorizontal: 16,
  },
  carouselNewsCard: {
    width: width * 0.3, // Reduced from 0.8
    backgroundColor: '#000000',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  carouselNewsImage: {
    width: '100%',
    height: 250, // Increased from 200
  },
  carouselPlaceholderImage: {
    width: '100%',
    height: 250, // Increased from 200
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselPlaceholderText: {
    color: '#888',
    fontSize: 16,
  },
  carouselNewsContent: {
    padding: 16,
  },
  carouselNewsTitle: {
    color: '#00e676',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  carouselNewsDescription: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  carouselLearnMoreButton: {
    backgroundColor: '#006400',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  carouselLearnMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e1e1e',
  },
  backButtonText: {
    color: '#00e676',
    marginLeft: 10,
    fontSize: 16,
  },
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  detailImage: {
    width: '100%',
    height: 300, // Increased from 250
    borderRadius: 10,
  },
  detailContent: {
    marginTop: 16,
  },
  detailTitle: {
    color: '#00e676',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailSource: {
    color: '#888',
    fontSize: 14,
  },
  detailDate: {
    color: '#888',
    fontSize: 14,
  },
  detailDescription: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  detailBody: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  readMoreButton: {
    backgroundColor: '#006400',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 16,
  },
  readMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#00e676',
  },
  loadMoreText: {
    color: '#00e676',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default News;