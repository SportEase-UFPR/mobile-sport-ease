import React, { useCallback, useEffect, useState } from "react";
import {
  Center,
  Box,
  Stack,
  VStack,
  Heading,
  Text,
  Button,
  Skeleton,
  CheckIcon,
  CloseIcon,
  ScrollView,
  Badge,
  Flex,
  HStack,
  Select,
  FormControl,
  InfoOutlineIcon,
  Modal,
  NativeBaseProvider,
  Spacer,
  Input, Divider, DeleteIcon,
  Alert,
  useToast,
  AlertDialog,
  TextArea,
} from "native-base";
import { AntDesign } from '@expo/vector-icons';
import temaGeralFormulario from "./nativeBaseTheme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { avaliarLocacao, cancelarUsoLocacao, confirmarUsoLocacao, getAllSolicitacoes } from "../../../api/LocacaoService";
import { useFocusEffect } from "@react-navigation/native";
import COLORS from "../../../colors/colors";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import { AirbnbRating } from "react-native-elements";
const ToastDetails = [
  {
    title: "Reserva cancelada",
    variant: "solid",
    description: "Solicitação cancelada com sucesso.",
    isClosable: true
  },
  {
    title: "Uso confirmado",
    variant: "solid",
    description: "Uso confirmado com sucesso.",
    isClosable: true
  },
]

