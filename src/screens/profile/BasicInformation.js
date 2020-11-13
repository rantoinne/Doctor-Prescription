import React, { useState, useContext } from "react"
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { TextInput, Text, TouchableRipple } from "react-native-paper"
import moment from 'moment';
import { Formik } from "formik"
import * as yup from "yup"
import DateTimePicker from "react-native-modal-datetime-picker"
import axios from "axios"

import Input from "../../components/Input"
import GradientButton from "../../components/GradientButton"
import BodyText from "../../components/BodyText"
import ErrorModal from "../../components/ErrorModal"
import Loader from "../../components/Loader"
import SuccessModal from "../../components/SuccessModal"

import { AppContext } from "../../context"

const BasicInformationScreen = (props) => {
  const dateInputRef = React.useRef()
  const context = useContext(AppContext)
  const [modalShow, setModal] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [successModalShow, setSuccessModal] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [dateOfBirth, setdateOfBirth] = useState(undefined)
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [dobError, setDobError] = useState("")
  const [dobErrorShow, setDobErrorShow] = useState(false)

  const { token } = context

  const isEmpty = (obj) => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false
    }

    return true
  }

  const onSubmitHandler = async (values) => {
    console.log("====================================")
    console.log(values)
    console.log("====================================")
    let month = ""
    let day = ""
    let year = ""
    if (dateOfBirth !== undefined) {
      month = dateOfBirth.getMonth()
      day = dateOfBirth.getDate()
      year = dateOfBirth.getFullYear()
    }
    props.navigation.navigate("gender", {
      basicData: values,
      dob: moment(dateOfBirth).format('MM-DD-YYYY'),
      mobileNumber: props.route.params.mobileNumber
    })
  }

  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    dob: yup.string(),
  })

  const modalHideHandler = () => {
    setModal(false)
  }

  const successModalHideHandler = () => {
    setSuccessModal(false)
  }

  const handleFocus = () => {
    dateInputRef.current.focus()
  }
  const handleBlur = () => {
    setTimeout(() => {
      dateInputRef.current.focus()
    }, 100)
  }
  const handleDateChange = (date) => {
    // let dob = new Date(date)
    // const month = dob.getMonth()
    // const day = dob.getDate()
    // const year = dob.getFullYear()

    // dob = month + "-" + day + "-" + year
    handleClose()
    setdateOfBirth(date)
  }

  const handleClose = () => {
    setOpenDatePicker(false)
    handleBlur()
  }

  const handleOpen = () => {
    Keyboard.dismiss()
    handleFocus()
    setOpenDatePicker(true)
  }

  const renderTouchText = (props) => {
    const { style, value } = props

    return (
      <TouchableRipple onPress={handleOpen}>
        <Text style={style}>{value}</Text>
      </TouchableRipple>
    )
  }

  return (
    <>
      {showLoader && <Loader />}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.screen}>
          <View style={styles.innerScreen}>
            <View style={styles.titleContainer}>
              <BodyText style={styles.forgotText}>Basic Information</BodyText>
            </View>
            <View style={styles.formContainer}>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  dob: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  if (dateOfBirth === undefined) {
                    setDobErrorShow(true)
                    setDobError("Date of birth is required")
                    return
                  }
                  onSubmitHandler(values)
                  setShowLoader(true)
                  resetForm()
                }}
                validationSchema={validationSchema}
              >
                {({
                  values,
                  handleChange,
                  errors,
                  setFieldTouched,
                  touched,
                  isValid,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <>
                    <View style={styles.formGroup}>
                      <Input
                        style={styles.input}
                        placeholder="First Name*"
                        value={values.firstName}
                        maxLength={30}
                        onChangeText={handleChange("firstName")}
                        onBlur={() => setFieldTouched("firstName")}
                      />
                    </View>
                    <View style={styles.errorContainer}>
                      {touched.firstName && errors.firstName && (
                        <BodyText style={styles.error}>
                          {errors.firstName}
                        </BodyText>
                      )}
                    </View>
                    <View style={styles.formGroup}>
                      <Input
                        style={styles.input}
                        placeholder="Last Name*"
                        value={values.lastName}
                        maxLength={30}
                        onChangeText={handleChange("lastName")}
                        onBlur={() => setFieldTouched("lastName")}
                      />
                    </View>

                    <View style={styles.errorContainer}>
                      {touched.lastName && errors.lastName && (
                        <BodyText style={styles.error}>
                          {errors.lastName}
                        </BodyText>
                      )}
                    </View>
                    <View style={styles.formGroup}>
                      <View style={styles.dobContainer}>
                        <View style={styles.inputWrap}>
                          <TextInput
                            label="Date of Birth"
                            ref={dateInputRef}
                            style={styles.input}
                            Type="flat"
                            value={
                              dateOfBirth
                                ? dateOfBirth.toLocaleDateString()
                                : ""
                            }
                            render={renderTouchText}
                            theme={{
                              colors: {
                                placeholder: "rgba(115, 39, 194, .43)",
                                text: "#7327C2",
                                primary: "rgba(115, 39, 194, .43)",
                                underlineColor: "rgba(226, 226, 226, 1)",
                              },
                            }}
                          />

                          <DateTimePicker
                            date={dateOfBirth}
                            maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 16))}
                            isVisible={openDatePicker}
                            onConfirm={(date) => {
                              handleDateChange(date)
                              setDobErrorShow(false)
                            }}
                            onCancel={handleClose}
                            mode="date"
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.errorContainer}>
                      {dobErrorShow && (
                        <BodyText style={styles.error}>{dobError}</BodyText>
                      )}
                    </View>
                    <View style={styles.buttonContainer}>
                      <GradientButton
                        disabled={!isValid}
                        style={styles.button}
                        onPress={handleSubmit}
                      >
                        Next
                      </GradientButton>
                    </View>
                  </>
                )}
              </Formik>
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
    marginTop: 0,
    width: "100%",
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
    width: "40%",
  },
  dobText: {
    textAlign: "center",
    width: "60%",
    color: "rgba(115, 39, 194, .43)",
    fontFamily: "roboto-italic",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    color: "#7327C2",
    paddingVertical: 0,
    height: 50,
  },
})

export default BasicInformationScreen
