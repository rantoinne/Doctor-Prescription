import React from "react";
import { TextInput, StyleSheet } from "react-native";

const Input = (props) => {
  return (
    <TextInput
      {...props}
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
    width: "100%",
  },
  fontStyle: {
    fontFamily: "roboto-italic",
  },
});
export default Input;
