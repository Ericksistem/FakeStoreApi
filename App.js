import 'react-native-gesture-handler';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './screens/home/home';
import SignIn from './screens/signIn/signIn';
import DescripcionProduct from './screens/DescriptionProduct/DescriptionProduct';
import profield from './screens/Profield/profield';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function App() {
  const Stack = createStackNavigator();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar el estado de autenticación al iniciar la aplicación
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token); // Si hay un token, el usuario está autenticado
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Muestra un indicador de carga mientras se verifica el estado de autenticación
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Rutas protegidas solo accesibles si está autenticado
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen
              name="DescripcionProduct"
              component={DescripcionProduct}
              options={{ title: 'Detalle del Producto' }}
            />
            <Stack.Screen name="profield" component={profield} />
          </>
        ) : (
          // Ruta de inicio de sesión
          <Stack.Screen name="SignIn">
            {(props) => <SignIn {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
