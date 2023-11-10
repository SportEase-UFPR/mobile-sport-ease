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
} from "native-base";
import { getSolicitacoesEmAndamento } from "../../../api/LocacaoService";
import moment from "moment";
import COLORS from "../../../colors/colors";

export default function PageHomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [informacoesEspacos, setInformacoesEspacos] = useState([]);
  const [cardData, setCardData] = useState([""]);

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
    }, [])
  );

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

        {cardData.map((card, index) => (
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
                <Stack space={2}>
                  <Heading size="sm" ml="-1" textAlign="center">
                    <Text
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
                    </Text>
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
    </ScrollView>
  );
}
