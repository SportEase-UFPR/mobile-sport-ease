import * as React from 'react';
import { View, Image, Keyboard, Alert, TouchableOpacity, ScrollView, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import styles from './styles';
import { useAuth } from '../../../contexts/AuthContext';
import { VStack, HStack, Pressable, Spinner, Heading, Switch } from 'native-base';
//import { Switch } from 'react-native-elements';

import LogoSportEase from '../../../../assets/logo-sport-ease.png';
import Input from '../../../components/BasicTextInput';

export default function PageAutocadastro() {
  const { onCadastrar } = useAuth();
  const navigation = useNavigation();
  const [inputs, setInputs] = React.useState({
    nomeCompleto: '',
    email: '',
    cpf: '',
    grr: '',
    senha: '',
    confirmacaoSenha: ''
  });
  const [errors, setErrors] = React.useState({});
  const [isStudent, setIsStudent] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  const toggleIsStudent = () => setIsStudent(!isStudent);


  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.nomeCompleto) {
      handleError('Nome completo é obrigatório', 'nomeCompleto');
      isValid = false;
    }
    if (!inputs.email) {
      handleError('O endereço de e-mail é obrigatório', 'email');
      isValid = false;
    }
    if (!inputs.cpf) {
      handleError('CPF é obrigatório', 'cpf');
      isValid = false;
    }
    if (isStudent && !inputs.grr) {
      handleError('GRR é obrigatório', 'grr');
      isValid = false;
    }
    if (!inputs.senha) {
      handleError('A senha é obrigatória', 'senha');
      isValid = false;
    }
    if (inputs.senha !== inputs.confirmacaoSenha) {
      handleError('As senhas não coincidem', 'confirmacaoSenha');
      isValid = false;
    }

    if (isValid) {
      autocadastro();
    }
  };

  const autocadastro = async () => {
    try {
      const response = await onCadastrar({
        nome: inputs.nomeCompleto,
        email: inputs.email,
        cpf: inputs.cpf,
        alunoUFPR: isStudent,
        grr: isStudent ? inputs.grr.toUpperCase : null,
        senha: inputs.senha
      });

      if (response.data && response.data.id) {
        Alert.alert('Sucesso', 'Um e-mail com o link de ativação foi enviado para você!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', response.msg);
      }
    } catch (error) {
      Alert.alert('Erro', 'Houve um erro ao realizar o autocadastro. Verifique seus dados e tente novamente.');
    }
  };


  const handleOnchange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };

  const [loaded] = useFonts({
    Poppins: require('../../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    PoppinsBold: require('../../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('../../../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image source={LogoSportEase} style={{ width: 55.5, height: 55.5 }} />
          <Text style={styles.headerText}> SportEase </Text>
        </View>

        <Text style={styles.emphasisText}> Criar Conta </Text>

        <View style={styles.inputContainer}>
          <Input
            onChangeText={text => handleOnchange(text, 'nomeCompleto')}
            onFocus={() => handleError(null, 'nomeCompleto')}
            iconName="account-outline"
            placeholder="Nome completo..."
            error={errors.nomeCompleto}
          />

          <Input
            inputType={'email'}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            autoComplete={'email'}
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="email-outline"
            placeholder="E-mail..."
            error={errors.email}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'cpf')}
            onFocus={() => handleError(null, 'cpf')}
            iconName="card-outline"
            placeholder="CPF..."
            error={errors.cpf}
          />

          <HStack mt="4" alignItems="center" space={2}>
            <Switch isChecked={isStudent} onToggle={toggleIsStudent} />
            <Text fontSize={15}>Sou estudante UFPR</Text>
          </HStack>

          {isStudent && (
            <Input
              onChangeText={text => handleOnchange(text, 'grr')}
              onFocus={() => handleError(null, 'grr')}
              iconName="account-card-details-outline"
              placeholder="GRR completo. Ex.: GRR00010002"
              error={errors.grr}
            />
          )}

          <Input
            onChangeText={text => handleOnchange(text, 'senha')}
            onFocus={() => handleError(null, 'senha')}
            iconName="lock-outline"
            placeholder="Senha..."
            password={true}
            error={errors.senha}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'confirmacaoSenha')}
            onFocus={() => handleError(null, 'confirmacaoSenha')}
            iconName="lock-outline"
            placeholder="Confirmar Senha..."
            password={true}
            error={errors.confirmacaoSenha}
          />
        </View>
        <Pressable
          w={'4/5'}
          maxH={60}
          flex={1}
          paddingY={5}
          borderRadius='full'
          backgroundColor={"success.500"}
          onPress={validate}
          mb={10}
        >
          <VStack
            alignItems="center"
            justifyContent="center"
            flexDirection={'row'}
            space={2}
          >
            {isSending ? <Spinner accessibilityLabel="Entrando..." size={'sm'} color="white" /> : null}
            <Heading color="white" fontSize="md">
              {isSending ? ' Enviando...' : 'Cadastrar'}
            </Heading>
          </VStack>
        </Pressable>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.simpleText, { marginBottom: 80 }]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
