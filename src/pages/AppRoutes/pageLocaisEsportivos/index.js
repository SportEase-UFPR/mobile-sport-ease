import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Center, Box, Stack, VStack, Heading, Text, Button, Skeleton, Divider, ScrollView, Flex, Badge, Image, WarningOutlineIcon, ArrowForwardIcon, Input, Icon, SearchIcon, NativeBaseProvider } from 'native-base';
import LocacaoService from '../../../api/LocacaoService';
import { Feather } from '@expo/vector-icons';
import temaGeralFormulario from './nativeBaseTheme';


export default function PageLocaisEsportivos({ navigation }) {
    const [espacosEsportivos, setEspacosEsportivos] = useState(['local']);
    const [espacosEsportivosFiltrado, setEspacosEsportivosFiltrado] = useState(espacosEsportivos);
    const [isLoading, setIsLoading] = useState(true);

    const handleFiltroLocais = (text) => {
        const filtrados = espacosEsportivos.filter(espaco => {
            // Verifica se o nome do espaço esportivo corresponde
            if (espaco.nome.toLowerCase().includes(text.toLowerCase())) return true;

            // Verifica se algum esporte dentro da lista de esportes corresponde
            return espaco.listaEsportes.some(esporte => esporte.nome.toLowerCase().includes(text.toLowerCase()));
        });
        setEspacosEsportivosFiltrado(filtrados);
    };

    const carregarEspacosEsportivos = () => {
        setIsLoading(true);

        LocacaoService.getEspacosEsportivos()
            .then(result => {
                setEspacosEsportivos(result);
                setEspacosEsportivosFiltrado(result);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar espaços esportivos:", error);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        carregarEspacosEsportivos()
    }, [])


    return (
        <NativeBaseProvider theme={temaGeralFormulario}>
            <ScrollView>
                <Box mt={25} paddingX={5}>
                    <Heading borderColor={'green.500'} borderLeftWidth={20} color={'green.500'} fontSize={'3xl'} marginBottom={10} paddingLeft={'30px'} noOfLines={2}>
                        Conheça os espaços esportivos da UFPR
                    </Heading>
                </Box>
                <Box  paddingX={'20px'}>
                    <Heading fontSize="lg" color={'green.900'}>
                        Pesquise um espaço:
                    </Heading>
                    <Input
                        placeholder="Nome ou esporte..."
                        InputRightElement={<SearchIcon mr="3" size="lg" />}
                        onChangeText={text => handleFiltroLocais(text)}
                    />
                    <Divider mb="5" mt="5"></Divider>
                </Box>
                {espacosEsportivosFiltrado.map((card, index) => (
                    <Box key={index} mb='5' mx='5' rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" borderRadius={'21'}
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
                            <Stack p="4">
                                <Image
                                    source={{ uri: `data:image/png;base64,${card.imagemBase64}` }}
                                    alt="Imagem do espaço esportivo"
                                    size="xl"
                                    width="100%"
                                    height="200"
                                    borderRadius="xl"
                                    mb={3}
                                />
                                <Heading size="xl">
                                    {card.nome}
                                </Heading>
                                <Flex direction="row" align="center">
                                    <Feather name="map-pin" size={15} color='black' />
                                    <Text ml='1' fontSize="md">
                                        {card.localidade}
                                    </Text>
                                </Flex>
                                <Flex direction="row" align="center">
                                    <Feather name="maximize-2" size={15} color='black' />
                                    <Text ml='1' fontSize="md">
                                        {card.dimensoes}
                                    </Text>
                                </Flex>
                                <Flex direction="row" align="center">
                                    <Feather name="users" size={15} color='black' />
                                    <Text ml='1' fontSize="md">
                                        Capacidade para {card.capacidade} pessoa(s)
                                    </Text>
                                </Flex>
                                <Box my="5">
                                    <Text fontSize="lg" fontWeight="semibold">
                                        Descrição do espaço:
                                    </Text>
                                    <Text fontSize="md">
                                        {card.descricao}
                                    </Text>
                                    <Text fontSize="md">
                                        Tipo do piso: {card.piso}
                                    </Text>
                                </Box>
                                <Text fontSize="lg" fontWeight="semibold" mb="1">
                                    Tipos de esporte:
                                </Text>
                                <Flex direction="row" wrap="wrap">
                                    {card.listaEsportes.map((esporte, index) => (
                                        <Badge key={index} _text={{ fontSize: 15, fontWeight: 400 }} py="1.5" mr="2" mb="2" maxW="1/2" colorScheme="success" variant={'subtle'} rounded="50">
                                            {esporte.nome}
                                        </Badge>
                                    ))}
                                </Flex>
                                <Flex direction="row-reverse" >
                                    <Button
                                        mt={'5'}
                                        isDisabled={!card.disponivel}
                                        size='lg'
                                        borderRadius='2xl'
                                        width="180px"
                                        backgroundColor={card.disponivel ? 'success.500' : 'danger.500'}
                                        leftIcon={card.disponivel ? <ArrowForwardIcon /> : <WarningOutlineIcon />}
                                        onPress={() => navigation.navigate('Nova Reserva')}
                                    >
                                        {card.disponivel ? 'Reservar local' : 'Indisponível'}
                                    </Button>
                                </Flex>
                            </Stack>
                        )}
                    </Box>
                ))}
            </ScrollView>
        </NativeBaseProvider>
    )
}