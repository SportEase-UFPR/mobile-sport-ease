import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from '../../colors/colors';

const BasicButton = ({ title, onPress = () => { } }) => {
  const trueColor = COLORS.color
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
        }
      ]}>
      <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 18 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};


export default BasicButton;