export default function PageHistorico() {
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cardData, setCardData] = useState([""]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [status, setStatus] = useState(null);
  const [local, setLocal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalDados, setModalDados] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [espacoOptions, setEspacoOptions] = useState([]);
  const cancelRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const [legendaStatus] = useState({
    'CANCELADA': 'error.500',
    'NEGADA': 'error.500',
    'FINALIZADA': 'emerald.500',
    'ENCERRADA': 'gray.500',
    'SOLICITADA': 'yellow.500',
    'APROVADA': 'green.500'
  });
  const toast = useToast();
  const ToastDetails = [
    {
      title: "Reserva cancelada",
      variant: "solid",
      description: "Solicitação cancelada com sucesso.",
      isClosable: true
    },
    {
      title: "Uso confirmado",
      variant: "solid",
      description: "Uso confirmado com sucesso.",
      isClosable: true
    },
    {
      title: "Avaliação enviada!",
      variant: "solid",
      description: "Obrigado por avaliar o local!",
      isClosable: true
    },
  ]
  const [idReservaAvaliacao, setIdReservaAvaliacao] = useState();
  const [ratingReservaAvaliacao, setRatingReservaAvaliacao] = useState(5);
  const [comentarioReservaAvaliacao, setComentarioReservaAvaliacao] = useState();

  const reservasFiltradas = cardData
    .filter((card) => {
      const filtroStatus = !status || card.status === status;
      const filtroLocal = !local || card.nomeEspacoEsportivo === local;
      const filtroDataInicio = !startDate || moment(card.dataHoraInicioReserva).isSameOrAfter(moment(startDate, 'DD/MM/YYYY'), 'day');
      const filtroDataFim = !endDate || moment(card.dataHoraFimReserva).isSameOrBefore(moment(endDate, 'DD/MM/YYYY'), 'day');
      return filtroStatus && filtroLocal && filtroDataInicio && filtroDataFim;
    })
    .sort((a, b) => {
      const dataA = moment(a.dataHoraInicioReserva);
      const dataB = moment(b.dataHoraInicioReserva);
      return dataA.diff(dataB)
    });

  const limparFiltros = () => {
    setStartDate('');
    setEndDate('');
    setStatus('');
    setLocal('');
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const onChangeStartDate = useCallback((event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = moment(selectedDate, 'DD/MM/YYYY');
      setStartDate(formattedDate);
    } else {
      setStartDate('');
    }
  }, []);

  const onChangeEndDate = useCallback((event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = moment(selectedDate, 'DD/MM/YYYY');
      setEndDate(formattedDate);
    } else {
      setEndDate('');
    }
  }, []);

  const showConfirmacaoReserva = (horario) => {
    if (moment().diff(moment(horario), "minutes") >= 5) {
      return true;
    }

    return false;
  };

  const showCancelarReserva = (horario) => {
    if (moment(horario).diff(moment(), "minutes") >= 15) {
      return true;
    }

    return false;
  };

  const showAvaliarReserva = (avaliacao) => {
    if (!avaliacao) {
      return true;
    }
    return false;
  };

  const carregarReservas = async () => {
    const result = await getAllSolicitacoes();
    if (result) {
      setCardData(result);
      setIsLoading(false);

      const statusUnicos = [...new Set(result.map(item => item.status))];
      const espacosUnicos = [...new Set(result.map(item => item.nomeEspacoEsportivo))];

      setStatusOptions(statusUnicos);
      setEspacoOptions(espacosUnicos);
    } else {
      setCardData([""]);
    }
  };

  const abrirModalDetalhes = (dados) => {
    setModalDados(dados);
    setShowModal(true);
  };

  const handleCancelarUso = async (idLocacao) => {
    try {
      const result = await cancelarUsoLocacao(idLocacao);
      const toastConfig = ToastDetails[0];
      toast.show(toastConfig);

      // Atualizar a lista removendo o item cancelado
      const updatedCardData = cardData.filter(card => card.id !== idLocacao);
      setCardData(updatedCardData);

    } catch (error) {
      Alert.alert(
        "Erro",
        `Não foi possível seguir com o cancelamento da locação. ${error.message}`
      )
    }
  }

  const handleConfirmarUso = async (idLocacao) => {
    try {
      const result = await confirmarUsoLocacao(idLocacao)
      const toastConfig = ToastDetails[1];
      toast.show(toastConfig);

      // Atualizar a lista removendo o item confirmado
      const updatedCardData = cardData.filter(card => card.id !== idLocacao);
      setCardData(updatedCardData);
    } catch (error) {
      Alert.alert(
        "Erro",
        `Não foi possível seguir com a confirmação de uso da locação. ${error.message}`
      )
    }
  }

  const handleAvaliarReserva = async (idLocacao, avaliacao, comentario) => {
    let requestData = {
      avaliacao: avaliacao,
      comentario: comentario
    }
    try {
      const result = await avaliarLocacao(idLocacao, requestData)
      const toastConfig = ToastDetails[2];
      toast.show(toastConfig);

    } catch (error) {
      Alert.alert(
        "Erro",
        `Não foi possível seguir com a avaliação do local. ${error.message}`
      )
    }
  }

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      carregarReservas();
    }, [])
  );

  return (
    <NativeBaseProvider theme={temaGeralFormulario}>
      {/* Modal de avaliação de reserva */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="xl">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Avalie a sua reserva!</Modal.Header>
          <Modal.Body>
            <AirbnbRating
              defaultRating={5}
              size={30}
              showRating={false}
              onFinishRating={(number) => {
                setRatingReservaAvaliacao(number)
              }}
            />
            <FormControl mt="3">
              <FormControl.Label>Nos conte o que você achou sobre o local!</FormControl.Label>
              <TextArea placeholder="Inclua aqui o seu comentário..." onChangeText={(text) => {
                setComentarioReservaAvaliacao(text)
              }} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button flex="1" colorScheme={"info"} onPress={() => {
              setModalVisible(false);
              handleAvaliarReserva(idReservaAvaliacao, ratingReservaAvaliacao, comentarioReservaAvaliacao);
            }}>
              Enviar avaliação
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <ScrollView>
        <Box mt={25} mb={25} paddingX={5}>
          <Heading
            borderColor={COLORS.green}
            borderLeftWidth={20}
            color={COLORS.green}
            fontSize={"3xl"}
            marginBottom={10}
            paddingLeft={"30px"}
          >
            Histórico de solicitações
          </Heading>
          <Box>
            <VStack space={4} direction={{ base: "column", md: "row" }}>
              <HStack space={2} alignItems="center" flex={1}>
                {/* Filtro de Data Início */}
                <FormControl minWidth="1/3" flex={1}>
                  <FormControl.Label>Data Início</FormControl.Label>
                  <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                    <Input
                      isReadOnly
                      placeholder="Data início..."
                      value={startDate ? moment(startDate).format('DD/MM/YYYY') : ''}
                    />
                  </TouchableOpacity>
                </FormControl>

                {/* Filtro de Data Fim */}
                <FormControl minWidth="1/3" flex={1}>
                  <FormControl.Label>Data Fim</FormControl.Label>
                  <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                    <Input
                      isReadOnly
                      placeholder="Data fim..."
                      value={endDate ? moment(endDate).format('DD/MM/YYYY') : ''}
                    />
                  </TouchableOpacity>
                </FormControl>
              </HStack>
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
                    variant="filled"
                    isReadOnly
                    selectedValue={local}
                    accessibilityLabel="Selecione o local"
                    placeholder="Todos"
                    onValueChange={(itemValue) => setLocal(itemValue)}
                  >
                    {espacoOptions.map((option) => (
                      <Select.Item key={option} label={option} value={option} />
                    ))}
                  </Select>
                </FormControl>
              </HStack>
              <Button
                alignSelf={'flex-end'}
                maxWidth={'2/3'}
                leftIcon={<DeleteIcon></DeleteIcon>}
                rounded={'full'}
                size="sm"
                variant="subtle"
                colorScheme="secondary"
                onPress={limparFiltros}
                px={'5'}>
                Limpar Filtros
              </Button>
            </VStack>
          </Box>
          <Divider mb="5" mt="5"></Divider>

          {/* Modais de datepicker */}
          {showStartPicker && (
            <DateTimePicker
              value={startDate ? moment(startDate, 'YYYY-MM-DD').toDate() : new Date()}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endDate ? moment(endDate, 'YYYY-MM-DD').toDate() : new Date()}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
            />
          )}

          {/* Geração dos cards contendo o histórico de locações */}
          {isLoading ? (
            <Box
              mb="5"
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
              <VStack space={8} overflow="hidden" rounded="20">
                <Skeleton.Text py="6" px="4" />
                <Center>
                  <Skeleton
                    mb="3"
                    w="90%"
                    rounded="20"
                    startColor={"green.100"}
                  />
                </Center>
              </VStack>
            </Box>
          ) : reservasFiltradas.length > 0 ? (
            reservasFiltradas.map((card, index) => (
              <Box
                key={index}
                mb="5"
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
                <Stack p="4" space={3}>
                  <Stack
                    space={1}
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start">
                    <Box alignSelf={'flex-start'}>
                      <Heading size="lg">
                        <Text color={COLORS.darkBlueText}>
                          {card.nomeEspacoEsportivo}
                        </Text>
                      </Heading>
                      <Text mt='-1' fontSize={'lg'} fontWeight={'bold'} color={COLORS.darkBlueText}>
                        {moment(card.dataHoraInicioReserva).format("DD/MM/YYYY")}
                      </Text>
                    </Box>
                    <Spacer />
                    <Badge mt='-5' borderWidth={'2'} variant={'outline'} borderRadius={'full'} colorScheme={legendaStatus[card.status].split('.')[0]}>
                      {card.status}
                    </Badge>
                    <Button
                      size="lg"
                      mt='-5'
                      padding={'0'}
                      borderRadius='full'
                      backgroundColor='blue.500'
                      startIcon={<InfoOutlineIcon size={'xl'} />}
                      onPress={() => abrirModalDetalhes(card)}>
                    </Button>
                  </Stack>

                  <Text color={COLORS.darkBlueText}>
                    <Text fontWeight="semibold">Status da reserva: </Text>
                    {card.status?.charAt(0).toUpperCase() +
                      card.status?.slice(1).toLowerCase()}
                  </Text>

                  <Text color={COLORS.darkBlueText}>
                    <Text fontWeight="semibold">Data e hora: </Text>
                    {moment(card.dataHoraInicioReserva).format(
                      "DD/MM/YYYY - HH:mm"
                    )}{" "}
                    às {moment(card.dataHoraFimReserva).format("HH:mm")}
                  </Text>

                  <Text color={COLORS.darkBlueText}>
                    <Text fontWeight="semibold">
                      Quantidade de participantes:
                    </Text>
                    {card.qtdParticipantes}
                  </Text>

                  <Text color={COLORS.darkBlueText}>
                    <Text fontWeight="semibold">Local: </Text>
                    {card.localidade}
                  </Text>

                  <Flex
                    direction="row"
                    justifyContent={
                      "flex-end"
                      // showCancelarReserva(card.dataHoraInicioReserva) &&
                      //   showConfirmacaoReserva(card.dataHoraInicioReserva)
                      //   ? "space-between"
                      //   : "center"
                    }
                  >
                    {showConfirmacaoReserva(card.dataHoraInicioReserva) && (card.status == 'SOLICITADA' || card.status == 'APROVADA') ? (
                      <Button
                        size="lg"
                        borderRadius="full"
                        backgroundColor={'success.500'}
                        leftIcon={<CheckIcon />}
                        onPress={() => { handleConfirmarUso(card.id) }}
                      >
                        Confirmar uso
                      </Button>
                    ) : null}

                    {showCancelarReserva(card.dataHoraInicioReserva) && (card.status == 'SOLICITADA' || card.status == 'APROVADA') ? (
                      <Button
                        size="lg"
                        borderRadius="full"
                        backgroundColor={'danger.500'}
                        leftIcon={<CloseIcon />}
                        onPress={() => { handleCancelarUso(card.id) }}
                      >
                        Cancelar uso
                      </Button>
                    ) : null}

                    {showAvaliarReserva(card.comentario) &&
                      card.status == 'FINALIZADA' ? (
                      <Button
                        variant={'solid'}
                        size="lg"
                        borderRadius="full"
                        colorScheme="info"
                        leftIcon={<AntDesign name="staro" size={24} color="white" />}
                        onPress={() => {
                          setIdReservaAvaliacao(card.id)
                          setModalVisible(!modalVisible)
                        }}
                      >
                        Avaliar
                      </Button>
                    ) : null}
                  </Flex>
                </Stack>
              </Box>
            ))
          ) : (
            <Center>
              <Text fontSize="md" color={COLORS.darkGrayText}>
                Não existem reservas em andamento.
              </Text>
            </Center>
          )}
        </Box>

        {/* Modal com detalhes da reserva */}
        <Modal size="xl" isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />

            <Modal.Body>
              <Stack space={2}>
                <Heading size="md">
                  <Text color={COLORS.darkBlueText}>
                    {modalDados?.nomeEspacoEsportivo}
                  </Text>
                </Heading>
              </Stack>

              <Text color={COLORS.darkBlueText} marginTop={2}>
                <Text fontWeight="semibold">Data/hora da solicitação: </Text>
                {moment(modalDados?.dataHoraSolicitacao).format(
                  "DD/MM/YYYY - HH:mm"
                )}{" "}
                às {moment(modalDados?.dataHoraSolicitacao).format("HH:mm")}
              </Text>

              <Text color={COLORS.darkBlueText} marginTop={2}>
                <Text fontWeight="semibold">Status da reserva: </Text>
                {modalDados?.status?.charAt(0).toUpperCase() +
                  modalDados?.status?.slice(1).toLowerCase()}
              </Text>

              <Text color={COLORS.darkBlueText} marginTop={2}>
                <Text fontWeight="semibold">Data/hora da reserva: </Text>
                {moment(modalDados?.dataHoraInicioReserva).format(
                  "DD/MM/YYYY - HH:mm"
                )}{" "}
                às {moment(modalDados?.dataHoraFimReserva).format("HH:mm")}
              </Text>

              <Text color={COLORS.darkBlueText} marginTop={2}>
                <Text fontWeight="semibold">Quantidade de participantes: </Text>
                {modalDados?.qtdParticipantes}
              </Text>

              <Text color={COLORS.darkBlueText} marginTop={2}>
                <Text fontWeight="semibold">Local: </Text>
                {modalDados?.localidade}
              </Text>

              <Text color={COLORS.darkBlueText} marginTop={2}>
                <Text fontWeight="semibold">Motivo da solicitação: </Text>
                {modalDados?.motivoSolicitacao}
              </Text>

              {modalDados?.motivoCancelamento ? (
                <Text color={COLORS.darkBlueText} marginTop={2}>
                  <Text fontWeight="semibold">Motivo do cancelamento: </Text>
                  {modalDados?.motivoCancelamento}
                </Text>
              ) : null}

              {modalDados?.avaliacao ? (
                <Text color={COLORS.darkBlueText} marginTop={2}>
                  <Text fontWeight="semibold">Avaliação: </Text>
                  {modalDados?.avaliacao}
                </Text>
              ) : null}
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </ScrollView>
    </NativeBaseProvider >
  );
}
