import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GradientButton = (props) => {
  return (
    // <TouchableOpacity
    //   {...props}
    //   activeOpacity={0.6}
    //   onPress={props.onPress}
    //   style={[props.disabled ? styles.disabled : {}]}
    // >
    //   <LinearGradient
    //     colors={["#6601F3", "#33017A"]}
    //     style={{ ...styles.button, ...props.style }}
    //   >
    //     <Text style={styles.buttonText}>{props.children}</Text>
    //   </LinearGradient>
    // </TouchableOpacity>
    <TouchableOpacity
      {...props}
      activeOpacity={0.6}
      onPress={props.onPress}
      style={styles.container}
      style={[props.disabled ? styles.disabled : {}]}
    >
      <View style={{ ...styles.linearGradient, ...props.style }}>
        <Text style={styles.text}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 23,
    textAlign: "center",
    margin: 10,
    color: "#493E81",
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
