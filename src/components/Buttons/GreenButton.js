import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import COLORS from '../../colors/colors';

const GreenButton = ({title, onPress = () => {}}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
        borderRadius: 25,
        height: 55,
        marginHorizontal: 20,
        width: '80%',
        backgroundColor: COLORS.green,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      style.shadowProp
      ]}>
      <Text style={{color: COLORS.white, fontWeight: 'bold', fontSize: 18}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
    shadowProp: {
        shadowColor: '#000000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
});

export default GreenButton;