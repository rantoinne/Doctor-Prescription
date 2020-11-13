import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BodyText from "../../components/BodyText";

import { AntDesign } from "@expo/vector-icons";

const WelcomeScreen = (props) => {
  return (
    <LinearGradient colors={["#54C8D6", "#5101C2"]} style={styles.screen}>
      <View style={styles.innerContainer}>
        <BodyText style={styles.titleText}>Welcome</BodyText>
        <BodyText style={styles.inputText}>
          You are on your way to a safe and healthy journey!
        </BodyText>
        <View style={styles.iconContainer}>
          <AntDesign
            name="doubleright"
            size={24}
            color="black"
            style={styles.icon}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    paddingHorizontal: 35,
  },
  titleText: {
    fontSize: 32,
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
  },
  inputText: {
    fontSize: 27,
    textAlign: "center",
    color: "#fff",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  icon: {
    color: "#fff",
  },
});

export default WelcomeScreen;
