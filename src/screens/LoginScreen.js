import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const axios = require('axios').default;
import * as SecureStore from 'expo-secure-store';
export default function LoginScreen() {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [rutError, setRutError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const formatRut = (value) => {
    let rutClean = value.replace(/[^0-9kK]/g, '');
    
    // Limitar a 9 caracteres (8 dígitos + 1 verificador)
    if (rutClean.length > 9) {
      rutClean = rutClean.slice(0, 9);
    }

    if (rutClean.length > 1) {
      const body = rutClean.slice(0, -1);
      const dv = rutClean.slice(-1).toUpperCase();

      let formattedBody = '';
      for (let i = body.length - 1; i >= 0; i--) {
        formattedBody = body.charAt(i) + formattedBody;
        if ((body.length - i) % 3 === 0 && i !== 0) {
          formattedBody = '.' + formattedBody;
        }
      }

      return `${formattedBody}-${dv}`;
    }

    return rutClean;
  };

  const unFormatRut = (value) => {
    return value.replace(/\./g, '');
  };

  const validateRut = (value) => {
    const rutRegex = /^(\d{1,3}(?:\.\d{3}){2}-[\dkK])$/;
    if (!rutRegex.test(value)) {
      setRutError('RUT inválido');
      return false;
    } else {
      setRutError('');
      return true;
    }
  };

  const validatePassword = (value) => {
    if (!value || value.length < 1) {
      setPasswordError('La clave es requerida');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleLogin = async () => {
    console.log('Iniciar sesión');
    console.log('RUT:', rut);
    console.log('Clave:', password + '\n');
    try {
      // Validar campos antes de hacer la llamada
      const isRutValid = validateRut(rut);
      const isPasswordValid = validatePassword(password);

      if (!isRutValid || !isPasswordValid) {
        return;
      }

      setIsLoading(true);
      // use axios
      const response = await axios.post('https://clubdelamusica-pruebas.com/api/v1/token/', {
        rut: unFormatRut(rut),
        password: password,
      });
      

      const data = response.data;
      // console.log(response);
      // console.log(data);
      // this response dont have a ok property
      if (data.error) {
        throw new Error(data.error);
      }
      // if (!response.ok) {
      //   throw new Error(data.message || 'Error en el inicio de sesión');
      // }

      // Aquí puedes guardar los tokens en el almacenamiento seguro
      await SecureStore.setItemAsync('accessToken', data.access);
      // await SecureStore.setItemAsync('refreshToken', data.refresh);

      // También puedes guardar la información del usuario
      // await AsyncStorage.setItem('userId', data.id.toString());
      // await AsyncStorage.setItem('isAdmin', data.es_administrador.toString());

      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'No se pudo iniciar sesión. Por favor, verifica tus credenciales e intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // verify if the token is saved
    SecureStore.getItemAsync('accessToken').then((accessToken) => {
      console.log(accessToken);
    }
    );
  }
  , []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/logotipo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.appName}>CalamaUnido</Text>

        <Text style={styles.signInText}>Iniciar Sesión</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="RUT"
            placeholderTextColor="#999"
            value={rut}
            onChangeText={(text) => {
              const formattedRut = formatRut(text);
              setRut(formattedRut);
              validateRut(formattedRut);
            }}
            keyboardType="numeric"
            maxLength={12}
            editable={!isLoading}
          />
          <TouchableOpacity style={styles.infoIcon}>
            <Icon name="information-circle-outline" size={24} color="#FF6347" />
          </TouchableOpacity>
        </View>
        {rutError ? <Text style={styles.errorText}>{rutError}</Text> : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Clave Única"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
            editable={!isLoading}
          />
          <TouchableOpacity style={styles.infoIcon}>
            <Icon name="information-circle-outline" size={24} color="#FF6347" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'INGRESANDO...' : 'INGRESAR'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  signInText: {
    fontSize: 20,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  infoIcon: {
    padding: 10,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
});

