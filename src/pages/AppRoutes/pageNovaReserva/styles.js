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
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.green
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  listItemIcon: {
    marginRight: 10,
  },
  listItemText: {
    fontSize: 18,
  },
  chevron: {
    alignSelf: 'flex-start'
  }
});


export default styles