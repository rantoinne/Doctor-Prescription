import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewPropTypes,
} from "react-native";
import PropTypes from "prop-types";
import React from "react";

import colors from "../common/colors";

const CustomButton = function (props) {
  const style = {};

  style.borderWidth = 0;

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.buttonStyle,
        style,
        props.buttonStyle,
        props.disabled ? styles.disabled : {},
      ]}
    >
      <Text style={[styles.textStyle, props.textStyle]}>{props.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    borderWidth: 1,
    borderRadius: 3,
  },
  textStyle: {
    textTransform: "uppercase",
    fontSize: 14,
    fontFamily: "roboto-italic",
    color: "#8749C7",
  },
  disabled: {
    opacity: 0.5,
  },
});

CustomButton.defaultProps = {
  type: "default",
  disabled: false,
};

CustomButton.propTypes = {
  buttonStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default CustomButton;
