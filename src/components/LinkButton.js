import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const LinkButton = (props) => {
  return (
    <TouchableOpacity {...props} style={styles.buttonStyle}>
      <Text style={styles.textStyle}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    borderWidth: 0,
    borderRadius: 3,
  },
  textStyle: {
    fontSize: 12,
    fontFamily: "roboto-italic",
    color: "#6601F3",
    textDecorationLine: "underline",
  },
});

export default LinkButton;
