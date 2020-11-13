import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GradientButton = (props) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.6}
      onPress={props.onPress}
      style={styles.container}
      style={[props.disabled ? styles.disabled : {}]}
    >
      <LinearGradient
        colors={["#6601F3", "#33017A"]}
        style={{ ...styles.linearGradient, ...props.style }}
      >
        <Text style={styles.text}>{props.children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 51,
  },
  text: {
    fontSize: 23,
    textAlign: "center",
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  disabled: {
    opacity: 0.6,
    elevation: 12,
  },
});

export default GradientButton;
