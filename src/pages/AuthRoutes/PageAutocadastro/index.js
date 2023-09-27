import * as React from 'react';
import { View, Text, Image, Keyboard, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

import LogoSportEase from '../../../../assets/logo-sport-ease.png';
import Input from '../../../components/Inputs/input';
import ButtonLogin from '../../../components/Buttons/GreenButton';

export default function PageAutocadastro() {

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

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;

    // Add validations for all the fields
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

  const autocadastro = () => {
    // Integrar com o serviço de autocadastro
    Alert.alert('Sucesso', 'Autocadastro realizado com sucesso!');
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

          <CheckBox
            title="Sou aluno(a) da UFPR"
            checked={isStudent}
            onPress={() => setIsStudent(!isStudent)}
          />

          {isStudent && (
            <Input
              onChangeText={text => handleOnchange(text, 'grr')}
              onFocus={() => handleError(null, 'grr')}
              iconName="account-card-details-outline"
              placeholder="GRR..."
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

        <ButtonLogin
          title={'Cadastrar'}
          onPress={validate}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.simpleText, { marginBottom: 80 }]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
