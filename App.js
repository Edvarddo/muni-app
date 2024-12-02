import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import PublicationsScreen from './src/screens/PublicacionesScreen';
import PublicationDetailScreen from './src/screens/PublicacionDetallesScreen';
import CrearPublicacionScreen from './src/screens/CrearPublicacionScreen';
const Stack = createStackNavigator();

const BottomNav = ({navigation}) => (
  
  
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home-outline" size={24} color="#000" />
        <Text style={styles.navText}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('CrearPublicacionScreen')}
      >
        <Icon name="create-outline" size={24} color="#000" />
        <Text style={styles.navText}>Crear</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItemCenter}>
        <Image
          source={require('./assets/nav-icon.png')}
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

const Layout = ({ children }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {children}
        </View>
        <BottomNav navigation={navigation} />
      </SafeAreaView>
    </View>

  )
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
        >
          {(props) => (
            <Layout>
              <HomeScreen {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Publications"
          options={{ headerShown: false }}
        >
          {(props) => (
            <Layout>
              <PublicationsScreen {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen 
          name="PublicationDetail" 
          options={{ headerShown: false }}
        >
          {(props) => (
            <Layout>
              <PublicationDetailScreen {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen 
          name="CrearPublicacionScreen" 
          options={{ headerShown: false }}
        >
          {(props) => (
            <Layout navigation={props.navigation}>
              <CrearPublicacionScreen {...props} />
            </Layout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
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
});

export default App;

