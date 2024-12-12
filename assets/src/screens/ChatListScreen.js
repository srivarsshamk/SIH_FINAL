import React, { useState, useEffect } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  StatusBar,
  ActivityIndicator 
} from 'react-native'; 
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for chevron icon

export default function ChatListScreen() {
  const [users, setUsers] = useState([]);
  const [pinnedUsers, setPinnedUsers] = useState([]); // State to track pinned users
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
    getCurrentUserId();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/users');

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const responseData = await response.json();
      const usersData = responseData.data || [];
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Could not load users');
      setLoading(false);
    }
  };

  const getCurrentUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const currentUser = JSON.parse(userData);
        setCurrentUserId(currentUser.id);
      }
    } catch (error) {
      console.error('Error getting current user ID:', error);
    }
  };

  const handlePinUser = (user) => {
    if (pinnedUsers.some((pinned) => pinned.id === user.id)) {
      // Unpin if already pinned
      setPinnedUsers((prev) => prev.filter((pinned) => pinned.id !== user.id));
    } else {
      // Pin user
      setPinnedUsers((prev) => [...prev, user]);
    }
  };

  const handleConnect = async (user) => {
    try {
      if (!currentUserId) {
        Alert.alert('Error', 'Please log in first');
        return;
      }

      await AsyncStorage.setItem('messageSenderId', currentUserId.toString());
      await AsyncStorage.setItem('messageReceiverId', user.id.toString());
      await AsyncStorage.setItem('receiverUsername', `${user.first_name} ${user.last_name}`.trim());

      navigation.navigate('Message', {
        senderId: currentUserId,
        receiverId: user.id,
        receiverName: `${user.first_name} ${user.last_name}`.trim() || 'User',
      });
    } catch (error) {
      console.error('Connect error:', error);
      Alert.alert('Error', 'Could not establish connection');
    }
  };

  const getProfileInitials = (user) => {
    return `${user.first_name ? user.first_name[0].toUpperCase() : ''}${user.last_name ? user.last_name[0].toUpperCase() : ''}`;
  };

  const renderUserItem = ({ item }) => {
    const displayName = item.id === currentUserId ? 'You' : `${item.first_name} ${item.last_name}`.trim();
    const isPinned = pinnedUsers.some((pinned) => pinned.id === item.id);
  
    return (
      <TouchableOpacity
        style={[styles.userContainer, isPinned && styles.pinnedContainer]}
        onPress={() => handleConnect(item)}
        onLongPress={() => handlePinUser(item)}
      >
        <View style={styles.profileInitialsContainer}>
          <Text style={styles.profileInitials}>{getProfileInitials(item)}</Text>
        </View>
        <View style={styles.userDetailsContainer}>
          <Text style={styles.userName}>{displayName}</Text>
        </View>
        {isPinned && <Ionicons name="pin" size={24} color="#00FF00" style={styles.pinIcon} />}
        <Ionicons name="chevron-forward" size={24} color="#FFFFFF" style={styles.chevronIcon} />
      </TouchableOpacity>
    );
  };
  

  const sortedUsers = [
    ...pinnedUsers,
    ...users.filter((user) => !pinnedUsers.some((pinned) => pinned.id === user.id)),
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FF00" />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.headerContainer}>
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Conversations</Text>
          <View style={styles.headerDecorationLine} />
        </View>
      </View>

      <FlatList
        data={sortedUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No conversations available</Text>
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#0A0A0A',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    alignItems: 'center', 
  },
  headerOverlay: {
    position: 'relative',
  },
  headerDecorationLine: {
    height: 3,
    width: 300,
    backgroundColor: '#008000',
    marginTop: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 255, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  listContentContainer: {
    paddingVertical: 15,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: '#0A0A0A',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInitialsContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#00FF00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  chevronIcon: {
    marginLeft: 10,
  },
  separator: {
    height: 0,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#00FF00',
  },
  pinnedContainer: {
    borderColor: '#008000', // Highlight pinned chats
  },
  pinIcon: {
    marginLeft: 10,
  },
});
