import React, { useState, useEffect } from 'react';
import { Keyboard, Alert, ScrollView } from 'react-native';
import {
  Box,
  VStack,
  FormControl,
  Input,
  Switch,
  Heading,
  NativeBaseProvider,
  Spinner,
  WarningOutlineIcon,
  Pressable
} from 'native-base';
import COLORS from '../../../colors/colors';
import temaGeralFormulario from './nativeBaseTheme';
import ClienteService from '../../../api/ClienteService';

export default function PageEditarPerfil({ route }) {
  const [user, setUser] = useState({
    nome: '',
    email: '',
    grr: '',
    cpf: '',
    novaSenha: '',
    confirmacaoNovaSenha: '',
    isStudent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (name, value) => {
    setUser({ ...user, [name]: value });
    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const toggleIsStudent = () => setUser({ ...user, isStudent: !user.isStudent });

  const validateAndSubmit = () => {
    Keyboard.dismiss();
    let isValid = true; // Alterado para 'let'

    // Validando campos obrigatórios
    if (!user.nome) {
      setFieldErrors(prevErrors => ({ ...prevErrors, nome: true }));
      isValid = false; // Alterado para modificar a variável existente
    }
    if (!user.email) {
      setFieldErrors(prevErrors => ({ ...prevErrors, email: true }));
      isValid = false;
    }
    if (user.novaSenha || user.confirmacaoNovaSenha) {
      if (user.novaSenha !== user.confirmacaoNovaSenha) {
        // Senhas não são iguais
        setFieldErrors(prevErrors => ({ ...prevErrors, confirmacaoNovaSenha: true }));
        isValid = false;
      } else {
        // Senhas são iguais
        setFieldErrors(prevErrors => ({ ...prevErrors, confirmacaoNovaSenha: false }));
      }
    } else {
      // Ambas as senhas estão vazias
      setFieldErrors(prevErrors => ({ ...prevErrors, confirmacaoNovaSenha: false }));
    }
    if (user.isStudent && !user.grr) {
      setFieldErrors(prevErrors => ({ ...prevErrors, isStudent: true }));
      isValid = false;
    }

    if (isValid) {
      setIsSending(true);
      editarPerfil();
      setIsSending(false);
    }
  };

  const editarPerfil = async () => {
    const requestData = {
      "nome": user.nome,
      "email": user.email
    }
    if (user.senha) {
      requestData.senha = user.senha;
    }
    if (user.grr) {
      requestData.grr = user.grr;
    }
    if (!user.isStudent) {
      requestData.grr = '';
    }

    try {
      const response = await ClienteService.setDadosCliente(requestData)
      if (response) {
        Alert.alert('Sucesso', 'A edição ocorreu conforme esperado!')
      }
    } catch (error) {
      Alert.alert('Erro', error.message)
    }
  }

  useEffect(() => {
    console.log(route.params);
    if (route?.params) {
      const { nome, email, cpf, grr } = route.params;
      setUser(prevUser => ({
        ...prevUser,
        nome: nome,
        email: email,
        cpf: cpf,
        grr: grr,
        novaSenha: '',
        confirmacaoNovaSenha: '',
        isStudent: grr ? true : false
      }));
    }
  }, [route.params?.user]);

  return (
    <NativeBaseProvider theme={temaGeralFormulario}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box mt={25} mb={25} paddingX={5}>
          <Heading
            borderColor={COLORS.green}
            borderLeftWidth={20}
            color={COLORS.green}
            fontSize={"3xl"}
            marginBottom={5}
            paddingLeft={"30px"}
          >
            Editar Perfil
          </Heading>
          <VStack space={3} mt="5">
            <FormControl isRequired isInvalid={fieldErrors.nome}>
              <FormControl.Label>Nome Completo</FormControl.Label>
              <Input
                value={user.nome}
                onChangeText={(value) => handleInputChange('nome', value)}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                É necessário incluir o seu nome.
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={fieldErrors.email}>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                value={user.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                É necessário incluir um endereço de e-mail.
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={fieldErrors.confirmacaoNovaSenha}>
              <FormControl.Label>Nova Senha</FormControl.Label>
              <Input
                value={user.novaSenha}
                onChangeText={(value) => handleInputChange('novaSenha', value)}
                type="password"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                As senhas devem ser iguais.
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={fieldErrors.confirmacaoNovaSenha}>
              <FormControl.Label>Confirmar Nova Senha</FormControl.Label>
              <Input
                value={user.confirmacaoNovaSenha}
                onChangeText={(value) => handleInputChange('confirmacaoNovaSenha', value)}
                type="password"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                As senhas devem ser iguais.
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl>

              <FormControl.Label _style={{ flex: 1 }} alignItems={'center'}>
                <Switch ml={-1} mr={2} isChecked={user.isStudent} onToggle={toggleIsStudent} />
                Sou aluno da UFPR
              </FormControl.Label>

            </FormControl>

            {user.isStudent && (
              <FormControl isDisabled={user.grr}>
                <FormControl.Label _disabled={{
                  _text: {
                    color: "gray.400",
                    fontWeight: "bold"
                  }
                }}>GRR</FormControl.Label>
                <Input
                  isReadOnly={!!user.grr}
                  value={user.grr}
                  onChangeText={(value) => handleInputChange('grr', value)}
                />
              </FormControl>
            )}

            <Pressable
              w={"full"}
              flex={1}
              paddingY={5}
              borderRadius="full"
              backgroundColor={"success.500"}
              onPress={() => validateAndSubmit()}
              mb={10}
            >
              <VStack
                alignItems="center"
                justifyContent="center"
                flexDirection={"row"}
                space={2}
              >
                {isLoading ? (
                  <Spinner
                    accessibilityLabel="Enviando..."
                    size={"sm"}
                    color="white"
                  />
                ) : null}
                <Heading color="white" fontSize="md">
                  {isLoading ? " Enviando solicitação..." : "Editar"}
                </Heading>
              </VStack>
            </Pressable>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
}
