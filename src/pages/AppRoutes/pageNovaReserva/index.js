import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import COLORS from '../../../colors/colors';

const PageNovaReserva = () => {
    const [local, setLocal] = useState('');
    const [dataReserva, setDataReserva] = useState(new Date());
    const [horaReservaInicio, sethoraReservaInicio] = useState(new Date());
    const [horaReservaFim, sethoraReservaFim] = useState(new Date());
    const [objetivo, setObjetivo] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const locais = ['Ginásio coberto', 'Quadra I', 'Quadra Futebol']; // Lista de locais mocada

    return (
        <View style={{ padding: 20 }}>

            <Text>Dados do local</Text>
            
            <View style={styles.inputContainer}>
                <Picker
                    selectedValue={local}
                    style={styles.picker}
                    onValueChange={(itemValue) => setLocal(itemValue)}
                >
                    {locais.map((item, index) => (
                        <Picker.Item label={item} value={item} key={index} />
                    ))}
                </Picker>
            </View>

            <Text>Informações sobre a reserva</Text>

            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Text>{dataReserva.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dataReserva}
                        mode="date"
                        onChange={(event, date) => {
                            setDataReserva(date || dataReserva);
                            setShowDatePicker(false);
                        }}
                    />
                )}
            </View>

            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                    <Text>{horaReservaInicio.toLocaleTimeString()}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker
                        value={horaReservaInicio}
                        mode="time"
                        display="spinner"
                        onChange={(event, time) => {
                            setHoraReservaInicio(time || horaReservaInicio);
                            setShowTimePicker(false);
                        }}
                    />
                )}
            </View>

            <Text>Objetivo da reserva</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Detalhe o motivo da solicitação e incluas informações sobre os participantes"
                    multiline={true}
                    value={objetivo}
                    onChangeText={setObjetivo}
                    style={styles.textArea}
                />
            </View>

            <TouchableOpacity style={{ backgroundColor: COLORS.green, padding: 10, borderRadius: 8 }}>
                <Text style={{ textAlign: 'center', color: 'white' }}>Enviar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 10, backgroundColor: COLORS.red, padding: 10, borderRadius: 8 }}>
                <Text style={{ textAlign: 'center', color: 'white' }}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: COLORS.light,
    },
    picker: {
        flex: 1,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },

});

export default PageNovaReserva;