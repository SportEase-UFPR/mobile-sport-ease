import * as React from 'react';
import { View, Image, Keyboard, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import styles from './styles';
import { useEffect } from 'react';

import LogoSportEase from '../../../../assets/logo-sport-ease.png';
import Input from '../../../components/BasicTextInput';
import { useAuth } from '../../../contexts/AuthContext';

import { Slide, Alert, Text, AlertDialog, Button, Spinner, VStack, Heading, Pressable } from 'native-base';

export default function PageLogin() {
  const { authState } = useAuth();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (authState.authenticated === null) {
        setIsOpenTop(true);
        await sleep(3000)
        setIsOpenTop(false);
      }
    };

    checkAuthentication();
  }, [authState.authenticated]);


  const navigation = useNavigation();

  const [inputs, setInputs] = React.useState({ email: '', senha: '' });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [isOpenTop, setIsOpenTop] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);

  const str = `${isOpenTop ? "Hide" : "Sua sessao expirou"}`;

  const { onLogin } = useAuth();

  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

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
        setIsOpen(true)
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
      <Slide in={isOpenTop} placement="top" duration={1000}>
        <Alert justifyContent="center" status="error" safeAreaTop={8}>
          <Alert.Icon />
          <Text color="error.600" fontWeight="medium">
            Sua sessão expirou.
          </Text>
        </Alert>
      </Slide>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.Header>Falha na autenticação</AlertDialog.Header>
          <AlertDialog.Body>
            Ocorreu uma falha na autenticação. Revise suas credenciais e tente novamente.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="outline" colorScheme="primary" onPress={onClose}>
                OK
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Image source={LogoSportEase} style={{ width: 55.5, height: 55.5 }}></Image>
        <Text style={styles.headerText}> SportEase </Text>
      </View>

      {/* INPUTS PARA LOGIN */}
      <View style={styles.inputContainer}>
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
          autoCapitalize={'none'}
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


      <Pressable
        w={'4/5'}
        maxH={60}
        flex={1}
        paddingY={5}
        borderRadius='full'
        backgroundColor={"success.500"}
        onPress={handleLogin}
        mb={10}
      >
        <VStack
          alignItems="center"
          justifyContent="center"
          flexDirection={'row'}
          space={2}
        >
          {loading ? <Spinner accessibilityLabel="Entrando..." size={'sm'} color="white" /> : null}
          <Heading color="white" fontSize="md">
            {loading ? ' Entrando...' : 'Entrar'}
          </Heading>
        </VStack>
      </Pressable>


      <TouchableOpacity onPress={() => navigation.navigate('Autocadastro')}>
        <Text style={styles.simpleText}> Quero me cadastrar </Text>
      </TouchableOpacity>
    </View>
  );
}
