import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Formik } from "formik";
import * as yup from "yup";

import axios from "axios";

import Input from "../../components/Input";
import GradientButton from "../../components/GradientButton";
import BodyText from "../../components/BodyText";
import ErrorModal from "../../components/ErrorModal";
import Loader from "../../components/Loader";
import SuccessModal from "../../components/SuccessModal";

import { AppContext } from "../../context";

const ChangePasswordScreen = (props) => {
  const context = useContext(AppContext);
  const [modalShow, setModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [successModalShow, setSuccessModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [icEye, setIcEye] = useState("visibility-off");
  const [icEyeNew, setIcEyeNew] = useState("visibility-off");
  const [icEyeCon, setIcEyeCon] = useState("visibility-off");
  const [isSecure, setSecure] = useState(true);
  const [isSecureConfirm, setSecureConfirm] = useState(true);
  const [isSecureNew, setisSecureNew] = useState(true);
  const { token } = context;

  const onSubmitHandler = async (values) => {
    console.log("=========token===========================");
    console.log(token);
    console.log("====================================");
    axios
      .post(
        "auth/patient-change-password",
        {
          old_password: values.password,
          new_password: values.newPassword,
          confirm_password: values.confirmPassword,
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
          setTimeout(() => {
            props.navigation.navigate("login");
          }, 1000);
          //   setModal(true);
          //   setErrorMessage(resData.message);
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
    password: yup.string().required("Password is required"),
    newPassword: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required!")
      .test("passwords-match", "Passwords must match!", function (value) {
        return this.parent.newPassword === value;
      }),
  });

  const modalHideHandler = () => {
    setModal(false);
  };

  const successModalHideHandler = () => {
    setSuccessModal(false);
  };

  const changePwdType = (type) => {
    if (type === "confirm") {
      if (isSecureConfirm) {
        setIcEyeCon("visibility");
        setSecureConfirm(false);
      } else {
        setIcEyeCon("visibility-off");
        setSecureConfirm(true);
      }
    } else if (type === "new") {
      if (isSecureNew) {
        setIcEyeNew("visibility");
        setisSecureNew(false);
      } else {
        setIcEyeNew("visibility-off");
        setisSecureNew(true);
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
              <BodyText style={styles.forgotText}>Change Password</BodyText>
            </View>
            <View style={styles.formContainer}>
              <Formik
                initialValues={{
                  password: "",
                  confirmPassword: "",
                  newPassword: "",
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
                        name="lock"
                        size={24}
                        color="black"
                        style={styles.icon}
                      />
                      <Input
                        style={styles.input}
                        placeholder="Enter Old Password"
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
                        placeholder="New Password"
                        secureTextEntry={isSecureNew}
                        value={values.newPassword}
                        maxLength={30}
                        onChangeText={handleChange("newPassword")}
                        onBlur={() => setFieldTouched("newPassword")}
                      />
                      <Icon
                        style={styles.iconRight}
                        name={icEyeNew}
                        size={30}
                        onPress={() => changePwdType("new")}
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
                      {touched.newPassword && errors.newPassword && (
                        <BodyText style={styles.error}>
                          {errors.newPassword}
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
                        placeholder="Confirm Password"
                        secureTextEntry={isSecureConfirm}
                        value={values.confirmPassword}
                        maxLength={30}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={() => setFieldTouched("confirmPassword")}
                      />
                      <Icon
                        style={styles.iconRight}
                        name={icEyeCon}
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

    height: 200,
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
    width: 340,
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
  button: {
    width: 340,
  },
  buttonContainer: {
    marginTop: 80,
  },
  iconRight: {
    position: "absolute",
    right: 0,
    color: "rgba(84, 200, 214, .68)",
    fontSize: 16,
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
});

export default ChangePasswordScreen;
