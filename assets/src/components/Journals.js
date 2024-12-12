import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, TextInput, Modal } from 'react-native';
import axios from 'axios';
import { ChevronLeft, Users, BookOpen, CalendarDays, Link, ArrowDown, Search, Filter, X } from 'lucide-react';

const Journals = () => {
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJournals, setSelectedJournals] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  
  // Modal states
  const [journalModalVisible, setJournalModalVisible] = useState(false);
  const [authorModalVisible, setAuthorModalVisible] = useState(false);

  // Unique publications and authors extraction
  const [uniqueJournals, setUniqueJournals] = useState([]);
  const [uniqueAuthors, setUniqueAuthors] = useState([]);

  const fetchJournals = async (currentPage) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/journals?page=${currentPage}&limit=20`);
      const newJournals = response.data.data || [];
  
      // Update journals and get unique publications and publishers
      const updatedJournals = currentPage === 1 ? newJournals : [...journals, ...newJournals];
      setJournals(updatedJournals);
      
      // Extract unique PUBLISHERS and authors
      const publishers_list = [...new Set(updatedJournals.map(j => j.publisher))];
      const authors_list = [...new Set(
        updatedJournals.flatMap(j => j.authors || [])
      )];
      
      setUniqueJournals(publishers_list);  // Now this holds PUBLISHERS
      setUniqueAuthors(authors_list);
  
      // Initial filtered results
      setFilteredJournals(updatedJournals);
      
      setHasMore(newJournals.length === 3);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals(1);
  }, []);

  // Search and Filter Logic
useEffect(() => {
  let result = journals;

  // Apply publisher filter (was previously publication filter)
  if (selectedJournals.length > 0) {
    result = result.filter(journal => 
      selectedJournals.includes(journal.publisher) // Filtering by publisher
    );
  }

  // Apply author filter
  if (selectedAuthors.length > 0) {
    result = result.filter(journal => 
      journal.authors.some(author => 
        selectedAuthors.includes(author)
      )
    );
  }

  // Apply search query
  if (searchQuery) {
    result = result.filter(journal => 
      journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.authors.some(author => 
        author.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      journal.journal.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  setFilteredJournals(result);
}, [searchQuery, selectedJournals, selectedAuthors, journals]);


  const loadMoreJournals = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchJournals(nextPage);
    }
  };

  // Toggle selection for journals and authors
  const toggleJournalSelection = (journal) => {
    setSelectedJournals(prev => 
      prev.includes(journal) 
        ? prev.filter(j => j !== journal)
        : [...prev, journal]
    );
  };

  const toggleAuthorSelection = (author) => {
    setSelectedAuthors(prev => 
      prev.includes(author) 
        ? prev.filter(a => a !== author)
        : [...prev, author]
    );
  };

  const JournalCard = ({ journal }) => (
    <TouchableOpacity style={styles.journalCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.journalTitle} numberOfLines={2}>
          {journal?.title || 'No Title Available'}
        </Text>
      </View>
  
      <View style={styles.journalDetailContent}>
        <View style={styles.detailInfoContainer}>
          <View style={styles.detailRow}>
            <Users style={styles.detailInfoIcon} />
            <Text style={styles.detailInfoText} numberOfLines={2}>
              Authors: {journal?.authors?.join(', ') || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <BookOpen style={styles.detailInfoIcon} />
            <Text style={styles.detailInfoText}>
              Journal: {journal?.journal || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <CalendarDays style={styles.detailInfoIcon} />
            <Text style={styles.detailInfoText}>
              Published: {journal?.published_date || 'N/A'}
            </Text>
          </View>
          {/* New Publisher Field */}
          <View style={styles.detailRow}>
            <Text style={styles.detailInfoText}>
              Publisher: {journal?.publisher || 'N/A'}
            </Text>
          </View>
          {journal?.url && (
            <TouchableOpacity 
              onPress={() => window.open(journal.url, '_blank')}
              style={styles.sourceLinkContainer}
            >
              <Link style={styles.sourceLinkIcon} />
              <Text style={styles.sourceLinkText}>View Source</Text>
            </TouchableOpacity>
          )}
        </View>
  
        <View>
          <Text style={styles.doiTitle}>DOI</Text>
          <Text style={styles.doiText}>{journal?.doi || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Modal for selecting journals or authors
  const FilterModal = ({ 
    visible, 
    onClose, 
    title, 
    items, 
    selectedItems, 
    onToggleSelection 
  }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.filterItem,
                  selectedItems.includes(item) && styles.selectedFilterItem
                ]}
                onPress={() => onToggleSelection(item)}
              >
                <Text style={[
                  styles.filterItemText,
                  selectedItems.includes(item) && styles.selectedFilterItemText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Scientific Journals</Text>
      
      {/* Search and Filter Section */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchInputContainer}>
          <Search style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search journals, authors..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Filter Buttons */}
        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setJournalModalVisible(true)}
          >
            <BookOpen style={styles.filterButtonIcon} />
            <Text style={styles.filterButtonText}>Publisher</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setAuthorModalVisible(true)}
          >
            <Users style={styles.filterButtonIcon} />
            <Text style={styles.filterButtonText}>Authors</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Filters */}
        {(selectedJournals.length > 0 || selectedAuthors.length > 0) && (
          <View style={styles.selectedFiltersContainer}>
            {selectedJournals.map(journal => (
              <TouchableOpacity 
                key={journal} 
                style={styles.selectedFilterChip}
                onPress={() => toggleJournalSelection(journal)}
              >
                <Text style={styles.selectedFilterChipText}>{journal}</Text>
                <X style={styles.chipCloseIcon} />
              </TouchableOpacity>
            ))}
            {selectedAuthors.map(author => (
              <TouchableOpacity 
                key={author} 
                style={styles.selectedFilterChip}
                onPress={() => toggleAuthorSelection(author)}
              >
                <Text style={styles.selectedFilterChipText}>{author}</Text>
                <X style={styles.chipCloseIcon} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      {/* Journals List */}
      <FlatList
        data={filteredJournals}
        renderItem={({ item }) => <JournalCard journal={item} />}
        keyExtractor={(journal, index) => journal?.doi || `journal-${index}`}
        ListFooterComponent={() => (
          hasMore && (
            <TouchableOpacity 
              style={styles.loadMoreButton} 
              onPress={loadMoreJournals}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1DB954" />
              ) : (
                <>
                  <ArrowDown style={styles.loadMoreIcon} />
                  <Text style={styles.loadMoreText}>Load More</Text>
                </>
              )}
            </TouchableOpacity>
          )
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContainer}
      />
      
      {loading && filteredJournals.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      )}

      {!loading && filteredJournals.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No journals found</Text>
        </View>
      )}

      {/* Modals for Filtering */}
      <FilterModal
  visible={journalModalVisible}
  onClose={() => setJournalModalVisible(false)}
  title="Select Publishers"
  items={uniqueJournals}  // This should be the list of publishers
  selectedItems={selectedJournals}  // Selected publishers will be filtered
  onToggleSelection={toggleJournalSelection}
/>


      <FilterModal
        visible={authorModalVisible}
        onClose={() => setAuthorModalVisible(false)}
        title="Select Authors"
        items={uniqueAuthors}
        selectedItems={selectedAuthors}
        onToggleSelection={toggleAuthorSelection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  journalCard: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: 225,  // Adjust width to fit horizontally
    borderWidth: 1,
    marginRight: 15, 
    borderColor: '#1DB954',
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 12,
  },
  journalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  journalDetailContent: {
    gap: 16,
    marginTop: 16,
  },
  detailInfoContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailInfoIcon: {
    color: '#1DB954',
    width: 18,
    height: 18,
  },
  detailInfoText: {
    color: '#FFFFFF',
    fontSize: 14,
    flexShrink: 1,
    flexWrap: 'wrap',  // Allow the text to wrap for longer author names
  },
  sourceLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  sourceLinkIcon: {
    color: '#1DB954',
    width: 16,
    height: 16,
  },
  sourceLinkText: {
    color: '#1DB954',
    marginLeft: 8,
    fontSize: 14,
  },
  doiTitle: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  doiText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  loadMoreButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  loadMoreIcon: {
    color: '#121212',
    width: 20,
    height: 20,
  },
  loadMoreText: {
    color: '#121212',
    marginTop: 4,
  },
  horizontalContainer: {
    paddingVertical: 8,  // Optional padding for better layout
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 0.48,
  },
  filterButtonIcon: {
    color: '#1DB954',
    marginRight: 8,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeIcon: {
    color: '#1DB954',
  },
  filterItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  selectedFilterItem: {
    backgroundColor: '#1DB954',
  },
  filterItemText: {
    color: '#FFFFFF',
  },
  selectedFilterItemText: {
    color: '#000000',
  },
  selectedFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 5,
  },
  selectedFilterChipText: {
    color: '#000000',
    marginRight: 5,
  },
  chipCloseIcon: {
    color: '#000000',
    width: 16,
    height: 16,
  },
});



export default Journals;
