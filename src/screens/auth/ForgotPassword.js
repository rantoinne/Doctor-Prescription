import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";

import Input from "../../components/Input";
import GradientButton from "../../components/GradientButton";
import BodyText from "../../components/BodyText";
import ErrorModal from "../../components/ErrorModal";
import Loader from "../../components/Loader";
import SuccessModal from "../../components/SuccessModal";

import { AppContext } from "../../context";

const ForgotPasswordScreen = (props) => {
  const context = useContext(AppContext);
  const [modalShow, setModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [successModalShow, setSuccessModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = context;

  const onSubmitHandler = async (values) => {
    axios
      .post(
        "auth/forgot-password/send-otp",
        {
          mobile_number: values.mobile,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(function (res) {
        const resData = res.data;
        console.log(resData);
        if (resData.status) {
          setShowLoader(false);
          setSuccessModal(true);
          setSuccessMessage(resData.message);

          props.navigation.navigate("mobileotp", {
            registerMobileNumber: values.mobile,
            urlFrom: "forgotPassword",
          });
        } else {
          setModal(true);
          setErrorMessage(resData.message);
          setShowLoader(false);
        }
      })
      .catch((error) => {
        const errData = error.response.data;
        setModal(true);

        setErrorMessage(errData.message);
        setShowLoader(false);
      });
  };
  const validationSchema = yup.object().shape({
    mobile: yup
      .string()
      .required("Mobile number is required")
      .min(10, "Mobile number must be 10 digits")
      .matches(/^[0-9]?[6789]\d{9}$/, "Please enter a valid mobile no"),
  });

  const modalHideHandler = () => {
    setModal(false);
  };
  const successModalHideHandler = () => {
    setSuccessModal(false);
  };

  return (
    <>
      {showLoader && <Loader />}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.screen}>
          <View style={styles.innerScreen}>
            <View style={styles.titleContainer}>
              <BodyText style={styles.forgotText}>Forgot Password</BodyText>
            </View>
            <View style={styles.formContainer}>
              <Formik
                initialValues={{
                  mobile: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  onSubmitHandler(values);
                  setShowLoader(true);
                  resetForm();
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
                      <MaterialIcons
                        name="call"
                        size={24}
                        color="black"
                        style={styles.icon}
                      />
                      <Input
                        style={styles.input}
                        placeholder="Mobile No."
                        keyboardType={"numeric"}
                        maxLength={10}
                        value={values.mobile}
                        onChangeText={(mobile) => {
                          handleChange("mobile", mobile);

                          setFieldValue(
                            "mobile",
                            mobile.replace(/[^0-9]/g, "")
                          );
                        }}
                        onBlur={() => {
                          setFieldTouched("mobile");
                        }}
                      />
                    </View>
                    <View style={styles.errorContainer}>
                      {touched.mobile && errors.mobile && (
                        <BodyText style={styles.error}>
                          {errors.mobile}
                        </BodyText>
                      )}
                    </View>
                    <View style={styles.buttonContainer}>
                      <GradientButton
                        disabled={!isValid}
                        style={styles.button}
                        onPress={handleSubmit}
                      >
                        Proceed
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
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#538FD1",
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
    height: 300,
    paddingTop: 50,
    alignItems: "flex-start",
    width: "100%",
  },
  forgotText: {
    color: "#54C8D6",
    fontSize: 28,
    alignItems: "flex-start",
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
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
  input: {
    paddingLeft: 25,
  },
  buttonContainer: {
    marginTop: 80,
    width: "100%",
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
    fontSize: 13,
  },
});

export default ForgotPasswordScreen;
