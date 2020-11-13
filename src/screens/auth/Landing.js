import React, { useEffect, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import MainButton from "../../components/MainButton";
import BodyText from "../../components/BodyText";
import { AppContext } from "../../context";

const Landing = ({ navigation }) => {
  const context = useContext(AppContext);
  const [authToken, setAuthToken] = useState("");

  const getTokenFunction = () => {
    //function to get the value from AsyncStorage
    AsyncStorage.getItem("token").then(
      (value) =>
        //AsyncStorage returns a promise so adding a callback to get the value
        setAuthToken(value)
      //Setting the value in Text
    );
  };

  useEffect(() => {
    getTokenFunction();
    console.log("================authToken====================");
    console.log(authToken);
    console.log("====================================");

    if (authToken) {
      navigation.navigate("dashboadIndex");
    }
  }, [authToken, setAuthToken]);

  return (
    <LinearGradient colors={["#54C8D6", "#5101C2"]} style={styles.screen}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../../../assets/img/logo_white.png")}
        />
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrap}>
          <MainButton
            style={styles.button}
            onPress={() => navigation.navigate("login")}
          >
            Login
          </MainButton>
        </View>

        <View style={styles.newUserContainer}>
          <BodyText style={styles.textInput}>New User?</BodyText>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("under16Screen")}
          >
            <BodyText style={styles.innerText}>Register Now</BodyText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.lineContainer}>
        <View style={styles.line} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 30,
    paddingHorizontal: 35,
  },
  logoContainer: {
    flex: 1,
    paddingTop: 100,
  },
  logo: {
    height: 150,
    width: 218,
  },
  buttonWrap: {
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 250,
    width: "100%",
  },
  button: {
    width: "100%",
  },

  newUserContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  textInput: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "roboto-light",
  },
  innerText: {
    marginLeft: 10,
    textDecorationLine: "underline",
    color: "#fff",
    fontSize: 20,
    backgroundColor: "transparent",
  },
  lineContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  line: {
    width: 100,
    backgroundColor: "#fff",
    height: 3,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});

export default Landing;
