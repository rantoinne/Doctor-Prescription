import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Input from "../../components/Input";
import GradientButton from "../../components/GradientButton";
import BodyText from "../../components/BodyText";

const ChangePasswordScreen = (props) => {
  return (
    <View style={styles.screen}>
      <View style={styles.innerScreen}>
        <View style={styles.logoContainer}>
          <BodyText style={styles.forgotText}>Change Password</BodyText>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <MaterialIcons
              name="email"
              size={24}
              color="black"
              style={styles.icon}
            />
            <Input style={styles.input} placeholder="Enter new password" />
          </View>
          <View style={styles.formGroup}>
            <MaterialIcons
              name="email"
              size={24}
              color="black"
              style={styles.icon}
            />
            <Input style={styles.input} placeholder="Confirm password" />
          </View>
        </View>
        <View style={styles.loginContainer}>
          <GradientButton style={styles.button}>Submit</GradientButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#538CD0",
  },
  innerScreen: {
    flex: 1,
    marginTop: 80,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    shadowColor: "#4401A2",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,
    elevation: -3,
  },
  logoContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: "flex-start",
  },
  forgotText: {
    color: "#54C8D6",
    fontSize: 28,
    alignItems: "flex-start",
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
  },
  loginContainer: {
    flex: 1,
  },
  formGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    color: "rgba(84, 200, 214, .68)",
    fontSize: 16,
    position: "absolute",
  },
  input: {
    width: 300,
    maxWidth: "80%",
    paddingLeft: 25,
  },
  button: {
    width: 340,
  },
});

export default ChangePasswordScreen;
