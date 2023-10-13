import { StyleSheet } from 'react-native';
import { Dimensions } from "react-native";
import COLORS from '../../../colors/colors';

// Recolhendo dimensão da tela
var width = Dimensions.get('window').width; //full width


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 30,
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.green
  },
  inputContainer: {
    marginVertical: 20,
  },
  inputContainerItem: {
    marginBottom: 20,
  },
  containerHeader: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left',
    fontWeight: 'bold',
    color: COLORS.green
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.greyText
  },
  chevron: {
    alignSelf: 'flex-start'
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});


export default styles