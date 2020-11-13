import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Text,
  AsyncStorage,
} from "react-native";

import BodyText from "../../components/BodyText";
import MainButton from "../../components/MainButton";
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get('window');

const Under16Message = (props) => {
  const [selectedValue, setAgeRestriction] = useState('I\'m 16 or older');
  const { navigation } = props;

  return (
    <>
      <View style={styles.screen}>
        <LinearGradient
          colors={['#713FC5', '#54C8D670', '#ffffff']}
          style={{
            width,
            height: height / 5
          }}
        />
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../../assets/img/text_logo.png")}
          />
        </View>

        <Text
          style={{
            marginTop: height / 10,
            fontSize: height / 50,
            textAlign: 'center',
            color: '#713FC5'
          }}
        >
          We're sorry,
          {'\n'}
          You must be 16 or older to use Health Safe
        </Text>

        <Text
          numberOfLines={2}
          style={{
            marginTop: height / 40,
            fontSize: height / 50,
            textAlign: 'center',
            color: '#713FC580',
            fontFamily: 'roboto-italic'
          }}
        >
          Please ask your guardian to create a profile for you on their own account
        </Text>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("login")}
            >
              <LinearGradient
                colors={['#6103E6', '#380284']}
                start={{ x: 1, y: 0.4 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: width / 1.4,
                  paddingVertical: height / 70,
                  alignSelf: 'center',
                  borderRadius: width / 50
                }}
              >
              <Text
                style={{
                  fontSize: height / 35,
                  textAlign: 'center',
                  color: '#fff'
                }}
              >
                Login
              </Text>
              </LinearGradient>
          </TouchableOpacity>

          <View style={styles.newUserContainer}>
            <Text style={styles.textInput}>New User?</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.innerText}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height,
    justifyContent: "flex-start",
    paddingHorizontal: width / 15,
    alignItems: "center",
    backgroundColor: '#fff'
  },
  innerText: {
    marginLeft: 10,
    textDecorationLine: "underline",
    color: "#fff",
    fontSize: 20,
    fontFamily: 'roboto-bold',
    backgroundColor: "transparent",
  },
  newUserContainer: {
    width: '100%',
    marginTop: height / 50,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    fontSize: height / 39,
  },
  buttonWrap: {
    width: "100%",
  },
  buttonContainer: {
    width,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height / 30,
  },
  innerScreen: {
    flex: 1,
    marginTop: 80,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderTopStartRadius: 45,
    borderTopEndRadius: 45,
    shadowColor: "#4401A2",
    shadowOffset: {
      width: 0,
      height: -20,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,
    elevation: 4,
    paddingHorizontal: 35,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -height / 20
  },
  logo: {
    height: height / 5,
    width: height / 5,
    resizeMode: 'contain'
  },
  formContainer: {
    flex: 1,
    alignItems: "center",

    width: "100%",
  },
  buttonContainer: {
    marginTop: 80,
    width: "100%",
  },
  formGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginContainer: {
    flex: 1,
  },
  icon: {
    color: "rgba(84, 200, 214, .68)",
    fontSize: 16,
    position: "absolute",
  },
  input: {
    paddingLeft: 25,
  },

  forgotContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  forgotText: {
    color: "rgba(115, 39, 194, 0.7)",
    fontFamily: "roboto-italic",
    fontWeight: "400",
    fontSize: 16,
  },
  noAccountContainer: {
    justifyContent: "center",
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
  },
  noAccountText: {
    fontFamily: "roboto-light",
    fontSize: 17,
    color: "#2E2E2E",
  },
  innerText: {
    color: "#7327C2",
    textDecorationLine: "underline",
    fontFamily: "roboto-reqular",
    marginLeft: 5,
    fontSize: 17,
  },
  button: {
    width: "100%",
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  error: {
    color: "red",
  },
  iconRight: {
    position: "absolute",
    right: 0,
    color: "rgba(84, 200, 214, .68)",
    fontSize: 16,
  },
  checkboxInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallInput: {
    fontSize: 12,
    fontFamily: "roboto-italic",
    color: "#8749C7",
    marginRight: 5,
  },
});

export default Under16Message;
