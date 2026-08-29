import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ value, setValue, placeholder, style, secureTextEntry, keyboardType }) => {
  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      style={[styles.input, style]}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholderTextColor="#aaa"
    />
  );
};
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default CustomInput;
