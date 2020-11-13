import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import BodyText from "./BodyText";
import { MaterialIcons } from "@expo/vector-icons";

import SmallButton from "./SmallButton";

const ErrorModal = (props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.isVisible}
      onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <MaterialIcons
              name="info-outline"
              size={24}
              color="black"
              style={styles.icon}
            />
          </View>
          <View style={styles.textContainer}>
            <BodyText style={styles.inputText}>{props.errorMessage}</BodyText>
          </View>
          <View>
            <SmallButton style={styles.button} onPress={props.onHide}>
              OK
            </SmallButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {},
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    height: 200,
    width: 330,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 45,
    alignItems: "center",
    shadowColor: "#000",
    justifyContent: "space-evenly",
    shadowColor: "#4401A2",
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,
    elevation: 14,
  },
  textContainer: {
    marginVertical: 40,
    justifyContent: "center",
    flexDirection: "row",
  },
  icon: {
    color: "#6601F3",
    fontSize: 35,
  },
  inputText: {
    color: "#54C8D6",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "roboto-italic",
  },
  button: {
    width: 99,
    height: 41,
  },
});

export default ErrorModal;
