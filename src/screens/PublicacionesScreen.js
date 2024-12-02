import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Animated,
  Dimensions,
  Switch,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import PublicationDetailScreen from './PublicacionDetallesScreen';

const PUBLICATIONS_API_URL = 'https://clubdelamusica-pruebas.com/api/v1/publicaciones/';
const CATEGORIES_API_URL = 'https://clubdelamusica-pruebas.com/api/v1/categorias/';
const { height } = Dimensions.get('window');

export default function PublicationsScreen() {
  const navigation = useNavigation();
  const [publications, setPublications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isCategoryFiltersVisible, setIsCategoryFiltersVisible] = useState(true); // Update 1
  const uniqueCounterRef = useRef(0); 
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    fetchCategories();
    fetchPublications();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      const response = await fetch(CATEGORIES_API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const showFilterDrawer = () => {
    setIsFilterVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const hideFilterDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsFilterVisible(false);
    });
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const applyFilters = () => {
    hideFilterDrawer();
    setIsFilterLoading(true);
    fetchPublications(1, true);
  };

  const fetchPublications = useCallback(async (pageNumber = 1, shouldRefresh = false) => {
    if (!hasMore && pageNumber !== 1) return;

    try {
      const token = await SecureStore.getItemAsync('accessToken');
      let url = `${PUBLICATIONS_API_URL}?page=${pageNumber}`;
      if (selectedCategories.length > 0) {
        const categoryNames = selectedCategories
          .map(id => categories.find(cat => cat.id === id)?.nombre)
          .filter(Boolean)
          .join(',');
        url += `&categoria=${encodeURIComponent(categoryNames)}`;
      }
    
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
    
      if (shouldRefresh) {
        setPublications(data.results);
      } else {
        setPublications(prevPublications => [...prevPublications, ...data.results]);
      }
    
      setHasMore(data.next !== null);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
      setIsFilterLoading(false);
    }
  }, [hasMore, selectedCategories, categories]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchPublications(1, true);
  }, [fetchPublications]);

  const loadMore = () => {
    if (!isLoading && !isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      fetchPublications(page + 1);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="chevron-back" size={24} color="#000" />
        <Text style={styles.headerTitle}>Publicaciones</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={showFilterDrawer}
        style={styles.filterButton}
      >
        <Icon name="filter" size={24} color="#FF5722" />
      </TouchableOpacity>
    </View>
  );

  const renderFilterDrawer = () => (
    <Modal
      visible={isFilterVisible}
      transparent={true}
      animationType="none"
      onRequestClose={hideFilterDrawer}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={hideFilterDrawer}
        />
        <Animated.View 
          style={[
            styles.filterDrawer,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filtros</Text>
            <TouchableOpacity onPress={hideFilterDrawer}>
              <Text>
                <Icon name="close" size={24} color="#000" />
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterSubHeader}>
            <Text style={styles.filterSectionTitle}>Categorías</Text>
            <TouchableOpacity onPress={() => setIsCategoryFiltersVisible(!isCategoryFiltersVisible)}>
              <Text>
                <Icon name={isCategoryFiltersVisible ? "chevron-up" : "chevron-down"} size={24} color="#FF5722" />
              </Text>
            </TouchableOpacity>
          </View>
          {isCategoryFiltersVisible && (
            <ScrollView style={styles.filterContent}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.filterOption}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text style={styles.filterOptionText}>{category.nombre}</Text>
                  <Switch
                    value={selectedCategories.includes(category.id)}
                    onValueChange={() => toggleCategory(category.id)}
                    trackColor={{ false: '#e0e0e0', true: '#FF5722' }}
                    thumbColor={selectedCategories.includes(category.id) ? '#fff' : '#fff'}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={applyFilters}
          >
            <Text style={styles.applyButtonText}>Aplicar filtros</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderPublication = ({ item: publication }) => (
    <TouchableOpacity
      style={styles.publicationCard}
      onPress={() => navigation.navigate('PublicationDetail', { publication })}
    >
      <View style={styles.publicationHeader}>
        <Text style={styles.publicationTitle}>{publication.titulo}</Text>
        <Text style={styles.publicationCode}>{publication.codigo}</Text>
      </View>
      <Text style={styles.publicationAuthor}>Por: {publication.usuario.nombre}</Text>
      <Text style={styles.publicationDescription} numberOfLines={2}>{publication.descripcion}</Text>
      <View style={styles.publicationFooter}>
        <Text style={styles.publicationDate}>
          {new Date(publication.fecha_publicacion).toLocaleDateString()}
        </Text>
        <View style={[styles.situationTag, { backgroundColor: getSituationColor(publication.situacion.nombre) }]}>
          <Text style={styles.situationText}>{publication.situacion.nombre}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#FF5722" />
      </View>
    );
  };

  const getSituationColor = (situation) => {
    switch (situation) {
      case 'Recibido':
        return '#FFA500';
      case 'En curso':
        return '#4CAF50';
      case 'Pendiente':
        return '#FF5722';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {isFilterLoading && (
        <View style={styles.filterLoadingContainer}>
          <ActivityIndicator size="large" color="#FF5722" />
        </View>
      )}
      {isLoading && publications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5722" />
        </View>
      ) : (
        <FlatList
          data={publications}
          renderItem={renderPublication}
          keyExtractor={(item) => `${item.id}-${uniqueCounterRef.current++}`} 
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF5722']}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      )}
      {renderFilterDrawer()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  filterButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterDrawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterContent: {
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterOptionText: {
    fontSize: 16,
  },
  applyButton: {
    margin: 20,
    backgroundColor: '#FF5722',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publicationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  publicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  publicationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  publicationCode: {
    fontSize: 12,
    color: '#666',
  },
  publicationDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  publicationAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  publicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  publicationDate: {
    fontSize: 12,
    color: '#666',
  },
  situationTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  situationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerLoader: {
    marginVertical: 16,
    alignItems: 'center',
  },
  filterLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1000,
  },
});

