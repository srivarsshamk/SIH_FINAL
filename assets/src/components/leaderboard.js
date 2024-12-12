import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userTotal, setUserTotal] = useState({ total_score: 0, games_played: 0 });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user ID from AsyncStorage
        const userData = await AsyncStorage.getItem('userData');
        const parsedUserData = JSON.parse(userData);
        setUserId(parsedUserData.id);

        // Fetch leaderboard data
        const leaderboardResponse = await fetch('http://127.0.0.1:8000/game-scores/leaderboard');
        const leaderboardResult = await leaderboardResponse.json();
        setLeaderboardData(leaderboardResult.data);

        // Fetch user's total
        if (parsedUserData.id) {
          const userTotalResponse = await fetch(`http://127.0.0.1:8000/game-scores/user/${parsedUserData.id}/total`);
          const userTotalResult = await userTotalResponse.json();
          setUserTotal(userTotalResult);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#002D04" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* User's Total Score Card */}
      <View style={styles.totalScoreCard}>
        <Text style={styles.totalScoreTitle}>Your Progress</Text>
        <View style={styles.totalScoreDetails}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreValue}>{userTotal.total_score}</Text>
            <Text style={styles.scoreLabel}>Total Score</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.scoreItem}>
            <Text style={styles.scoreValue}>{userTotal.games_played}</Text>
            <Text style={styles.scoreLabel}>Games Played</Text>
          </View>
        </View>
      </View>

      {/* Leaderboard Table */}
      <View style={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}>Global Leaderboard</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.rankCell]}>Rank</Text>
          <Text style={[styles.headerCell, styles.nameCell]}>Player</Text>
          <Text style={[styles.headerCell, styles.scoreCell]}>Score</Text>
          <Text style={[styles.headerCell, styles.gamesCell]}>Games</Text>
        </View>
        <ScrollView style={styles.tableBody}>
          {leaderboardData.map((entry, index) => (
            <View 
              key={index} 
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <Text style={[styles.cell, styles.rankCell]}>{index + 1}</Text>
              <Text style={[styles.cell, styles.nameCell]}>{entry.first_name}</Text>
              <Text style={[styles.cell, styles.scoreCell]}>{entry.total_score}</Text>
              <Text style={[styles.cell, styles.gamesCell]}>{entry.games_played}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalScoreCard: {
    backgroundColor: '#002D04',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  totalScoreTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  totalScoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: 'white',
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  leaderboardContainer: {
    flex: 1,
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002D04',
    textAlign: 'center',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#002D04',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableBody: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  evenRow: {
    backgroundColor: 'white',
  },
  oddRow: {
    backgroundColor: '#f9f9f9',
  },
  cell: {
    fontSize: 14,
  },
  rankCell: {
    flex: 1,
    textAlign: 'center',
  },
  nameCell: {
    flex: 3,
  },
  scoreCell: {
    flex: 2,
    textAlign: 'right',
  },
  gamesCell: {
    flex: 2,
    textAlign: 'right',
  },
});

export default Leaderboard;