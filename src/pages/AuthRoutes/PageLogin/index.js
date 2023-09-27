import * as React from 'react';
import { View, Text, Image, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import styles from './styles';

import LogoSportEase from '../../../../assets/logo-sport-ease.png';
import Input from '../../../components/Inputs/input';
import ButtonLogin from '../../../components/Buttons/GreenButton';
import { useAuth } from '../../../contexts/AuthContext';

export default function PageLogin() {

  const navigation = useNavigation();

  // Variáveis
  const [inputs, setInputs] = React.useState({ email: '', senha: '' });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false); // Estado para indicar o carregamento
  const { onLogin, onLogout } = useAuth();


  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  // Validações de campo
  const handleLogin = async () => {
    
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
      setLoading(true);
      await sleep(500);

      const result = await onLogin(inputs.email, inputs.senha);
      if (result && result.error) {
        Alert.alert('Cadastro não encontrado', 'Usuário ou senha inválidos!');
      }
    
      setLoading(false);
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };

  // Incluindo fonte Poppins --------------
  const [loaded] = useFonts({
    Poppins: require('../../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    PoppinsBold: require('../../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('../../../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }
  // Término do import das fontes ----------

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Image source={LogoSportEase} style={{ width: 55.5, height: 55.5 }}></Image>
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

      {/* Botão de login com indicador de carregamento */}
      <ButtonLogin
        title={loading ? 'Entrando...' : 'Entrar'}
        onPress={handleLogin}
        disabled={loading} // Desativa o botão enquanto a autenticação estiver em andamento
      />

      <TouchableOpacity onPress={() => navigation.navigate('Autocadastro')}>
        <Text style={styles.simpleText}> Quero me cadastrar </Text>
      </TouchableOpacity>
    </View>
  );
}
