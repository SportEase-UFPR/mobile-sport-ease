import { StyleSheet } from 'react-native';
import { Dimensions } from "react-native";
import COLORS from '../../colors/colors';

// Recolhendo dimensão da tela
var width = Dimensions.get('window').width; //full width


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9fafb',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContainer: {
      flexDirection: 'row',      
      alignItems: 'center',
      marginBottom: 20
    },
    inputContainer: {
      marginTop:50,
      textAlign: 'center',      
      width: width,
      paddingHorizontal:30,
    },

    simpleText: {
      fontFamily: 'Poppins',
      color: COLORS.blue
    },

    headerText: {
      marginLeft:10,
      fontFamily: 'PoppinsSemiBold',
      fontSize: 22,
      color: COLORS.darkBlue,
    }


  });

export default styles