import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DopingScandalsTimeline from '../components/DopingScandalsTimeline';
import Journals from '../components/Journals';
import SpaceBackground from '../components/SpaceBackground';

const CaseStudies = () => {
  const navigation = useNavigation();
  const caseStudies = [
    {
      title: 'WADA v. Ali Mohammed Al Hitmi',
      type: 'CASE LAW',
      uri: 'https://www.dropbox.com/scl/fi/u44tmw6o93vr7k7qj9rj3/al-hitmi_appeal-decision_2014-1.pdf?rlkey=qhpik661kzdw49j95lhhgh35f&st=wd8scle4&raw=1',
      
      iconColor: '#008000',
    },
    {
      title: 'WADA v. Ms. Rishu Nagar',
      type: 'CASE LAW',
      uri: 'https://www.dropbox.com/scl/fi/u44tmw6o93vr7k7qj9rj3/al-hitmi_appeal-decision_2014-1.pdf?rlkey=qhpik661kzdw49j95lhhgh35f&st=wd8scle4&raw=1',
      
      iconColor: '#008000',
    },
    {
      title: 'WADA v. Panayotis Tsimiklis',
      type: 'CASE LAW',
      uri: 'https://www.dropbox.com/scl/fi/u44tmw6o93vr7k7qj9rj3/al-hitmi_appeal-decision_2014-1.pdf?rlkey=qhpik661kzdw49j95lhhgh35f&st=wd8scle4&raw=1',
      
      iconColor: '#008000',
    },
    {
      title: 'Note on the CAS Award: WADA v. RUSADA',
      type: 'CASE LAW',
      uri: 'https://www.dropbox.com/scl/fi/u44tmw6o93vr7k7qj9rj3/al-hitmi_appeal-decision_2014-1.pdf?rlkey=qhpik661kzdw49j95lhhgh35f&st=wd8scle4&raw=1',
      
      iconColor: '#FFA500',
    },
    {
      title: 'Romanian Anti-Doping Agency - WADA v. Muresan',
      type: 'CASE LAW',
      uri: 'https://www.dropbox.com/scl/fi/u44tmw6o93vr7k7qj9rj3/al-hitmi_appeal-decision_2014-1.pdf?rlkey=qhpik661kzdw49j95lhhgh35f&st=wd8scle4&raw=1',
      
      iconColor: '#0000FF',
    },
    {
      title: 'Romanian Anti-Doping Agency - WADA v. Sobota',
      type: 'CASE LAW',
      uri: 'https://www.dropbox.com/scl/fi/u44tmw6o93vr7k7qj9rj3/al-hitmi_appeal-decision_2014-1.pdf?rlkey=qhpik661kzdw49j95lhhgh35f&st=wd8scle4&raw=1',
      
      iconColor: '#008000',
    },
  ];

  return (
    <View style={styles.wrapper}>
      <SpaceBackground style={styles.spaceBackground} />
      
      {/* Updated Header Section with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="home" size={28} color="#008000" /> 
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Anti-Doping Case Studies</Text>
        <Text style={styles.headerSubtitle}>
          Exploring Landmark Decisions in Sports Integrity
        </Text>
        <View style={styles.headerUnderline} />
      </View>

      <ScrollView style={styles.container}>
        {/* Doping Scandals Timeline Component */}
        <View style={styles.sectionSpacing}>
          <DopingScandalsTimeline />
        </View>

        {/* Practical Case Studies Section */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Practical Case Studies</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Title</Text>
            <Text style={styles.headerText}>                                                                                                                                                      Type</Text>
            <Text style={styles.headerText}>Download</Text>
          </View>
          {caseStudies.map((caseStudy, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.titleContainer}>
                <View style={[styles.icon, { backgroundColor: caseStudy.iconColor }]} />
                <Text style={styles.titleText}>{caseStudy.title}</Text>
              </View>
              <Text style={styles.typeText}>{caseStudy.type}</Text>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => {
                  console.log(`Downloading ${caseStudy.title} from ${caseStudy.uri}`);
                }}
              >
                <Ionicons name="download-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Journals Section */}
        <View style={styles.sectionSpacing}>
          <Text style={styles.sectionTitle}>Research Journals</Text>
          <Journals />
        </View>

        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  spaceBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  backButton: {
    position: 'absolute', 
    top: 50, 
    left: 15, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 10, 
    padding: 10,
    zIndex: 1,
  },
  headerContainer: {
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#a0a0a0',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  headerUnderline: {
    height: 3,
    width: 100,
    backgroundColor: '#008000',
    marginTop: 15,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  sectionSpacing: {
    marginBottom: 20,
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333333',
  },
  tableHeader: {
    backgroundColor: '#008000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '60%',
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  titleText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
    fontWeight: 'bold',
  },
  typeText: {
    fontSize: 14,
    color: '#666666',
    width: 120,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  downloadButton: {
    backgroundColor: '#008000',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  imageContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333333',
  },
});

export default CaseStudies;