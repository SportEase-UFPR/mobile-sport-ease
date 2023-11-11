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
  Input
} from "native-base";
import temaGeralFormulario from "./nativeBaseTheme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAllSolicitacoes } from "../../../api/LocacaoService";
import { useFocusEffect } from "@react-navigation/native";
import COLORS from "../../../colors/colors";
import moment from "moment";
import { TouchableOpacity } from "react-native";

export default function PageHistorico() {
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [cardData, setCardData] = useState([""]);
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [status, setStatus] = useState(null);
  const [local, setLocal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalDados, setModalDados] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [espacoOptions, setEspacoOptions] = useState([]);
  const reservasFiltradas = cardData.filter((card) => {
    const filtroStatus = status === null || card.status === status;
    const filtroLocal = local === null || card.nomeEspacoEsportivo === local;
    const filtroDataInicio = !startDate || moment(card.dataHoraInicioReserva).isSameOrAfter(startDate, 'day');
    const filtroDataFim = !endDate || moment(card.dataHoraFimReserva).isSameOrBefore(endDate, 'day');

    return filtroStatus && filtroLocal && filtroDataInicio && filtroDataFim;
  });

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

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

  const carregarReservas = async () => {
    const result = await getAllSolicitacoes();
    if (result) {
      console.log(result);
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

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  useEffect(() => {
    const loadData = async () => {
      await sleep(1000);
      setIsLoading(false);
    };

    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      carregarReservas();
    }, [])
  );

  return (
    <NativeBaseProvider theme={temaGeralFormulario}>
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
          <Box marginBottom={30}>
            <Text> Filtros...</Text>
            <VStack space={4} direction={{ base: "column", md: "row" }}>
              {/* Filtro de Data Início */}
              <FormControl minWidth="1/3" flex={1}>
                <FormControl.Label>Data início</FormControl.Label>
                <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <Input
                    isReadOnly
                    placeholder="Data início"
                    value={moment(startDate).format('DD/MM/YYYY')}
                  />
                </TouchableOpacity>
              </FormControl>

              {/* Filtro de Data Fim */}
              <FormControl minWidth="1/3" flex={1}>
                <FormControl.Label>Data Fim</FormControl.Label>
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                  <Input
                    isReadOnly
                    placeholder="Data fim"
                    value={moment(endDate).format('DD/MM/YYYY')}
                  />
                </TouchableOpacity>
              </FormControl>
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

            </VStack>
          </Box>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
            />
          )}
          {reservasFiltradas.map((card, index) => (
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
              {isLoading ? (
                // Renderize o Skeleton se estiver carregando
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
              ) : (
                <Stack p="4" space={3}>
                  {/* <Badge
                  colorScheme="success"
                  maxW="1/2"
                  _text={{ fontSize: 20, fontWeight: 400 }}
                  rounded="50"
                >
                  Locação Ativa
                </Badge> */}

                  <Stack
                    space={1}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Heading size="md">
                      <Text color={COLORS.darkBlueText}>
                        {card.nomeEspacoEsportivo}
                      </Text>
                    </Heading>

                    <Button
                      size="md"
                      borderRadius="md"
                      width="35px"
                      backgroundColor={COLORS.blue}
                      startIcon={<InfoOutlineIcon />}
                      onPress={() => abrirModalDetalhes(card)}
                    ></Button>
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
                      Quantidade de participantes:{" "}
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
                      showCancelarReserva(card.dataHoraInicioReserva) &&
                        showConfirmacaoReserva(card.dataHoraInicioReserva)
                        ? "space-between"
                        : "center"
                    }
                  >
                    {showConfirmacaoReserva(card.dataHoraInicioReserva) ? (
                      <Button
                        size="lg"
                        borderRadius="md"
                        width="140px"
                        backgroundColor={COLORS.green}
                        leftIcon={<CheckIcon />}
                      >
                        Confirmar uso
                      </Button>
                    ) : null}

                    {showCancelarReserva(card.dataHoraInicioReserva) ? (
                      <Button
                        size="lg"
                        borderRadius="md"
                        width="140px"
                        backgroundColor={COLORS.red}
                        leftIcon={<CloseIcon />}
                      >
                        Cancelar uso
                      </Button>
                    ) : null}
                  </Flex>
                </Stack>
              )}
            </Box>
          ))}
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
