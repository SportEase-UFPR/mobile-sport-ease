import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { listarEspacosEsportivos } from '../../../services/espacosEsportivosService';
import { listarHorariosDisponiveis, solicitarLocacao } from '../../../services/locacaoService';
import { Box, TextArea, Heading, Text, Pressable, ScrollView, FormControl, Input, WarningOutlineIcon, Select, CheckIcon, Button } from 'native-base';


const PageNovaReserva = () => {
    const [inputLocalReserva, setInputLocalReserva] = useState(null);
    const [horarioInicioReserva, setHorarioInicioReserva] = useState(null);
    const [horarioDisponivelData, setHorarioDisponivelData] = useState(null);
    const [qntParticipantesReserva, setQntParticipantesReserva] = useState(null);
    const [qntHoras, setQntHoras] = useState(null);
    const [motivoSolicitacao, setMotivoSolicitacao] = useState('');
    const [dataReserva, setDataReserva] = useState(new Date());
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [espacosEsportivos, setEspacosEsportivos] = useState([]);

    const [inputErrors, setInputErrors] = useState({})

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    useEffect(() => {
        const carregarEspacosEsportivos = async () => {
            try {
                const result = await listarEspacosEsportivos();
                setEspacosEsportivos(result);
            } catch (error) {
                console.error('Erro ao carregar espaços esportivos:', error);
            }
        };

        carregarEspacosEsportivos();
    }, []);

    useEffect(() => {
        if (inputLocalReserva && dataReserva) {
            carregarHorariosDisponiveis(dataReserva, inputLocalReserva);
        }
    }, [inputLocalReserva, dataReserva]);

    useEffect(() => {
        setHorarioDisponivelData(horariosDisponiveis);
    }, [horariosDisponiveis]);

    const carregarHorariosDisponiveis = async (dataReserva, idEspacoEsportivo) => {
        try {
            const requestData = {
                data: dataReserva.toISOString(),
                idEspacoEsportivo: idEspacoEsportivo,
            };

            const result = await listarHorariosDisponiveis(requestData);
            setHorariosDisponiveis(result);
        } catch (error) {
            console.error('Erro ao carregar horários disponíveis:', error);
        }
    };

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
        console.log('chamou handleSubmit')
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
            const novaDataReservaInicio = new Date(dataReserva);
            const [horas, minutos] = horarioInicioReserva.split(':').map(Number);
            novaDataReservaInicio.setHours(horas);
            novaDataReservaInicio.setMinutes(0);
            novaDataReservaInicio.setSeconds(0);
            novaDataReservaInicio.setMilliseconds(0);
            const novaDataReservaFim = new Date(novaDataReservaInicio);
            novaDataReservaFim.setHours(horas + 3);

            console.log(motivoSolicitacao);
            console.log(qntParticipantesReserva);
            console.log(novaDataReservaInicio.toISOString());
            console.log(novaDataReservaFim.toISOString());
            console.log(inputLocalReserva)
            try {
                const dadosDaLocacao = {
                    motivoSolicitacao: motivoSolicitacao,
                    qtdParticipantes: parseInt(qntParticipantesReserva),
                    dataHoraInicioReserva: novaDataReservaInicio.toISOString(),
                    dataHoraFimReserva: novaDataReservaFim.toISOString(),
                    idEspacoEsportivo: inputLocalReserva,
                };

                const response = await solicitarLocacao(dadosDaLocacao);

                if (response) {
                    Alert.alert('Sucesso!', 'Solicitação criada com sucesso!');
                }

            } catch (error) {
                Alert.alert('Erro!', 'Não foi possível seguir com a solicitação');
            }
        }
    };

    return (
        <ScrollView>
            <Box mt={25} mb={25} paddingX={5} >
                <Heading color="green.500" fontSize={'4xl'} marginBottom={10}>
                    Nova solicitação de reserva
                </Heading>
                <Box mb={10}>
                    <Text fontSize={'lg'} color="green.500" fontWeight={'semibold'}>Dados do local</Text>
                    <FormControl isRequired isInvalid={inputErrors.localInvalid} marginBottom={3}>
                        <FormControl.Label>Selecione o local desejado </FormControl.Label>
                        <Select
                            isReadOnly
                            borderRadius={"md"}
                            accessibilityLabel="Selecione o local desejado"
                            placeholder="Selecione um local..."
                            _selectedItem={{
                                bg: "black.500",
                                endIcon: <CheckIcon size={5} />
                            }} mt="1"
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

                    <FormControl isRequired isInvalid={inputErrors.qntParticipantesInvalid}>
                        <FormControl.Label>Quantidade de participantes </FormControl.Label>
                        <Input
                            variant="outline"
                            placeholder="Quantidade total de participantes..."
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
                </Box>
                <Box mb={10}>
                    <Text fontSize={'lg'} color="green.500" fontWeight={'semibold'}>Dados da reserva</Text>
                    <FormControl isRequired isInvalid={inputErrors.dataReservaInvalid} marginBottom={3}>
                        <FormControl.Label>Selecione o dia da reserva </FormControl.Label>
                        <Pressable
                            onPress={showDatepicker}
                        >
                            <Input
                                variant="outline"
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
                            borderRadius={"md"}
                            accessibilityLabel="Selecione o horário inicial da reserva"
                            placeholder="Selecione o horário inicial..."
                            _selectedItem={{
                                bg: "black.500",
                                endIcon: <CheckIcon size={5} />
                            }} mt="1"
                            onValueChange={(horario) => {
                                setInputErrors(prevErrors => ({ ...prevErrors, horarioInicioReservaInvalid: false }));
                                setHorarioInicioReserva(horario);
                            }}
                        >
                            {
                                horarioDisponivelData && horarioDisponivelData.horaInteira ?
                                    horarioDisponivelData.horaInteira.map((horario, index) => (
                                        <Select.Item key={index} label={horario.toString()} value={horario.toString()} />
                                    )) : []

                            }
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            Indique o horário de início da reserva
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={inputErrors.qntHorasInvalid}>
                        <FormControl.Label>Selecione a quantidade de horas a serem reservadas </FormControl.Label>
                        <Input
                            variant="outline"
                            placeholder="Quantidade de horas da reserva..."
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                setQntHoras(text)
                                setInputErrors(prevErrors => ({ ...prevErrors, qntHorasInvalid: false }));
                            }}
                        />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            Indique por quantas horas o local será reservado
                        </FormControl.ErrorMessage>
                    </FormControl>
                </Box>

                <Box mb={5}>
                    <Text fontSize={'lg'} color="green.500" fontWeight={'semibold'}>Objetivo da reserva</Text>
                    <FormControl isRequired isInvalid={inputErrors.motivoSolicitacaoInvalid} marginBottom={3}>
                        <FormControl.Label>Inclua o motivo da solicitação </FormControl.Label>
                        <TextArea
                            isInvalid={inputErrors.motivoSolicitacaoInvalid}
                            placeholder="Inclua uma breve descrição do motivo pelo qual você deseja reservar a área..."
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
                <Button
                    onPress={() => handleSubmit()}
                    backgroundColor={'green.500'}
                    size={'lg'}
                    borderRadius={'full'}
                >Enviar</Button>
            </Box>

        </ScrollView>
    );
};

export default PageNovaReserva;

