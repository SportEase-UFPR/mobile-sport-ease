import React from 'react';
import { Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';


import PageMeuPerfil from '../pages/AppRoutes/pageMeuPerfil';
import styles from '../../styles';
import { useFonts } from 'expo-font';
import PageNovaReserva from '../pages/AppRoutes/pageNovaReserva';


function LogoTitle() {
    return (
        <Image
            style={{ width: 33, height: 36, marginLeft: 20, borderRadius: 8 }}
            source={require('../../assets/logo-sport-ease.png')}
        />
    );
}


// Componentes para cada aba
function Tab1Screen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Tab 1!</Text>
        </View>
    );
}

function Tab2Screen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Tab 2!</Text>
        </View>
    );
}

function Tab3Screen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Tab 3!</Text>
        </View>
    );
}

function Tab4Screen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Tab 4!</Text>
        </View>
    );
}

// importar telas que o usuário poderá acessar depois de login


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
                <Tab.Screen name="Tab1" component={Tab1Screen}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="home" size={24} color={focused ? 'green' : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Nova Reserva" component={PageNovaReserva}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="plus-square" size={24} color={focused ? 'green' : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Tab3" component={Tab3Screen}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="map-pin" size={24} color={focused ? 'green' : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Historico" component={Tab4Screen}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="clock" size={24} color={focused ? 'green' : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Meu Perfil" component={PageMeuPerfil}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="user" size={24} color={focused ? 'green' : 'black'} />
                        )
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}