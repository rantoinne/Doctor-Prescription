import React from 'react';
import {
  View,
  TextInput,
  Dimensions,
  Text
} from 'react-native';

const { width, height } = Dimensions.get('window');

const InputWithLabel = ({ label, placeholderText, placeholderTextColor, value, fnc, containerMargin, editable, onFocus, maxLength, minLength, showErrorMsg, errorMsg, keyboardType = "default" }) => {
  console.log('VALUE', value);
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: !!containerMargin ? containerMargin : height / 60
      }}
    >
      <Text
        style={{
          fontSize: height / 60,
          color: '#7327C280',
          fontFamily: 'roboto-italic',
          textAlign: 'center'
        }}
      >
        {label || ''}
      </Text>
      <TextInput
        editable={editable}
        placeholder={placeholderText || ''}
        placeholderTextColor={placeholderTextColor || "#7327C2"}
        value={value}
        keyboardType={keyboardType}
        onChangeText={(text) => {
          fnc(text)
        }}
        maxLength={maxLength}
        minLength={minLength}
        onFocus={onFocus}
        style={{
          width: '100%',
          height: height / 35,
          paddingVertical: 0,
          paddingHorizontal: 0,
          backgroundColor: 'transparent',
          fontFamily: 'roboto-italic',
          borderBottomWidth: 0.6,
          borderColor: '#c4c4c4',
          color: '#7327C2',
        }}
      />
      { showErrorMsg && (
        <Text
          style={{
            fontSize: height / 70,
            color: 'red',
            fontFamily: 'roboto-italic',
            textAlign: 'center'
          }}
        >
          {errorMsg}
        </Text>
      )}

    </View>
  )
}

export default InputWithLabel;