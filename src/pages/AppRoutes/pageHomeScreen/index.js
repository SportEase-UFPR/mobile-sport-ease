import React, { useEffect, useState, useCallback  } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Center, Box, Stack, VStack, Heading, Text, Button, Skeleton, CheckIcon, CloseIcon, ScrollView, Flex } from 'native-base';
import { getSolicitacoesEmAndamento } from '../../../api/LocacaoService';


export default function PageHomeScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [informacoesEspacos, setInformacoesEspacos] = useState([]);
    const [cardData, setCardData] = useState(['']);

    const carregarReservas = async () => {
        const result = await getSolicitacoesEmAndamento();
        if (result) {
            setCardData(result);
            setIsLoading(false);
        } else {
            setCardData(['']);
        }
    }

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            carregarReservas();
        }, [])
    );


    return (
        <ScrollView>
            <Box mt={25} mb={25} paddingX={5}>
                <Heading borderColor={'green.500'} borderLeftWidth={20} color="green.500" fontSize={'3xl'} marginBottom={10} paddingLeft={'30px'}>
                    Suas reservas em andamento
                </Heading>

                {cardData.map((card, index) => (
                    <Box key={index} mb='5' rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" borderRadius={'21'}
                        _dark={{
                            borderColor: "coolGray.600",
                            backgroundColor: "gray.700"
                        }} _web={{
                            shadow: 2,
                            borderWidth: 0
                        }} _light={{
                            backgroundColor: "gray.50"
                        }}>
                        {isLoading ? (
                            // Renderize o Skeleton se estiver carregando
                            <VStack space={8} overflow="hidden" rounded="20">
                                <Skeleton.Text py="6" px="4" />
                                <Center>
                                    <Skeleton mb="3" w="90%" rounded="20" startColor={'green.100'} />
                                </Center>
                            </VStack>
                        ) : (
                            <Stack p="4" space={3}>
                                <Stack space={2}>
                                    <Heading size="md" ml="-1">

                                        {card.id}
                                    </Heading>
                                </Stack>
                                <Text fontWeight="semibold">
                                    Período: {card.periodo}
                                </Text>
                                <Text fontWeight="semibold">
                                    Espaço esportivo: {card.espaco}
                                </Text>
                                <Text fontWeight="semibold">
                                    Quantidade de participantes: {card.participantes}
                                </Text>
                                <Flex direction="row" justifyContent="space-between">
                                    <Button size='lg' borderRadius='2xl' width="150px" backgroundColor={'success.500'} leftIcon={<CheckIcon />}>Confirmar uso</Button>
                                    <Button size='lg' borderRadius='2xl' width="150px" backgroundColor={'danger.500'} leftIcon={<CloseIcon />}>Cancelar uso</Button>
                                </Flex>
                            </Stack>
                        )}
                    </Box>
                ))}
            </Box>
        </ScrollView >
    )
}
