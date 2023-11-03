import React from 'react';
import { Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

import PageMeuPerfil from '../pages/AppRoutes/pageMeuPerfil';
import styles from '../../styles';
import { useFonts } from 'expo-font';
import PageNovaReserva from '../pages/AppRoutes/pageNovaReserva';
import PageHomeScreen from '../pages/AppRoutes/pageHomeScreen';
import PageHistorico from '../pages/AppRoutes/pageHistorico';
import PageEditarPerfil from '../pages/AppRoutes/pageEditarPerfil';
import PageLocaisEsportivos from '../pages/AppRoutes/pageLocaisEsportivos';


function LogoTitle() {
    return (
        <Image
            style={{ width: 33, height: 36, marginLeft: 20, borderRadius: 8 }}
            source={require('../../assets/logo-sport-ease.png')}
        />
    );
}

// Componentes para cada aba

function Tab3Screen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Tab 3!</Text>
        </View>
    );
}

const ProfileStack = createStackNavigator();
function MeuPerfilStack() {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="MeuPerfil" component={PageMeuPerfil}
                options={{
                    headerShown: false
                }} />
            <ProfileStack.Screen name="PageEditarPerfil" component={PageEditarPerfil}
                options={{
                    headerShown: false
                }} />
        </ProfileStack.Navigator>
    );
}


const Tab = createBottomTabNavigator();

export default function AppRoutes() {
    // Incluindo fonte Poppins --------------
    const [loaded] = useFonts({
        Poppins: require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
        PoppinsBold: require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
        PoppinsSemiBold: require('../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    });

    if (!loaded) {
        return null;
    }

    // Término do import das fontes ----------

    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator
                screenOptions={{
                    headerLeft: props => <LogoTitle />,
                    headerTitle: () => (
                        <Text style={styles.headerText}>
                            SportEase
                        </Text>
                    ),
                    headerTitleAlign: 'left',
                }}
            >
                <Tab.Screen name="HomeScreen" component={PageHomeScreen}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="home" size={focused ? 32 : 24} color={focused ? 'green' : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Nova Reserva" component={PageNovaReserva}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="plus-square" size={focused ? 32 : 24} color={focused ? 'green' : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Locais Esportivos" component={PageLocaisEsportivos}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="map-pin" size={focused ? 32 : 24} color={focused ? 'green' : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Historico" component={PageHistorico}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="clock" size={focused ? 32 : 24} color={focused ? 'green' : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Meu Perfil" component={MeuPerfilStack}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="user" size={focused ? 32 : 24} color={focused ? 'green' : 'black'} />
                        )
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}