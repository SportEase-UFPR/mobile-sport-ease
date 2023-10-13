import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Button, ScrollView, TextInput, Alert } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';
import Input from '../../../components/BasicTextInput';
import { listarEspacosEsportivos } from '../../../services/espacosEsportivosService';
import { listarHorariosDisponiveis, solicitarLocacao } from '../../../services/locacaoService';
import GreenButton from '../../../components/BasicButton';
import Divisor from '../../../components/Divisor';
import BasicButton from '../../../components/BasicButton';

const PageNovaReserva = () => {
    const [localReserva, setLocalReserva] = useState([]);
    const [espacosEsportivos, setEspacosEsportivos] = useState([]);
    const [idEspacoEsportivo, setIdEspacoEsportivo] = useState(null);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [horarioInicioReserva, setHorarioInicioReserva] = useState([]);
    const [horarioDisponivelData, setHorarioDisponivelData] = useState([]);
    const [qntHoras, setQntHoras] = useState([]);
    const [motivoSolicitacao, setMotivoSolicitacao] = useState('');
    const [dataReserva, setDataReserva] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const { control, handleSubmit } = useForm();

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
        if (idEspacoEsportivo && dataReserva) {
            carregarHorariosDisponiveis(dataReserva, idEspacoEsportivo);
        }
    }, [idEspacoEsportivo, dataReserva]);

    useEffect(() => {
        setHorarioDisponivelData(horariosDisponiveis);
    }, [horariosDisponiveis]);

    const findEspacoIdByName = (nomeEspaco) => {
        const espaco = espacosEsportivos.find((item) => item.nome === nomeEspaco);
        setIdEspacoEsportivo(espaco ? espaco.id : null);
    };

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

    const showTimepicker = () => {
        showMode('time');
    };

    const submitHandler = async (formData) => {
        const novaDataReservaInicio = new Date(dataReserva);
        const [horas, minutos] = horarioInicioReserva.split(':').map(Number);
        novaDataReservaInicio.setHours(horas);
        novaDataReservaInicio.setMinutes(0);
        novaDataReservaInicio.setSeconds(0);
        novaDataReservaInicio.setMilliseconds(0);
        const novaDataReservaFim = new Date(novaDataReservaInicio);
        novaDataReservaFim.setHours(horas+3);
        
        try {
            const dadosDaLocacao = {
                motivoSolicitacao: motivoSolicitacao,
                qtdParticipantes: parseInt(formData.qntParticipantesReserva),
                dataHoraInicioReserva: novaDataReservaInicio.toISOString(),
                dataHoraFimReserva: novaDataReservaFim.toISOString(),
                idEspacoEsportivo: idEspacoEsportivo,
            };

            const response = await solicitarLocacao(dadosDaLocacao);

            if (response) {
                Alert.alert('Sucesso!', 'Solicitação criada com sucesso!');
            }

        } catch (error) {
            Alert.alert('Erro!', 'Não foi possível seguir com a solicitação');
        }
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Text style={styles.header}>Nova solicitação de reserva</Text>
                <View style={styles.inputContainer}>
                    <View style={styles.inputContainerItem}>
                        <Text style={styles.containerHeader}>Dados do local</Text>
                        <Text style={styles.listItemText}>Selecione o local desejado *</Text>

                        <SelectList
                            setSelected={(espaco) => {
                                setLocalReserva(espaco);
                                findEspacoIdByName(espaco)
                            }}
                            data={espacosEsportivos.map((espaco) => ({ label: espaco.nome, value: espaco.nome }))}
                            save="localReserva"
                            search={false}
                            placeholder="Selecione o local da reserva"
                        />
                    </View>
                    
                    <View style={styles.inputContainerItem}>
                        <Text style={styles.listItemText}>Quantidade de participantes *</Text>
                        <Controller
                            control={control}
                            name='qntParticipantesReserva'
                            render={({ field: { value, onChange } }) => (
                                <Input
                                    onChangeText={onChange}
                                    value={value}
                                    save="qntParticipantesReserva"
                                    search={false}
                                    placeholder="Indique a quantidade de pessoas"
                                    numeric={true}
                                />
                            )}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.inputContainerItem}>
                        <Text style={styles.containerHeader}>Dados da reserva</Text>
                        <Text style={styles.listItemText}>Selecione o dia da reserva *</Text>
                        <SafeAreaView>
                            <Button onPress={showDatepicker} title="Selecione o dia da reserva..." />
                            <Text>Data selecionada: {dataReserva.toLocaleDateString()}</Text>
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={dataReserva}
                                    mode={mode}
                                    is24Hour={false}
                                    onChange={onChange}
                                    minimumDate={new Date()}
                                />
                            )}
                        </SafeAreaView>
                    </View>
                    <View style={styles.inputContainerItem}>
                        <Text style={styles.listItemText}>Selecione o horário inicial da reserva *</Text>

                        <SelectList
                            setSelected={(value) => setHorarioInicioReserva(value)}
                            data={horarioDisponivelData && horarioDisponivelData.horaInteira ?
                                horarioDisponivelData.horaInteira.map((hora) => ({ label: hora.toString(), value: hora.toString() })) : []
                            }
                            save="horarioDisponivel"
                            search={false}
                            placeholder="Selecione o horário..."
                        />
                    </View>
                    <View style={styles.inputContainerItem}>
                        <Text style={styles.listItemText}>Selecione a quantidade de horas a serem reservadas *</Text>
                        <Controller
                            control={control}
                            name='qntParticipantesReserva'
                            render={({ field: { value, onChange } }) => (
                                <Input
                                    onChangeText={onChange}
                                    value={value}
                                    save="qntParticipantesReserva"
                                    search={false}
                                    placeholder="Indique a quantidade de horas..."
                                    numeric={true}
                                />
                            )}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.inputContainerItem}>
                        <Text style={styles.containerHeader}>Objetivo da reserva</Text>
                        <Text style={styles.listItemText}>Inclua o motivo da solicitação * </Text>
                        <TextInput
                            onChangeText={(text) => setMotivoSolicitacao(text)}
                            value={motivoSolicitacao}
                            placeholder="Detalhe o motivo da solicitação e inclua informações sobre os participantes"
                            multiline={true}
                            numberOfLines={4}
                        />
                    </View>
                </View>

                <BasicButton color={'green'} title={"Enviar"} onPress={handleSubmit(submitHandler)} />
            </View>
        </ScrollView>
    );
};

export default PageNovaReserva;

