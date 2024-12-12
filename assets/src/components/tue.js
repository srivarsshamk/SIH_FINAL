import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Add this import

const App = () => {
  const navigation = useNavigation(); // Add navigation hook
  const [activeTab, setActiveTab] = useState('guidance');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryConditions, setSearchQueryConditions] = useState('');
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [isMedicationModalVisible, setIsMedicationModalVisible] = useState(false);
  const [isConditionModalVisible, setIsConditionModalVisible] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertName, setAlertName] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [isCreateAlertModalVisible, setIsCreateAlertModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [alertDate, setAlertDate] = useState('');
  const [alertTime, setAlertTime] = useState('');
  
  
  // WADA TUE Application URL (official link)
  const wadaTUEFormLink = 'https://www.wada-ama.org/en/resources/therapeutic-use-exemption/tue-application-form'; // Official WADA form link

  // Fetch alerts from WADA API (simulated)
  useEffect(() => {
    loadUserData();
  }, []);

  // Fetch user alerts when userId is set
  useEffect(() => {
    if (userId) {
      fetchUserAlerts();
    }
  }, [userId]);

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserId(parsedData.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Fetch user-specific alerts
  const fetchUserAlerts = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/alerts/user/${userId}`);
      const responseData = await response.json();
      
      // Sort alerts by date, most recent first
      const sortedAlerts = responseData.data.sort((a, b) => 
        new Date(b.alert_datetime) - new Date(a.alert_datetime)
      );
      
      setAlerts(sortedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      Alert.alert('Error', 'Could not fetch alerts');
    }
  };

  // Create a new alert
  const handleCreateAlert = async () => {
    // Validate inputs
    if (!alertName.trim() || !alertDescription.trim() || !alertDate.trim() || !alertTime.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Combine date and time into ISO 8601 format
      const isoDateTime = `${alertDate}T${alertTime}:00.000Z`;
      
      // Validate the combined date
      const parsedDate = new Date(isoDateTime);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }

      // Prepare the alert data
      const alertData = {
        name: alertName,
        description: alertDescription,
        alert_datetime: isoDateTime
      };

      // Send POST request to create alert
      const response = await fetch(`http://127.0.0.1:8000/alerts?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData)
      });

      if (!response.ok) {
        throw new Error('Failed to create alert');
      }

      // Refresh alerts after creating
      await fetchUserAlerts();

      // Reset form and close modal
      setAlertName('');
      setAlertDescription('');
      setAlertDate('');
      setAlertTime('');
      setIsCreateAlertModalVisible(false);

      Alert.alert('Success', 'Alert created successfully');
    } catch (error) {
      console.error('Error creating alert:', error);
      Alert.alert('Error', 'Could not create alert. Please check your date and time format.');
    }
  };
  // Render alerts content
  const renderAlertsContent = () => {
    return (
      <View style={styles.alertsContainer}>
        <TouchableOpacity 
          style={styles.createAlertButton}
          onPress={() => setIsCreateAlertModalVisible(true)}
        >
          <Text style={styles.createAlertButtonText}>Create New Alert</Text>
        </TouchableOpacity>
  
        {alerts.length === 0 ? (
          <Text style={styles.noAlertsText}>No alerts found</Text>
        ) : (
          <ScrollView>
            {alerts.map((alert, index) => (
              <View key={index} style={styles.alertItem}>
                <Text style={styles.alertName}>{alert.name}</Text>
                <Text style={styles.alertDescription}>{alert.description}</Text>
                <Text style={styles.alertDateTime}>
                  {new Date(alert.alert_datetime).toLocaleString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
  
        {/* Create Alert Modal */}
        <Modal
          visible={isCreateAlertModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New Alert</Text>
              <TextInput
                style={styles.input}
                placeholder="Alert Name"
                placeholderTextColor="#888"
                value={alertName}
                onChangeText={setAlertName}
              />
              <TextInput
                style={styles.input}
                placeholder="Alert Description"
                placeholderTextColor="#888"
                value={alertDescription}
                onChangeText={setAlertDescription}
                multiline
                numberOfLines={4}
              />
              <View style={styles.dateTimeContainer}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="Date (YYYY-MM-DD)"
                  placeholderTextColor="#888"
                  value={alertDate}
                  onChangeText={setAlertDate}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.timeInput}
                  placeholder="Time (HH:mm)"
                  placeholderTextColor="#888"
                  value={alertTime}
                  onChangeText={setAlertTime}
                  keyboardType="numeric"
                />
              </View>
  
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={handleCreateAlert}
                >
                  <Text style={styles.modalButtonText}>Create Alert</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setIsCreateAlertModalVisible(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  // Simulated Data for Other Tabs
  const guidanceData = [
    'Know the rules and regulations about anti-doping.',
    'Familiarize yourself with the banned substances list.',
    'Always check medications for compliance with anti-doping guidelines.',
    'Ensure proper use of therapeutic use exemptions (TUEs).',
    'Follow procedures for submitting anti-doping tests.',
    'Educate yourself on how doping tests are conducted.',
    'Know the penalties for doping violations in your sport.',
    'Understand the anti-doping agencies and their role.',
    'Participate in anti-doping education programs.',
    'Respect the integrity of your sport by competing clean.'
  ];

  const applyData = [
    'Submit medical records and supporting documents to the relevant anti-doping organization.',
    'Ensure that the application is complete and includes all required documentation.',
    'Applications should be submitted well in advance of any competition to avoid delays.',
    'Consult your doctor to ensure the proposed medication is necessary for your condition.',
    'Verify if the medication is on the World Anti-Doping Agency (WADA) prohibited list.',
    'Submit a signed statement from your healthcare provider explaining why the medication is necessary.',
    'Check if the medication has been prescribed for a medical condition that is recognized by WADA.',
    'Understand the application review process and timeline for TUE decisions.',
    'Be aware that incomplete applications may lead to a delayed or denied TUE.',
    'Follow the rules and regulations of your sport\'s governing body regarding TUE applications.'
  ];

  const conditionsData = [
    { name: 'Asthma', description: 'Asthma and respiratory conditions may qualify for TUE if required medications are prohibited.' },
    { name: 'Pain Management', description: 'Some pain management medications may be granted TUEs.' },
    { name: 'Diabetes', description: 'Conditions like diabetes may require special approvals for certain medications.' },
    { name: 'Mental Health', description: 'Mental health conditions such as depression may allow for TUEs for prescribed medications.' },
    { name: 'ADHD', description: 'Conditions like ADHD may allow for stimulant medications under a TUE.' },
    { name: 'HIV/AIDS', description: 'HIV/AIDS medications may require a TUE for certain treatments.' },
    { name: 'Cancer Treatments', description: 'Prohibited substances for cancer treatments may be granted under TUE.' },
    { name: 'Allergic Reactions', description: 'Allergic reactions and treatments may be eligible for TUE approval.' },
    { name: 'Chronic Pain', description: 'If you have chronic pain conditions, you may need a TUE for pain relief medications.' },
    { name: 'Thyroid Issues', description: 'Thyroid issues may require a TUE for certain thyroid replacement medications.' }
  ];

  const medicationData = [
    { name: 'Adderall', symptoms: 'Used for ADHD. May require a TUE.' },
    { name: 'Anabolic steroids', symptoms: 'Used for muscle growth. Requires TUE for medical purposes.' },
    { name: 'Oxycodone', symptoms: 'Pain reliever. Requires TUE for pain management.' },
    { name: 'Corticosteroids', symptoms: 'Used for inflammation. TUE may be required for certain conditions.' },
    { name: 'Beta-blockers', symptoms: 'For heart conditions. May be prohibited in some sports.' },
    { name: 'Diuretics', symptoms: 'Used for hypertension. May require TUE.' },
    { name: 'Asthma Meds', symptoms: 'For asthma. Can require TUE if they contain prohibited substances.' },
    { name: 'Antibiotics', symptoms: 'Generally not prohibited but always check with WADA.' },
    { name: 'Hormonal treatments', symptoms: 'For thyroid or hormonal imbalance. TUE may be necessary.' },
    { name: 'Pain relief medications', symptoms: 'For managing chronic pain. TUE may be needed.' }
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleSearchConditions = (text) => {
    setSearchQueryConditions(text);
  };

  // Filter medications based on search query
  const filteredMedicationData = medicationData.filter(
    (med) => med.name.toLowerCase().includes(searchQuery.toLowerCase()) || med.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter conditions based on search query
  const filteredConditionsData = conditionsData.filter(
    (condition) => condition.name.toLowerCase().includes(searchQueryConditions.toLowerCase())
  );

  const handleMedicationClick = (medication) => {
    setSelectedMedication(medication);
    setIsMedicationModalVisible(true);
  };

  const handleConditionClick = (condition) => {
    setSelectedCondition(condition);
    setIsConditionModalVisible(true);
  };

  const closeMedicationModal = () => {
    setIsMedicationModalVisible(false);
  };

  const closeConditionModal = () => {
    setIsConditionModalVisible(false);
  };

  // Function to render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'guidance':
        return guidanceData.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ));
      case 'apply':
        return (
          <View>
            {applyData.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))}
            {/* Link to WADA's TUE Application Form */}
            <TouchableOpacity onPress={() => Linking.openURL(wadaTUEFormLink)} style={styles.linkButton}>
              <Text style={styles.linkText}>Click here to fill the TUE Application Form</Text>
            </TouchableOpacity>
          </View>
        );
      case 'conditions':
        return (
          <View>
            <TextInput
              style={styles.searchBar}
              placeholder="Search by condition"
              placeholderTextColor="#888"
              value={searchQueryConditions}
              onChangeText={handleSearchConditions}
            />
            {filteredConditionsData.map((condition, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => handleConditionClick(condition)}>
                <Text style={styles.itemText}>{condition.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'medication':
        return (
          <View>
            <TextInput
              style={styles.searchBar}
              placeholder="Search by medication or symptoms"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {filteredMedicationData.map((med, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemContainer}
                onPress={() => handleMedicationClick(med)}>
                <Text style={styles.itemText}>{med.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'alerts':
        return renderAlertsContent();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button Container */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('guidance')}
          style={[styles.tabButton, activeTab === 'guidance' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'guidance' && styles.activeTabText]}>Guidance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('apply')}
          style={[styles.tabButton, activeTab === 'apply' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'apply' && styles.activeTabText]}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('conditions')}
          style={[styles.tabButton, activeTab === 'conditions' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'conditions' && styles.activeTabText]}>Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('medication')}
          style={[styles.tabButton, activeTab === 'medication' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'medication' && styles.activeTabText]}>Medication</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('alerts')}
          style={[styles.tabButton, activeTab === 'alerts' && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === 'alerts' && styles.activeTabText]}>Alerts</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer}>{renderContent()}</ScrollView>

      {/* Modals */}
      <Modal visible={isMedicationModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMedication?.name}</Text>
            <Text style={styles.modalSymptoms}>{selectedMedication?.symptoms}</Text>
            <TouchableOpacity onPress={closeMedicationModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isConditionModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCondition?.name}</Text>
            <Text style={styles.modalSymptoms}>{selectedCondition?.description}</Text>
            <TouchableOpacity onPress={closeConditionModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 40 : 20,  // Adjust for iOS status bar
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',  // Standard iOS blue, adjust as needed
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#1F1F1F',
  },
  tabButton: {
    padding: 10,
  },
  tabText: {
    color: '#BDBDBD',
    fontSize: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#00FF00',
  },
  activeTabText: {
    color: '#00FF00',
  },
  contentContainer: {
    padding: 20,
  },
  itemContainer: {
    backgroundColor: '#2f2f2f',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
  },
  alertBox: {
    backgroundColor: '#FF4C4C',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  alertTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  alertMessage: {
    color: '#fff',
    fontSize: 14,
  },
  noAlertsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
    backgroundColor: '#333',
    color: '#fff',
  },
  linkButton: {
    marginTop: 20,
    backgroundColor: '#00FF00',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSymptoms: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#00FF00',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  alertsContainer: {
    flex: 1,
    padding: 20,
  },
  createAlertButton: {
    backgroundColor: '#00FF00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createAlertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noAlertsText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  alertItem: {
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  alertName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alertDescription: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 5,
  },
  alertDateTime: {
    color: '#888',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#00FF00',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalCancelButton: {
    backgroundColor: '#FF4C4C',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateInput: {
    flex: 0.6,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  timeInput: {
    flex: 0.35,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
  },
});

export default App;