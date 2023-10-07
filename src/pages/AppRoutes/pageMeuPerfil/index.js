import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './styles';

import PageEditarPerfil from '../pageEditarPerfil';


import { useAuth } from '../../../contexts/AuthContext';

const PageMeuPerfil = ({ navigation }) => {
    const { onLogout, authState } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Olá, Fulano!</Text>
            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('PageEditarPerfil')}>
                <Feather name="edit-2" size={24} color="black" style={styles.listItemIcon} />
                <Text style={styles.listItemText}>Editar perfil</Text>
                <Feather name="chevron-right" size={24} color="gray" style={styles.chevron}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listItem} onPress={onLogout}>
                <Feather name="log-out" size={24} color="red" style={styles.listItemIcon} />
                <Text style={{color: 'red', fontSize: 18}} >Sair</Text>
                <Feather name="chevron-right" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );
};

export default PageMeuPerfil;