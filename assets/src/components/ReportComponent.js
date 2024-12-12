import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';

const ReportComponent = () => {
  const handleReportClick = () => {
    Linking.openURL('mailto:speakup-nada@gov.in');
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={require('../../images/bgrm.png')} style={styles.backgroundImage} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>SPEAK UP!</Text>
        <TouchableOpacity style={styles.button} onPress={handleReportClick}>
          <Text style={styles.buttonText}>Report Now</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          To ensure clean sports, NADA India seeks cooperation from all stakeholders. If you observe any doping-related misconduct, report it immediately at{' '}
          <Text style={styles.email}>speakup-nada@gov.in</Text>. Your identity will be protected.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000', // Black background
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15, // Reduced padding
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.4, // Makes the image subtle
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15, // Reduced padding
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black background
    borderRadius: 8, // Reduced border radius
  },
  title: {
    fontSize: 22, // Reduced font size
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15, // Reduced margin
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 25, // Reduced padding
    borderRadius: 8, // Reduced border radius
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginVertical: 12, // Reduced margin
  },
  buttonText: {
    fontSize: 16, // Reduced font size
    fontWeight: '600',
    color: '#002D04', // Dark green
    letterSpacing: 1,
    textAlign: 'center',
  },
  text: {
    fontSize: 14, // Reduced font size
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20, // Reduced line height
    marginHorizontal: 8, // Reduced margin
  },
  email: {
    color: '#FFD700', // Gold color for email emphasis
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default ReportComponent;
