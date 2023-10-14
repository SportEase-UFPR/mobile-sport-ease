import React from 'react';
import { Center, Box, Stack, AspectRatio, Image, Heading, Text, Button, IconButton, CheckIcon, CloseIcon, ScrollView } from 'native-base';

export default function PageHomeScreen() {
    return (
        <ScrollView>

            <Box mt={25} mb={25} paddingX={5}>
                <Heading borderColor={'green.500'} borderLeftWidth={30} color="green.500" fontSize={'4xl'} marginBottom={10} paddingLeft={'12'}>
                    Suas reservas em andamento
                </Heading>
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
                            <Button size='lg' borderRadius='2xl' minW='3/5' backgroundColor={'success.500'} leftIcon={<CheckIcon />}>Confirmar uso</Button>
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
                            <Button size='lg' borderRadius='2xl' minW='3/5' backgroundColor={'red.500'} leftIcon={<CloseIcon />}>Cancelar reserva</Button>
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
                            <Button size='lg' borderRadius='2xl' minW='3/5' backgroundColor={'red.500'} leftIcon={<CloseIcon />}>Cancelar reserva</Button>
                        </Center>
                    </Stack>
                </Box>
            </Box>
        </ScrollView>



    )
}
