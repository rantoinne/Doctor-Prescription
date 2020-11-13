import { StatusBar } from "expo-status-bar"
import React, { useState } from "react"
import { StyleSheet, Alert, AsyncStorage } from "react-native"
import * as Font from "expo-font"
import { AppLoading } from "expo"
import axios from "axios"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import { AppProvider, AppContext } from "./src/context/"

import LandingScreen from "./src/screens/auth/Landing"
import LoginScreen from "./src/screens/auth/Login"
import ForgotPasswordScreen from "./src/screens/auth/ForgotPassword"
import RegisterScreen from "./src/screens/auth/Register"
import MobileOtpScreen from "./src/screens/auth/MobileOTP"
import WelcomeScreen from "./src/screens/profile/Welcome"
import ProfileScreen from "./src/screens/profile/Profile"
import ForgotFinishScreen from "./src/screens/auth/ForgotFinish"
import ChangePasswordScreen from "./src/screens/profile/ChangePassword"
import BasicInformationScreen from "./src/screens/profile/BasicInformation"
import GenderScreen from "./src/screens/profile/Gender"
import DashboardScreen from "./src/screens/dashboard/Dashboard"
import DashboardIndexScreen from "./src/screens/"
import ProfileDetailScreen from "./src/screens/profile/ProfileDetails"
import MyPrescription from "./src/screens/prescriptions/MyPrescription"
import AddPrescriptionScreen from "./src/screens/prescriptions/AddPrescription"
import EditPrescription from "./src/screens/prescriptions/EditPrescription"
import Under16Screen from "./src/screens/auth/Under16Screen"
import Under16Message from "./src/screens/auth/Under16Message"

const fetchFonts = () => {
  return Font.loadAsync({
    "AntipastoPro-trial": require("./assets/fonts/AntipastoPro_trial.ttf"),
    "roboto-reqular": require("./assets/fonts/Roboto-Regular.ttf"),
    "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "roboto-light": require("./assets/fonts/Roboto-Light.ttf"),
    "roboto-italic": require("./assets/fonts/Roboto-Italic.ttf"),
  })
}
const Stack = createStackNavigator()

axios.defaults.baseURL = "http://52.66.197.45:3000/"
axios.defaults.headers.post["Content-Type"] = "application/json"

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false)

  //

  // const tokenGet = getToken("token");

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setDataLoaded(true)
        }}
        onError={(err) => console.log(err)}
      />
    )
  }

  // useEffect(() => {}, []);

  // axios.interceptors.request.use(
  //   (reqConfig) => {
  //     const reqConfiglocal = reqConfig;
  //     console.log("====================================");
  //     console.log(getToken(), "Token");
  //     console.log("====================================");
  //     if (getToken()) {
  //       reqConfiglocal.headers.Authorization = `Baerer ${getToken()}`;
  //       // reqConfiglocal.headers.Authorization = token
  //     }
  //     // config.headers['Content-Type'] = 'application/json';

  //     return reqConfiglocal;
  //   },
  //   (error) => {
  //     Promise.reject(error);
  //   }
  // );

  // axios.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   (error) => {
  //     // if (error.response.status === 401) {
  //     // }

  //     return Promise.reject(error);
  //   }
  // );

  // const token = AsyncStorage.getItem("token").then((value) => value);
  // console.log("====================================");
  // console.log(token);
  // console.log("====================================");

  const config = {
    animation: "spring",
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          // initialRouteName="basicInformation"
        >
          <Stack.Screen name="Home" component={LandingScreen} />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="register"
            component={RegisterScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="mobileotp"
            component={MobileOtpScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="under16Message"
            component={Under16Message}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="under16Screen"
            component={Under16Screen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="welcome"
            component={WelcomeScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="forgotpassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="forgotFinish"
            component={ForgotFinishScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="profileScreen"
            component={ProfileScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="changepassword"
            component={ChangePasswordScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="basicInformation"
            component={BasicInformationScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="gender"
            component={GenderScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="profileDetails"
            component={ProfileDetailScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="dashboadIndex"
            component={DashboardIndexScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="myPrescription"
            component={MyPrescription}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="addPrescription"
            component={AddPrescriptionScreen}
          />
          <Stack.Screen
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
            name="editPrescription"
            component={EditPrescription}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  )
}

const styles = StyleSheet.create({})
