import React, { useState, useEffect } from "react"
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  AsyncStorage,
  Image,
  TouchableOpacity
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Avatar } from "react-native-paper"
import BodyText from "../../components/BodyText"
import Axios from 'axios'
import { Menu } from "react-native-paper"
import ProfileDetailScreen from "./ProfileDetails"
import { Feather } from "@expo/vector-icons"

const { width, height } = Dimensions.get('window');

const ProfileScreen = (props) => {
  const [profileEditOpen, setProfileEditOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userData, setUserData] = useState({})

  function getAge(dateString) {
    var today = new Date();
    console.log('dateString', dateString);
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const getNameFunction = async () => {
    //function to get the value from AsyncStorage
    AsyncStorage.getItem("firstName").then(
      (value) =>
        //AsyncStorage returns a promise so adding a callback to get the value
        setFirstName(value)
      //Setting the value in Text
    )
    AsyncStorage.getItem("lastName").then(
      (value) =>
        //AsyncStorage returns a promise so adding a callback to get the value
        setLastName(value)
      //Setting the value in Text
    )

    Axios.get('patient/basic-info', {
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`
      }
    })
      .then(function (res) {
        console.log('dateString', res.data.data);
        setUserData(res.data.data);
      })
      .catch((error) => {

      })
  }

  useEffect(() => {
    getNameFunction()
  }, [firstName, setFirstName, lastName, setLastName])

  const hideProfileEdit = () => {
    setProfileEditOpen(false)
  }

  const removeToken = async (key) => {
    try {
      await AsyncStorage.removeItem(key)
      return true
    } catch (exception) {
      return false
    }
  }

  const logOutHandler = async () => {
    removeToken()
    await AsyncStorage.clear();

    if (removeToken()) {
      props.navigation.popToTop()
    }
  }

  return (
    <View style={styles.screen}>
      {!profileEditOpen ? (
        <>
          <LinearGradient colors={["#54C8D6", "#5101C2"]} style={styles.topBar}>
            <View
              style={{
                width,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: width / 15
              }}
            >
              <View
                style={{
                  maxWidth: '50%',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end'
                }}
              >
                <Image
                  style={{
                    width: width / 3.4,
                    height: width / 3.4,
                    borderRadius: width / 6.8,
                    marginLeft: width / 20,
                    resizeMode: 'contain'
                  }}
                  source={require("../../../assets/img/profile.png")}
                />
                <TouchableOpacity
                  style={{
                    width: width / 12,
                    height: width / 12,
                    backgroundColor: '#54C8D6',
                    borderRadius: width / 24,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    right: 0,
                    bottom: 0
                  }}
                >
                  <Feather name="camera" size={height / 33} color="white" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  maxWidth: '50%',
                  width: '50%',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginLeft: -width / 30
                }}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: height / 25,
                    color: 'white',
                    fontFamily: 'roboto-bold',
                    textAlign: 'left'
                  }}
                >
                  {userData?.first_name} {userData?.last_name}
                </Text>
                <Text
                  style={{
                    fontSize: height / 35,
                    color: 'white',
                    textAlign: 'left'
                  }}
                >
                  Age : {getAge(userData.dob)} yrs
            </Text>
              </View>
            </View>
          </LinearGradient>
          <ScrollView style={styles.menuContainer}>
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => {
                props.navigation.navigate('profileDetails')
              }}
              title="My Details"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => props.navigation.navigate('addPrescription')}
              title="My Prescriptions"
            />

            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => { }}
              title="My Lab Reports"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => { }}
              title="My Doctors"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => { }}
              title="My Labs"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => { }}
              title="My Pharmacists"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => { }}
              title="My Allied HSPs"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => { }}
              title="My Content"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => { }}
              title="Forum and blogs"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => { }}
              title="Inbox"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => { }}
              title="About Us"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => { }}
              title="Settings"
            />
            <Menu.Item
              titleStyle={styles.menuItem}
              onPress={() => {
                logOutHandler()
              }}
              title="Logout"
            />
          </ScrollView>
        </>
      ) : (
          <ProfileDetailScreen onHide={hideProfileEdit} navigation={props.navigation} />
        )
      }
    </View >
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    height: height / 3.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height / 25,
  },
  media: {
    flexDirection: "row",
    alignItems: "center",
  },
  mediaImage: { position: "relative" },
  textContainer: {
    paddingLeft: 20,
    maxWidth: '50%'
  },
  nameText: {
    fontSize: 30,
    color: "#fff",
    fontFamily: "roboto-bold",
  },
  ageText: {
    fontSize: 21,
    color: "#fff",
  },
  uploadButtonContainer: {
    position: "absolute",
    bottom: 5,
    right: -5,
    backgroundColor: "#54C8D6",
    padding: 10,
    borderRadius: 50,
  },
  menuContainer: {
    paddingLeft: 15,
  },
  menuItem: {
    color: "rgba(102, 1, 243, .62)",
    fontSize: 17,
  },
})

export default ProfileScreen
