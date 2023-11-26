import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import {
  View,
  Center,
  Box,
  Stack,
  VStack,
  Heading,
  Text,
  Button,
  Skeleton,
  Divider,
  ScrollView,
  Flex,
  Badge,
  Image,
  WarningOutlineIcon,
  ArrowForwardIcon,
  Input,
  SearchIcon,
  NativeBaseProvider,
  Actionsheet,
  useDisclose,
  Spinner
} from "native-base";
import LocacaoService from "../../../api/LocacaoService";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import temaGeralFormulario from "./nativeBaseTheme";
import COLORS from "../../../colors/colors";
import { AirbnbRating } from "react-native-elements";
import EspacoEsportivoService from "../../../api/EspacoEsportivoService";
import moment from "moment";

export default function PageLocaisEsportivos({ navigation }) {
  const [espacosEsportivos, setEspacosEsportivos] = useState(["local"]);
  const [espacosEsportivosFiltrado, setEspacosEsportivosFiltrado] =
    useState(espacosEsportivos);
  const [isLoading, setIsLoading] = useState(true);
  const [isComentariosLoading, setIsComentariosLoading] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclose();

  const handleFiltroLocais = (text) => {
    const filtrados = espacosEsportivos.filter((espaco) => {
      if (espaco.nome.toLowerCase().includes(text.toLowerCase())) return true;
      return espaco.listaEsportes.some((esporte) =>
        esporte.nome.toLowerCase().includes(text.toLowerCase())
      );
    });
    setEspacosEsportivosFiltrado(filtrados);
  };

  const carregarEspacosEsportivos = () => {
    setIsLoading(true);
    LocacaoService.getEspacosEsportivos()
      .then((result) => {
        setEspacosEsportivos(result);
        setEspacosEsportivosFiltrado(result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const carregarComentarios = async (idEspaco) => {
    setIsComentariosLoading(true);
    try {
      const response = await EspacoEsportivoService.getComentarios(idEspaco);
      if (response) {
        response.sort((a, b) => {
          const dateA = new Date(a.dataHoraComentario);
          const dateB = new Date(b.dataHoraComentario);
          return dateB - dateA;
        });
        setComentarios(response);
      } else {
        setComentarios([]);
      }
    } catch (error) {
      setComentarios([]);
    }
    setIsComentariosLoading(false);
  };

  function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }


  useEffect(() => {
    carregarEspacosEsportivos();
  }, []);

  return (
    <NativeBaseProvider theme={temaGeralFormulario}>
      <ScrollView>
        <Box mt={25} paddingX={5}>
          <Heading
            borderColor={COLORS.green}
            borderLeftWidth={20}
            color={COLORS.green}
            fontSize={"3xl"}
            marginBottom={10}
            paddingLeft={"30px"}
            noOfLines={2}
          >
            Conheça os espaços esportivos da UFPR
          </Heading>
        </Box>
        <Box paddingX={"20px"}>
          <Heading fontSize="lg" color={COLORS.green}>
            Pesquise um espaço:
          </Heading>
          <Input
            placeholder="Nome ou esporte..."
            InputRightElement={<SearchIcon mr="3" size="lg" />}
            onChangeText={(text) => handleFiltroLocais(text)}
          />
          <Divider mb="5" mt="5"></Divider>
        </Box>
        {espacosEsportivosFiltrado.map((card, index) => (
          <Box
            key={index}
            mb="5"
            mx="5"
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            borderRadius={"21"}
            _dark={{
              borderColor: "coolGray.600",
              backgroundColor: "gray.700",
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
            _light={{
              backgroundColor: "gray.50",
            }}
          >
            {isLoading ? (
              // Renderize o Skeleton se estiver carregando
              <VStack space={8} overflow="hidden" rounded="20">
                <Skeleton.Text py="6" px="4" />
                <Center>
                  <Skeleton
                    mb="3"
                    w="90%"
                    rounded="20"
                    startColor={"green.200"}
                  />
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
                <Pressable onPress={() => {
                  carregarComentarios(card.id);
                  onOpen();
                }}>
                  <Heading size="xl">{card.nome}</Heading>
                  <View ml={-1} mb={3} style={{ alignItems: 'flex-start' }}>
                    {card.mediaAvaliacoes > 0 ? (
                      <>
                        <AirbnbRating
                          defaultRating={card.mediaAvaliacoes}
                          size={20}
                          isDisabled
                          showRating={false}
                          starContainerStyle={{ justifyContent: 'flex-start' }}
                        />
                        <Flex ml='1' flexDirection={'row'} alignItems={'center'}>
                          <Feather name="message-square" size={13} color="black" />
                          <Text fontSize={'xs'} fontStyle={'italic'} ml={'1'}>
                            Acessar avaliações...
                          </Text>
                        </Flex>
                      </>
                    ) : (
                      <Text ml='1' color={'gray.500'}>Sem avaliações...</Text>
                    )}

                  </View>
                </Pressable>
                <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                  <Actionsheet.Content borderTopRadius="0">
                    <Box w="100%" h={60} px={4} justifyContent="center">
                      <Text fontSize="16" color="gray.500" _dark={{ color: "gray.300" }}>
                        Avaliações do local esportivo:
                      </Text>
                    </Box>
                    {isComentariosLoading ? (
                      <Center>
                        <Spinner color="emerald.500" />
                      </Center>
                    ) : (
                      <ScrollView width={"full"}>
                        {comentarios.filter(comentario => comentario.avaliacao).length > 0 ? (
                          comentarios.filter(comentario => comentario.avaliacao)
                            .map((comentario, index) => (
                              <Actionsheet.Item key={index} borderBottomColor={'gray.200'} borderBottomWidth={1}>
                                <View style={{ alignItems: 'flex-start' }} >
                                  <Heading size="sm" ml="1">{comentario.nomeCliente.split(" ")[0].toUpperCase()}</Heading>
                                  <AirbnbRating
                                    defaultRating={comentario.avaliacao}
                                    size={19}
                                    isDisabled
                                    showRating={false}
                                    starContainerStyle={{ justifyContent: 'flex-start' }}
                                  />
                                  {comentario.comentario ? <Text ml="1" italic>"{comentario.comentario}"</Text> : null}
                                  <Text ml="1" mt='1' fontSize={'xs'} color={'gray.500'}>{moment(comentario.dataHoraComentario).format('DD/MM/YYYY')}</Text>
                                </View>
                              </Actionsheet.Item>
                            ))
                        ) : (
                          <Actionsheet.Item isDisabled>
                            <Center>
                              <Text>Não há comentários para este local.</Text>
                            </Center>
                          </Actionsheet.Item>
                        )}
                      </ScrollView>
                    )}
                  </Actionsheet.Content>
                </Actionsheet>
                <Flex direction="row" align="center">
                  <Feather name="map-pin" size={15} color="black" />
                  <Text ml="1" fontSize="md">
                    {card.localidade}
                  </Text>
                </Flex>
                <Flex direction="row" align="center">
                  <Feather name="maximize-2" size={15} color="black" />
                  <Text ml="1" fontSize="md">
                    {card.dimensoes}
                  </Text>
                </Flex>
                <Flex direction="row" align="center">
                  <Feather name="users" size={15} color="black" />
                  <Text ml="1" fontSize="md">
                    Capacidade entre {card.capacidadeMin} a {card.capacidadeMax} pessoa(s)
                  </Text>
                </Flex>
                <Box my="5">
                  <Text fontSize="lg" fontWeight="semibold">
                    Descrição do espaço:
                  </Text>
                  <Text fontSize="md">{card.descricao}</Text>
                  <Text fontSize="md">Tipo do piso: {card.piso}</Text>
                </Box>
                <Text fontSize="lg" fontWeight="semibold" mb="1">
                  Tipos de esporte:
                </Text>
                <Flex direction="row" wrap="wrap">
                  {card.listaEsportes.map((esporte, index) => (
                    <Badge
                      key={index}
                      _text={{ fontSize: 15, fontWeight: 400 }}
                      py="1.5"
                      mr="2"
                      mb="2"
                      maxW="1/2"
                      colorScheme="success"
                      variant={"subtle"}
                      rounded="50"
                    >
                      <Text>{toTitleCase(esporte.nome)}</Text>
                    </Badge>
                  ))}
                </Flex>
                <Flex direction="row-reverse">
                  <Button
                    mt={"5"}
                    isDisabled={!card.disponivel}
                    size="lg"
                    borderRadius="2xl"
                    width="180px"
                    backgroundColor={
                      card.disponivel ? "success.500" : "danger.500"
                    }
                    leftIcon={
                      card.disponivel ? (
                        <ArrowForwardIcon />
                      ) : (
                        <WarningOutlineIcon />
                      )
                    }
                    onPress={() => navigation.navigate("Nova Reserva", {idEspacoPadrao: card.id})}
                  >
                    {card.disponivel ? "Solicitar reserva" : "Indisponível"}
                  </Button>
                </Flex>
              </Stack>
            )}
          </Box>
        ))}
      </ScrollView>
    </NativeBaseProvider>
  );
}
