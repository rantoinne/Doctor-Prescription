import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
} from "react-native";

import { Formik } from "formik";
import * as yup from "yup";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

import Input from "../../components/Input";
import GradientButton from "../../components/GradientButton";
import BodyText from "../../components/BodyText";
import ErrorModal from "../../components/ErrorModal";
import CustomCheckBox from "../../components/CustomCheckBox";
import Loader from "../../components/Loader";
import SuccessModal from "../../components/SuccessModal";

import { AppContext } from "../../context";
import LinkButton from "../../components/LinkButton";

const RegisterScreen = (props) => {
  const context = useContext(AppContext);
  const { setToken } = context;
  const [isAgreed, setSelection] = useState(false);
  const [agreeMessage, setAgreeMessage] = useState("");
  const [modalShow, setModal] = useState(false);
  const [successModalShow, setSuccessModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [icEye, setIcEye] = useState("visibility-off");
  const [icEyeRe, setIcEyeRe] = useState("visibility-off");
  const [isSecure, setSecure] = useState(true);
  const [isSecureConfirm, setSecureConfirm] = useState(true);

  const onSubmitHandler = async (values) => {
    if (!isAgreed) {
      setAgreeMessage("Please agree our Terms & Conditions");
      return;
    }

    console.log("=============values=======================");
    console.log(values);
    console.log("====================================");

    axios
      .post("auth/patient-registration", {
        mobileNumber: values.mobile,
        password: values.password,
        cPassword: values.confirmPassword,
      })
      .then(function (res) {
        const resData = res.data;
        console.log(resData);
        if (resData.status) {
          setShowLoader(false);
          //AsyncStorage.setItem("token", resData.data.token);

          setSuccessModal(true);
          setSuccessMessage("Please enter the OTP sent to your mobile number");

          props.navigation.navigate("mobileotp", {
            registerMobileNumber: values.mobile,
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
      .min(10, "Mobile number must be of 10 digits")
      .matches(/^[0-9]?[6789]\d{9}$/, "Please enter a valid mobile no"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_~^%()+={}[|:;"'<>,.?/\\/\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),

    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .test("passwords-match", "Passwords must match", function (value) {
        return this.parent.password === value;
      }),
  });

  const agreeHandler = () => {
    setSelection(!isAgreed);
  };

  const modalHideHandler = () => {
    setModal(false);
  };
  const successModalHideHandler = () => {
    setSuccessModal(false);
  };

  const changePwdType = (type) => {
    if (type === "confirm") {
      if (isSecureConfirm) {
        setIcEyeRe("visibility");
        setSecureConfirm(false);
      } else {
        setIcEyeRe("visibility-off");
        setSecureConfirm(true);
      }
    } else {
      if (isSecure) {
        setIcEye("visibility");
        setSecure(false);
      } else {
        setIcEye("visibility-off");
        setSecure(true);
      }
    }
  };

  return (
    <>
      {showLoader && <Loader />}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.screen}>
          <View style={styles.innerScreen}>
            <View style={styles.titleContainer}>
              <BodyText style={styles.titleText}>Register Account</BodyText>
            </View>
            <View style={styles.formContainer}>
              <Formik
                initialValues={{
                  mobile: "",
                  password: "",
                  confirmPassword: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  onSubmitHandler(values);
                  if (isAgreed) {
                    setShowLoader(true);
                    resetForm();
                  }
                  setSelection(false);
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
                  handleBlur,
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
                          handleChange("mobile", mobile);

                          setFieldValue(
                            "mobile",
                            mobile.replace(/[^0-9]/g, "")
                          );
                        }}
                        onBlur={() => {
                          handleBlur("mobile");
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
                    <View style={styles.formGroup}>
                      <MaterialIcons
                        name="lock"
                        size={24}
                        color="black"
                        style={styles.icon}
                      />
                      <Input
                        style={styles.input}
                        placeholder="Enter Password"
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
                    <View style={styles.infoContainer}>
                      {touched.password && errors.password ? null : (
                        <BodyText style={styles.passInfoText}>
                          8 or more alphanumeric and special characters
                        </BodyText>
                      )}
                    </View>

                    <View style={styles.errorContainer}>
                      {touched.password && errors.password && (
                        <BodyText style={styles.error}>
                          {errors.password}
                        </BodyText>
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
                        placeholder="Re-enter Password"
                        secureTextEntry={isSecureConfirm}
                        value={values.confirmPassword}
                        maxLength={30}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={() => {
                          setFieldTouched("confirmPassword");
                          handleBlur("mobile");
                        }}
                      />
                      <Icon
                        style={styles.iconRight}
                        name={icEyeRe}
                        size={30}
                        onPress={() => changePwdType("confirm")}
                      />
                    </View>
                    <View style={styles.errorContainer}>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <BodyText style={styles.error}>
                          {errors.confirmPassword}
                        </BodyText>
                      )}
                    </View>

                    <View style={styles.buttonContainer}>
                      {!isAgreed ? (
                        <View style={styles.errorContainer}>
                          <BodyText style={styles.error}>
                            {agreeMessage}
                          </BodyText>
                        </View>
                      ) : null}
                      <View>
                        <CustomCheckBox
                          isSelected={isAgreed}
                          setSelection={agreeHandler}
                        >
                          <View style={styles.checkboxInputContainer}>
                            <BodyText style={styles.smallInput}>
                              Agree with
                            </BodyText>
                            <LinkButton>Terms & Conditions</LinkButton>
                            <View style={styles.andInput}>
                              <BodyText style={styles.andText}>&</BodyText>
                            </View>
                            <LinkButton>Privacy Policy</LinkButton>
                          </View>
                        </CustomCheckBox>
                      </View>

                      <GradientButton
                        disabled={!isValid}
                        style={styles.button}
                        onPress={handleSubmit}
                      >
                        Generate OTP
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
    borderTopStartRadius: 45,
    borderTopEndRadius: 45,
    shadowColor: "#4401A2",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.57,
    shadowRadius: 15.19,
    elevation: 20,
    paddingHorizontal: 35,
  },
  titleContainer: {
    height: 160,
    paddingTop: 50,
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 0,
  },
  titleText: {
    color: "#54C8D6",
    fontSize: 28,
    alignItems: "flex-start",
  },
  logo: {
    height: 90,
    width: 105,
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
    width: "100%",
  },
  formGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 50,
    width: "100%",
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
  },
  noAccountText: {
    fontFamily: "roboto-light",
    fontSize: 17,
    color: "#2E2E2E",
  },
  innerText: {
    color: "#8749C7",
    textDecorationLine: "underline",
    fontFamily: "roboto-reqular",
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
  checkboxInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallInput: {
    fontSize: 12,
    fontFamily: "roboto-italic",
    color: "#8749C7",
    marginRight: 5,
    opacity: 0.43,
  },
  iconRight: {
    position: "absolute",
    right: 0,
    color: "rgba(84, 200, 214, .68)",
    fontSize: 16,
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
  andInput: {
    marginHorizontal: 5,
  },
  andText: {
    fontSize: 12,
    fontFamily: "roboto-italic",
    color: "#6601F3",
  },
});

export default RegisterScreen;
