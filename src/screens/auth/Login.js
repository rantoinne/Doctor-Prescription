import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Text,
  AsyncStorage,
} from "react-native";

import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";

import Input from "../../components/Input";
import GradientButton from "../../components/GradientButton";
import BodyText from "../../components/BodyText";
import ErrorModal from "../../components/ErrorModal";
import Loader from "../../components/Loader";
import CustomCheckBox from "../../components/CustomCheckBox";

import { AppContext } from "../../context";

const LoginScreen = (props) => {
  const context = useContext(AppContext);
  const { setToken } = context;
  const [modalShow, setModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [icEye, setIcEye] = useState("visibility-off");
  const [isSecure, setSecure] = useState(true);
  const [isAgreed, setSelection] = useState(false);

  const loginHandler = async (values) => {
    axios
      .post("auth/patient-login", {
        mobileNumber: values.mobile,
        password: values.password,
      })
      .then(function (res) {
        console.log(res.data);
        const resData = res.data;
        if (resData.status) {
          AsyncStorage.setItem("token", resData.data.token);
          setToken(resData.data.token);
          setModal(false);
          setShowLoader(false);
          setErrorMessage("");
          props.navigation.navigate("dashboadIndex");
        } else {
          setModal(true);
          setErrorMessage(resData.message);
          setShowLoader(false);
        }
      })
      .catch(function (error) {
        console.log(error);
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
      .min(10, "Mobile number must be of 10 digits")
      .matches(/^[0]?[6789]\d{9}$/, "Please enter a valid mobile no"),
    password: yup.string().required("Password is required"),
  });

  const modalHideHandler = () => {
    setModal(false);
  };

  const changePwdType = () => {
    if (isSecure) {
      setIcEye("visibility");
      setSecure(false);
    } else {
      setIcEye("visibility-off");
      setSecure(true);
    }
  };

  const agreeHandler = () => {
    setSelection(!isAgreed);
  };

  return (
    <>
      {showLoader && <Loader />}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.screen}>
          <View style={styles.innerScreen}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require("../../../assets/img/text_logo.png")}
              />
            </View>
            <View style={styles.formContainer}>
              <Formik
                initialValues={{
                  mobile: "",
                  password: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  setShowLoader(true);
                  loginHandler(values);
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
                        keyboardType={"numeric"}
                        maxLength={10}
                        placeholder="Mobile No."
                        value={values.mobile}
                        onChangeText={(mobile) => {
                          handleChange("mobile");
                          setFieldValue(
                            "mobile",
                            mobile.replace(/[^0-9]/g, "")
                          );
                        }}
                        onBlur={() => setFieldTouched("mobile")}
                      />
                    </View>
                    <View style={styles.errorContainer}>
                      {touched.mobile && errors.mobile && (
                        <Text style={styles.error}>{errors.mobile}</Text>
                      )}
                    </View>
                    <View style={styles.formGroup}>
                      <MaterialIcons
                        name="lock"
                        size={24}
                        color="black"
                        style={styles.icon}
                      />
                      <Input
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={isSecure}
                        value={values.password}
                        maxLength={30}
                        onChangeText={handleChange("password")}
                        onBlur={() => setFieldTouched("password")}
                      />
                      <Icon
                        style={styles.iconRight}
                        name={icEye}
                        size={30}
                        onPress={() => changePwdType("pa")}
                      />
                    </View>
                    <View style={styles.errorContainer}>
                      {touched.password && errors.password && (
                        <Text style={styles.error}>{errors.password}</Text>
                      )}
                    </View>

                    <View style={styles.buttonContainer}>
                      <View>
                        <CustomCheckBox
                          isSelected={isAgreed}
                          setSelection={agreeHandler}
                        >
                          <View style={styles.checkboxInputContainer}>
                            <BodyText style={styles.smallInput}>
                              Remember me
                            </BodyText>
                          </View>
                        </CustomCheckBox>
                      </View>
                      <GradientButton
                        disabled={!isValid}
                        style={styles.button}
                        onPress={handleSubmit}
                      >
                        Login
                      </GradientButton>
                      <View style={styles.forgotContainer}>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() =>
                            props.navigation.navigate("forgotpassword")
                          }
                        >
                          <BodyText style={styles.forgotText}>
                            Forgot Password?
                          </BodyText>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.noAccountContainer}>
                        <BodyText style={styles.noAccountText}>
                          Don't have an account?
                        </BodyText>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => props.navigation.navigate("register")}
                        >
                          <BodyText style={styles.innerText}>
                            Register Now
                          </BodyText>
                        </TouchableOpacity>
                      </View>
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
    paddingTop: 50,
    height: 200,
  },
  logo: {
    height: 90,
    width: 105,
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

export default LoginScreen;
