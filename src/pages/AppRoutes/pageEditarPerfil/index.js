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
  Button,
  Text,
} from 'native-base';
import COLORS from '../../../colors/colors';
import temaGeralFormulario from './nativeBaseTheme';
import ClienteService from '../../../api/ClienteService';
import { validateEmail } from '../../../utils';

export default function PageEditarPerfil({ navigation, route }) {
  const [user, setUser] = useState({
    nome: '',
    email: '',
    grr: '',
    cpf: '',
    novaSenha: '',
    confirmacaoNovaSenha: '',
    isStudent: false,
  });
  const [grr, setGrr] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [customErrorMessage, setCustomErrorMessage] = useState({});

  const handleInputChange = (name, value) => {
    setUser({ ...user, [name]: value });
    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    setCustomErrorMessage((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const toggleIsStudent = () => setUser({ ...user, isStudent: !user.isStudent });

  const validateAndSubmit = () => {
    Keyboard.dismiss();
    let isValid = true;

    // Validando campos obrigatórios
    if (!user.nome) {
      setFieldErrors(prevErrors => ({ ...prevErrors, nome: true }));
      isValid = false;
    }
    if (!user.email) {
      setFieldErrors(prevErrors => ({ ...prevErrors, email: true }));
      isValid = false;
    } else if (!validateEmail(user.email)) {
      setCustomErrorMessage(prevErrors => ({ ...prevErrors, email: 'Inclua um endereço de e-mail válido.' }));
      setFieldErrors(prevErrors => ({ ...prevErrors, email: true }));
      isValid = false;
    }

    if (user.novaSenha || user.confirmacaoNovaSenha) {
      if (user.novaSenha !== user.confirmacaoNovaSenha) {
        setFieldErrors(prevErrors => ({ ...prevErrors, novaSenha: true }));
        setFieldErrors(prevErrors => ({ ...prevErrors, confirmacaoNovaSenha: true }));
        isValid = false;
      } else {
        setFieldErrors(prevErrors => ({ ...prevErrors, novaSenha: false }));
        setFieldErrors(prevErrors => ({ ...prevErrors, confirmacaoNovaSenha: false }));
      }
    } else {
      setFieldErrors(prevErrors => ({ ...prevErrors, novaSenha: false }));
      setFieldErrors(prevErrors => ({ ...prevErrors, confirmacaoNovaSenha: false }));
    }

    if (user.novaSenha) {
      if (user.novaSenha.length < 6) {
        setFieldErrors(prevErrors => ({ ...prevErrors, novaSenha: true }));
        setCustomErrorMessage(prevErrors => ({ ...prevErrors, novaSenha: 'A senha deve possuir 6 ou mais caracteres.' }));
        isValid = false;
      }
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
    if (user.novaSenha) {
      requestData.senha = user.novaSenha;
    }
    if (user.grr) {
      requestData.grr = user.grr;
    }
    if (!user.isStudent) {
      requestData.grr = '';
      requestData.alunoUFPR = 0
    } else {
      requestData.alunoUFPR = 1
    }
    setIsLoading(true);

    try {
      const response = await ClienteService.editarDadosCliente(requestData)
      if (response) {
        Alert.alert('Sucesso', 'A edição ocorreu conforme esperado!')
        navigation.navigate('MeuPerfil', { param: 'reload' })
      }
    } catch (error) {
      // Trata o erro de forma mais específica
      Alert.alert('Erro', error);
    }
    setIsLoading(false);
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
      }),
        setGrr(grr));
    } else {

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

            <FormControl isInvalid={fieldErrors.novaSenha}>
              <FormControl.Label>Nova Senha</FormControl.Label>
              <Input
                value={user.novaSenha}
                onChangeText={(value) => handleInputChange('novaSenha', value)}
                type="password"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {customErrorMessage.novaSenha ? customErrorMessage.novaSenha : 'As senhas devem ser iguais.'}
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
                {customErrorMessage.confirmacaoNovaSenha ? customErrorMessage.confirmacaoNovaSenha : 'As senhas devem ser iguais.'}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl>

              <FormControl.Label _style={{ flex: 1 }} alignItems={'center'}>
                <Switch ml={-1} mr={1}
                  offTrackColor="gray.200" onTrackColor="emerald.200" onThumbColor="green.500" offThumbColor="green.50"
                  isChecked={user.isStudent} onToggle={toggleIsStudent} />
                Sou aluno da UFPR
              </FormControl.Label>

            </FormControl>

            {user.isStudent && (
              <FormControl isDisabled={!!grr}>
                <FormControl.Label>GRR</FormControl.Label>
                <Input
                  isReadOnly={!!grr}
                  value={user.grr}
                  onChangeText={(value) => handleInputChange('grr', value)}
                />
              </FormControl>
            )}

            <Button
              w="full"
              mt={5}
              flex={1}
              py={5}
              borderRadius="full"
              backgroundColor="success.500"
              onPress={() => validateAndSubmit()}
              mb={10}
              isDisabled={isLoading}
              isLoading={isLoading}
              _loading={{
                bg: "success.500",
                _text: {
                  color: "white",
                },
              }}
              _text={{
                color: "white",
                fontSize: "md",
              }}
            >
              {isLoading ? (
                <Text>
                  <Spinner
                    mr={2}
                    accessibilityLabel="Enviando solicitação..."
                    size={"md"}
                    color="white"
                  />
                </Text>
              ) : (
                <Text
                  accessibilityLabel="Enviando solicitação..."
                  color="white"
                  fontSize={'md'}
                >
                  Editar
                </Text>
              )}
            </Button>

          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
}
