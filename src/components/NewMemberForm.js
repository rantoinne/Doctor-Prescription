import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Picker,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  Platform,
  ScrollView
} from "react-native";
import Axios from 'axios';
import BodyText from "./BodyText";
import { LinearGradient } from "expo-linear-gradient";
import InputWithLabel from "./InputWithLabel";
import CommonPicker from "./CommonPicker";

const { width, height } = Dimensions.get('window');

const FEMALES = ['Mother', 'Wife', 'Daughter'];
const MALES = ['Father', 'Son', 'Husband'];

const NewMemberFormModal = ({
  hideModal,
  visible,
  submitNewMemberRequest
}) => {
  const [btnEnabled, setBtnMode] = useState(false)

  const [gender, setGender] = useState('')
  const [genderError, setGenderError] = useState([false, ''])

  const [relation, setRelation] = useState('')
  const [relationError, setRelationError] = useState([false, ''])

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState([false, ''])

  const [age, setAge] = useState('')
  const [ageError, setAgeError] = useState([false, ''])

  const [mobNo, setMobNo] = useState('')
  const [mobNoError, setMobError] = useState([false, ''])

  const [addressCityName, setAddressCityName] = useState('')
  const [addressPincode, setAddressPincode] = useState('')
  const [address, setAddress] = useState('')
  const [addressStateName, setAddressStateName] = useState('')

  const fetchPinDetails = async (pincode) => {
    Axios.get(
      `common/location-by-zipcode/${pincode}`, {
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`
      }
    }
    )
      .then((res) => {
        setAddressCityName(res.data.data[0].districtName || "");
        setAddressStateName(res.data.data[0].stateName || "");
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  const switchMode = () => {
    const errors = [nameError[0], ageError[0], relationError[0], genderError[0], mobNoError[0]];
    setBtnMode(!errors.includes(true))
  }

  const makePayloadAndCreateNewMember = () => {
    const errors = [nameError[0], ageError[0], relationError[0], genderError[0], mobNoError[0]];
    const values = [name, age, relation, gender, mobNo, addressCityName, addressPincode, address, addressStateName];
    if (errors.includes(true)
      || values.includes('')
      || gender === 'Select' || relation === 'Select') {
      return;
    }
    const formData = new FormData();
    
    formData.append('name', name)
    formData.append('age', age);
    formData.append('relation', relation);
    formData.append('gender', gender);
    formData.append('mobileNumber', mobNo);
    formData.append('address', address);
    formData.append('city', addressCityName);
    formData.append('district', addressCityName);
    formData.append('state', addressStateName);
    formData.append('pincode', addressPincode);
    
    setName('');
    setAge('');
    setRelation('');
    setGender('');
    setMobNo('');
    setAddress('');
    setAddressPincode('');
    setAddressStateName('');
    setAddressCityName('');
    submitNewMemberRequest(formData);
  }

  return (
    <Modal
      animationType="fade"
      onBackButtonPress={hideModal}
      transparent={true}
      onRequestClose={hideModal}
      visible={visible}
    >
      <TouchableOpacity activeOpacity={1} onPressOut={hideModal}>
        <View style={styles.modalMainContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <TouchableWithoutFeedback>
                <View style={{ width: '100%' }}>
                  <LinearGradient colors={["#54C8D6", "#6201E9"]} style={styles.headerView}>
                    <BodyText style={styles.headerSubTitle}>
                      ADD A FAMILY MEMBER
                  </BodyText>
                  </LinearGradient>
                  <View
                    style={styles.parentUIContainer}
                  >
                    <View
                      style={{
                        maxHeight: height / 2,
                        marginBottom: 10
                      }}
                    >
                      <ScrollView
                        showsVerticalScrollIndicator={false}
                      >
                        <InputWithLabel
                          placeholderText="Patient's Name *"
                          placeholderTextColor="#7327C273"
                          showErrorMsg={nameError[0]}
                          errorMsg={nameError[1]}
                          value={name}
                          fnc={(text) => {
                            setName(text);
                            if (/\d/.test(text)) {
                              setNameError([
                                true,
                                'Name cannot have numbers'
                              ])
                            }
                            if (!/\d/.test(text)) {
                              setNameError([
                                false,
                                ''
                              ])
                            }
                            switchMode();
                          }}
                        />
                        <CommonPicker
                          label="Relationship *"
                          selectedValue={relation}
                          showErrorMsg={relationError[0]}
                          errorMsg={relationError[1]}
                          pickerArrayItem={['Select', 'Father', 'Mother', 'Son', 'Wife', 'Daughter', 'Husband']}
                          onValueChange={(itemValue) => {
                            setRelation(itemValue);
                            if (gender === 'Male' && FEMALES.includes(itemValue)
                              || gender === 'Female' && MALES.includes(itemValue)) {
                              setGenderError([
                                true,
                                'Please enter correct gender'
                              ])
                            }
                            else {
                              setGenderError([
                                false,
                                ''
                              ])
                            }
                            switchMode();
                          }
                          }
                        />
                        <InputWithLabel
                          placeholderText="Age *"
                          maxLength={2}
                          showErrorMsg={ageError[0]}
                          errorMsg={ageError[1]}
                          value={age}
                          keyboardType="number-pad"
                          placeholderTextColor="#7327C273"
                          fnc={(text) => {
                            setAge(text)
                            if (text === '00' || text === '0') {
                              setAgeError([
                                true,
                                'Age cannot be 0 / 00'
                              ])
                            } else {
                              setAgeError([
                                false,
                                ''
                              ])
                            }
                            switchMode();
                          }}
                        />
                        <CommonPicker
                          label="Gender *"
                          selectedValue={gender}
                          showErrorMsg={genderError[0]}
                          errorMsg={genderError[1]}
                          pickerArrayItem={['Select', 'Male', 'Female']}
                          onValueChange={(itemValue) => {
                            setGender(itemValue);
                            if (itemValue === 'Male' && FEMALES.includes(relation)
                              || itemValue === 'Female' && MALES.includes(relation)) {
                              setGenderError([
                                true,
                                'Please enter correct gender'
                              ])
                            }
                            else {
                              setGenderError([
                                false,
                                ''
                              ])
                            }
                            switchMode();
                          }
                          }
                        />
                        <InputWithLabel
                          placeholderText="Pateint's Contact Number *"
                          keyboardType="number-pad"
                          maxLength={10}
                          showErrorMsg={mobNoError[0]}
                          errorMsg={mobNoError[1]}
                          value={mobNo}
                          placeholderTextColor="#7327C273"
                          fnc={(text) => {
                            setMobNo(text)
                            if (text.length <= 9) {
                              setMobError([
                                true,
                                'Mobile number should have 10 digits'
                              ])
                            }
                            if (text.length === 10) {
                              setMobError([
                                false,
                                ''
                              ])
                            }
                            switchMode();
                          }}
                        />
                        <InputWithLabel
                          placeholderText="Pincode"
                          placeholderTextColor="#7327C273"
                          maxLength={6}
                          keyboardType="number-pad"
                          value={addressPincode}
                          fnc={(pValue) => {
                            if (pValue.length === 6) {
                              fetchPinDetails(pValue)
                            }
                            setAddressPincode(pValue)
                          }
                          }
                        />
                        <InputWithLabel
                          value={address}
                          placeholderText="Address *"
                          placeholderTextColor="#7327C273"
                          fnc={(adrs) => {
                            setAddress(adrs);
                            switchMode();
                          }}
                        />
                        <InputWithLabel
                          placeholderText="City *"
                          editable={false}
                          value={addressCityName}
                          placeholderTextColor="#7327C273"
                        />
                        <InputWithLabel
                          placeholderText="District *"
                          value={addressCityName}
                          editable={false}
                          placeholderTextColor="#7327C273"
                        />
                        <InputWithLabel
                          placeholderText="State *"
                          value={addressStateName}
                          editable={false}
                          placeholderTextColor="#7327C273"
                        />
                      </ScrollView>
                    </View>
                    <TouchableOpacity
                      // disabled={!btnEnabled}
                      onPress={() => makePayloadAndCreateNewMember()}
                    >
                      <LinearGradient
                        colors={[
                          '#6201EA',
                          '#35027F'
                        ]}
                        style={{
                          width: width * 0.7,
                          borderRadius: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: height / 15
                        }}
                      >
                        <Text
                          style={{
                            fontSize: height / 40,
                            color: 'white',
                            fontFamily: 'roboto-bold'
                          }}
                        >
                          Continue
                          </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>

  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#00000099",
  },
  modalMainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  modalInnerContainer: {
    ...Platform.select({
      ios: {
        width: (width / 100) * 85,
      },
      android: {
        width: (width / 100) * 80,
        marginTop: -height / 30,
      }
    }),
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopRightRadius: width / 15,
    borderTopLeftRadius: width / 15,
    backgroundColor: 'white',
    borderRadius: width / 15,
    borderWidth: 1,
  },
  rowMemberContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: height / 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#00000029'
  },
  addNewMemberContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: height / 70,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatarStyle: {
    width: height / 17,
    height: height / 17,
    resizeMode: 'contain'
  },
  parentUIContainer: {
    padding: height / 40,
    paddingVertical: height / 60,
    backgroundColor: 'white',
    width: '100%',
    borderBottomRightRadius: width / 15,
    borderBottomLeftRadius: width / 15
  },
  avatarTextContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headerView: {
    justifyContent: 'center',
    paddingVertical: height / 30,
    alignItems: 'center',
    borderTopRightRadius: width / 15,
    borderTopLeftRadius: width / 15,
    paddingHorizontal: 14,
    width: '100%',
    borderBottomWidth: 1,
  },
  headerSubTitle: {
    fontSize: Platform.OS == 'ios' ? height / 55 : height / 45,
    color: 'white',
  },
  memberNameTextStyle: {
    fontSize: height / 45,
    marginLeft: width / 15,
    color: '#7327C2'
  }
});

export default NewMemberFormModal;
