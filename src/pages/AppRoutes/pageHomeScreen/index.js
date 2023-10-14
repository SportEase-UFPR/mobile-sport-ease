import React, { useEffect, useState } from 'react';
import { Center, Box, Stack, VStack, Heading, Text, Button, Skeleton, CheckIcon, CloseIcon, ScrollView, HStack } from 'native-base';




export default function PageHomeScreen() {
    const [isLoading, setIsLoading] = useState(true);

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    useEffect(() => {
        const loadData = async () => {
            await sleep(1000);
            setIsLoading(false);
        }

        loadData();
    }, []);

    const cardData = [
        { title: 'Pedido reserva (1)', periodo: 'Hoje', espaco: 'Campo 1', participantes: 10 },
        { title: 'Pedido reserva (2)', periodo: 'Amanhã', espaco: 'Campo 2', participantes: 15 },
    ];

    return (
        <ScrollView>
            <Box mt={25} mb={25} paddingX={5}>
                <Heading borderColor={'green.500'} borderLeftWidth={30} color="green.500" fontSize={'4xl'} marginBottom={10} paddingLeft={'12'}>
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
                                        {card.title}
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
                                <Center>
                                    <Button size='lg' borderRadius='2xl' minW='full' backgroundColor={'success.500'} leftIcon={<CheckIcon />}>Confirmar uso</Button>
                                </Center>
                            </Stack>
                        )}
                    </Box>
                ))}


                {/* <VStack borderWidth="1" space={8} overflow="hidden" rounded="20" _dark={{
                    borderColor: "coolGray.500"
                }} _light={{
                    borderColor: "coolGray.200"
                }}>
                    <Skeleton.Text py="6" px="4" />
                    <Center>
                        <Skeleton mb="3" w="90%" rounded="20" startColor={'green.100'} />
                    </Center>
                </VStack>

                <Box mb='5' rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" borderRadius={'2xl'}
                    _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700"
                    }} _web={{
                        shadow: 2,
                        borderWidth: 0
                    }} _light={{
                        backgroundColor: "gray.50"
                    }}>


                    <Stack p="4" space={3}>
                        <Stack space={2}>
                            <Heading size="md" ml="-1">
                                Pedido reserva (NUM)
                            </Heading>
                        </Stack>
                        <Text fontWeight="semibold">
                            Período:
                        </Text>
                        <Text fontWeight="semibold">
                            Espaço esportivo:
                        </Text>
                        <Text fontWeight="semibold">
                            Quantidade de participantes:
                        </Text>
                        <Center>
                            <Button size='lg' borderRadius='2xl' minW='full' backgroundColor={'success.500'} leftIcon={<CheckIcon />}>Confirmar uso</Button>
                        </Center>
                    </Stack>
                </Box>

                <Box mb='5' rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" borderRadius={'2xl'}
                    _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700"
                    }} _web={{
                        shadow: 2,
                        borderWidth: 0
                    }} _light={{
                        backgroundColor: "gray.50"
                    }}>
                    <Stack p="4" space={3}>
                        <Stack space={2}>
                            <Heading size="md" ml="-1">
                                Pedido reserva (NUM)
                            </Heading>
                        </Stack>
                        <Text fontWeight="semibold">
                            Período:
                        </Text>
                        <Text fontWeight="semibold">
                            Espaço esportivo:
                        </Text>
                        <Text fontWeight="semibold">
                            Quantidade de participantes:
                        </Text>
                        <Center>
                            <Button size='lg' borderRadius='2xl' minW='full' backgroundColor={'red.500'} leftIcon={<CloseIcon />}>Cancelar reserva</Button>
                        </Center>
                    </Stack>
                </Box>
                <Box mb='5' rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" borderRadius={'2xl'}
                    _dark={{
                        borderColor: "coolGray.600",
                        backgroundColor: "gray.700"
                    }} _web={{
                        shadow: 2,
                        borderWidth: 0
                    }} _light={{
                        backgroundColor: "gray.50"
                    }}>
                    <Stack p="4" space={3}>
                        <Stack space={2}>
                            <Heading size="md" ml="-1">
                                Pedido reserva (NUM)
                            </Heading>
                        </Stack>
                        <Text fontWeight="semibold">
                            Período:
                        </Text>
                        <Text fontWeight="semibold">
                            Espaço esportivo:
                        </Text>
                        <Text fontWeight="semibold">
                            Quantidade de participantes:
                        </Text>
                        <Center>
                            <Button size='lg' borderRadius='2xl' minW='full' backgroundColor={'red.500'} leftIcon={<CloseIcon />}>Cancelar reserva</Button>
                        </Center>
                    </Stack>
                </Box> */}
            </Box>
        </ScrollView >



    )
}
