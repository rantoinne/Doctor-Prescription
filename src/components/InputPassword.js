import React from "react";
import { TextInput, StyleSheet } from "react-native";

const InputPassword = (props) => {
  return (
    <TextInput
      {...props}
      secureTextEntry={true}
      style={{ ...styles.input, ...props.style }}
      placeholderTextColor="rgba(115, 39, 194, .43)"
      placeholderStyle={styles.fontStyle}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomColor: "#8749C7",
    borderBottomWidth: 1,
    marginVertical: 10,
    height: 30,
    width: 340,
    maxWidth: "80%",
  },
  fontStyle: {
    fontFamily: "roboto-italic",
  },
});
export default InputPassword;
