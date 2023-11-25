import * as React from 'react';
import { View, Text, Image, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import styles from './styles';

import LogoSportEase from '../../../../assets/logo-sport-ease.png';
import Input from '../../../components/BasicTextInput';

import { validateEmail } from '../../../utils';
import ClienteService from '../../../api/ClienteService';

import { Pressable, VStack, Spinner, Heading} from 'native-base';

export default function PageKeywordReset() {

  const navigation = useNavigation();

  // Variáveis
  const [inputs, setInputs] = React.useState({ email: '' });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text.trim() }));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };

  const handleKeywordReset = async () => {
    setLoading(true)
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('O endereço de e-mail é obrigatório', 'email');
      isValid = false;
      setLoading(false)
    } else {
      let emailTrim = inputs.email.trim()
      setInputs({ "email": emailTrim })
      if (!validateEmail(inputs.email)) {
        isValid = false;
        handleError('Inclua um endereço de e-mail válido', 'email');
        setLoading(false)
      }
    }
    if (isValid) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const requestData = {
      "email": inputs.email
    }

    try {
      const response = await ClienteService.recuperarSenha(requestData);
      if (response) {
        Alert.alert("E-mail enviado", "Caso o usuário esteja registrado, ele receberá um e-mail contendo as instruções para redefinição de senha.")
        setLoading(false)

      }
    } catch (error) {
      Alert.alert("Opa...", error)
      handleError(error, 'email');
      setLoading(false)

    }

  }

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
        <Image source={LogoSportEase}
          style={{ width: 55.5, height: 55.5 }}></Image>
        <Text style={styles.headerText}> SportEase </Text>
      </View>

      {/* BODY SECTION */}

      <Text style={{ textAlign: 'center', marginHorizontal: 10 }}> Informe o seu e-mail cadastrado na plataforma para receber as instruções e recuperar sua senha. </Text>
      <View style={styles.inputContainer}>
        <Input
          inputType={'email'}
          keyboardType={'email-address'}
          autoCapitalize={'none'}
          autoComplete={'email'}
          onChangeText={text => handleOnchange(text, 'email')}
          onFocus={() => handleError(null, 'email')}
          placeholder="E-mail da conta..."
          error={errors.email}
        />
      </View>

      <Pressable
        mt={'10'}
        w={'4/5'}
        maxH={60}
        flex={1}
        paddingY={5}
        borderRadius='full'
        backgroundColor={"success.500"}
        onPress={handleKeywordReset}
        mb={10}
      >
        <VStack
          alignItems="center"
          justifyContent="center"
          flexDirection={'row'}
          space={2}
        >
          {loading ? <Spinner accessibilityLabel="Enviando..." size={'sm'} color="white" /> : null}
          <Heading color="white" fontSize="md">
            {loading ? ' Enviando...' : 'Recuperar senha'}
          </Heading>
        </VStack>
      </Pressable>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.simpleText, { marginBottom: 20 }]}>Cancelar</Text>
      </TouchableOpacity>

    </View>
  );
}