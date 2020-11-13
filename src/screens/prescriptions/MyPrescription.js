import React, { useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  AsyncStorage,
  ScrollView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Card, TextInput, List } from "react-native-paper"
import { AntDesign } from "@expo/vector-icons"
import moment from 'moment';
import BodyText from "../../components/BodyText"
import CustomCheckBox from "../../components/CustomCheckBox"
import SmallButton from "../../components/SmallButton"
import GradientButton from "../../components/GradientButton"
import Axios from "axios"
import { FlatList } from "react-native-gesture-handler"

const MyPrescription = (props) => {
  const [isAgreed, setSelection] = useState(false)
  const [currentPage, setPageIndex] = useState(1);
  const [myPrescriptions, setPrescriptions] = useState([]);
  const { navigation } = props;

  useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        fetchPrescriptions();
      });
      return unsubscribe;
  }, [navigation]);

  const fetchPrescriptions = async () => {
    console.log(`Bearer ${await AsyncStorage.getItem("token")}`);
    Axios.get(`patient/prescriptions/login-user/pagination?page=${currentPage}&pageSize=5`, {
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`
      }
    })
      .then((res) => {
        console.log('Response 55 EFECt', res);
        setPrescriptions([...res.data.data.pageData]);
        setPageIndex(currentPage+1);
        console.log('Pres', myPrescriptions);
      })
      .catch((error) => {
        console.log('Error 55', error);
      });
  }

  const addFetchPrescriptions = async () => {
    console.log(currentPage);
    Axios.get(`patient/prescriptions/login-user/pagination?page=${currentPage}&pageSize=5`, {
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`
      }
    })
      .then((res) => {
        console.log('Response 55', res.data.data.pageData);
        setPrescriptions(myPrescriptions.concat(res.data.data.pageData));
        console.log('Prescription END', myPrescriptions.concat(res.data.data.pageData));
        setPageIndex(currentPage+1);
      })
      .catch((error) => {
        console.log('Error 55', error);
      });
  }

  const agreeHandler = () => {
    setSelection(!isAgreed)
  }
  return (
    <View style={styles.screen}>
      <LinearGradient colors={["#54C8D6", "#5101C2"]} style={styles.topBar}>
        <View style={styles.topTitleContainer}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            activeOpacity={0.6}>
            <AntDesign
              name="arrowleft"
              size={24}
              color="black"
              style={styles.titleIcon}
            />
          </TouchableOpacity>

          <BodyText style={styles.topTitle}>My Prescription</BodyText>
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <View style={styles.bodyTopHead}>
          <View>
            <BodyText style={styles.bodyTitleText}>
              Long Press for Multiple Section
            </BodyText>
          </View>
          <View>
            <TouchableOpacity>
              <BodyText style={styles.selectAllText}>Select All</BodyText>
            </TouchableOpacity>
          </View>
        </View>
        {
          myPrescriptions.length === 0 && (
            <BodyText style={styles.noPresFoundText}>
              No Prescriptions found! {'\n'}Please start by clicking &apos;Add Prescription&apos;
            </BodyText>
          )
        }
        <FlatList
          data={myPrescriptions}
          onEndReached={() => addFetchPrescriptions()}
          renderItem={({item, index}) => {
            return (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardTop}>
                    <View style={styles.topIconsContainer}>
                      <Image
                        style={styles.topIconImage}
                        source={require("../../../assets/img/icons/doc.png")}
                      />
                      <Image
                        style={styles.topIconImage}
                        source={require("../../../assets/img/icons/pres.png")}
                      />
                    </View>
                    <View>
                      <CustomCheckBox
                        isSelected={isAgreed}
                        setSelection={agreeHandler}
                      >
                        <View style={styles.checkboxInputContainer}>
                          <BodyText style={styles.smallInput}></BodyText>
                        </View>
                      </CustomCheckBox>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.media}>
                      <View style={styles.mediaImageContainer}>
                        <Image
                          style={styles.mediaImage}
                          source={{ uri: item.prescriptionFiles[0] }}
                        />
                        <SmallButton
                          style={styles.editButton}
                          onPress={() =>
                            props.navigation.navigate("editPrescription", {
                              ...item
                            })
                          }
                        >
                          <BodyText style={styles.buttonText}>Edit</BodyText>
                        </SmallButton>
                      </View>
                      <View style={styles.prescriptionListContainer}>
                        <List.Section>
                          <List.Item
                            style={styles.listMain}
                            titleStyle={styles.listTitle}
                            descriptionStyle={styles.listDescription}
                            title="Prescription Name / Description"
                            description={item.description || '--'}
                          />
                          <List.Item
                            style={styles.listMain}
                            titleStyle={styles.listTitle}
                            descriptionStyle={styles.listDescription}
                            title="Prescription Date"
                            description={`${moment(item.prescribed_on).format('MM-DD-YYYY')}`}
                          />
                          <List.Item
                            style={styles.listMain}
                            titleStyle={styles.listTitle}
                            descriptionStyle={styles.listDescription}
                            title="Doctor Name"
                            description={item.doctor_name}
                          />
                          <List.Item
                            style={styles.listMain}
                            titleStyle={styles.listTitle}
                            descriptionStyle={styles.listDescription}
                            title="Doctor Number"
                            description={item.doctor_phone_no}
                          />
                        </List.Section>
                      </View>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            )
          }}
        />

        <View style={styles.buttonsContainer}>
          <GradientButton
            style={styles.button}
            onPress={() => props.navigation.navigate("addPrescription")}
          >
            <BodyText style={styles.addButtonText}>Add Prescription </BodyText>
          </GradientButton>
          {/* <GradientButton style={styles.button}>Share</GradientButton> */}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    height: 150,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  topTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  topTitle: {
    color: "#fff",
    fontSize: 18,
  },
  titleIcon: {
    color: "#fff",
    marginRight: 5,
    fontSize: 30,
  },
  body: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 35,
    paddingTop: 10,
  },
  bodyTopHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  bodyTitleText: {
    color: "rgba(115, 39, 194, .43)",
    fontSize: 16,
    fontFamily: "roboto-italic",
  },
  selectAllText: {
    color: "rgba(115, 39, 194, .43)",
    fontSize: 19,
    fontFamily: "roboto-bold",
  },
  noPresFoundText: {
    color: "rgba(115, 39, 194, .43)",
    fontSize: 19,
    fontFamily: "roboto-bold",
    marginLeft: 20
  },
  card: {
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    width: "100%",
    marginBottom: 15,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 20,
  },
  input: {
    backgroundColor: "#fff",
    color: "#7327C2",
    paddingVertical: 0,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 226, 226, 1)",
  },
  media: {
    flexDirection: "row",
    paddingBottom: 10,

    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  editButton: {
    width: 79,
    borderRadius: 18,
    paddingVertical: 7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  mediaImageContainer: {
    alignItems: "center",
    width: "35%",
    justifyContent: "center",
  },
  mediaImage: {
    height: 107,
    width: 84,
    marginBottom: 10,
    marginTop: 10,
  },
  prescriptionListContainer: {
    width: "65%",
  },
  listTitle: {
    color: "rgba(115, 39, 194, .43)",
    fontSize: 11,
    fontFamily: "roboto-italic",
  },
  listDescription: {
    color: "rgba(115, 39, 194, 1)",
    fontSize: 16,
    fontFamily: "roboto-italic",
    marginBottom: 10,
  },
  listMain: {
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 226, 226, 1)",
  },
  topIconsContainer: {
    flexDirection: "row",
  },
  topIconImage: {
    marginHorizontal: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  button: {
    width: "100%",
    minWidth: "100%",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 21,
  },
})

export default MyPrescription
