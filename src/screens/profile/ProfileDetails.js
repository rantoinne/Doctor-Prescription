import React, { useState, useRef, useEffect, useContext } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Keyboard,
  Dimensions,
  ScrollView,
  Picker,
  AsyncStorage,
  Text,
  Alert,
} from "react-native"
import moment from 'moment';
import DateTimePicker from "react-native-modal-datetime-picker"
import { LinearGradient } from "expo-linear-gradient"
import { Entypo, AntDesign, Feather, FontAwesome } from "@expo/vector-icons"
import Loader from "../../components/Loader"
import SuccessModal from "../../components/SuccessModal"
import RadioForm from 'react-native-simple-radio-button'
import InputWithLabel from "../../components/InputWithLabel"
import { SCREEN_HEIGHT } from "../../utilities/HelperFunctions"
import { AppContext } from "../../context"
import Axios from "axios"

const { width, height } = Dimensions.get('window');
const common_colr = "rgba(115, 39, 194, 1)"

var radio_props = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
];

const ProfileDetailScreen = (props) => {
  const { navigation } = props;
  const context = useContext(AppContext)
  const dateInputRef = React.useRef()
  const { token } = context
  const [isFullAddressExpanded, expandFullAddress] = useState(false);
  const [errorMessage, setErrorMessages] = useState(['', '', '', '']);
  const [errorFieldIndex, setErrorFieldIndex] = useState([false, false, false, false]);
  const [isEmergencyDetailExpanded, expandEmergencyDetailView] = useState(false);
  const [isEmploymentInfoExpanded, expandEmploymentInfoView] = useState(false);
  const [isInsuranceExpanded, expandInsuranceView] = useState(false);
  const [showLoader, setShowLoader] = useState(false)
  const [authToken, setAuthToken] = useState(false)
  const [isEmpNumberValid, setEmpNumberValidity] = useState(false)
  const [isEmergencyNumberValid, setEmergencyNumberValidity] = useState(false)
  const [isEmpNameValid, setEmpNameValidity] = useState(false)
  const [isContactNameValid, setContactNameValidity] = useState(false)
  const [userdata, setUserdata] = useState({})
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [dateOfBirth, setdateOfBirth] = useState(undefined)
  const [dateOfBirth1, setdateOfBirth1] = useState(undefined)
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [emailIsInvalid, setemailIsInvalid] = useState(false)
  const [openDatePicker1, setOpenDatePicker1] = useState(false)
  const [successModalShow, setSuccessModal] = useState(false)
  const [isEditable, setEditingControls] = useState(false)
  const [isBtnActive, setBtnActivity] = useState(false)
  const [addressCityName, setAddressCityName] = useState('')
  const [gender, setGender] = useState('')
  const [addressCountryName, setAddressCountryName] = useState('')
  const [addressPincode, setAddressPincode] = useState('')
  const [address, setAddress] = useState('')
  const [address1, setAddress1] = useState('')
  const [addressStateName, setAddressStateName] = useState('')
  const scrollRef = useRef();
  const [dobErrorShow, setDobErrorShow] = useState(false)

  useEffect(() => {
    getData();
    const backAction = () => {
      if (isEditable) {
        goBackConfirmation();
      }
      else {
        navigation.goBack();
      }
      return true;
    };

    BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [isEditable]);

  const handleDateChange = (date) => {
    handleClose()
    setUserdata(userdata => ({ ...userdata, dob: date }))
    setdateOfBirth(date)
  }

  const handleDateChange1 = (date) => {
    handleClose1()
    setUserdata({
      ...userdata, insuranceDetails: {
        policyName: userdata.insuranceDetails.policyName,
        provider: userdata.insuranceDetails.provider,
        type: userdata.insuranceDetails.type,
        policyNumber: userdata.insuranceDetails.policyNumber,
        insurance_provide_by_employer: userdata.insuranceDetails.insurance_provide_by_employer,
        valid_till: date,
      }
    })
    setdateOfBirth1(date)
  }

  const fetchPinDetails = async (pincode) => {
    Axios.get(
      `common/location-by-zipcode/${pincode}`, {
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`
      }
    }
    )
      .then((res) => {
        console.log('response', res);
        setAddressCityName(res.data.data[0].districtName || "");
        setAddressCountryName('India');
        setAddressStateName(res.data.data[0].stateName || "");
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  const handleClose = () => {
    setOpenDatePicker(false)
    handleBlur()
  }

  const handleClose1 = () => {
    setOpenDatePicker1(false)

  }

  const handleBlur = () => {
    setTimeout(() => {
      // dateInputRef.current.focus()
    }, 100)
  }

  const handleFocus = () => {
    // dateInputRef.current.focus()
  }

  const handleOpen = () => {
    Keyboard.dismiss()
    handleFocus()
    setOpenDatePicker(true)
  }

  const setBtnMode = () => {
    if (userdata.first_name === '' ||
      userdata.last_name === '' ||
      userdata.mobileNumber === '') {
      setBtnActivity(false)
    }
    else {
      setBtnActivity(true)
    }
  }

  const getData = async (tok) => {
    console.log('Token', await AsyncStorage.getItem("token"));
    Axios.get('patient/basic-info', {
      headers: {
        'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`
      }
    })
      .then(function (res) {
        console.log(res)
        const resData = res.data
        console.log('\n\n\n\n\n\n\n\n\n\n\n', resData.data.insuranceDetails.insurance_provide_by_employer)
        setUserdata(resData.data)
        setAddressCityName(resData.data.address.city || '');
        setAddressCountryName(resData.data.address.country || '');
        setAddressStateName(resData.data.address.state || '');
        setAddressPincode(resData.data.address.pincode || '');
        setAddress(resData.data.address.address1 || '');
        setAddress1(resData.data.address.address2 || '');
        setGender(resData.data.gender || '');
        setTimeout(() => {
          console.log('userData', userdata.mobileNumber);
        }, 2000);
        if (resData.status) {
          setShowLoader(false)
          setFirst(resData.data.first_name)
          setLast(resData.data.last_name)
          resData.data.dob = resData.data.dob.split('T')[0]
          console.log(resData.data.dob)
          console.log('sad', dateOfBirth)
        } else {
          // setErrorMessage(resData.message)
          setShowLoader(false)
        }
      })
      .catch((error) => {
        // const errData = error.response.data
        // setErrorMessage(errData.message)
        setShowLoader(false)
      })
  }

  const successModalHideHandler = () => {
    setSuccessModal(false)
  }

  const goBackConfirmation = () =>
    Alert.alert(
      "Are you sure?",
      "You will lose editted details",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => navigation.goBack() }
      ],
      { cancelable: false }
    );

  const onsubmit = async () => {
    const array = errorFieldIndex.filter(e => e === true);
    console.log('DATE NOW', moment(userdata.insuranceDetails.valid_till || Date.now()).format('MM-DD-YYYY'));
    if (errorFieldIndex.filter(e => e === true).length > 0 || emailIsInvalid || isEmpNumberValid || isEmergencyNumberValid || isEmpNameValid) {
      return;
    }
    console.log(JSON.stringify(userdata))
    var a
    let data = userdata

    console.log("\n\n", userdata);
    a = {
      "first_name": data.first_name || "",
      "last_name": data.last_name || "",
      "dob": !!dateOfBirth ? moment(dateOfBirth).format('MM-DD-YYYY') : moment(userdata.dob).format('MM-DD-YYYY'),
      "gender": gender || "",
      "mobileNumber": data.mobileNumber || "",
      "martialStatus": data.martialStatus === "Select" ? "" : data.martialStatus || "",
      "bloodgroup": data.bloodgroup === "Select" ? "" : data.bloodgroup || "",
      "address": {
        "address1": address || "",
        "address2": address1 || "",
        "street": '',
        "city": addressCityName || "",
        "locality": "locality",
        "state": addressStateName || "",
        "country": addressCountryName || "",
        "pincode": addressPincode || ""
      },
      "email": data.email || "",
      "emergencyDetails": {
        "contactNo": userdata.emergencyDetails.contactNo || "",
        "contactPerson": userdata.emergencyDetails.contactPerson || "",
        "relation": userdata.emergencyDetails.relation === "Select" ? "" : userdata.emergencyDetails.relation || ""
      },
      "employmentInformation": {
        "employerName": userdata.employmentInformation.employerName || "",
        "designation": userdata.employmentInformation.designation || "",
        "mobileNumber": userdata.employmentInformation.mobileNumber || "",
        "industry": userdata.employmentInformation.industry || "",
        "addressType": userdata.employmentInformation.addressType || "",
        "address": {
          "address1": userdata.employmentInformation.address1 || "",
          "address2": userdata.employmentInformation.address2 || "",
          "street": userdata.employmentInformation.street || "",
          "city": userdata.employmentInformation.city || "",
          "locality": userdata.employmentInformation.locality || "",
          "state": userdata.employmentInformation.state || "",
          "country": userdata.employmentInformation.country || "",
          "pincode": userdata.employmentInformation.pincode || ""
        }
      },
      "insuranceDetails": {
        "valid_till": moment(userdata.insuranceDetails.valid_till || new Date()).format('MM-DD-YYYY'),
        "type": userdata.insuranceDetails.type || "",
        "provider": userdata.insuranceDetails.provider || "",
        "policyName": userdata.insuranceDetails.policyName || "",
        "policyNumber": userdata.insuranceDetails.policyNumber || "",
        "insurance_provide_by_employer": userdata.insuranceDetails.insurance_provide_by_employer || false
      },

    }
    // }
    console.log('a', data)
    console.log('a', a)

    console.log(Axios
      .put("patient/complete-info", a, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }))
    Axios
      .put("patient/complete-info", a, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      })
      .then(function (res) {
        console.log(res)
        const resData = res.data
        if (resData.status) {
          getData(authToken);
          setSuccessModal(true)
          setdateOfBirth(undefined)
          setShowLoader(false)
        } else {
        }
        navigation.goBack();
      })
      .catch((error) => {
        const errData = error.response.data
        navigation.goBack();
      })
  }

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center'
      }}
    >
      {showLoader && <Loader />}
      <LinearGradient colors={["#54C8D6", "#5101C2"]} style={styles.topBar}>
        <View
          style={{
            width,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (isEditable) {
                goBackConfirmation();
                return;
              }
              props.navigation.goBack();
            }}
          >
            <Entypo
              name="chevron-left"
              size={height / 17}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign
              name="pluscircleo"
              size={height / 22}
              color="white"
            />
          </TouchableOpacity>
        </View>
        {/* DP AND NAME AGE VIEW*/}
        <View
          style={{
            width: width / 1.02,
            marginTop: -height / 58,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              maxWidth: '50%'
            }}
          >
            <Image
              style={{
                width: width / 3.4,
                height: width / 3.4,
                borderRadius: width / 6.8,
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
              justifyContent: 'center',
              alignItems: 'flex-start',
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
              {/* {first} {last} */}
              Yateesh Bhardwaj Bhardwaj
            </Text>
            <Text
              style={{
                fontSize: height / 35,
                color: 'white',
                textAlign: 'left'
              }}
            >
              Age: {getAge(userdata.dob)} yrs
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* PROFILE MY DETAILS HEADING */}

      <View
        style={{
          width,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingHorizontal: width / 15
        }}
      >
        <Text
          style={{
            fontSize: height / 30,
            color: '#54C8D6',
            fontFamily: 'roboto-bold',
            marginTop: height / 70,
            textAlign: 'left',
          }}
        >
          Profile
        </Text>
        {
          !isEditable ? (
            <TouchableOpacity onPress={() => {
              setEditingControls(true)
            }}
            >
              <Feather
                name="edit-3"
                color="#33017A"
                size={height / 30}
              />
            </TouchableOpacity>
          ) : (
              <TouchableOpacity onPress={() => {
                onsubmit()
              }}
              >
                <FontAwesome
                  name="floppy-o"
                  color="#33017A"
                  size={height / 30}
                />
              </TouchableOpacity>
            )
        }
      </View>

      {/* User Info Fields Non editable */}

      <ScrollView
        keyboardShouldPersistTaps="never"
        ref={scrollRef}
      // onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
      >
        <View
          style={{
            width,
            paddingHorizontal: width / 14,
            marginTop: height / 70
          }}
        >

          <InputWithLabel
            label="First Name"
            editable={isEditable}
            showErrorMsg={errorFieldIndex[0]}
            errorMsg={errorMessage[0]}
            value={userdata.first_name}
            fnc={(first_name) => {
              setUserdata(userdata => ({ ...userdata, first_name: first_name }));
              if (first_name.length === 0) {
                console.log(' I AM ALREADY HERE')
                setErrorFieldIndex([
                  ...[true, errorFieldIndex[1], errorFieldIndex[2], errorFieldIndex[3]]
                ])
                setErrorMessages([
                  ...[
                    "First name cannot be blank",
                    errorMessage[1],
                    errorMessage[2],
                    errorMessage[3],
                  ]
                ])
                return;
              }
              if (first_name === userdata.last_name?.toLowerCase()) {
                setErrorFieldIndex([
                  ...[true, errorFieldIndex[1], errorFieldIndex[2], errorFieldIndex[3]]
                ])
                setErrorMessages([
                  ...[
                    "First name cannot be same as last name",
                    errorMessage[1],
                    errorMessage[2],
                    errorMessage[3],
                  ]
                ])
                return;
              }
              if (first_name.length > 1) {
                setErrorFieldIndex([
                  ...[false, errorFieldIndex[1], errorFieldIndex[2], errorFieldIndex[3]]
                ])
                setErrorMessages([
                  ...[
                    "",
                    errorMessage[1],
                    errorMessage[2],
                    errorMessage[3],
                  ]
                ])
                return;
              }
            }}
          />

          <InputWithLabel
            label="Last Name"
            editable={isEditable}
            containerMargin={0}
            errorMsg={errorMessage[1]}
            showErrorMsg={errorFieldIndex[1]}
            value={userdata.last_name}
            fnc={(last_name) => {
              setUserdata(userdata => ({ ...userdata, last_name: last_name }));
              if (last_name.length === 0) {
                console.log(' I AM ALREADY HERE')
                setErrorFieldIndex([
                  ...[errorFieldIndex[0], true, errorFieldIndex[2], errorFieldIndex[3]]
                ])
                setErrorMessages([
                  ...[
                    errorMessage[0],
                    "Last name cannot be blank",
                    errorMessage[2],
                    errorMessage[3],
                  ]
                ])
                return;
              }
              if (last_name === userdata.first_name?.toLowerCase()) {
                setErrorFieldIndex([
                  ...[errorFieldIndex[0], true, errorFieldIndex[2], errorFieldIndex[3]]
                ])
                setErrorMessages([
                  ...[
                    errorMessage[0],
                    "Last name cannot be same as first name",
                    errorMessage[2],
                    errorMessage[3],
                  ]
                ])
                return;
              }
              if (last_name.length > 1) {
                setErrorFieldIndex([
                  ...[errorFieldIndex[0], false, errorFieldIndex[2], errorFieldIndex[3]]
                ])
                setErrorMessages([
                  ...[
                    errorMessage[0],
                    "",
                    errorMessage[2],
                    errorMessage[3],
                  ]
                ])
                return;
              }
            }}
          />

          <InputWithLabel
            editable={false}
            onFocus={() => {
              setOpenDatePicker(true)
            }}
            label="Date of birth"
            fnc={(dob) => {
              setUserdata(userdata => ({ ...userdata, dob: dob }));
              setBtnMode();
            }}
            value={
              !!dateOfBirth ? moment(dateOfBirth).format('MM-DD-YYYY')
                : moment(userdata.dob).format('MM-DD-YYYY') || moment(new Date()).format('MM-DD-YYYY')
            }
          />
          <DateTimePicker
            date={dateOfBirth}
            maximumDate={new Date()}
            isVisible={openDatePicker}
            onConfirm={(date) => {
              handleDateChange(date)
              setDobErrorShow(false)
              setBtnMode();
            }}
            onCancel={handleClose}
            mode="date"
          />
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: height / 60,
              borderBottomWidth: 1,
              borderColor: '#c4c4c4'
            }}
          >
            <Text
              style={{
                fontSize: height / 60,
                color: '#7327C280',
                fontFamily: 'roboto-italic',
                textAlign: 'center'
              }}
            >
              Gender
            </Text>
            <Picker
              style={{ height: height / 35, width: width - 40, fontFamily: 'roboto-italic', textAlign: 'left', marginLeft: -width / 55 }}
              selectedValue={gender}
              enabled={isEditable}
              onValueChange={async (itemValue, itemIndex) => {
                await setGender(itemValue);
                setBtnMode();
                console.log(gender);
              }
              }
            >
              <Picker.Item color="#7327C2" label="Male" value="Male" style={{ fontFamily: 'roboto-italic' }} />
              <Picker.Item color="#7327C2" label="Female" value="Female" style={{ fontFamily: 'roboto-italic' }} />
              <Picker.Item color="#7327C2" label="Other" value="Other" style={{ fontFamily: 'roboto-italic' }} />
            </Picker>
          </View>
          {/* <InputWithLabel
            label="Gender"
            placeholderText="Female"
            value={userdata.gender}
            fnc={(gender)=>setUserdata(userdata => ({ ...userdata, gender: gender }))}
          /> */}

          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: height / 60,
              borderBottomWidth: 1,
              borderColor: '#c4c4c4'
            }}
          >
            <Text
              style={{
                fontSize: height / 60,
                color: '#7327C280',
                fontFamily: 'roboto-italic',
                textAlign: 'center'
              }}
            >
              Marital Status
            </Text>
            <Picker
              style={{ height: height / 35, width: width - 40, fontFamily: 'roboto-italic', textAlign: 'left', marginLeft: -width / 55 }}
              selectedValue={userdata.martialStatus}
              enabled={isEditable}
              onValueChange={(itemValue, itemIndex) =>
                setUserdata(userdata => ({ ...userdata, martialStatus: itemValue }))
              }
            >
              <Picker.Item color="#7327C280" label="Select" value="Select" />
              <Picker.Item color="#7327C2" label="Married" value="Married" />
              <Picker.Item color="#7327C2" label="Single" value="Single" />
              <Picker.Item color="#7327C2" label="Divorced" value="Divorced" />
              <Picker.Item color="#7327C2" label="Separated" value="Separated" />
            </Picker>
          </View>
          {/* <InputWithLabel
            label="Marital Status"
            placeholderText="Single"
            value={userdata.martialStatus}
            fnc={(martialStatus)=>setUserdata(userdata => ({ ...userdata, martialStatus: martialStatus }))}
          /> */}

          <InputWithLabel
            label="Mobile No"
            placeholderText={userdata.mobileNumber}
            value={userdata.mobileNumber}
            editable={false}
            errorMsg={errorMessage[3]}
            maxLength={10}
            showErrorMsg={errorFieldIndex[3]}
            fnc={(mobileNumber) => {
              setUserdata(userdata => ({ ...userdata, mobileNumber: mobileNumber }))
              if (mobileNumber.length === 0) {
                setErrorFieldIndex([
                  ...[errorFieldIndex[0], errorFieldIndex[1], errorFieldIndex[2], true]
                ])
                setErrorMessages([
                  ...[
                    errorMessage[0],
                    errorMessage[1],
                    errorMessage[2],
                    "Mobile number cannot be blank",
                  ]
                ])
                return;
              }
              if (mobileNumber.length === 10) {
                setErrorFieldIndex([
                  ...[errorFieldIndex[0], errorFieldIndex[1], errorFieldIndex[2], false]
                ])
                setErrorMessages([
                  ...[
                    errorMessage[0],
                    errorMessage[1],
                    errorMessage[2],
                    "",
                  ]
                ])
                return;
              }
            }}
          />

          <InputWithLabel
            label="Email Id"
            value={userdata.email}
            showErrorMsg={emailIsInvalid}
            errorMsg="Email format is incorrect"
            editable={isEditable}
            fnc={(email) => {
              setUserdata(userdata => ({ ...userdata, email: email }));
              if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{1,3})*$/.test(email)) {
                setemailIsInvalid(true);
              }
              else {
                setemailIsInvalid(false);
              }
            }}
          />

          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: height / 60,
              borderBottomWidth: 1,
              borderColor: '#c4c4c4'
            }}
          >
            <Text
              style={{
                fontSize: height / 60,
                color: '#7327C280',
                fontFamily: 'roboto-italic',
                textAlign: 'center'
              }}
            >
              Blood Group
            </Text>
            <Picker
              style={{ height: height / 35, width: width - 40, fontFamily: 'roboto-italic', textAlign: 'left', marginLeft: -width / 55 }}
              selectedValue={userdata.bloodgroup}
              enabled={isEditable}
              onValueChange={(itemValue, itemIndex) =>
                setUserdata(userdata => ({ ...userdata, bloodgroup: itemValue }))
              }
            >
              <Picker.Item color="#7327C280" label="Select" value="Select" />
              <Picker.Item color="#7327C2" label="A+" value="A+" />
              <Picker.Item color="#7327C2" label="B+" value="B+" />
              <Picker.Item color="#7327C2" label="AB+" value="AB+" />
              <Picker.Item color="#7327C2" label="AB-" value="AB-" />
              <Picker.Item color="#7327C2" label="O+" value="O+" />
              <Picker.Item color="#7327C2" label="O-" value="O-" />
              <Picker.Item color="#7327C2" label="A-" value="A-" />
              <Picker.Item color="#7327C2" label="B-" value="B-" />
            </Picker>
          </View>

          {/* Expandable / Accordions */}

          {/* FULL ADDRESS */}

          {
            !isFullAddressExpanded ? (
              <TouchableOpacity
                onPress={() => expandFullAddress(true)}
                style={{
                  width: '100%',
                  borderBottomWidth: 1,
                  borderColor: '#c4c4c4',
                  height: height / 15,
                  flexDirection: 'row',
                  paddingVertical: height / 30,
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  // marginBottom: height / 20
                }}
              >
                <Text
                  style={{
                    fontFamily: 'roboto-italic',
                    fontSize: height / 55,
                    color: '#7327C2',
                  }}
                >
                  Full Address
            </Text>
                <Entypo
                  size={height / 30}
                  color="#542F0F"
                  name="chevron-down"
                />
              </TouchableOpacity>
            ) : (
                <View
                  style={{
                    // marginBottom: height / 20
                  }}
                >
                  <TouchableOpacity
                    onPress={() => expandFullAddress(false)}
                    style={{
                      width: '100%',
                      borderBottomWidth: 1,
                      borderColor: '#c4c4c4',
                      height: height / 15,
                      flexDirection: 'row',
                      paddingVertical: height / 30,
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'roboto-italic',
                        fontSize: height / 55,
                        color: '#7327C2',
                      }}
                    >
                      Full Address
                  </Text>
                    <Entypo
                      size={height / 30}
                      color="#542F0F"
                      name="chevron-up"
                    />
                  </TouchableOpacity>

                  <InputWithLabel
                    label="Pincode"
                    maxLength={6}
                    keyboardType="number-pad"
                    value={addressPincode}
                    editable={isEditable}
                    fnc={(pValue) => {
                      if (pValue.length === 6) {
                        fetchPinDetails(pValue)
                      }
                      setAddressPincode(pValue)
                    }
                    }
                  />
                  <InputWithLabel
                    label="Address"
                    value={address}
                    editable={isEditable}
                    fnc={(address1) => {
                      setAddress(address1)
                    }
                    }
                  />
                  <InputWithLabel
                    label="Address 1"
                    value={address1}
                    editable={isEditable}
                    fnc={(address2) => {
                      setAddress1(address2)
                    }
                    }
                  />
                  <InputWithLabel
                    label="City"
                    editable={isEditable}
                    value={addressCityName}
                    fnc={(city) => {
                      setUserdata({
                        ...userdata, address: {
                          pincode: userdata?.address?.pincode,
                          address1: userdata?.address?.address1,
                          address2: userdata?.address?.address2,
                          city: city,
                          state: userdata?.address?.state,
                          country: userdata?.address?.country,
                        }
                      })
                    }
                    }
                  />
                  <InputWithLabel
                    label="State"
                    editable={isEditable}
                    value={addressStateName}
                    fnc={(state) => {
                      setUserdata({
                        ...userdata, address: {
                          pincode: userdata?.address?.pincode,
                          address1: userdata?.address?.address1,
                          address2: userdata?.address?.address2,
                          city: userdata?.address?.city,
                          state: state,
                          country: userdata?.address?.country,
                        }
                      })
                    }
                    }
                  />
                  <InputWithLabel
                    label="Country"
                    editable={isEditable}
                    value={addressCountryName}
                    fnc={(country) => {
                      setUserdata({
                        ...userdata, address: {
                          pincode: userdata?.address?.pincode,
                          address1: userdata?.address?.address1,
                          address2: userdata?.address?.address2,
                          city: userdata?.address?.city,
                          state: userdata?.address?.state,
                          country: country,
                        }
                      })
                    }
                    }

                  />
                </View>
              )
          }

          {/* EMERGENCY DETAIL */}

          {
            !isEmergencyDetailExpanded ? (
              <TouchableOpacity
                onPress={() => expandEmergencyDetailView(true)}
                style={{
                  width: '100%',
                  borderBottomWidth: 1,
                  borderColor: '#c4c4c4',
                  height: height / 15,
                  flexDirection: 'row',
                  paddingVertical: height / 30,
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  // marginBottom: height / 20
                }}
              >
                <Text
                  style={{
                    fontFamily: 'roboto-italic',
                    fontSize: height / 55,
                    color: '#7327C2',
                  }}
                >
                  Emergency Detail
                </Text>
                <Entypo
                  size={height / 30}
                  color="#542F0F"
                  name="chevron-down"
                />
              </TouchableOpacity>
            ) : (
                <View
                  style={{
                    // marginBottom: height / 20
                  }}
                >
                  <TouchableOpacity
                    onPress={() => expandEmergencyDetailView(false)}
                    style={{
                      width: '100%',
                      borderBottomWidth: 1,
                      borderColor: '#c4c4c4',
                      height: height / 15,
                      flexDirection: 'row',
                      paddingVertical: height / 30,
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'roboto-italic',
                        fontSize: height / 55,
                        color: '#7327C2',
                      }}
                    >
                      Emergency Detail
                  </Text>
                    <Entypo
                      size={height / 30}
                      color="#542F0F"
                      name="chevron-up"
                    />
                  </TouchableOpacity>

                  <InputWithLabel
                    label="Emergency Contact Person"
                    showErrorMsg={isContactNameValid}
                    errorMsg="Name cannot have number"
                    editable={isEditable}
                    value={userdata?.emergencyDetails.contactPerson}
                    fnc={(val) => {
                      if (/\d/.test(val)) {
                        setContactNameValidity(true);
                      }
                      if (!/\d/.test(val)) {
                        setContactNameValidity(false);
                      }
                      setUserdata({
                        ...userdata, emergencyDetails: {
                          contactNo: userdata?.emergencyDetails.contactNo,
                          contactPerson: val,
                          relation: userdata?.emergencyDetails.relation,
                        },
                      })
                      // let a = userdata
                      // a.emergencyDetails.contactPerson = contactPerson
                      // setUserdata(a)
                    }
                    }
                  />
                  <InputWithLabel
                    label="Emergency Contact Number"
                    editable={isEditable}
                    keyboardType="number-pad"
                    showErrorMsg={isEmergencyNumberValid}
                    errorMsg="Contact number invalid"
                    maxLength={10}
                    value={userdata?.emergencyDetails.contactNo}
                    fnc={(contactNo) => {
                      if (contactNo.length <= 9) {
                        setEmergencyNumberValidity(true)
                      } else {
                        setEmergencyNumberValidity(false)
                      }
                      setUserdata({
                        ...userdata, emergencyDetails: {
                          contactNo: contactNo,
                          relation: userdata?.emergencyDetails.relation,
                          contactPerson: userdata?.emergencyDetails.contactPerson,
                        }
                      })
                    }
                    }
                    maxLength={10}
                  />
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      marginTop: height / 60,
                      borderBottomWidth: 1,
                      borderColor: '#c4c4c4'
                    }}
                  >
                    <Text
                      style={{
                        fontSize: height / 60,
                        color: '#7327C280',
                        fontFamily: 'roboto-italic',
                        textAlign: 'center'
                      }}
                    >
                      Relationship
                    </Text>
                    <Picker
                      style={{ height: height / 35, width: width - 40, fontFamily: 'roboto-italic', textAlign: 'left', marginLeft: -width / 55 }}
                      enabled={isEditable}
                      selectedValue={userdata?.emergencyDetails.relation}
                      onValueChange={(itemValue, itemIndex) => {
                        setUserdata({
                          ...userdata, emergencyDetails: {
                            contactNo: userdata?.emergencyDetails.contactNo,
                            relation: itemValue,
                            contactPerson: userdata?.emergencyDetails.contactPerson,
                          }
                        })
                      }
                      }
                    >
                      <Picker.Item color="#7327C280" label="Select" value="Select" />
                      <Picker.Item color="#7327C2" label="Mother" value="Mother" />
                      <Picker.Item color="#7327C2" label="Father" value="Father" />
                      <Picker.Item color="#7327C2" label="Husband" value="Husband" />
                      <Picker.Item color="#7327C2" label="Wife" value="Wife" />
                      <Picker.Item color="#7327C2" label="Son" value="Son" />
                      <Picker.Item color="#7327C2" label="Daughter" value="Daughter" />
                      <Picker.Item color="#7327C2" label="Maternal Grandfather" value="Maternal Grandfather" />
                      <Picker.Item color="#7327C2" label="Maternal GrandMother" value="Maternal GrandMother" />
                      <Picker.Item color="#7327C2" label="Paternal Grandfather" value="Paternal Grandfather" />
                      <Picker.Item color="#7327C2" label="Paternal GrandMother" value="Paternal GrandMother" />
                      <Picker.Item color="#7327C2" label="Brother" value="Brother" />
                      <Picker.Item color="#7327C2" label="Sister" value="Sister" />
                      <Picker.Item color="#7327C2" label="Others" value="Others" />
                    </Picker>
                  </View>
                  {/* <InputWithLabel
                    label="Relationship"
                    value={userdata.emergencyDetails.relation}
                    fnc={(relation)=>{
                      setUserdata({...userdata,  emergencyDetails: {
                        contactNo: userdata.emergencyDetails.contactNo,
                        relation : relation,
                        contactPerson : userdata.emergencyDetails.contactPerson,
                        }
                    })
                    }
                    }
                  /> */}
                </View>
              )
          }

          {/* Employment INFO */}

          {
            !isEmploymentInfoExpanded ? (
              <TouchableOpacity
                onPress={() => expandEmploymentInfoView(true)}
                style={{
                  width: '100%',
                  borderBottomWidth: 1,
                  borderColor: '#c4c4c4',
                  height: height / 15,
                  flexDirection: 'row',
                  paddingVertical: height / 30,
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  // marginBottom: height / 20
                }}
              >
                <Text
                  style={{
                    fontFamily: 'roboto-italic',
                    fontSize: height / 50,
                    color: '#7327C2',
                  }}
                >
                  Employment Information
                </Text>
                <Entypo
                  size={height / 30}
                  color="#542F0F"
                  name="chevron-down"
                />
              </TouchableOpacity>
            ) : (
                <View
                  style={{
                    // marginBottom: height / 20
                  }}
                >
                  <TouchableOpacity
                    onPress={() => expandEmploymentInfoView(false)}
                    style={{
                      width: '100%',
                      borderBottomWidth: 1,
                      borderColor: '#c4c4c4',
                      height: height / 15,
                      flexDirection: 'row',
                      paddingVertical: height / 30,
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'roboto-italic',
                        fontSize: height / 55,
                        color: '#7327C2',
                      }}
                    >
                      Employment Information
                  </Text>
                    <Entypo
                      size={height / 30}
                      color="#542F0F"
                      name="chevron-up"
                    />
                  </TouchableOpacity>

                  <InputWithLabel
                    label="Employer Name"
                    placeholderText=""
                    editable={isEditable}
                    showErrorMsg={isEmpNameValid}
                    errorMsg="Name cannot contain numbers"
                    value={userdata?.employmentInformation.employerName}
                    fnc={(employerName) => {
                      if (/\d/.test(employerName)) {
                        setEmpNameValidity(true);
                      }
                      if (!/\d/.test(employerName)) {
                        setEmpNameValidity(false);
                      }
                      setUserdata({
                        ...userdata, employmentInformation: {
                          employerName: employerName,
                          designation: userdata?.employmentInformation.designation,
                          mobileNumber: userdata?.employmentInformation.mobileNumber,
                          industry: userdata?.employmentInformation.industry,
                          addressType: userdata?.employmentInformation.addressType,
                        }
                      })
                    }
                    }
                  />
                  <InputWithLabel
                    label="Designation"
                    placeholderText=""
                    editable={isEditable}
                    value={userdata?.employmentInformation.designation}
                    fnc={(designation) => {
                      setUserdata({
                        ...userdata, employmentInformation: {
                          employerName: userdata?.employmentInformation.employerName,
                          designation: designation,
                          mobileNumber: userdata?.employmentInformation.mobileNumber,
                          industry: userdata?.employmentInformation.industry,
                          addressType: userdata?.employmentInformation.addressType,
                        }
                      })
                    }
                    }
                  />
                  <InputWithLabel
                    label="Mobile No."
                    placeholderText=""
                    maxLength={10}
                    errorMsg="Number should be 10 digits"
                    showErrorMsg={isEmpNumberValid}
                    keyboardType="number-pad"
                    editable={isEditable}
                    value={userdata?.employmentInformation.mobileNumber}
                    fnc={(mobileNumber) => {
                      if (mobileNumber.length <= 9) {
                        setEmpNumberValidity(true);
                      } else {
                        setEmpNumberValidity(false);
                      }
                      setUserdata({
                        ...userdata, employmentInformation: {
                          employerName: userdata?.employmentInformation.employerName,
                          designation: userdata?.employmentInformation.designation,
                          mobileNumber: mobileNumber,
                          industry: userdata?.employmentInformation.industry,
                          addressType: userdata?.employmentInformation.addressType,
                        }
                      })
                    }
                    }
                  />
                  <InputWithLabel
                    label="Industry"
                    placeholderText=""
                    editable={isEditable}
                    value={userdata.employmentInformation.industry}
                    fnc={(industry) => {
                      setUserdata({
                        ...userdata, employmentInformation: {
                          employerName: userdata?.employmentInformation.employerName,
                          designation: userdata?.employmentInformation.designation,
                          mobileNumber: userdata?.employmentInformation.mobileNumber,
                          industry: industry,
                          addressType: userdata?.employmentInformation.addressType,
                        }
                      })
                    }
                    }
                  />
                  <InputWithLabel
                    label="Address Type"
                    placeholderText=""
                    editable={isEditable}
                    value={userdata.employmentInformation.addressType}
                    fnc={(addressType) => {
                      setUserdata({
                        ...userdata, employmentInformation: {
                          employerName: userdata?.employmentInformation.employerName,
                          designation: userdata?.employmentInformation.designation,
                          mobileNumber: userdata?.employmentInformation.mobileNumber,
                          industry: userdata?.employmentInformation.industry,
                          addressType: addressType,
                        }
                      })
                    }
                    }
                  />
                </View>
              )
          }

          {/* Insurence  INFO */}

          {
            !isInsuranceExpanded ? (
              <TouchableOpacity
                onPress={() => expandInsuranceView(true)}
                style={{
                  width: '100%',
                  borderBottomWidth: 1,
                  borderColor: '#c4c4c4',
                  height: height / 15,
                  flexDirection: 'row',
                  paddingVertical: height / 30,
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: height / 20
                }}
              >
                <Text
                  style={{
                    fontFamily: 'roboto-italic',
                    fontSize: height / 50,
                    color: '#7327C2',
                  }}
                >
                  Insurance Detail
                </Text>
                <Entypo
                  size={height / 30}
                  color="#542F0F"
                  name="chevron-down"
                />
              </TouchableOpacity>
            ) : (
                <View
                  style={{
                    marginBottom: height / 20
                  }}
                >
                  <TouchableOpacity
                    onPress={() => expandInsuranceView(false)}
                    style={{
                      width: '100%',
                      borderBottomWidth: 1,
                      borderColor: '#c4c4c4',
                      height: height / 15,
                      flexDirection: 'row',
                      paddingVertical: height / 30,
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'roboto-italic',
                        fontSize: height / 55,
                        color: '#7327C2',
                      }}
                    >
                      Insurance Detail
                  </Text>
                    <Entypo
                      size={height / 30}
                      color="#542F0F"
                      name="chevron-up"
                    />
                  </TouchableOpacity>

                  <InputWithLabel
                    label="Policy Name"
                    placeholderText=""
                    editable={isEditable}
                    value={userdata?.insuranceDetails.policyName}
                    fnc={(val) => {
                      setUserdata({
                        ...userdata, insuranceDetails: {
                          policyName: val,
                          provider: userdata.insuranceDetails.provider,
                          type: userdata.insuranceDetails.type,
                          policyNumber: userdata.insuranceDetails.policyNumber,
                          insurance_provide_by_employer: userdata.insuranceDetails.insurance_provide_by_employer,
                          valid_till: userdata.insuranceDetails.valid_till,
                        }
                      })
                    }
                    }
                  />
                  <InputWithLabel
                    label="Insurance Provider"
                    placeholderText=""
                    editable={isEditable}
                    value={userdata?.insuranceDetails.provider}
                    fnc={(val) => {
                      setUserdata({
                        ...userdata, insuranceDetails: {
                          policyName: userdata.insuranceDetails.policyName,
                          provider: val,
                          type: userdata.insuranceDetails.type,
                          policyNumber: userdata.insuranceDetails.policyNumber,
                          insurance_provide_by_employer: userdata.insuranceDetails.insurance_provide_by_employer,
                          valid_till: userdata.insuranceDetails.valid_till,
                        }
                      })
                    }
                    }
                  />
                  <InputWithLabel
                    label="Insurance Type"
                    editable={isEditable}
                    placeholderText=""
                    value={userdata?.insuranceDetails.type}
                    fnc={(val) => {
                      setUserdata({
                        ...userdata, insuranceDetails: {
                          policyName: userdata.insuranceDetails.policyName,
                          provider: userdata.insuranceDetails.provider,
                          type: val,
                          policyNumber: userdata.insuranceDetails.policyNumber,
                          insurance_provide_by_employer: userdata.insuranceDetails.insurance_provide_by_employer,
                          valid_till: userdata.insuranceDetails.valid_till,
                        }
                      })
                    }
                    }
                  />
                  <InputWithLabel
                    label="Policy Number"
                    editable={isEditable}
                    placeholderText=""
                    value={userdata?.insuranceDetails.policyNumber}
                    fnc={(val) => {
                      setUserdata({
                        ...userdata, insuranceDetails: {
                          policyName: userdata.insuranceDetails.policyName,
                          provider: userdata.insuranceDetails.provider,
                          type: userdata.insuranceDetails.type,
                          policyNumber: val,
                          insurance_provide_by_employer: userdata.insuranceDetails.insurance_provide_by_employer,
                          valid_till: userdata.insuranceDetails.valid_till,
                        }
                      })
                    }
                    }
                  />
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      marginTop: height / 35,
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      borderColor: '#c4c4c4'
                    }}
                  >
                    <Text
                      style={{
                        fontSize: height / 60,
                        color: '#7327C280',
                        fontFamily: 'roboto-italic',
                        textAlign: 'center',
                        marginRight: 5
                      }}
                    >
                      Insurance provided by the employer
                    </Text>
                    <RadioForm
                      initial={userdata?.insuranceDetails.insurance_provide_by_employer ? 0 : 1}
                      formHorizontal={true}
                      labelHorizontal={true}
                      labelColor={'#7327C2'}
                      buttonColor={'#7327C2'}
                      buttonInnerColor={'#7327C2'}
                      buttonOuterColor={'#7327C2'}
                      selectedButtonColor={'#7327C2'}
                      selectedLabelColor={'#7327C2'}
                      labelStyle={{ marginHorizontal: 5 }}
                      buttonSize={12}
                      buttonOuterSize={22}
                      buttonStyle={{ marginLeft: 5 }}
                      buttonWrapStyle={{}}
                      animation={true}
                      radio_props={radio_props}
                      onPress={(value) => {
                        if (!isEditable) {
                          return;
                        }
                        console.log('SELECTED RADIO', value);
                        setUserdata({
                          ...userdata, insuranceDetails: {
                            policyName: userdata.insuranceDetails.policyName,
                            provider: userdata.insuranceDetails.provider,
                            type: userdata.insuranceDetails.type,
                            policyNumber: userdata.insuranceDetails.policyNumber,
                            insurance_provide_by_employer: value,
                            valid_till: userdata.insuranceDetails.valid_till,
                          }
                        })
                      }}
                    />

                  </View>
                  {/* <InputWithLabel
                    label="Insurance provided by the employer"
                    placeholderText=""
                      value={userdata.insuranceDetails.addressType}
                      fnc={(addressType)=>{
                        let a = userdata
                        a.insuranceDetails.policyName = addressType
                        setUserdata(a)}
                      }
                  /> */}

                  <InputWithLabel
                    onFocus={() => setOpenDatePicker1(true)}
                    label="Valid Till"
                    editable={isEditable}
                    placeholderText=""
                    value={
                      moment(userdata.insuranceDetails.valid_till).format('MM-DD-YYYY') || moment(new Date()).format('MM-DD-YYYY')
                    }
                    fnc={(valid_till) => {
                      setUserdata({
                        ...userdata, insuranceDetails: {
                          policyName: userdata.insuranceDetails.policyName,
                          provider: userdata.insuranceDetails.provider,
                          type: userdata.insuranceDetails.type,
                          policyNumber: userdata.insuranceDetails.policyNumber,
                          insurance_provide_by_employer: userdata.insuranceDetails.insurance_provide_by_employer,
                          valid_till: valid_till,
                        }
                      })
                    }
                    }
                  />
                  <DateTimePicker
                    date={dateOfBirth1}
                    isVisible={openDatePicker1}
                    onConfirm={(date) => {
                      handleDateChange1(date)
                      setDobErrorShow(false)
                    }}
                    onCancel={handleClose1}
                    mode="date"
                  />
                </View>
              )
          }

        </View>
      </ScrollView>

      <SuccessModal
        isVisible={successModalShow}
        successMessage={"User details Added!"}
        onHide={successModalHideHandler}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    height: SCREEN_HEIGHT / 3.2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: height / 25,
  },
  topToolContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  toolIcon: {
    color: "#FFFFFF",
    fontSize: 30,
  },
  media: {
    flexDirection: "row",
    alignItems: "center",
  },
  mediaImage: { position: "relative" },
  textContainer: {
    paddingLeft: 20,
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
  accordionContainer: {
    padding: 0,
    width: "100%",
  },
  menuItem: {
    color: "rgba(115, 39, 194, 1)",
    borderBottomColor: "#E2E2E2",
    borderBottomWidth: 1,

    width: "100%",
    marginLeft: -15,
    paddingLeft: 10,

    height: 35,
  },
  formTitleContainer: {
    flex: 1,
    paddingHorizontal: 35,
    paddingTop: 15,
    alignItems: "center",
  },
  formTitle: {
    fontSize: 28,
    color: "#54C8D6",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    color: "#7327C2",
    paddingVertical: 0,
    height: 50,
    fontSize: 16,
    justifyContent: "center",
  },
  inputPicker: {
    marginTop: 10,
    marginLeft: 5,
    color: "#7327C2",
  },
  formGroupRadio: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 30,
    paddingLeft: 10,
    paddingTop: 10,
  },
  radioLeftContainer: {
    width: "40%",
  },
  radioGroup: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "center",
  },
  radioTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  radioTextLeft: {
    color: "rgba(115, 39, 194, .43)",
  },
  radioText: {
    color: "rgba(115, 39, 194, .43)",
  },
  healthTitle: {
    color: "#7327C2",
    paddingLeft: 10,
    fontFamily: "roboto-bold",
    borderBottomColor: "#E2E2E2",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  datePicker: {
    width: "100%",
    marginLeft: 0,
    textAlign: "left",
  },
  formGroupMultiSelect: {
    borderBottomColor: "#E2E2E2",
    borderBottomWidth: 1,
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  error: {
    color: "red",
    fontSize: 13,
  },
  menuItemContainer: {
    width: "100%",
  },
  prescriptionListContainer: {
    paddingHorizontal: 25,
    flex: 1,
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
})

export default ProfileDetailScreen
