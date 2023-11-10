import React, { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { ActivityIndicator, Text as RNText } from 'react-native';
import { View, FlatList, Text, Heading, Box, HStack, VStack, Spacer, Badge } from 'native-base';
import { useNotifications } from '../../../contexts/NotificationContext'; // Ajuste para importar o hook de contexto
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { readNotifications } from '../../../api/ClienteService';

function NotificationItem({ item }) {
    return (
        <Box
            borderWidth="2"
            borderColor={item.lida ? "coolGray.400" : "yellow.600"}
            borderRadius={'lg'}
            py="2"
            px="4"
            mb="3">
            <HStack
                justifyContent="space-between"
                alignItems="center"
            >
                <VStack flex={1}>
                    <Text
                        fontSize={'lg'}
                        color={item.lida ? "coolGray.600" : "yellow.600"}
                        bold>
                        {item.titulo}
                    </Text>
                    <Text color={item.lida ? "coolGray.600" : "yellow.600"}>
                        {item.conteudo}
                    </Text>
                </VStack>
                {!item.lida && (
                    <View style={{
                        width: 15,
                        height: 15,
                    }}
                        bgColor={"yellow.600"}
                        borderRadius={'full'}
                    />
                )}
            </HStack>
        </Box>
    );
}

export default function PageNotificacoes() {
    const { notifications, newNotifications, markNotificationsAsRead } = useNotifications();

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                if (notifications.some(notificacao => !notificacao.lida)) {
                    readNotifications().then(() => {
                        markNotificationsAsRead();
                    }).catch(error => {
                        console.log("Um erro ocorreu ao ler as notificações");
                    });
                }
            };
        }, [notifications])
    );

    if (newNotifications === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (notifications.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <RNText>Não há novas notificações.</RNText>
            </View>
        );
    }

    return (
        <View mx={'4'} mt={'5'}>
            <Heading fontSize="4xl" pb="3" textAlign={'right'}>
                <MaterialCommunityIcons name="message-text" size={30} color="black" /> Notificações
            </Heading>
            <Spacer> </Spacer>
            <FlatList
                data={notifications}
                renderItem={({ item }) => <NotificationItem item={item} />}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}
