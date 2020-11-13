import React from 'react';
import {
  View,
  Picker,
  Dimensions,
  Text
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CommonPicker = ({
  label,
  selectedValue,
  onValueChange,
  pickerArrayItem,
  showErrorMsg,
  errorMsg
}) => {
  return (
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: height / 60,
        borderBottomWidth: 1,
        borderColor: '#c4c4c4'
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
        {label}
      </Text>
      <Picker
        style={{
          height: height / 35,
          width: width - 40,
          fontFamily: 'roboto-italic',
          textAlign: 'left',
          marginLeft: -width / 55
        }}
        selectedValue={selectedValue}
        onValueChange={(itemValue) => onValueChange(itemValue)}
      >
        
        {
          pickerArrayItem?.map((pickerItem, index) => {
            return (
              <Picker.Item color={pickerItem === 'Select' ? '#7327C270' : '#7327C2'} label={pickerItem} value={pickerItem} style={{ fontFamily: 'roboto-italic' }} />
            );
          })
        }
      </Picker>
      { showErrorMsg && (
        <Text
          style={{
            fontSize: height / 70,
            color: 'red',
            position: 'absolute',
            bottom: -height / 45,
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

export default CommonPicker;