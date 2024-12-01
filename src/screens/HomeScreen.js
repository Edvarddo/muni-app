import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current; 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // verify if the token is saved
    SecureStore.getItemAsync('accessToken').then((accessToken) => {
      console.log(accessToken);
    }
    );
  }
  , []);
  useEffect(() => {
    if (showHamburgerMenu) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showHamburgerMenu, slideAnim, fadeAnim]);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      console.log('Access token removed successfully');
    } catch (error) {
      console.error('Error removing access token:', error);
    }
    setShowUserMenu(false);
    navigation.navigate('Login');
  };

  const renderUserMenu = () => (
    <Modal
      visible={showUserMenu}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowUserMenu(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowUserMenu(false)}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <Icon name="log-out-outline" size={24} color="#FF5722" />
            <Text style={styles.menuText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderHamburgerMenu = () => (
    <Modal
      visible={showHamburgerMenu}
      transparent={true}
      animationType="none"
      onRequestClose={() => setShowHamburgerMenu(false)}
    >
      <View style={styles.hamburgerMenuWrapper}>
        <Animated.View 
          style={[
            styles.hamburgerMenuOverlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowHamburgerMenu(false)}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.hamburgerMenuContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowHamburgerMenu(false)}
          >
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.hamburgerMenuContent}>
            <TouchableOpacity style={styles.hamburgerMenuItem}>
              <Icon name="home-outline" size={24} color="#FF5722" />
              <Text style={styles.hamburgerMenuText}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hamburgerMenuItem}>
              <Icon name="notifications-outline" size={24} color="#FF5722" />
              <Text style={styles.hamburgerMenuText}>Notificaciones</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hamburgerMenuItem}>
              <Icon name="calendar-outline" size={24} color="#FF5722" />
              <Text style={styles.hamburgerMenuText}>Eventos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hamburgerMenuItem}>
              <Icon name="people-outline" size={24} color="#FF5722" />
              <Text style={styles.hamburgerMenuText}>Comunidad</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hamburgerMenuItem}>
              <Icon name="help-circle-outline" size={24} color="#FF5722" />
              <Text style={styles.hamburgerMenuText}>Ayuda</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => setShowHamburgerMenu(true)}>
        <Icon name="menu" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>CalamaUnido</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerIcon}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerIcon}
          onPress={() => setShowUserMenu(true)}
        >
          <Icon name="person-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeroBanner = () => (
    <ImageBackground
      source={require('../../assets/calama-banner.jpg')}
      style={styles.heroBanner}
    >
      <View style={styles.heroBannerOverlay} />
      <Text style={styles.heroText}>Bienvenido a CalamaUnido!</Text>
    </ImageBackground>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <TouchableOpacity style={styles.categoryButton}>
        <Icon name="globe-outline" size={32} color="#000" />
        <Text style={styles.categoryText}>Global</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryButton}>
        <Icon name="location-outline" size={32} color="#000" />
        <Text style={styles.categoryText}>Local</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryButton}>
        <Icon name="chatbubbles-outline" size={32} color="#000" />
        <Text style={styles.categoryText}>Publicaciones</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryButton}>
        <Icon name="megaphone-outline" size={32} color="#000" />
        <Text style={styles.categoryText}>Anuncios</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPopularTopics = () => (
    <View style={styles.popularTopicsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Temas Populares</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllButton}>Ver Todo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={styles.topicCard}>
          <Image
            source={require('../../assets/news-icon.png')}
            style={styles.topicImage}
          />
          <Text style={styles.topicTitle}>Noticias Municipales</Text>
          <Text style={styles.topicDate}>Último cambio: 2021-08-18</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topicCard}>
          <Image
            source={require('../../assets/rules-icon.png')}
            style={styles.topicImage}
          />
          <Text style={styles.topicTitle}>Reglas del Foro</Text>
          <Text style={styles.topicDate}>Último cambio: 2021-08-15</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topicCard}>
          <Image
            source={require('../../assets/events-icon.png')}
            style={styles.topicImage}
          />
          <Text style={styles.topicTitle}>Eventos</Text>
          <Text style={styles.topicDate}>Último cambio: 2021-08-10</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="home-outline" size={24} color="#000" />
        <Text style={styles.navText}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="create-outline" size={24} color="#000" />
        <Text style={styles.navText}>Crear</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItemCenter}>
        <Image
          source={require('../../assets/nav-icon.png')}
          style={styles.centerLogo}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="settings-outline" size={24} color="#000" />
        <Text style={styles.navText}>Ajustes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="person-outline" size={24} color="#000" />
        <Text style={styles.navText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.scrollView}>
        {renderHeroBanner()}
        {renderCategories()}
        {renderPopularTopics()}
      </ScrollView>
      {renderBottomNav()}
      {renderUserMenu()}
      {renderHamburgerMenu()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 16,
  },
  heroBanner: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: '#FFF5F2',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF5722',
    width: 95,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 9,
    color: '#000',
  },
  popularTopicsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllButton: {
    color: '#FF5722',
    fontSize: 14,
    backgroundColor: '#FFF5F2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  topicCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  topicImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  topicDate: {
    fontSize: 12,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
  },
  navItemCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: -30,
    borderWidth: 1,
    borderColor: '#eee',
  },
  centerLogo: {
    width: 40,
    height: 40,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FF5722',
  },
  hamburgerMenuWrapper: { 
    flex: 1,
    flexDirection: 'row-reverse',
  },
  hamburgerMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  hamburgerMenuContainer: { 
    flex: 1,
    backgroundColor: 'white',
    width: 350,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 16,
  },
  hamburgerMenuContent: {
    flex: 1,
    paddingTop: 20,
  },
  hamburgerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  hamburgerMenuText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
});

