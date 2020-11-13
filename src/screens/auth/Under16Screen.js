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

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get('window');

const Under16Screen = (props) => {
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
            width,
            marginTop: height / 10,
            fontSize: height / 50,
            textAlign: 'center',
            color: '#713FC5'
          }}
        >
          Are you 16 years or older?
        </Text>

        <Text
          style={{
            width,
            marginTop: height / 40,
            fontSize: height / 50,
            textAlign: 'center',
            color: '#713FC580',
            fontFamily: 'roboto-italic'
          }}
        >
          To create an account, we need to know{'\n'}how old are you
        </Text>

        <TouchableOpacity
          onPress={() => setAgeRestriction('I\'m 16 or older')}
          style={{
            width: width / 1.4,
            marginTop: height / 9,
            paddingVertical: height / 220,
            borderRadius: width,
            borderWidth: 1.5,
            borderColor: '#713FC5'
          }}
        >
          <Text
            style={{
              fontSize: height / 45,
              textAlign: 'center',
              color: '#713FC5'
            }}
          >
            I'm 16 or older
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setAgeRestriction('I\'m under 16')}
          style={{
            width: width / 1.4,
            marginTop: height / 40,
            paddingVertical: height / 220,
            borderRadius: width,
            borderWidth: 1.5,
            borderColor: '#713FC5'
          }}
        >
          <Text
            style={{
              fontSize: height / 45,
              textAlign: 'center',
              color: '#713FC5'
            }}
          >
            I'm under 16
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 10
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (selectedValue === 'I\'m under 16') {
                navigation.navigate('under16Message')
                return;
              }
              navigation.navigate('register')
            }}
          >
            <LinearGradient
              colors={['#7327C2', '#380284']}
              start={{ x: 1, y: 0.4 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: width / 1.4,
                paddingVertical: height / 200,
                borderRadius: width,
                borderWidth: 1.5,
                borderColor: '#713FC5'
              }}
            >
              <Text
                style={{
                  fontSize: height / 45,
                  textAlign: 'center',
                  color: '#fff'
                }}
              >
                {selectedValue}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
    alignItems: "center",
    backgroundColor: '#fff'
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

export default Under16Screen;
