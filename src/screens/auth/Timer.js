import React from "react";
import { StyleSheet } from "react-native";

import BodyText from "../../components/BodyText";

const TimerText = (props) => {
  const { time } = props;

  return <BodyText style={styles.resendOtpTimerText}>{" " + time}s</BodyText>;
};

const styles = StyleSheet.create({
  resendOtpTimerText: {
    fontSize: 14,
    fontFamily: "roboto-italic",
    color: "#8749C7",
  },
});

export default TimerText;
