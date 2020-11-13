import React, { useEffect, useState } from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform
} from "react-native";
import {
  Appbar,
  Avatar,
  ProgressBar,
  BottomNavigation,
} from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import BodyText from "../../components/BodyText";
import ActiveUsersModal from "../../components/ActiveUsersModal";
import Axios from "axios";
import NewMemberFormModal from "../../components/NewMemberForm";

const { width, height } = Dimensions.get('window');

const DashboardScreen = (props) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showActiveUsersModal, setActiveUsersModalVisibility] = useState(false);
  const [showNewMemberFormModal, setNewMemberFormModalVisibility] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [currentActiveMember, setCurrentActiveMember] = useState(0);

  const hideActiveUsersModal = () => {
    setActiveUsersModalVisibility(false);
  }

  const changeNewMemberFormModalMode = () => {
    setNewMemberFormModalVisibility(false);
  }

  const getNameFunction = () => {
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
  }

  useEffect(() => {
    fetchMembers()
    getNameFunction()
  }, [firstName])

  const fetchMembers = async () => {
    Axios
      .get("patient/family-members", {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`
        }
      })
      .then(function (res) {
        console.log(res.data);
        const resData = res.data;
        if (resData.status) {
          console.log('1\n\n\n', resData.data[0].mobileNumber);
          setFamilyMembers(resData.data || []);
        } else {
          console.log('2', resData);
        }
      })
      .catch(function (error) {
        console.log('e', error);
      });
  }

  const submitNewMemberRequest = async (payload) => {
    console.log('THESE VALUES COMING HERE', payload);

    Axios
      .post("patient/family-members", payload, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`
        }
      })
      .then(function (res) {
        console.log("RESPONSE DATA", res);
      })
      .catch(function (error) {
        console.log('e', error);
      });
    fetchMembers();
    changeNewMemberFormModalMode();
  }

  return (
    <View style={styles.screen}>
      <Appbar style={styles.appBar}>
        <View style={styles.leftContainer}>
          <BodyText style={styles.helloText}>Hello {firstName}!</BodyText>
          <BodyText style={styles.profileStatusText}>
            Your Profile Completeness
          </BodyText>
        </View>
        <View style={styles.rightContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.bellContainer}>
              <FontAwesome5 name="bell" size={height / 30} color="black" />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => setActiveUsersModalVisibility(true)}
          >
            <Avatar.Image
              size={height / 14}
              source={require("../../../assets/img/avatar.png")}
            />
          </TouchableWithoutFeedback>
        </View>
      </Appbar>
      <ProgressBar progress={0.5} color={"#54C8D6"} style={styles.progress} />

      <View style={styles.banner}>
        <Image
          style={styles.bannerImage}
          resizeMode="cover"
          source={require("../../../assets/img/banner/1.jpg")}
        />
      </View>
      <View style={styles.servicesContainer}>
        <View style={styles.servicesRow}>
          <View style={styles.col}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => props.navigation.navigate("myPrescription")}
            >
              <Image
                style={styles.serviceImage}
                source={require("../../../assets/img/gallery/upload_priscription.png")}
              />
              <BodyText style={styles.titleText}>Prescriptions</BodyText>
            </TouchableOpacity>
          </View>
          <View style={styles.col}>
            <TouchableOpacity activeOpacity={0.6}>
              <Image
                style={styles.serviceImage}
                source={require("../../../assets/img/gallery/upload_priscription.png")}
              />
              <BodyText style={styles.titleText}>Lab Reports</BodyText>
            </TouchableOpacity>
          </View>
          <View style={styles.col}>
            <TouchableOpacity activeOpacity={0.6}>
              <Image
                style={styles.serviceImage}
                source={require("../../../assets/img/gallery/upload_priscription.png")}
              />
              <BodyText style={styles.titleText}>Doctors</BodyText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.servicesRow, { marginTop: 0 }]}>
          <View style={styles.col}>
            <TouchableOpacity activeOpacity={0.6}>
              <Image
                style={styles.serviceImage}
                source={require("../../../assets/img/gallery/upload_priscription.png")}
              />
              <BodyText style={styles.titleText}>Allied HSPs</BodyText>
            </TouchableOpacity>
          </View>
          <View style={styles.col}>
            <TouchableOpacity activeOpacity={0.6}>
              <Image
                style={styles.serviceImage}
                source={require("../../../assets/img/gallery/upload_priscription.png")}
              />
              <BodyText style={styles.titleText}>Pharmacists</BodyText>
            </TouchableOpacity>
          </View>
          <View style={styles.col}>
            <TouchableOpacity activeOpacity={0.6}>
              <Image
                style={styles.serviceImage}
                source={require("../../../assets/img/gallery/upload_priscription.png")}
              />
              <BodyText style={styles.titleText}>Content</BodyText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Active Users Modal */}
      <ActiveUsersModal
        visible={showActiveUsersModal}
        hideModal={hideActiveUsersModal}
        members={familyMembers}
        currentActiveMember={currentActiveMember}
        setCurrentActiveMember={setCurrentActiveMember}
        showNewMemberForm={setNewMemberFormModalVisibility}
      />
      {/* New Member Form Modal */}
      <NewMemberFormModal
        visible={showNewMemberFormModal}
        submitNewMemberRequest={submitNewMemberRequest}
        hideModal={changeNewMemberFormModalMode}
        showNewMemberForm={setNewMemberFormModalVisibility}
      />
    </View>
  )
}

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
  banner: {
    height: 220,
  },
  bannerImage: {
    height: "100%",
  },
  servicesContainer: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff",
  },
  servicesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  col: {
    width: "33.3333%",
    paddingHorizontal: 5,
    alignItems: "center",
  },
  serviceImage: {
    height: 130,
    width: 130,
  },
  titleText: {
    color: "rgba(43, 43, 43, .7)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 0,
  },
})

export default DashboardScreen
