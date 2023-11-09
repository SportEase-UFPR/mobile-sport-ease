import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { solicitarLocacao } from '../../../services/locacaoService';
import LocacaoService, { createSolicitacaoLocacao, getHorariosDisponiveis, getInformacoesEspacoEsportivo } from '../../../api/LocacaoService';
import {
    Flex, Box, TextArea, Heading, Text, Pressable, ScrollView, FormControl, Input, WarningOutlineIcon, Select, VStack, Skeleton,
    Spinner, NativeBaseProvider, Divider, Badge, Slider
} from 'native-base';

import temaGeralFormulario from './nativeBaseTheme';


const PageNovaReserva = ({ navigation }) => {
    const [inputLocalReserva, setInputLocalReserva] = useState(null);
    const [horarioInicioReserva, setHorarioInicioReserva] = useState(null);
    const [horarioDisponivelData, setHorarioDisponivelData] = useState(null);
    const [qntParticipantesReserva, setQntParticipantesReserva] = useState(null);
    const [qntHoras, setQntHoras] = useState(1);
    const [motivoSolicitacao, setMotivoSolicitacao] = useState('');
    const [dataReserva, setDataReserva] = useState(new Date());
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [espacosEsportivos, setEspacosEsportivos] = useState([]);
    const [informacoesEspacoEscolhido, setInformacoesEspacoEscolhido] = useState([]);
    const [somaHorario, setSomaHorario] = useState(horarioInicioReserva);
    const [sliderMax, setSliderMax] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [inputErrors, setInputErrors] = useState({})
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    // UseEffect para carregar a listagem inicial dos espaços esportivos
    useEffect(() => {
        setIsLoading(true);
        const carregarEspacosEsportivos = async () => {
            try {
                const result = await LocacaoService.getEspacosEsportivosDisponiveis();
                setEspacosEsportivos(result);
                setIsLoading(false)
            } catch (error) {
                console.error('Erro ao carregar espaços esportivos:', error);
                setIsLoading(false)
            }
        };

        carregarEspacosEsportivos();
    }, []);

    //UseEffect para carregar os horários disponíveis de reserva
    useEffect(() => {
        if (inputLocalReserva && dataReserva) {
            setSliderMax(1);
            carregarHorariosDisponiveis(dataReserva, inputLocalReserva);
        }
    }, [inputLocalReserva, dataReserva]);

    useEffect(() => {
        if (inputLocalReserva) {
            setSliderMax(1);
            setIsLoadingForm(true);
            carregarInformacoesEspacoEscolhido(inputLocalReserva);
        }
    }, [inputLocalReserva]);

    useEffect(() => {
        setHorarioDisponivelData(horariosDisponiveis);
    }, [horariosDisponiveis]);

    useEffect(() => {
        // certifique-se de que calcularDisponibilidadeHorario é uma função e está disponível neste escopo
        const max = calcularDisponibilidadeHorario(); // Suponha que esta função retorna um número
        if (typeof max === 'number') { // Confirme que é um número antes de atualizar o estado
            setSliderMax(max);
        } else {
            console.error('calcularDisponibilidadeHorario did not return a number:', max);
        }
    }, [horarioInicioReserva]);

    const carregarHorariosDisponiveis = async (dataReserva, idEspacoEsportivo) => {
        try {
            const requestData = {
                data: dataReserva.toISOString(),
                idEspacoEsportivo: idEspacoEsportivo,
            };
            const result = await getHorariosDisponiveis(requestData);
            setHorariosDisponiveis(result);
        } catch (error) {
            console.error('Erro ao carregar horários disponíveis:', error);
        }
    };

    const carregarInformacoesEspacoEscolhido = async (idEspacoEsportivo) => {
        try {
            const result = await getInformacoesEspacoEsportivo(idEspacoEsportivo);
            setInformacoesEspacoEscolhido(result);

        } catch (error) {
            console.error('Erro ao carregar informações do local:', error);
        }
        setIsLoadingForm(false);
    };


    const calcularDisponibilidadeHorario = () => {
        const maxLocacaoDia = informacoesEspacoEscolhido.maxLocacaoDia;
        const periodoLocacao = informacoesEspacoEscolhido.periodoLocacao;
        let horarioAtual = horarioInicioReserva;
        let horariosEncontrados = 0; // Para contar quantas vezes um horário disponível foi encontrado

        for (let indexMax = 1; indexMax <= maxLocacaoDia; indexMax++) {
            const novoHorario = addTimes(horarioAtual, periodoLocacao);
            if (horariosDisponiveis.horariosDisponiveis.includes(novoHorario)) {
                horarioAtual = novoHorario;
                horariosEncontrados++;
            } else {
                break;
            }
        }
        return horariosEncontrados;
    }

    function addTimes(startTime, duration) {
        // Divide as strings "HH:mm:ss" e converte para números
        const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
        const [durationHours, durationMinutes, durationSeconds] = duration.split(':').map(Number);

        // Converte horas e minutos para segundos e soma tudo
        const startTotalSeconds = startHours * 3600 + startMinutes * 60 + startSeconds;
        const durationTotalSeconds = durationHours * 3600 + durationMinutes * 60 + durationSeconds;
        const totalSeconds = startTotalSeconds + durationTotalSeconds;

        // Converte segundos de volta para horas, minutos e segundos
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Formata a saída para "HH:mm:ss", garantindo dois dígitos para horas, minutos e segundos
        const result = [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');

        return result;
    }

    function multTime(hoursString, multiplier) {
        const timeToSeconds = time => {
          const [hours, minutes, seconds] = time.split(':').map(parseFloat);
          return hours * 3600 + minutes * 60 + seconds;
        };
      
        const secondsToTime = totalSeconds => {
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
      
          return [hours, minutes, seconds]
            .map(val => val.toString().padStart(2, '0'))
            .join(':');
        };
      
        const initialSeconds = timeToSeconds(hoursString);
      
        const totalSeconds = initialSeconds * multiplier;
      
        return secondsToTime(totalSeconds);
      }
      

    function addPeriodToDate(date, period, times = 1) {
        const [hours, minutes, seconds] = period.split(':').map(Number); // Converte em números
        // Adiciona o período múltiplas vezes
        date.setHours(date.getHours() + hours * times);
        date.setMinutes(date.getMinutes() + minutes * times);
        date.setSeconds(date.getSeconds() + seconds * times);
        return date;
    }


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDataReserva(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };


    const handleSubmit = async (formData) => {
        let isValid = true;
        if (!inputLocalReserva) {
            setInputErrors(prevErrors => ({ ...prevErrors, localInvalid: true }));
            isValid = false;
        }
        if (!qntParticipantesReserva) {
            setInputErrors(prevErrors => ({ ...prevErrors, qntParticipantesInvalid: true }));
            isValid = false;
        }
        if (!dataReserva) {
            setInputErrors(prevErrors => ({ ...prevErrors, dataReservaInvalid: true }));
            isValid = false;
        }
        if (!horarioInicioReserva) {
            setInputErrors(prevErrors => ({ ...prevErrors, horarioInicioReservaInvalid: true }));
            isValid = false;
        }
        if (!qntHoras) {
            setInputErrors(prevErrors => ({ ...prevErrors, qntHorasInvalid: true }));
            isValid = false;
        }
        if (!motivoSolicitacao) {
            setInputErrors(prevErrors => ({ ...prevErrors, motivoSolicitacaoInvalid: true }));
            isValid = false;
        }
        if (isValid) {
            setIsSending(true)
            const novaDataReservaInicio = new Date(dataReserva);
            const [horas, minutos] = horarioInicioReserva.split(':').map(Number);
            novaDataReservaInicio.setHours(horas);
            novaDataReservaInicio.setMinutes(minutos);
            novaDataReservaInicio.setSeconds(0);
            novaDataReservaInicio.setMilliseconds(0);
            const novaDataReservaFim = new Date(novaDataReservaInicio);
            addPeriodToDate(novaDataReservaFim, informacoesEspacoEscolhido.periodoLocacao, qntHoras);
            try {
                const dadosDaLocacao = {
                    motivoSolicitacao: motivoSolicitacao,
                    qtdParticipantes: parseInt(qntParticipantesReserva),
                    dataHoraInicioReserva: novaDataReservaInicio.toISOString(),
                    dataHoraFimReserva: novaDataReservaFim.toISOString(),
                    idEspacoEsportivo: inputLocalReserva,
                };

                const response = await createSolicitacaoLocacao(dadosDaLocacao);

                if (response) {
                    setIsSending(false);
                    Alert.alert('Sucesso!', 'Solicitação criada com sucesso!');
                    navigation.navigate("HomeScreen")
                }

            } catch (error) {
                Alert.alert('Erro!', 'Não foi possível seguir com a solicitação. Revise os dados enviados.');
                setIsSending(false);
            }
        }
    };

    return (
        <NativeBaseProvider theme={temaGeralFormulario}>
            <ScrollView>
                <Box mt={25} mb={25} paddingX={5} >
                    <Heading borderColor={'green.500'} borderLeftWidth={20} color="green.500" fontSize={'3xl'} marginBottom={10} paddingLeft={'30px'}>
                        Nova solicitação de reserva
                    </Heading>
                    {isLoading ? (
                        <VStack space={4} overflow="hidden">
                            <Skeleton.Text startColor="green.300" />
                            <Skeleton.Text />
                            <Skeleton startColor="white" rounded={'md'} />
                        </VStack>
                    ) : (
                        <>
                            <Box mb={5} height={'150'}>
                                <Text fontSize={'2xl'} color="green.800" fontWeight={'semibold'}>1. Dados do local</Text>
                                <FormControl fontSize={'3xl'} isRequired isInvalid={inputErrors.localInvalid} marginBottom={3}>
                                    <FormControl.Label>Selecione o local desejado </FormControl.Label>
                                    <Select
                                        mt="1"
                                        isReadOnly
                                        accessibilityLabel="Botão de seleção do local"
                                        placeholder="Selecionar local..."
                                        onValueChange={(espaco) => {
                                            setInputErrors(prevErrors => ({ ...prevErrors, localInvalid: false }));
                                            setInputLocalReserva(espaco);
                                        }}
                                    >
                                        {
                                            espacosEsportivos && espacosEsportivos.length > 0
                                                ? espacosEsportivos.map((espaco, index) => (
                                                    <Select.Item key={index} label={espaco.nome} value={espaco.id} />
                                                ))
                                                : null
                                        }
                                    </Select>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        Indique o local de reserva
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <Flex flexDirection="row" flexWrap="wrap">
                                    {isLoadingForm ? (
                                        <Skeleton
                                            startColor="green.200"
                                            width={'50'}
                                            height={'8'}
                                            rounded={'50'}
                                            py="1.5"
                                            mr="1"
                                            mb="1"
                                        />
                                    ) : (
                                        informacoesEspacoEscolhido.listaEsportes?.map((esporte, index) => (
                                            <Badge
                                                key={`badge-${index}`}
                                                _text={{ fontSize: '10px', fontWeight: '400' }}
                                                py="1.5"
                                                mr="1"
                                                mb="1"
                                                colorScheme="success"
                                                variant="subtle"
                                                rounded="50"
                                            >
                                                {esporte?.nome}
                                            </Badge>
                                        ))
                                    )}
                                </Flex>

                            </Box>

                            <Divider></Divider>

                            {inputLocalReserva ? (
                                <>
                                    <Box mt={5} mb={5}>
                                        <Text fontSize={'2xl'} color="green.800" fontWeight={'semibold'}>2. Dados da reserva</Text>

                                        <FormControl isRequired isInvalid={inputErrors.qntParticipantesInvalid} marginBottom={3} >
                                            <FormControl.Label>Quantidade de participantes</FormControl.Label>
                                            <Input
                                                placeholder="Selecionar quantidade de pessoas..."
                                                keyboardType="numeric"
                                                onChangeText={(text) => {
                                                    setInputErrors(prevErrors => ({ ...prevErrors, qntParticipantesInvalid: false }));
                                                    setQntParticipantesReserva(text)
                                                }}
                                            />


                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                Indique a quantidade de participantes
                                            </FormControl.ErrorMessage>
                                        </FormControl>

                                        <FormControl isRequired isInvalid={inputErrors.dataReservaInvalid} marginBottom={3}>
                                            <FormControl.Label>Selecione o dia da reserva </FormControl.Label>
                                            <Pressable
                                                onPress={showDatepicker}
                                            >
                                                <Input
                                                    placeholder="Selecione o dia da reserva"
                                                    isReadOnly
                                                    value={dataReserva.toLocaleDateString()}
                                                />
                                            </Pressable>
                                            {show && (
                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    value={dataReserva}
                                                    mode={mode}
                                                    is24Hour={false}
                                                    onChange={(event, selectedDate) => {
                                                        onChange(event, selectedDate);
                                                        setInputErrors(prevErrors => ({ ...prevErrors, dataReservaInvalid: false }));
                                                    }}
                                                    minimumDate={new Date()}
                                                />
                                            )}
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                Indique a data de reserva
                                            </FormControl.ErrorMessage>
                                        </FormControl>

                                        <FormControl isRequired isInvalid={inputErrors.horarioInicioReservaInvalid} marginBottom={3}>
                                            <FormControl.Label>Selecione o horário inicial da reserva </FormControl.Label>
                                            <Select
                                                isReadOnly
                                                accessibilityLabel="Selecione o horário inicial da reserva"
                                                placeholder="Selecione o horário inicial..."
                                                mt="1"
                                                onValueChange={(horario) => {
                                                    setInputErrors(prevErrors => ({ ...prevErrors, horarioInicioReservaInvalid: false }));
                                                    setHorarioInicioReserva(horario);
                                                }}
                                            >
                                                {
                                                    horarioDisponivelData && horarioDisponivelData.horariosDisponiveis ?
                                                        horarioDisponivelData.horariosDisponiveis.map((horario, index) => (
                                                            <Select.Item key={index} label={horario.toString()} value={horario.toString()} />
                                                        )) : []

                                                }
                                            </Select>
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                Indique o horário de início da reserva
                                            </FormControl.ErrorMessage>
                                        </FormControl>


                                        <FormControl isRequired isInvalid={inputErrors.qntHorasInvalid}>
                                            <FormControl.Label>Por quanto tempo você deseja reservar o espaço? </FormControl.Label>
                                            <Slider defaultValue={1} size="md" colorScheme="green" w="90%" mx="auto" minValue={1} maxValue={sliderMax} 
                                                onChange={v => {
                                                    v && setQntHoras(v);
                                                }}>
                                                <Slider.Track>
                                                    <Slider.FilledTrack />
                                                </Slider.Track>
                                                <Slider.Thumb />
                                            </Slider>
                                            {horarioInicioReserva ? (
                                                <>
                                                    <Text>
                                                        Período: {horarioInicioReserva} até {addTimes(horarioInicioReserva, multTime(informacoesEspacoEscolhido.periodoLocacao, qntHoras))}
                                                    </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <FormControl.HelperText>
                                                        As informações do período da reserva aparecerão aqui.
                                                    </FormControl.HelperText>
                                                </>
                                            )}
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                Indique por quantas horas o local será reservado
                                            </FormControl.ErrorMessage>
                                        </FormControl>
                                    </Box>
                                    <Divider></Divider>
                                    <Box mt={5} mb={5}>
                                        <Text fontSize={'2xl'} color="green.800" fontWeight={'semibold'}>3. Objetivo da reserva</Text>
                                        <FormControl isRequired isInvalid={inputErrors.motivoSolicitacaoInvalid} marginBottom={3}>
                                            <FormControl.Label>Inclua o motivo da solicitação </FormControl.Label>
                                            <TextArea
                                                isInvalid={inputErrors.motivoSolicitacaoInvalid}
                                                placeholder="Por qual motivo você deseja reservar o espaço?"
                                                onChangeText={(text) => {
                                                    setMotivoSolicitacao(text)
                                                    setInputErrors(prevErrors => ({ ...prevErrors, motivoSolicitacaoInvalid: false }));
                                                }
                                                } />
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                Indique o motivo da reserva
                                            </FormControl.ErrorMessage>
                                        </FormControl>
                                    </Box>
                                    <Pressable
                                        w={'full'}
                                        flex={1}
                                        paddingY={5}
                                        borderRadius='full'
                                        backgroundColor={"success.500"}
                                        onPress={() => handleSubmit()}
                                        mb={10}>
                                        <VStack
                                            alignItems="center"
                                            justifyContent="center"
                                            flexDirection={'row'}
                                            space={2}>
                                            {isSending ? <Spinner accessibilityLabel="Entrando..." size={'sm'} color="white" /> : null}
                                            <Heading color="white" fontSize="md">
                                                {isSending ? ' Enviando solicitação...' : 'Enviar'}
                                            </Heading>
                                        </VStack>
                                    </Pressable>
                                </>
                            ) : (
                                <>
                                    <Text mt={'5'} fontSize={'2xl'} color="gray.500" fontWeight={'semibold'}>2. Dados da reserva</Text>
                                    <Text fontSize={'sm'} color="gray.500" fontWeight={'normal'}>Primeiro, selecione um espaço esportivo</Text>
                                </>
                            )}
                        </>
                    )}
                </Box>
            </ScrollView >
        </NativeBaseProvider >

    );
};

export default PageNovaReserva;

