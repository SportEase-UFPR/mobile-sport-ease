import React, { useEffect, useState } from 'react';
import { Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import PageMeuPerfil from '../pages/AppRoutes/pageMeuPerfil';
import styles from '../../styles';
import { useFonts } from 'expo-font';
import PageNovaReserva from '../pages/AppRoutes/pageNovaReserva';
import PageHomeScreen from '../pages/AppRoutes/pageHomeScreen';
import PageHistorico from '../pages/AppRoutes/pageHistorico';
import PageEditarPerfil from '../pages/AppRoutes/pageEditarPerfil';
import PageLocaisEsportivos from '../pages/AppRoutes/pageLocaisEsportivos';
import { IconButton, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import PageNotificacoes from '../pages/AppRoutes/pageNotificacoes';
import { useNotifications } from '../contexts/NotificationContext';
import COLORS from '../colors/colors';

function LogoTitle() {
    return (
        <Image
            style={{ width: 33, height: 36, marginLeft: 20, borderRadius: 8 }}
            source={require('../../assets/logo-sport-ease.png')}
        />
    );
}

function NotificationButton() {
    const navigation = useNavigation();
    const [isNotification, setIsNotification] = useState(false);

    // useNotifications é um hook e deve ser chamado diretamente no corpo do componente
    const { notifications, loadNotifications } = useNotifications();

    useEffect(() => {
        // Não precisa de uma função assíncrona aqui, pois os dados já estão no contexto
        const hasUnreadNotification = notifications.some(notificacao => !notificacao.lida);
        setIsNotification(hasUnreadNotification);
    }, [notifications])

    return (
        <IconButton
            icon={<Icon as={MaterialCommunityIcons} name={isNotification ? 'bell-badge' : 'bell'} />}
            borderRadius="full"
            mr="4"
            _icon={{
                color: (isNotification ? "yellow.500" : "gray.500"),
                size: "lg"
            }}
            _hover={{
                bg: (isNotification ? "yellow.500:alpha.20" : "gray.500:alpha.20")
            }}
            _pressed={{
                bg: (isNotification ? "yellow.500:alpha.20" : "gray.500:alpha.20"),
                _icon: {
                    size: "md"
                },
                _ios: {
                    _icon: {
                        size: "2xl"
                    }
                }
            }}
            _ios={{
                _icon: {
                    size: "2xl"
                }
            }}
            onPress={() => {
                loadNotifications();
                navigation.navigate("Notificacoes")
            }
            }
        />
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
                    headerRight: () => <NotificationButton />,
                    headerTitleAlign: 'left',
                }}
            >
                <Tab.Screen name="HomeScreen" component={PageHomeScreen}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="home" size={focused ? 32 : 24} color={focused ? COLORS.green : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Locais Esportivos" component={PageLocaisEsportivos}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="map-pin" size={focused ? 32 : 24} color={focused ? COLORS.green : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Nova Reserva" component={PageNovaReserva}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <AntDesign name="pluscircleo" size={focused ? 37 : 32} color={focused ? COLORS.green : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Historico" component={PageHistorico}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="clock" size={focused ? 32 : 24} color={focused ? COLORS.green : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Meu Perfil" component={MeuPerfilStack}
                    options={{
                        tabBarLabel: () => null,
                        tabBarIcon: ({ focused, size }) => (
                            <Feather name="user" size={focused ? 32 : 24} color={focused ? COLORS.green : 'black'} />
                        )
                    }} />
                <Tab.Screen name="Notificacoes" component={PageNotificacoes}
                    options={{
                        tabBarButton: () => null,
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}