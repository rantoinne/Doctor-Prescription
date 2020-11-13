import React, { useState, useContext, useEffect } from "react"
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import Icon from "react-native-vector-icons/MaterialIcons"
import { RadioButton, Text } from "react-native-paper"

import axios from "axios"

import GradientButton from "../../components/GradientButton"
import BodyText from "../../components/BodyText"
import ErrorModal from "../../components/ErrorModal"
import Loader from "../../components/Loader"
import SuccessModal from "../../components/SuccessModal"

import { AppContext } from "../../context"

const GenderScreen = (props) => {
  const context = useContext(AppContext)
  const [modalShow, setModal] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [successModalShow, setSuccessModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [value, setValue] = React.useState("")
  const [isActive, setActive] = useState(false)

  const { token } = context
  const { basicData, dob, mobileNumber = "" } = props.route.params
  console.log("Props Route", props.route.params);

  useEffect(() => {
    if (value !== "") {
      setActive(true)
    }
  }, [value, setActive])

  const onSubmitHandler = () => {
    console.log("============dob========================")
    console.log(dob)
    console.log("====================================")
    const basicDataObj = {
      first_name: basicData.firstName,
      last_name: basicData.lastName,
      dob: dob,
      gender: value,
      mobileNumber,
    }

    console.log('basicDataObj', basicDataObj);

    axios
      .post("patient/basic-info", basicDataObj, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (res) {
        const resData = res.data
        console.log(resData)
        if (resData.status) {
          setShowLoader(false)
          setSuccessModal(true)
          setSuccessMessage(resData.message)
          AsyncStorage.setItem("firstName", basicData.firstName)
          AsyncStorage.setItem("lastName", basicData.lastName)
          // setTimeout(() => {
          //   setSuccessModal(false)
          // }, 1000)
          //   setModal(true);
          //   setErrorMessage(resData.message);
        } else {
          setModal(true)
          setErrorMessage(resData.message)
          setShowLoader(false)
        }
      })
      .catch((error) => {
        const errData = error.response.data
        console.log("==================errData==================")
        console.log(errData)
        console.log("====================================")
        setModal(true)

        setErrorMessage(errData.message)
        setShowLoader(false)
      })
  }

  const modalHideHandler = () => {
    setModal(false)
  }

  const successModalHideHandler = () => {
    props.navigation.navigate("dashboadIndex")
    setSuccessModal(false)
  }

  return (
    <>
      {showLoader && <Loader />}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.screen}>
          <View style={styles.innerScreen}>
            <View style={styles.titleContainer}>
              <BodyText style={styles.forgotText}>Gender</BodyText>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <RadioButton.Group
                  onValueChange={(value) => setValue(value)}
                  value={value}
                  style={styles.buttonGroup}
                >
                  <View style={styles.buttonItem}>
                    <RadioButton value="Male" color="#685BA9" />
                    <Text style={styles.radioText}>Male</Text>
                  </View>
                  <View style={styles.buttonItem}>
                    <RadioButton value="Female" color="#685BA9" />
                    <Text style={styles.radioText}>Female</Text>
                  </View>
                  <View style={styles.buttonItem}>
                    <RadioButton value="Others" color="#685BA9" />
                    <Text style={styles.radioText}>Other</Text>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.buttonContainer}>
                <GradientButton
                  style={styles.button}
                  onPress={onSubmitHandler}
                  disabled={!isActive}
                >
                  Next
                </GradientButton>
              </View>
            </View>
          </View>
          <ErrorModal
            isVisible={modalShow}
            errorMessage={errorMessage}
            onHide={modalHideHandler}
          />
          <SuccessModal
            isVisible={successModalShow}
            successMessage={successMessage}
            onHide={successModalHideHandler}
          />
        </View>
      </TouchableWithoutFeedback>
    </>
  )
}

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
    paddingHorizontal: 35,
  },
  titleContainer: {
    paddingTop: 50,
    alignItems: "flex-start",
    width: "100%",

    height: 100,
  },
  forgotText: {
    color: "#54C8D6",
    fontSize: 28,
    alignItems: "flex-start",
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
    width: "100%",
  },
  loginContainer: {
    flex: 1,
  },
  formGroup: {
    alignItems: "flex-start",
    width: "100%",
  },
  icon: {
    color: "rgba(84, 200, 214, .68)",
    fontSize: 16,
    position: "absolute",
  },
  //   input: {
  //     paddingLeft: 25,
  //   },

  buttonContainer: {
    marginTop: 80,
    width: 193,
  },

  errorContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  error: {
    color: "red",
    fontSize: 13,
  },
  infoContainer: {
    width: 340,
    alignItems: "flex-start",
    paddingLeft: 5,
    width: "100%",
  },
  passInfoText: {
    color: "gray",
    fontSize: 12,
  },
  dobContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",
  },
  inputWrap: {
    width: "30%",
  },
  dobText: {
    textAlign: "center",
    width: "60%",
    color: "rgba(115, 39, 194, .43)",
    fontFamily: "roboto-italic",
    fontSize: 16,
  },
  buttonGroup: {
    width: "100%",
  },
  buttonItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    color: "#7327C2",
    fontSize: 18,
    fontFamily: "roboto-reqular",
  },
})

export default GenderScreen
