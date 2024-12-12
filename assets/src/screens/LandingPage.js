import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Linking,
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Platform,
  Dimensions,
  Animated,
  SafeAreaView
} from 'react-native';
import { 
  ShieldCheck, 
  BookOpen, 
  MessageCircle, 
  Bot, Newspaper,Gamepad,Clipboard,
  Scale, 
  Italic
} from 'lucide-react';
import { useNavigation } from '@react-navigation/native';
import SpaceBackground from '../components/SpaceBackground';
import axios from 'axios';

// Import Social Media Icons
import InstagramIcon from '../../images/socialmedia/instagram.png';
import TwitterIcon from '../../images/socialmedia/twitter.png';
import LinkedinIcon from '../../images/socialmedia/linkedin.png';

const { width, height } = Dimensions.get('window');

const LandingPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);
  const scrollViewRef = useRef(null);
  const featureCarouselRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current; // For fading effect
  const imageSlide = useRef(new Animated.Value(100)).current; // For sliding effect
  useEffect(() => {
    // Fade in the images and slide them in when the component mounts
    Animated.parallel([
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(imageSlide, {
        toValue: 0,
        duration: 5000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [imageOpacity, imageSlide]);

  const features = [
    {
      icon: <ShieldCheck color="#00A86B" size={64} />,
      title: "Supplement Verification",
      description: "AI-powered analysis of supplement safety and WADA compliance, ensuring athletes' health and fair competition.",
      details: "Our verification system cross-references global databases, providing instant, comprehensive supplement safety assessments.",
      background: require('../../images/nebula.jpg'),
    },
    {
      icon: <MessageCircle color="#00A86B" size={64} />,
      title: "Professional Network",
      description: "Exclusive community platform connecting athletes, coaches, and anti-doping experts worldwide.",
      details: "Secure, moderated forums for sharing experiences, seeking advice, and building a transparent athletic community.",
      background: require('../../images/nebula.jpg'),
    },
    {
      icon: <BookOpen color="#00A86B" size={64} />,
      title: "Knowledge Ecosystem",
      description: "Comprehensive educational resources on anti-doping standards.",
      details: "Interactive learning modules, expert-curated content, and multimedia resources exploring ethical sporting practices.",
      background: require('../../images/nebula.jpg'),
    },
    {
      icon: <Gamepad color="#00A86B" size={64} />,
      title: "Interactive Games",
      description: "Engage in fun, educational games designed to promote awareness about anti-doping practices.",
      details: "Challenge your peers in quizzes and interactive games, featuring a global leaderboard to foster healthy competition.",
      background: require('../../images/nebula.jpg'),
    },
    {
      icon: <Clipboard color="#00A86B" size={64} />,
      title: "TUE Guidance",
      description: "Personalized guidance for Therapeutic Use Exemptions (TUE) application and approval processes.",
      details: "Step-by-step assistance in submitting TUE applications, ensuring compliance with WADA regulations.",
      background: require('../../images/nebula.jpg'),
    },
    {
      icon: <Newspaper color="#00A86B" size={64} />,
      title: "Latest News & Journals",
      description: "Stay informed with curated news, journals, and real-life case studies in the world of anti-doping.",
      details: "Explore expert analyses, scientific breakthroughs, and inspiring stories from athletes' journeys to clean sport.",
      background: require('../../images/nebula.jpg'),
    },
  ];
  

  const solutionsContainerRef = useRef(null);

const scrollToSection = (section) => {
  switch (section) {
    case 'solutions':
      if (solutionsContainerRef.current) {
        solutionsContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
          scrollViewRef.current?.scrollTo({
            y: pageY, // Scroll to the start of the solutions container
            animated: true,
          });
        });
      }
      break;

   

    // Add more sections as needed
  }
};


  const handleNewsletterSubscription = async () => {
    if (email.trim() && email.includes('@')) {
      try {
        // Make a POST request to the FastAPI endpoint
        const response = await axios.post('http://127.0.0.1:8000/newsletter/subscribe', {
          email: email,
        });
  
        // Check if subscription was successful
        if (response.status === 201) {
          alert('Thank you for subscribing!');
          setEmail('');
        } else {
          alert('There was an issue subscribing. Please try again.');
        }
      } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        alert('There was an error subscribing. Please try again later.');
      }
    } else {
      alert('Please enter a valid email address');
    }}

    const FeatureCarousel = () => {
      const [currentIndex, setCurrentIndex] = useState(0);
    
      useEffect(() => {
        const interval = setInterval(() => {
          // Update the index to simulate a slide change
          setCurrentIndex(prevIndex => (prevIndex + 1) % features.length);
        }, 4000); // Change slide every 2.5 seconds
    
        // Cleanup the interval when the component unmounts
        return () => clearInterval(interval);
      }, []);
    
      useEffect(() => {
        // Scroll the carousel to the active slide
        if (featureCarouselRef.current) {
          featureCarouselRef.current.scrollTo({
            x: currentIndex * width, // Scroll to the active slide
            animated: true,
          });
        }
      }, [currentIndex]);
    
      return (
        <View style={styles.featureCarouselContainer}>
          <Animated.ScrollView
            ref={featureCarouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            contentContainerStyle={styles.featureCarouselContent}
          >
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCarouselItem}>
                <Image 
                  source={feature.background}
                  style={styles.featureBackground}
                  blurRadius={5}
                />
                <View style={styles.featureOverlay} />
                <View style={styles.featureContent}>
                  <View style={styles.featureIconContainer}>
                    {feature.icon}
                  </View>
                  <Text style={styles.featureCarouselTitle}>{feature.title}</Text>
                  <Text style={styles.featureCarouselDescription}>
                    {feature.description}
                  </Text>
                  <TouchableOpacity style={styles.learnMoreButton}>
                    <Text style={styles.learnMoreButtonText} onPress={() => navigation.push('Login')}>Learn More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Animated.ScrollView>
          
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {features.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width
              ];
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp'
              });
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.7, 1, 0.7],
                extrapolate: 'clamp'
              });
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.paginationDot,
                    { opacity, transform: [{ scale }] }
                  ]}
                />
              );
            })}
          </View>
        </View>
      );
    };
    

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Navbar */}
      <View style={styles.stickyNavBar}>
        <Image 
          source={require('../../images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.navItems}>
          
          <TouchableOpacity onPress={() => scrollToSection('solutions')}>
            <Text style={styles.navItem}>Features</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.push('Login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => navigation.push('SignUp')}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
          
            <Text style={styles.heroTitle}>
              Empowering <Text style={styles.greenText}>Integrity</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Your journey to clean sports starts here
            </Text>
            <TouchableOpacity 
              style={styles.heroButton}
              onPress={() => scrollToSection('solutions')}
            >
              <Text style={styles.heroButtonText}>Explore FairPlay</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroImageContainer}>
            <Image 
              source={require('../../images/image2.jpeg')}
              style={styles.heroImage}
            
            />
          </View>
        </View>

       
    
        <View ref={solutionsContainerRef} style={styles.solutionsContainer}>
  <Text style={styles.sectionTitle}>
    Our <Text style={styles.greenText}>Features</Text>
  </Text>
  <FeatureCarousel />
</View>

        {/* Newsletter Section */}
        <View style={styles.newsletterContainer}>
          <Text style={styles.newsletterTitle}>Stay at the Forefront</Text>
          <Text style={styles.newsletterSubtitle}>
            Receive cutting-edge insights, regulatory updates, and exclusive athlete resources
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.emailInput}
              placeholder="Professional email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#666"
            />
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={handleNewsletterSubscription}
            >
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.greenBorderLine} />
        {/* Connect Section */}
        
                {/* Connect Section */}
                <View style={styles.connectSection}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.greenText}>Connect</Text> With NADA
          </Text>
          <View style={styles.socialLinks}>
      <TouchableOpacity
        style={styles.socialIcon}
        onPress={() => Linking.openURL('https://www.instagram.com/nadaindiaoffice/?hl=en')}
      >
        <Image source={InstagramIcon} style={styles.socialIconImage} />
        <Text style={styles.socialText}>Instagram</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.socialIcon}
        onPress={() => Linking.openURL('https://x.com/NADAIndiaOffice?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor')}
      >
        <Image source={TwitterIcon} style={styles.socialIconImage} />
        <Text style={styles.socialText}>Twitter</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.socialIcon}
        onPress={() => Linking.openURL('https://www.linkedin.com/company/national-anti-doping-agency-india/?originalSubdomain=in')}
      >
        <Image source={LinkedinIcon} style={styles.socialIconImage} />
        <Text style={styles.socialText}>LinkedIn</Text>
      </TouchableOpacity>
    </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010409',
  },
  stickyNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(1,4,9,0.9)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 70, // Adjust based on navbar height
  },
  logo: {
    width: 120,
    height: 40,
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    color: '#C9D1D9',
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 15,
    letterSpacing: 0.5,
  },
  loginButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 15,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00A86B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 15,
  },
  signupText: {
    color: '#00A86B',
    fontWeight: 'bold',
  },
  heroSection: {
    height: height * 0.8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
    zIndex: -1,
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 10,
    padding: 10,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    textDecoration: 'underline',
  textDecorationColor: 'white',  // White underline
  textDecorationThickness: 3,     // Thickness of the underline
  textDecorationOffset: 4,       // Gap between text and underline
  },
  greenText: {
    color: '#00A86B',
    textDecoration: 'underline',
  textDecorationColor: 'white',  // White underline
  textDecorationThickness: 3,     // Thickness of the underline
  textDecorationOffset: 4,       // Gap between text and underline
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#C9D1D9',
    textAlign: 'center',
    marginBottom: 25,
  },
  heroButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  heroButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
 
  image: {
    width: '65%', // Adjust this as needed
    height: undefined, // Keeps aspect ratio intact
    aspectRatio: 1, // You can adjust this ratio if the image needs a different width-to-height ratio
  },
  sectionTitle: {
    fontSize: 35,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 1,
    paddingTop: 10,    
    paddingVertical: 10,
    textDecoration: 'underline',
  textDecorationColor: 'white',  // White underline
  textDecorationThickness: 3,     // Thickness of the underline
  textDecorationOffset: 4,       // Gap between text and underline            // Optional: add some space below the underline
  },

  
  
  solutionsContainer: {
    backgroundColor: '#000000',
    paddingVertical: 5,
    marginTop: 10,
  
  },
  featureCarouselContainer: {
    width: width,  // Set the carousel width to the screen width
  height: height * 0.9,  // Increase height of the carousel window, adjust this value
  marginBottom: 20,  // Optional: add space after the carousel
  },
  featureCarouselContent: {
    alignItems: 'left',
  },
  featureCarouselItem: {
    width: width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  // Continuing the styles object from the previous artifact
  featureBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  featureOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(1,4,9,0.7)',
  },
  featureContent: {
    alignItems: 'center',
    paddingHorizontal: 50,
    zIndex: 10,
  },
  featureIconContainer: {
    marginBottom: 20,
  },
  featureCarouselTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#00A86B',
    marginBottom: 15,
    textAlign: 'center',
  },
  featureCarouselDescription: {
    fontSize: 18,
    color: '#C9D1D9',
    textAlign: 'center',
    marginBottom: 20,
  },
  learnMoreButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  learnMoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00A86B',
    marginHorizontal: 8,
  },
  connectSection: {
    backgroundColor: '#000000',
    borderBottomColor: '#C9D1D9', 
    paddingVertical: 50,
    alignItems: 'center',
    
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  socialIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    backgroundColor: '#161B22',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  socialIconImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialText: {
    color: '#C9D1D9',
    fontSize: 14,
  },
  newsletterContainer: {
    backgroundColor: '#000000',
    paddingVertical: 50,
    alignItems: 'center',
  },
  newsletterTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: 'white',
    marginBottom: 15,
    textDecoration: 'underline',
  textDecorationColor: 'white',  // White underline
  textDecorationThickness: 3,     // Thickness of the underline
  textDecorationOffset: 4,       // Gap between text and underline
  },
  newsletterSubtitle: {
    color: '#C9D1D9',
    textAlign: 'center',
    maxWidth: 600,
    marginBottom: 25,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 500,
    justifyContent: 'center',
  },
  emailInput: {
    flex: 1,
    backgroundColor: '#161B22',
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderWidth: 1,
    borderColor: '#00A86B',
  },
  subscribeButton: {
    backgroundColor: '#00A86B',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  greenBorderLine: {
    height: 2, // Height of the green line
    
    backgroundColor: '#002D04', // Green color
    marginVertical: 5, // Margin to space out the sections
  },
});

export default LandingPage;