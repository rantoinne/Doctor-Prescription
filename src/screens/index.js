import React from "react";
import { View, StyleSheet, Image } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Appbar,
  Avatar,
  ProgressBar,
  BottomNavigation,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

import { FontAwesome5 } from "@expo/vector-icons";

import ProfileScreen from "./profile/Profile";
import DashboardScreen from "./dashboard/Dashboard";
import { render } from "react-dom";

const Tab = createBottomTabNavigator();
console.disableYellowBox = true;

const DashboardIndexScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Tab.Navigator
        initialRouteName="Feed"
        tabBarOptions={{
          activeTintColor: "#7327C2",
          style: { height: 70, paddingBottom: 15, paddingTop: 15 },
        }}
      >
        <Tab.Screen
          name="home"
          component={DashboardScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused
                    ? require("../../assets/img/icons/home_purple.png")
                    : require("../../assets/img/icons/home_blue.png")
                }
                style={{
                  width: 32,
                  height: 32,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="healthWallet"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Health Wallet",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused
                    ? require("../../assets/img/icons/wallet_purple.png")
                    : require("../../assets/img/icons/wallet_blue.png")
                }
                style={{
                  width: 32,
                  height: 32,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="myBlog"
          component={ProfileScreen}
          options={{
            tabBarLabel: "My Blog",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused
                    ? require("../../assets/img/icons/blog_purple.png")
                    : require("../../assets/img/icons/blog_blue.png")
                }
                style={{
                  width: 32,
                  height: 32,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="SettingsStack"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={
                  focused
                    ? require("../../assets/img/icons/profile_purple.png")
                    : require("../../assets/img/icons/profile_blue.png")
                }
                style={{
                  width: 32,
                  height: 32,
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, width: "100%" },
  appBar: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 30,
    paddingEnd: 20,
    paddingStart: 30,
    width: "100%",
  },
  leftContainer: {
    width: "80%",
  },
  helloText: {
    color: "#7327C2",
    fontSize: 13,
    fontFamily: "roboto-italic",
  },
  profileStatusText: {
    color: "#95989A",
    fontSize: 13,
    fontFamily: "roboto-italic",
  },
  rightContainer: {
    flexDirection: "row",
    width: "20%",
    alignItems: "center",
  },
  bellContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    elevation: 10,
    height: 35,
    padding: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  progress: {
    height: 13.61,
  },
});

export default DashboardIndexScreen;
