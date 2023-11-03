import React, { useEffect, useState } from 'react';
import { Center, Box, Stack, VStack, Heading, Text, Button, Skeleton, CheckIcon, CloseIcon, ScrollView, Badge, Flex, HStack, Select, FormControl } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function PageHistorico() {
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [status, setStatus] = useState(null);
    const [local, setLocal] = useState(null);

    const statusOptions = ["Finalizado", "Cancelado", "Locação Ativa", "Todos"];
    const localOptions = ["Campo de Futebol Oficial"];

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
        { data: '12/11/2023', horaInicio: '12:00', horaFim: '15:00', espaco: 'Campo de Futebol', participantes: 32, status: 'ATIVO' },
    ];

    return (
        <ScrollView>
            <Box mt={25} mb={25} paddingX={5}>
                <Heading borderColor={'green.500'} borderLeftWidth={20} color="green.500" fontSize={'3xl'} marginBottom={10} paddingLeft={'30px'}>
                    Histórico de solicitações
                </Heading>
                <Box marginBottom={30}>
                    <Text> Filtros...</Text>
                    <VStack space={4} direction={{ base: 'column', md: 'row' }}>
                        {/* <VStack space={2} flex={1}>
                            <Button onPress={() => setShowStartPicker(true)}>Data inicial: {startDate.toLocaleDateString()}</Button>
                            {showStartPicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    onChange={(event, selectedDate) => {
                                        setShowStartPicker(false);
                                        setStartDate(selectedDate || startDate);
                                    }}
                                />
                            )}

                            <Button onPress={() => setShowEndPicker(true)}>Data final: {endDate.toLocaleDateString()}</Button>
                            {showEndPicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    onChange={(event, selectedDate) => {
                                        setShowEndPicker(false);
                                        setEndDate(selectedDate || endDate);
                                    }}
                                />
                            )}
                        </VStack> */}

                        <HStack space={2} alignItems="center" flex={1}>
                            <FormControl minWidth="1/3" flex={1}>
                                <FormControl.Label>Status</FormControl.Label>
                                <Select
                                    isReadOnly
                                    selectedValue={status}
                                    accessibilityLabel="Selecione o status"
                                    placeholder="Todos"
                                    onValueChange={(itemValue) => setStatus(itemValue)}
                                >
                                    {statusOptions.map((option) => (
                                        <Select.Item key={option} label={option} value={option} />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl minWidth="1/3" flex={1}>
                                <FormControl.Label>Local</FormControl.Label>
                                <Select
                                    isReadOnly
                                    selectedValue={local}
                                    accessibilityLabel="Selecione o local"
                                    placeholder="Todos"
                                    onValueChange={(itemValue) => setLocal(itemValue)}
                                >
                                    {localOptions.map((option) => (
                                        <Select.Item key={option} label={option} value={option} />
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>
                    </VStack>
                </Box>

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
                                <Badge colorScheme="success" maxW="1/2" _text={{ fontSize: 20, fontWeight: 400 }} rounded="50">
                                    Locação Ativa
                                </Badge>
                                <Stack space={2}>
                                    <Heading size="md" ml="-1">
                                        {card.espaco}
                                    </Heading>
                                </Stack>
                                <Text fontWeight="semibold">
                                    Data e hora: {card.data} - {card.horaInicio} às {card.horaFim}
                                </Text>
                                <Text fontWeight="semibold">
                                    Local: {card.espaco}
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
