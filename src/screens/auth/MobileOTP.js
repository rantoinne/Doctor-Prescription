import React, { useState, useRef, useEffect, useContext } from "react";
import { View, StyleSheet, Image, Alert, AsyncStorage } from "react-native";
import axios from "axios";

import CustomTextInput from "../../components/CustomTextInput";
import GradientButton from "../../components/GradientButton";
import BodyText from "../../components/BodyText";
import CustomButton from "../../components/CustomButton";
import Loader from "../../components/Loader";
import ErrorModal from "../../components/ErrorModal";

import colors from "../../common/colors";
import { GenericStyles } from "../../styles/GenericStyles";
import { isAndroid } from "../../utilities/HelperFunctions";

import TimerText from "./Timer";

import { otpVerify } from "../../api_services/AuthService";
import { AppContext } from "../../context/";

const RESEND_OTP_TIME_LIMIT = 40;

let resendOtpTimerInterval;
let autoSubmitOtpTimerInterval;

const MobileOtpScreen = (props) => {
  const context = useContext(AppContext);
  const [mobileNumber, setMobileNumber] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [modalShow, setModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { token, setChangePasswordToken, setToken } = context;
  // const { mobileNumber } = props.route.parrams;
  const { registerMobileNumber, urlFrom } = props.route.params;

  const [otpArray, setOtpArray] = useState(["", "", "", ""]);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );
  const [resendActive, setResendActive] = useState(true);
  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);
  const fifthTextInputRef = useRef(null);

  useEffect(() => {
    startResendOtpTimer();
    setMobileNumber(registerMobileNumber);

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime, registerMobileNumber]);

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
        setSubmittingOtp(false);
        setResendActive(false);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  const refCallback = (textInputRef) => (node) => {
    textInputRef.current = node;
  };

  const onSubmitButtonPress = async () => {
    // API call
    // todo
    setShowLoader(true);

    let apiUrl = "auth/verify-otp";
    if (urlFrom === "forgotPassword") {
      apiUrl = "auth/forgot-password/verify-otp";
    }

    console.log("============apiUrl========================");
    console.log(apiUrl);
    console.log("====================================");

    axios
      .post(
        apiUrl,
        {
          otp: otpArray.join(""),
          mobile_number: mobileNumber,
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
          setToken(resData.data.token);
          AsyncStorage.setItem("token", resData.data.token);
          setChangePasswordToken(resData.data.token);
          // Alert.alert("OTP Verify Successfully!");
          if (urlFrom === "forgotPassword") {
            props.navigation.navigate("forgotFinish");
            return;
          }
          props.navigation.navigate("basicInformation", {
            mobileNumber,
          });
        } else {
          setShowLoader(false);
          setModal(true);

          setErrorMessage(res.message);
          // Alert.alert("Error", res.message, [
          //   { text: "Okay", style: "cancel" },
          // ]);
        }
      })
      .catch(function (error) {
        setShowLoader(false);

        setModal(true);

        setErrorMessage(error.response.data.message);
        // Alert.alert("Error", error.response.data.message, [
        //   { text: "Okay", style: "cancel" },
        // ]);
      });

    // console.log("====================================");
    // console.log(resData);
    // console.log("====================================");
    // // console.log("====================================");
    // // console.log(resData);
    // // console.log("====================================");
  };

  const onOtpChange = (index) => {
    return (value) => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return;
      }
      const otpArrayCopy = otpArray.concat();
      otpArrayCopy[index] = value;
      setOtpArray(otpArrayCopy);

      // auto focus to next InputText if value is not blank
      if (value !== "") {
        if (index === 0) {
          secondTextInputRef.current.focus();
        } else if (index === 1) {
          thirdTextInputRef.current.focus();
        } else if (index === 2) {
          fourthTextInputRef.current.focus();
        } else if (index === 3) {
          fifthTextInputRef.current.focus();
        }
      }
    };
  };
  const onOtpKeyPress = (index) => {
    return ({ nativeEvent: { key: value } }) => {
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (value === "Backspace" && otpArray[index] === "") {
        if (index === 1) {
          firstTextInputRef.current.focus();
        } else if (index === 2) {
          secondTextInputRef.current.focus();
        } else if (index === 3) {
          thirdTextInputRef.current.focus();
        } else if (index === 4) {
          fourthTextInputRef.current.focus();
        }

        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (isAndroid && index > 0) {
          const otpArrayCopy = otpArray.concat();
          otpArrayCopy[index - 1] = ""; // clear the previous box which will be in focus
          setOtpArray(otpArrayCopy);
        }
      }
    };
  };

  const modalHideHandler = () => {
    setModal(false);
  };

  return (
    <>
      {showLoader && <Loader />}
      <View style={styles.screen}>
        <View style={styles.innerScreen}>
          <View style={styles.titleContainer}>
            <BodyText style={styles.forgotText}>Enter OTP</BodyText>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              {[
                firstTextInputRef,
                secondTextInputRef,
                thirdTextInputRef,
                fourthTextInputRef,
                fifthTextInputRef,
              ].map((textInputRef, index) => (
                <CustomTextInput
                  containerStyle={[GenericStyles.fill]}
                  value={otpArray[index]}
                  onKeyPress={onOtpKeyPress(index)}
                  onChangeText={onOtpChange(index)}
                  keyboardType={"numeric"}
                  maxLength={1}
                  style={[styles.otpText, GenericStyles.centerAlignedText]}
                  autoFocus={index === 0 ? true : undefined}
                  refCallback={refCallback(textInputRef)}
                  key={index}
                />
              ))}
            </View>

            <View style={styles.timerContainer}>
              <View style={styles.wrap}>
                {resendActive ? (
                  <TimerText time={resendButtonDisabledTime} />
                ) : null}

                <CustomButton
                  type={"link"}
                  text={"Resend OTP"}
                  buttonStyle={styles.otpResendButton}
                  textStyle={styles.otpResendButtonText}
                  disabled={resendActive}
                />
              </View>
            </View>
          </View>
          <View style={styles.loginContainer}>
            <GradientButton style={styles.button} onPress={onSubmitButtonPress}>
              Verify
            </GradientButton>
          </View>
        </View>
      </View>
      <ErrorModal
        isVisible={modalShow}
        errorMessage={errorMessage}
        onHide={modalHideHandler}
      />
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
    flex: 1,
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
  },
  loginContainer: {
    flex: 1,
  },
  formGroup: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 35,
    marginBottom: 15,
  },
  icon: {
    color: "rgba(84, 200, 214, .68)",
    fontSize: 16,
    position: "absolute",
  },
  input: {
    width: 300,
    maxWidth: "80%",
    paddingLeft: 25,
  },
  button: {
    width: 200,
    alignItems: "center",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    paddingHorizontal: 90,
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
  },
  otpResendButton: {
    alignItems: "center",
    width: "100%",
  },
  otpResendButtonText: {
    color: "#8749C7",
    textTransform: "none",
    textDecorationLine: "underline",
  },
  otpText: {
    fontWeight: "bold",
    color: colors.BLUE,
    fontSize: 18,
    width: "100%",
  },
});

export default MobileOtpScreen;
