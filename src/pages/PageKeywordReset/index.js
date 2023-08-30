import * as React from 'react';
import { View, Text, Image, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

import LogoSportEase from '../../../assets/logo-sport-ease.png';
import Input from '../../components/Inputs/input';
import ButtonLogin from '../../components/Buttons/GreenButton';

import authService from '../../services/auth';

export default function PageLogin() {

  const navigation = useNavigation();

  // Variáveis
  const [inputs, setInputs] = React.useState({ email: '', senha: '' });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

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

      <Text style={{textAlign:'center', marginHorizontal:10}}> Informe o seu e-mail cadastrado na plataforma para receber as instruções e recuperar sua senha. </Text>
      <View style={styles.inputContainer}>
        <Input
          onChangeText={text => handleOnchange(text, 'email')}
          onFocus={() => handleError(null, 'email')}
          iconName="email-outline"
          placeholder="E-mail..."
          error={errors.email}
        />

      </View>

      <ButtonLogin
        title={'Recuperar Senha'}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.simpleText, { marginBottom: 20 }]}>Cancelar</Text>
      </TouchableOpacity>

    </View>
  );
}