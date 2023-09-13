import * as React from 'react';
import { View, Text, Image, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

import AuthContext from '../../contexts/auth';

import LogoSportEase from '../../../assets/logo-sport-ease.png';
import Input from '../../components/Inputs/input';
import ButtonLogin from '../../components/Buttons/GreenButton';

import authService from '../../services/auth';

export default function PageLogin() {

  const navigation = useNavigation();

  // Variáveis
  const [inputs, setInputs] = React.useState({ email: '', senha: '' });
  const [errors, setErrors] = React.useState({});
  const { signed, signIn } = React.useContext(AuthContext);


  // Variável de login
  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('O endereço de e-mail é obrigatório', 'email');
      isValid = false;
    }
    if (!inputs.senha) {
      handleError('A senha é obrigatória', 'senha');
      isValid = false;
    }
    if (isValid) {
      login();
    }
  };

  const login = () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      let userData = await AsyncStorage.getItem('userData');
      if (userData) {
        userData = JSON.parse(userData);
        if (
          inputs.email == userData.email &&
          inputs.senha == userData.senha
        ) {
          navigation.navigate('HomeScreen');
          AsyncStorage.setItem(
            'userData',
            JSON.stringify({ ...userData, loggedIn: true }),
          );
        } else {
          Alert.alert('Erro', 'Usuário ou senha inválidos');
        }
      } else {
        Alert.alert('Erro', 'Usuário não existe');
      }
    }, 3000);
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };

  // Incluindo fonte Poppins --------------
  const [loaded] = useFonts({
    Poppins: require('../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    PoppinsBold: require('../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('../../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }
  // Término do import das fontes ----------

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Image source={LogoSportEase}
          style={{ width: 55.5, height: 55.5 }}></Image>
        <Text style={styles.headerText}> SportEase </Text>
      </View>

      {/* INPUTS PARA LOGIN */}

      <View style={styles.inputContainer}>
        <Input
          onChangeText={text => handleOnchange(text, 'email')}
          onFocus={() => handleError(null, 'email')}
          iconName="email-outline"
          placeholder="E-mail..."
          error={errors.email}
        />

        <Input
          onChangeText={text => handleOnchange(text, 'senha')}
          onFocus={() => handleError(null, 'senha')}
          iconName="email-outline"
          placeholder="Senha..."
          password={true}
          error={errors.senha}
        />

      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Recuperar Senha')}>
        <Text style={[styles.simpleText, { marginBottom: 20 }]}>Esqueci a senha</Text>
      </TouchableOpacity>

      <ButtonLogin
        title={'Entrar'}
        onPress={validate}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Autocadastro')}>
        <Text style={styles.simpleText}> Quero me cadastrar </Text>
      </TouchableOpacity>

    </View>
  );
}