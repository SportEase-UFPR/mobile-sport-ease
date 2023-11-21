import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  Flex,
  Divider,
  Badge,
  AlertDialog,
  useToast
} from "native-base";
import { cancelarUsoLocacao, confirmarUsoLocacao, getSolicitacoesEmAndamento } from "../../../api/LocacaoService";
import moment from "moment";
import COLORS from "../../../colors/colors";
import { Alert } from "react-native";



export default function PageHomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [cardId, setCardId] = useState();
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
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
  ]
  const [legendaStatus] = useState({
    'CANCELADA': 'error.500',
    'NEGADA': 'error.500',
    'FINALIZADA': 'emerald.500',
    'ENCERRADA': 'gray.500',
    'SOLICITADA': 'yellow.500',
    'APROVADA': 'green.500'
  });

  const showConfirmacaoReserva = (horario, status) => {
    if ((moment.tz('America/Sao_Paulo').diff(moment(horario), "minutes") >= 5) && status == 'APROVADA') {
      return true;
    }
    return false;
  };

  const showCancelarReserva = (card) => {
    let momentoInicio = card.dataHoraInicioReserva;
    let statusReserva = card.status;
    if (statusReserva === "SOLICITADA") {
      return true;
    }
    if (statusReserva === "APROVADA") {
      if (moment.tz('America/Sao_Paulo').diff(moment(momentoInicio), "hours") < 24) {
        return true
      }
    }
    return false;
  };

  const carregarReservas = async () => {
    const result = await getSolicitacoesEmAndamento();
    if (result) {
      setCardData(result);
      setIsLoading(false);
    } else {
      setCardData([""]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      carregarReservas();
    }, [])
  );

  const handleCancelarUso = async (idLocacao) => {
    setIsLoadingModal(true);
    try {
      const result = await cancelarUsoLocacao(idLocacao);
      const updatedCardData = cardData.filter(card => card.id !== idLocacao);
      setCardData(updatedCardData);
      setIsLoadingModal(false);
      setIsOpen(false);
      const toastConfig = ToastDetails[0];
      toast.show(toastConfig);
    } catch (error) {
      Alert.alert(
        "Erro",
        `Não foi possível seguir com o cancelamento da locação. ${error.message}`
      )
      setIsLoadingModal(false);
    }
  }

  const handleConfirmarUso = async (idLocacao) => {
    setIsLoadingModal(true);
    try {
      const result = await confirmarUsoLocacao(idLocacao)
      const updatedCardData = cardData.filter(card => card.id !== idLocacao);
      setCardData(updatedCardData);
      setIsLoadingModal(false);
      const toastConfig = ToastDetails[1];
      toast.show(toastConfig);
    } catch (error) {
      Alert.alert(
        "Erro",
        `Não foi possível seguir com a confirmação de uso da locação. ${error.message}`
      )
      setIsLoadingModal(false);
    }
  }

  const handleIsOpen = (isCancel, cardId) => {
    setCancelDialog(isCancel ? true : false);
    setCardId(cardId);
    setIsOpen(true);
  };



  return (
    <ScrollView>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{cancelDialog ? 'Cancelar Reserva' : 'Confirmar Uso'}</AlertDialog.Header>
          <AlertDialog.Body>
            {cancelDialog ?
              'Realmente deseja cancelar a reserva?'
              :
              'Realmente deseja confirmar o uso do local?'}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                Voltar
              </Button>
              <Button
                isLoading={isLoadingModal}
                isLoadingText={'Carregando...'}
                isDisabled={isLoadingModal}
                colorScheme={cancelDialog ? 'danger' : 'success'}
                onPress={() => {
                  { cancelDialog ? handleCancelarUso(cardId) : handleConfirmarUso(cardId) }
                }}>
                {cancelDialog ? 'Cancelar' : 'Confirmar'}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Box mt={25} mb={25} paddingX={5}>
        <Heading
          borderColor={COLORS.green}
          borderLeftWidth={20}
          color={COLORS.green}
          fontSize={"3xl"}
          marginBottom={10}
          paddingLeft={"30px"}
        >
          Suas reservas em andamento
        </Heading>
        <Divider mb="5" />
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
        ) : cardData.length > 0 ? (
          cardData.map((card, index) => (
            <Box
              key={'alert_dialog-' + index}
              mb="5"
              rounded="lg"
              overflow="hidden"
              borderColor="coolGray.200"
              borderWidth="1"
              borderRadius={"21"}
              backgroundColor="gray.50"
            >

              <Stack p="4" space={3}>
                <Stack space={2}>
                  <Heading size="sm" ml="-1" >
                    <Badge variant={'outline'} borderRadius={'full'} colorScheme={legendaStatus[card.status].split('.')[0]}>
                      {card.status}
                    </Badge>
                  </Heading>
                  <Heading size="lg" ml="-1" textAlign="left">
                    <Text color={COLORS.darkBlueText}>Reserva #{card.id}</Text>
                  </Heading>
                </Stack>

                <Text color={COLORS.darkGrayText} textAlign="left">
                  <Text fontWeight="semibold">Período:</Text>{" "}
                  {moment(card.dataHoraInicioReserva).format("HH:mm")} até{" "}
                  {moment(card.dataHoraFimReserva).format("HH:mm - DD/MM/YYYY")}{" "}
                </Text>

                <Text color={COLORS.darkGrayText} textAlign="left">
                  <Text fontWeight="semibold">Espaço esportivo:</Text>{" "}
                  {card.nomeEspacoEsportivo + " - " + card.localidade}
                </Text>
                <Text color={COLORS.darkGrayText} textAlign="left">
                  <Text fontWeight="semibold">
                    Quantidade de participantes:
                  </Text>{" "}
                  {card.qtdParticipantes}
                </Text>

                <Flex
                  direction="row"
                >
                  {showConfirmacaoReserva(card.dataHoraInicioReserva, card.status) ? (
                    <Button
                      size="lg"
                      width={'full'}
                      borderRadius="full"
                      backgroundColor={'success.500'}
                      leftIcon={<CheckIcon />}
                      onPress={() => handleIsOpen(false, card.id)}
                    >
                      Confirmar uso
                    </Button>
                  ) : null}

                  {showCancelarReserva(card) ? (
                    <Button
                      size="lg"
                      width={'full'}
                      borderRadius="full"
                      backgroundColor={'danger.500'}
                      leftIcon={<CloseIcon />}
                      onPress={() => handleIsOpen(true, card.id)}
                    >
                      Cancelar uso
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
    </ScrollView>
  );
}