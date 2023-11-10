import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './styles';
import { Box, Flex, Heading, Text, Pressable, Container, Center } from 'native-base';

import { useAuth } from '../../../contexts/AuthContext';
import ClienteService from '../../../api/ClienteService';
import COLORS from '../../../colors/colors';

const PageMeuPerfil = ({ navigation }) => {
    const { onLogout } = useAuth();
    const [headerText, setHeaderText] = useState('');


    const carregarNomeUsuario = async () => {
        const result = await ClienteService.getInformacoesUsuario();
        if (result.nome) {
            const primeiroNome = result.nome.split(' ')[0];
            setHeaderText('Olá, ' + primeiroNome + '!');
        } else {
            setHeaderText('');
        }
    }

    useEffect(() => {
        carregarNomeUsuario();
    }, [])

    return (
        <Box mt={25} mb={25} paddingX={5}>

            <Heading borderColor={COLORS.green} borderLeftWidth={20} color={COLORS.green} fontSize={'3xl'} marginBottom={10} paddingLeft={'30px'}>
                {headerText}
            </Heading>

            <Pressable
                onPress={() => navigation.navigate('PageEditarPerfil')}
                overflow="hidden"
                display="flex"
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                marginBottom={5}>

                <Flex direction="row" align="center">
                    <Feather name="edit-2" size={24} color="black" style={styles.listItemIcon} />
                    <Text color="coolGray.800" fontWeight="medium" fontSize="xl">
                        Editar perfil
                    </Text>
                </Flex>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </Pressable>
            <Pressable
                onPress={() => onLogout()}
                overflow="hidden"
                display="flex"
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Flex direction="row" align="center">
                    <Feather name="log-out" size={24} color="red" style={styles.listItemIcon} />
                    <Text color="red.500" fontWeight="medium" fontSize="xl">
                        Sair
                    </Text>
                </Flex>
                <Feather name="chevron-right" size={24} color="red" style={styles.chevron} />
            </Pressable>
        </Box>
    );
};

export default PageMeuPerfil;