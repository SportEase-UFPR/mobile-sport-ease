import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from "react-native";
import { Entypo } from '@expo/vector-icons';
import DatePicker from "../../../components/DatePicker";
import LocacaoService, {
  createSolicitacaoLocacao,
  getHorariosDisponiveis,
  getInformacoesEspacoEsportivo,
} from "../../../api/LocacaoService";
import {
  Flex,
  Box,
  TextArea,
  Heading,
  Text,
  Pressable,
  ScrollView,
  FormControl,
  Input,
  WarningOutlineIcon,
  Select,
  VStack,
  Skeleton,
  Spinner,
  NativeBaseProvider,
  Divider,
  Badge,
  IconButton,
  Modal,
  HStack,
} from "native-base";
import moment from "moment-timezone";
import temaGeralFormulario from "./nativeBaseTheme";
import COLORS from "../../../colors/colors";

const PageNovaReserva = ({ navigation }) => {
  const [inputLocalReserva, setInputLocalReserva] = useState(null);
  const [horarioInicioReserva, setHorarioInicioReserva] = useState(null);
  const [horarioFimReserva, setHorarioFimReserva] = useState(null);
  const [horarioDisponivelData, setHorarioDisponivelData] = useState(null);
  const [qntParticipantesReserva, setQntParticipantesReserva] = useState(null);
  const [motivoSolicitacao, setMotivoSolicitacao] = useState("");
  const [dataReserva, setDataReserva] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [espacosEsportivos, setEspacosEsportivos] = useState([]);
  const [informacoesEspacoEscolhido, setInformacoesEspacoEscolhido] = useState([]);
  const [botaoMax, setBotaoMax] = useState(0);
  const [botaoCount, setBotaoCount] = useState(0)
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [desmontarComponente, setDesmontarComponente] = useState(false);

  // USEEFFECTS, --------------------------------
  // UseEffect para carregar a listagem inicial dos espaços esportivos
  useEffect(() => {
    setIsLoading(true);
    const carregarEspacosEsportivos = async () => {
      try {
        const result = await LocacaoService.getEspacosEsportivosDisponiveis();
        setEspacosEsportivos(result);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar espaços esportivos:", error);
        setIsLoading(false);
      }
    };
    carregarEspacosEsportivos();
  }, []);

  //UseFocusEffect para limpar a navegação ao sair da pg
  // useFocusEffect(
  //   useCallback(() => {
  //     if (desmontarComponente) {
  //       console.log('entrou aqui no useFocusEffect')
  //       setInputLocalReserva(null);
  //       setEspacosEsportivos(null);
  //       setIsLoading(true);
  //       const carregarEspacosEsportivos = async () => {
  //         try {
  //           const result = await LocacaoService.getEspacosEsportivosDisponiveis();
  //           setEspacosEsportivos(result);
  //         } catch (error) {
  //           console.error("Erro ao carregar espaços esportivos:", error);
  //           setIsLoading(false);
  //         }
  //       };
  //       carregarEspacosEsportivos();
  //       setDesmontarComponente(false);
  //       console.log(inputLocalReserva);
  //       setIsLoading(false);
  //     }
  //   }, [])
  // );

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('teste');
      setDesmontarComponente(true);
    });

    return unsubscribe;
  }, [desmontarComponente]);

  //UseEffect para carregar os horários disponíveis de reserva
  useEffect(() => {
    if (inputLocalReserva && dataReserva) {
      carregarHorariosDisponiveis(dataReserva, inputLocalReserva);
    }
  }, [inputLocalReserva, dataReserva]);

  useEffect(() => {
    if (inputLocalReserva) {
      setIsLoadingForm(true);
      carregarInformacoesEspacoEscolhido(inputLocalReserva);
    }
  }, [inputLocalReserva]);


  useEffect(() => {
    if (horarioInicioReserva) {
      const max = calcularDisponibilidadeHorario();
      setBotaoMax(max);
      atualizarHorarioFim();
    }
  }, [botaoCount]);

  useEffect(() => {
    if (horarioInicioReserva) {
      const max = calcularDisponibilidadeHorario();
      if (typeof max === "number") {
        setHorarioFimReserva(
          addTimes(
            horarioInicioReserva,
            multTime(
              informacoesEspacoEscolhido.periodoLocacao,
              botaoCount + 1
            )
          )
        )
        setBotaoMax(max)
        setBotaoCount(0)
      } else {
        console.error(
          "calcularDisponibilidadeHorario did not return a number:",
          max
        );
      }
    }
  }, [horarioInicioReserva]);


  useEffect(() => {
    setHorarioDisponivelData(horariosDisponiveis);
  }, [horariosDisponiveis]);

  useEffect(() => {
    setHorarioInicioReserva(null);
    setHorarioFimReserva(null);
  }, [inputLocalReserva]);




  // FUNÇÕES PARA TRATAR HORÁRIOS E DATAS ------------------------------------ 
  const atualizarHorarioFim = () => {

    const novoFim = addTimes(horarioInicioReserva, multTime(informacoesEspacoEscolhido.periodoLocacao, (botaoCount + 1)));
    setHorarioFimReserva(novoFim);

  };

  const aumentarHorario = () => {
    if (botaoCount < botaoMax) {
      setBotaoCount(botaoCount + 1);
    }
  };

  const diminuirHorario = () => {
    if (botaoCount > 0) {
      setBotaoCount(botaoCount - 1);
    }
  };

  const carregarHorariosDisponiveis = async (
    dataReserva,
    idEspacoEsportivo
  ) => {
    const dataReservaLocalDate = moment.utc(dataReserva).format('YYYY-MM-DD')
    try {
      const requestData = {
        data: dataReservaLocalDate,
        idEspacoEsportivo: idEspacoEsportivo,
      };
      const result = await getHorariosDisponiveis(requestData);
      setHorariosDisponiveis(result.horariosDisponiveis);
    } catch (error) {
      console.error("Erro ao carregar horários disponíveis:", error);
    }
  };

  const carregarInformacoesEspacoEscolhido = async (idEspacoEsportivo) => {
    try {
      const result = await getInformacoesEspacoEsportivo(idEspacoEsportivo);
      setInformacoesEspacoEscolhido(result);
    } catch (error) {
      console.error("Erro ao carregar informações do local:", error);
    }
    setIsLoadingForm(false);
  };

  const calcularDisponibilidadeHorario = () => {
    const maxLocacaoDia = informacoesEspacoEscolhido.maxLocacaoDia;
    const periodoLocacao = moment.utc(informacoesEspacoEscolhido.periodoLocacao, "HH:mm:ss");
    let novoHorario = moment.utc(horarioInicioReserva, "HH:mm:ss");
    let horariosEncontrados = 0; // Para contar quantas vezes um horário disponível foi encontrado


    for (let indexMax = 1; indexMax <= maxLocacaoDia; indexMax++) {
      novoHorario.add({
        hours: periodoLocacao.hours(),
        minutes: periodoLocacao.minutes(),
        seconds: periodoLocacao.seconds()
      });
      let novoHorarioString = novoHorario.format("HH:mm:ss");
      if (horariosDisponiveis.includes(novoHorarioString)) {
        horarioAtual = novoHorario;
        horariosEncontrados++;
      } else {
        break;
      }
    }
    if (horariosEncontrados === 0 && maxLocacaoDia > 1) {
      return 1;
    } else if (horariosEncontrados === 1 && maxLocacaoDia > 1) {
      return 2;
    } else {
      return horariosEncontrados;
    }

  };

  function addTimes(startTime, duration) {
    // Divide as strings "HH:mm:ss" e converte para números
    const [startHours, startMinutes, startSeconds] = startTime
      .split(":")
      .map(Number);
    const [durationHours, durationMinutes, durationSeconds] = duration
      .split(":")
      .map(Number);

    // Converte horas e minutos para segundos e soma tudo
    const startTotalSeconds =
      startHours * 3600 + startMinutes * 60 + startSeconds;
    const durationTotalSeconds =
      durationHours * 3600 + durationMinutes * 60 + durationSeconds;
    const totalSeconds = startTotalSeconds + durationTotalSeconds;

    // Converte segundos de volta para horas, minutos e segundos
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Formata a saída para "HH:mm:ss", garantindo dois dígitos para horas, minutos e segundos
    const result = [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");

    return result;
  }

  function multTime(hoursString, multiplier) {
    const timeToSeconds = (time) => {
      const [hours, minutes, seconds] = time.split(":").map(parseFloat);
      return hours * 3600 + minutes * 60 + seconds;
    };

    const secondsToTime = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return [hours, minutes, seconds]
        .map((val) => val.toString().padStart(2, "0"))
        .join(":");
    };

    const initialSeconds = timeToSeconds(hoursString);
    const totalSeconds = initialSeconds * multiplier;
    return secondsToTime(totalSeconds);
  }


  function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  const handleSubmit = async () => {
    let isValid = true;
    if (!inputLocalReserva) {
      setInputErrors((prevErrors) => ({ ...prevErrors, localInvalid: true }));
      isValid = false;
    }
    if (!qntParticipantesReserva) {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        qntParticipantesInvalid: true,
      }));
      isValid = false;
    }
    if (!dataReserva) {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        dataReservaInvalid: true,
      }));
      isValid = false;
    }
    if (!horarioInicioReserva) {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        horarioInicioReservaInvalid: true,
      }));
      isValid = false;
    }
    if (!motivoSolicitacao) {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        motivoSolicitacaoInvalid: true,
      }));
      isValid = false;
    }
    if (isValid) {
      setIsSending(true);
      const novoHorarioInicioReserva = moment.utc(horarioInicioReserva, "HH:mm:ss")
      console.log('INFORMAÇÕES NO MOMENTO DE ENVIO..........')
      console.log(`novoHorarioInicioReserva: ${novoHorarioInicioReserva}`)
      const periodoLocacao = moment.utc(informacoesEspacoEscolhido.periodoLocacao, "HH:mm:ss");

      //Incluindo dados sobre a data e hora inicial da reserva em uma nova const
      const novaDataReservaInicio = moment.utc(dataReserva);
      novaDataReservaInicio.add({
        hours: novoHorarioInicioReserva.hours(),
        minutes: novoHorarioInicioReserva.minutes(),
        seconds: novoHorarioInicioReserva.seconds()
      });
      console.log(`novaDataReservaInicio: ${novoHorarioInicioReserva}`)


      //Incluindo dados sobre a data e hora final da reserva em uma nova const
      const novaDataReservaFim = moment.utc(novaDataReservaInicio);
      novaDataReservaFim.add({
        hours: (periodoLocacao.hours() * (botaoCount + 1)),
        minutes: (periodoLocacao.minutes() * (botaoCount + 1)),
        seconds: (periodoLocacao.seconds() * (botaoCount + 1))
      });

      console.log(`novaDataReservaFim: ${novaDataReservaFim}`)

      try {
        const dadosDaLocacao = {
          motivoSolicitacao: motivoSolicitacao,
          qtdParticipantes: parseInt(qntParticipantesReserva),
          dataHoraInicioReserva: novaDataReservaInicio,
          dataHoraFimReserva: novaDataReservaFim,
          idEspacoEsportivo: inputLocalReserva,
        };
        const result = await createSolicitacaoLocacao(dadosDaLocacao);
        if (result.isSuccess == false) {
          console.log(result)
          setIsSending(false);
          Alert.alert("Falha na solicitação", result.message);
        } else {
          console.log(result);

          // Adicionar o listener 'blur'
          const unsubscribe = navigation.addListener('blur', () => {
            console.log("entrou no unsubscribe")
            setInputLocalReserva(null);
            setEspacosEsportivos(null);
            setIsLoading(true);
            const carregarEspacosEsportivos = async () => {
              try {
                const result = await LocacaoService.getEspacosEsportivosDisponiveis();
                setEspacosEsportivos(result);
              } catch (error) {
                console.error("Erro ao carregar espaços esportivos:", error);
                setIsLoading(false);
              }
            };
            carregarEspacosEsportivos();
            console.log('finalizou');
            setIsLoading(false);
            unsubscribe();
          });

          setIsSending(false);
          Alert.alert("Sucesso!", "Solicitação criada com sucesso!");

          // Isso acionará o listener 'blur', se ainda estiver ativo
          navigation.goBack();
        }
      } catch (error) {
        setIsSending(false);
        isValid = false;
        Alert.alert(
          "Falha na solicitação",
          "Ocorreu um erro inesperado."
        );
      }
    }
  };

  return (
    <NativeBaseProvider theme={temaGeralFormulario}>
      <ScrollView>
        {/* Modal com DatePicker */}
        <Modal isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)}>
          <Modal.Content maxWidth="600px">
            <Modal.CloseButton />
            <Modal.Header>Dia da Reserva</Modal.Header>
            <Modal.Body >
              <DatePicker
                date={dataReserva}
                setDate={setDataReserva}
                availableDays={informacoesEspacoEscolhido.diasFuncionamento}
                setShowCalendarModal={setShowCalendarModal}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <Box mt={25} mb={25} paddingX={5}>
          <Heading
            borderColor={COLORS.green}
            borderLeftWidth={20}
            color={COLORS.green}
            fontSize={"3xl"}
            marginBottom={10}
            paddingLeft={"30px"}
          >
            Nova solicitação de reserva
          </Heading>
          {isLoading ? (
            <VStack space={4} overflow="hidden">
              <Skeleton.Text startColor="green.300" />
              <Skeleton.Text />
              <Skeleton startColor="white" rounded={"md"} />
            </VStack>
          ) : (
            <>
              <Box mb={5} height={"150"}>
                <Text
                  fontSize={"2xl"}
                  color={COLORS.green}
                  fontWeight={"semibold"}
                >
                  1. Dados do local
                </Text>
                <FormControl
                  fontSize={"3xl"}
                  isRequired
                  isInvalid={inputErrors.localInvalid}
                  marginBottom={3}
                >
                  <FormControl.Label>
                    Selecione o local desejado{" "}
                  </FormControl.Label>
                  <Select
                    mt="1"
                    value="teste"
                    isReadOnly
                    accessibilityLabel="Botão de seleção do local"
                    placeholder="Selecionar local..."
                    onValueChange={(espaco) => {
                      setInputErrors((prevErrors) => ({
                        ...prevErrors,
                        localInvalid: false,
                      }));
                      setInputLocalReserva(espaco);
                    }}
                  >
                    {espacosEsportivos && espacosEsportivos.length > 0
                      ? (
                        espacosEsportivos.map((espaco, index) => (
                          <Select.Item
                            key={index}
                            label={espaco.nome}
                            value={espaco.id}
                          />
                        ))
                      )
                      : null}
                  </Select>
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Indique o local de reserva
                  </FormControl.ErrorMessage>
                </FormControl>
                <Flex flexDirection="row" flexWrap="wrap">
                  {isLoadingForm ? (
                    <Skeleton
                      startColor="green.200"
                      width={"50"}
                      height={"10"}
                      rounded={"50"}
                      py="1.5"
                      mr="1"
                      mb="1"
                    />
                  ) : (
                    inputLocalReserva ?
                      (informacoesEspacoEscolhido.listaEsportes?.map(
                        (esporte, index) => (
                          <Badge
                            key={`badge-${index}`}
                            _text={{ fontSize: "13px", fontWeight: "400" }}
                            py="1.5"
                            mr="1"
                            mb="1"
                            colorScheme="success"
                            variant="subtle"
                            rounded="50"
                          >
                            {toTitleCase(esporte?.nome)}
                          </Badge>
                        )
                      )) : (
                        null
                      )
                  )}
                </Flex>
              </Box>

              <Divider></Divider>

              {inputLocalReserva ? (
                <>
                  <Box mt={5} mb={5}>
                    <Text
                      fontSize={"2xl"}
                      color={COLORS.green}
                      fontWeight={"semibold"}
                    >
                      2. Dados da reserva
                    </Text>

                    <FormControl
                      isRequired
                      isInvalid={inputErrors.qntParticipantesInvalid}
                      marginBottom={3}
                    >
                      <FormControl.Label>
                        Quantidade de participantes
                      </FormControl.Label>
                      <Input
                        placeholder="Selecionar quantidade de pessoas..."
                        keyboardType="number-pad"
                        onChangeText={(text) => {
                          const isInvalid = text < informacoesEspacoEscolhido.capacidadeMin ||
                            text > informacoesEspacoEscolhido.capacidadeMax;

                          setInputErrors((prevErrors) => ({
                            ...prevErrors,
                            qntParticipantesInvalid: isInvalid,
                          }));
                          setQntParticipantesReserva(text);
                        }}
                      />

                      {inputErrors.qntParticipantesInvalid && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                          Selecione entre {informacoesEspacoEscolhido.capacidadeMin} e {informacoesEspacoEscolhido.capacidadeMax} pessoas.
                        </FormControl.ErrorMessage>
                      )}

                      {!inputErrors.qntParticipantesInvalid && (
                        <FormControl.HelperText flexDirection={'row'}>
                          Selecione entre {informacoesEspacoEscolhido.capacidadeMin} e {informacoesEspacoEscolhido.capacidadeMax} pessoas.
                        </FormControl.HelperText>
                      )}
                    </FormControl>

                    <FormControl
                      isRequired
                      isInvalid={inputErrors.dataReservaInvalid}
                      marginBottom={3}
                    >
                      <FormControl.Label>
                        Selecione o dia da reserva
                      </FormControl.Label>
                      <Pressable onPress={() => setShowCalendarModal(true)}>
                        <Input
                          placeholder="Selecione o dia da reserva..."
                          isReadOnly
                          value={dataReserva ? moment.utc(dataReserva).format('DD/MM/YYYY') : ''}
                        />
                      </Pressable>
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        Indique a data de reserva
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                      isInvalid={inputErrors.horarioInicioReservaInvalid}
                      marginBottom={3}
                    >
                      <FormControl.Label>
                        Selecione o horário inicial da reserva{" "}
                      </FormControl.Label>
                      <Select
                        isReadOnly
                        accessibilityLabel="Selecione o horário inicial da reserva"
                        placeholder="Selecione o horário inicial..."
                        mt="1"
                        onValueChange={(horario) => {
                          setInputErrors((prevErrors) => ({
                            ...prevErrors,
                            horarioInicioReservaInvalid: false,
                          }));
                          setHorarioInicioReserva(horario);
                        }}
                      >
                        {horarioDisponivelData
                          ? horarioDisponivelData.map(
                            (horario, index) => (
                              <Select.Item
                                key={index}
                                label={horario.toString()}
                                value={horario.toString()}
                              />
                            )
                          )
                          :
                          <Select.Item
                            isDisabled
                            label={'Selecione um dia para a reserva...'}
                            value={'Selecione um dia para a reserva...'}
                          />
                        }
                      </Select>
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        Indique o horário de início da reserva
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                    >
                      <FormControl.Label>
                        Por quanto tempo você deseja reservar o espaço?{" "}
                      </FormControl.Label>
                      {horarioInicioReserva ? (
                        <HStack alignItems="center" justifyContent="space-around">
                          <IconButton
                            isDisabled={botaoCount === 0}
                            size={'sm'}
                            colorScheme="success"
                            variant="outline"
                            _icon={{
                              as: Entypo,
                              name: "minus",
                            }}
                            onPress={diminuirHorario}
                          />
                          <Text fontSize={'md'}>
                            {horarioInicioReserva} até{" "}
                            {horarioFimReserva}
                          </Text>
                          <IconButton
                            isDisabled={(botaoCount === (botaoMax - 1) && botaoMax != 0)}
                            size={'sm'}
                            colorScheme="success"
                            variant="outline"
                            _icon={{
                              as: Entypo,
                              name: "plus",
                            }}
                            onPress={aumentarHorario}
                          />
                        </HStack>

                      ) : (
                        <>
                          <FormControl.HelperText>
                            As informações do período da reserva aparecerão
                            aqui.
                          </FormControl.HelperText>
                        </>
                      )}
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        Indique por quantas horas o local será reservado
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Box>
                  <Divider></Divider>
                  <Box mt={5} mb={5}>
                    <Text
                      fontSize={"2xl"}
                      color={COLORS.green}
                      fontWeight={"semibold"}
                    >
                      3. Objetivo da reserva
                    </Text>
                    <FormControl
                      isRequired
                      isInvalid={inputErrors.motivoSolicitacaoInvalid}
                      marginBottom={3}
                    >
                      <FormControl.Label>
                        Inclua o motivo da solicitação{" "}
                      </FormControl.Label>
                      <TextArea
                        isInvalid={inputErrors.motivoSolicitacaoInvalid}
                        placeholder="Por qual motivo você deseja reservar o espaço?"
                        onChangeText={(text) => {
                          setMotivoSolicitacao(text);
                          setInputErrors((prevErrors) => ({
                            ...prevErrors,
                            motivoSolicitacaoInvalid: false,
                          }));
                        }}
                      />
                      <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        Indique o motivo da reserva
                      </FormControl.ErrorMessage>
                    </FormControl>
                  </Box>
                  <Pressable
                    w={"full"}
                    flex={1}
                    paddingY={5}
                    borderRadius="full"
                    backgroundColor={"success.500"}
                    onPress={() => handleSubmit()}
                    mb={10}
                  >
                    <VStack
                      alignItems="center"
                      justifyContent="center"
                      flexDirection={"row"}
                      space={2}
                    >
                      {isSending ? (
                        <Spinner
                          accessibilityLabel="Entrando..."
                          size={"sm"}
                          color="white"
                        />
                      ) : null}
                      <Heading color="white" fontSize="md">
                        {isSending ? " Enviando solicitação..." : "Enviar"}
                      </Heading>
                    </VStack>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text
                    mt={"5"}
                    fontSize={"2xl"}
                    color="gray.500"
                    fontWeight={"semibold"}
                  >
                    2. Dados da reserva
                  </Text>
                  <Text fontSize={"sm"} color="gray.500" fontWeight={"normal"}>
                    Primeiro, selecione um espaço esportivo
                  </Text>
                </>
              )}
            </>
          )}
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default PageNovaReserva;