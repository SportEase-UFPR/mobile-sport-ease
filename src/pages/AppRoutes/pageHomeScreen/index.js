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
  const [isOpen, setIsOpen] = React.useState(false);
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

  const ToastAlert = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    ...rest
  }) => <Alert maxWidth="100%" alignSelf="center" flexDirection="row" status={status ? status : "info"} variant={variant} {...rest}>
      <VStack space={1} flexShrink={1} w="100%">
        <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text fontSize="md" fontWeight="medium" flexShrink={1} color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
              {title}
            </Text>
          </HStack>
          {isClosable ? <IconButton variant="unstyled" icon={<CloseIcon size="3" />} _icon={{
            color: variant === "solid" ? "lightText" : "darkText"
          }} onPress={() => toast.close(id)} /> : null}
        </HStack>
        <Text px="6" color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
          {description}
        </Text>
      </VStack>
    </Alert>;


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
      console.log(cardData);
    }, [])
  );

  const handleCancelarUso = async (idLocacao) => {
    console.log(`cancelando uso... id ${idLocacao}`)
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
      const result = await confirmarUsoLocacaoUsoLocacao(idLocacao)
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

  return (
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
              <AlertDialog key={'alert_dialog-' + index} leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                  <AlertDialog.CloseButton />
                  <AlertDialog.Header>Cancelar Reserva</AlertDialog.Header>
                  <AlertDialog.Body>
                    Realmente deseja cancelar a reserva?
                  </AlertDialog.Body>
                  <AlertDialog.Footer>
                    <Button.Group space={2}>
                      <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                        Voltar
                      </Button>
                      <Button colorScheme="danger" onPress={() => handleCancelarUso(card.id)}>
                        Sim, cancelar
                      </Button>
                    </Button.Group>
                  </AlertDialog.Footer>
                </AlertDialog.Content>
              </AlertDialog>
              <Stack p="4" space={3}>
                <Stack space={2}>
                  <Heading size="sm" ml="-1" textAlign="center">
                    <Badge
                      style={{
                        color:
                          card.status === "SOLICITADA"
                            ? COLORS.yellow
                            : COLORS.green,
                      }}
                    >
                      Reserva
                      {" " +
                        card.status?.charAt(0).toUpperCase() +
                        card.status?.slice(1).toLowerCase()}
                    </Badge>
                  </Heading>

                  <Heading size="lg" ml="-1" textAlign="center">
                    <Text color={COLORS.darkBlueText}>Reserva #{card.id}</Text>
                  </Heading>
                </Stack>

                <Text color={COLORS.darkGrayText} textAlign="center">
                  <Text fontWeight="semibold">Período:</Text>{" "}
                  {moment(card.dataHoraInicioReserva).format("HH:mm")} até{" "}
                  {moment(card.dataHoraFimReserva).format("HH:mm - DD/MM/YYYY")}{" "}
                </Text>

                <Text color={COLORS.darkGrayText} textAlign="center">
                  <Text fontWeight="semibold">Espaço esportivo:</Text>{" "}
                  {card.nomeEspacoEsportivo + " - " + card.localidade}
                </Text>
                <Text color={COLORS.darkGrayText} textAlign="center">
                  <Text fontWeight="semibold">
                    Quantidade de participantes:
                  </Text>{" "}
                  {card.qtdParticipantes}
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

                      borderRadius="lg"
                      backgroundColor={'success.500'}
                      leftIcon={<CheckIcon />}
                      onPress={() => handleConfirmarUso(card.id)}
                    >
                      Confirmar uso
                    </Button>
                  ) : null}

                  {showCancelarReserva(card.dataHoraInicioReserva) ? (
                    <Button
                      size="lg"
                      borderRadius="lg"
                      backgroundColor={'danger.500'}
                      leftIcon={<CloseIcon />}
                      onPress={() => setIsOpen(!isOpen)}
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