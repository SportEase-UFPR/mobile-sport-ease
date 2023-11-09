import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { FlatList, Text, Heading, Box, HStack, VStack, Spacer } from 'native-base';
import { getNotificacoes } from '../../../api/ClienteService';

export default function PageNotificacoes() {
    const [notificacoes, setNotificacoes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true)
        const carregarNotificacoes = async () => {
            const response = await getNotificacoes();
            if (response) {
                setNotificacoes(response);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }
        carregarNotificacoes();
    }, [])

    return (
        <View>
            <Heading fontSize="xl" p="4" pb="3">
                Notificações
            </Heading>
            <FlatList data={notificacoes} renderItem={({
                item
            }) => <Box borderBottomWidth="1" _dark={{
                borderColor: "muted.50"
            }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                    <HStack space={[2, 3]} justifyContent="space-between">
                        <VStack>
                            <Text _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800" bold>
                                {item.titulo}
                            </Text>
                            <Text color="coolGray.600" _dark={{
                                color: "warmGray.200"
                            }}>
                                {item.conteudo}
                            </Text>
                        </VStack>
                        <Spacer />
                        <Text fontSize="xs" _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800" alignSelf="flex-start">
                            {item.timeStamp}
                        </Text>
                    </HStack>
                </Box>} keyExtractor={item => item.id} />
        </View >
    );
}
