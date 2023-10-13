import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '../../colors/colors';

const Divisor = () => {
  return (
    <View style={styles.divisor} />
  );
};

const styles = StyleSheet.create({
  divisor: {
    borderBottomColor: COLORS.green,
    borderBottomWidth: 1,
    width: '100%',
  },
});

export default Divisor;
