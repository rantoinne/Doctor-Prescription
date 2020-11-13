import React from "react";
import { View, Text, CheckBox, StyleSheet } from "react-native";

const CustomCheckBox = (props) => {
  return (
    <View style={styles.checkboxContainer}>
      <CheckBox
        value={props.isSelected}
        onValueChange={props.setSelection}
        style={styles.checkbox}
        checkedColor="#8749C7"
        tintColors={{ true: "#8749C7", false: "#8749C7" }}
      />
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
});

export default CustomCheckBox;
