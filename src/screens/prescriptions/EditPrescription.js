import React, { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  TextInput as RNTextInput,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import {
  Card,
  TextInput,
  RadioButton,
  Text,
  TouchableRipple,
} from "react-native-paper"
import moment from 'moment';
import { Formik } from "formik"
import * as yup from "yup"
import DateTimePicker from "react-native-modal-datetime-picker"
import * as ImagePicker from "expo-image-picker"
import { Buffer } from "buffer"
import axios from "axios"

import { AntDesign } from "@expo/vector-icons"

import BodyText from "../../components/BodyText"
import CustomCheckBox from "../../components/CustomCheckBox"
import SmallButton from "../../components/SmallButton"
import GradientButton from "../../components/GradientButton"
import ErrorModal from "../../components/ErrorModal"
import Loader from "../../components/Loader"
import SuccessModal from "../../components/SuccessModal"

const { width, height } = Dimensions.get('window');

const useForceUpdate = () => useState()[1];

const EditPrescription = (props) => {
  const dateInputRef = React.useRef()
  const dateFollowUpInputRef = React.useRef()
  const dateOfTestInputRef = React.useRef()
  const [isAgreed, setSelection] = useState(false)
  const [isEditablePrescription, setEditingControls] = useState(undefined)
  const [followUpRequired, setFollowUpRequired] = React.useState("yes")
  const [labTestRequired, setLabTestRequired] = React.useState("yes")
  const [testSheduled, setTestSheduled] = React.useState("yes")
  const [testDone, setTestDone] = React.useState("yes")

  const [fileData, setFileData] = useState([])
  const [fileDataLabTest, setFileDataLabTest] = useState({})

  const [prescriptionImages, setPrescriptionImages] = useState([])
  const [labTestImages, setLabTestImages] = useState([])
  const [prescriptionImagesBas64, setPrescriptionImagesBas64] = useState([])
  const [labTestImagesBas64, setLabTestImagesBas64] = useState([])
  const [modalShow, setModal] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [successModalShow, setSuccessModal] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [prescribedOn, setprescribedOn] = useState(undefined)
  const [followUpDate, setfollowUpDate] = useState(undefined)
  const [dateOfTest, setDateOfTest] = useState(moment(new Date()).format('MM-DD-YYYY'))
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [openFollowUpDatePicker, setOpenFollowUpDatePicker] = useState(false)
  const [openDateOfTestPicker, setOpenDateOfTestPicker] = useState(false)
  const [dobError, setDobError] = useState("")
  const [dobErrorShow, setDobErrorShow] = useState(false)
  const [followUpErrorShow, setFollowUpErrorShow] = useState(false)
  const [dateOfTestErrorShow, setDateOfTestErrorShow] = useState(false)
  const [authToken, setAuthToken] = useState("")
  const [prescriptionDetails, setPrescriptionDetails] = useState({})
  const [incomingImageSize, setIncomingImageSize] = useState(0)

  const { navigation } = props;


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    })

    console.log(result)

    if (!result.cancelled) {
      // ImagePicker saves the taken photo to disk and returns a local URI to it
      let localUri = result.uri
      let filename = localUri.split("/").pop()

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename)
      let type = match ? `image/${match[1]}` : `image`
      console.log('IMAGES BEFORE', fileData);

      setFileData([
        ...fileData,
        {
          uri: localUri,
          name: filename,
          type,
        }
      ])



      setTimeout(() => {
        console.log('IMAGES', fileData);
      }, 1000);
      setPrescriptionImages((prevPrescriptionImage) =>
        prevPrescriptionImage.concat(result.uri)
      )
      let base64Image = "data:image/png;base64, " + result.base64
      setPrescriptionImagesBas64((preImage) => preImage.concat(base64Image))
    }
  }

  const pickImageLabTest = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    })

    console.log(result)

    if (!result.cancelled) {
      let localUri = result.uri
      let filename = localUri.split("/").pop()

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename)
      let type = match ? `image/${match[1]}` : `image`

      setFileDataLabTest((prevFileData) => ({
        ...prevFileData,
        uri: localUri,
        name: filename,
        type,
      }))

      setLabTestImages((prevlabTestImage) =>
        prevlabTestImage.concat(result.uri)
      )
      let base64Image = "data:image/png;base64, " + result.base64
      setLabTestImagesBas64((prevImage) => prevImage.concat(base64Image))
    }
  }

  const agreeHandler = () => {
    setSelection(!isAgreed)
  }

  const validationSchema = yup.object().shape({
    doctorName: yup.string().required("Doctor name is required"),
    // clinicName: yup.string().required("Clinic name is required"),
    doctorNumber: yup
      .string()
      .required("Doctor number is required")
      .min(10, "Doctor number must be of 10 digits")
      .matches(/^[0-9]?[6789]\d{9}$/, "Please enter a valid mobile no"),
    specialization: yup.string().required("Specialization is required"),
    prescribedOn: yup.string(),
    followUpDate: yup.string(),
    followUpRequired: yup.string(),
    labtestRequired: yup.string(),
    testSheduled: yup.string(),
    testDone: yup.string(),
    description: yup.string(),
  })

  const getTokenFunction = () => {
    //function to get the value from AsyncStorage
    AsyncStorage.getItem("token").then(
      (value) =>
        //AsyncStorage returns a promise so adding a callback to get the value
        setAuthToken(value)
      //Setting the value in Text
    )
  }
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const isEditablePrescriptionCopy = !!props.route?.params;
    setEditingControls(isEditablePrescriptionCopy);
    console.log('PROPS \n\n\n', props.route.params);
    if (isEditablePrescriptionCopy) {
      setPrescriptionDetails(props.route?.params);
      setprescribedOn(moment(props.route.params.prescribed_on).format('MM-DD-YYYY'))
      setfollowUpDate(props.route.params.date_of_follow_up !== null ? moment(props.route.params.date_of_follow_up).format('MM-DD-YYYY') : moment(new Date()).format('MM-DD-YYYY'))
      setDateOfTest(props.route.params.date_of_test !== null ? moment(props.route.params.date_of_test).format('MM-DD-YYYY') : moment(new Date()).format('MM-DD-YYYY'))
      setFollowUpRequired(props.route.params.is_required_follow_up ? "yes" : "no")
      setLabTestRequired(props.route.params.lab_test_required ? "yes" : "no")
      setTestSheduled(props.route.params.is_test_scheduled ? "yes" : "no")
      setTestDone(props.route.params.get_test_done ? "yes" : "no");

      if (props.route.params.prescriptionFiles.length > 0) {
        setPrescriptionImages(props.route.params.prescriptionFiles.length > 0 ? props.route.params.prescriptionFiles : []);
        setFileData(...[props.route.params.prescriptionFiles]);
        setIncomingImageSize(props.route.params.prescriptionFiles.length)
      }
      setTimeout(() => {
        console.log('FILEDATE', fileData);
      }, 1500)

    }
    getTokenFunction()
    console.log('addPrescription', prescriptionDetails);
    console.log("================authToken====================")
    console.log(authToken)
    console.log("====================================")
  }, [authToken, setAuthToken])

  const onSubmitHandler = (values) => {
    let month = ""
    let day = ""
    let year = ""
    let prescriptionDate = ""
    let followUpDateObj = ""
    let dateOfTestObj = ""

    let prescDate = new Date(prescribedOn)
    let followDate = new Date(followUpDate)

    console.log("=============prescribedOn=======================")
    console.log(fileDataLabTest.length)
    console.log(fileDataLabTest)
    console.log("====================================")
    console.log("=============prescribedOn=======================")
    console.log(followUpDateObj)
    console.log("====================================", prescriptionDetails.prescriptionFiles.length > 0)

    let formData = new FormData()
    
    if (incomingImageSize === fileData.length) {

    }
    // if (fileData.length === 1) {
    //   formData.append("prescriptionFiles", fileData);
    // }
    else {
      fileData?.map((item, index) => {
        if (typeof item === "string") {
          formData.append("prescriptionFiles", item);
        }
        else {
          formData.append("prescriptionFiles", {
            type: item.type,
            uri: item.uri,
            name: item.filename || `filename${index}.jpg`,
          });
        }
      });
    }


    formData.append("clinic_name", values.clinicName)
    formData.append("doctor_name", values.doctorName)
    formData.append("doctor_phone_no", values.doctorNumber)
    formData.append("specialization", values.specialization)
    formData.append("prescribed_on", prescribedOn)
    formData.append(
      "is_required_follow_up", followUpRequired === "yes" ? true : false
    )
    formData.append(
      "lab_test_required", false
      // labTestRequired === 'yes' ? true : false
    )

    if (followUpRequired === 'yes') {
      formData.append("date_of_follow_up", followUpDate)
    }

    formData.append(
      "is_test_scheduled", false
    )
    // testSheduled === 'yes' ? true : false
    formData.append("get_test_done", false)
    // formData.append("date_of_test", moment(new Date()).format('MM-DD-YYYY'))
    formData.append("date_of_test", "09-20-2020")
    // formData.append("get_test_done", testDone === 'yes' ? true : false)

    // if (labTestRequired === "yes") {
    //   formData.append(
    //     "is_test_scheduled",
    //     testSheduled === 'yes' ? true : false
    //   )
    //   formData.append("get_test_done", testDone === 'yes' ? true : false)

    //   if(Object.keys(fileDataLabTest).length > 0) {
    //     formData.append("labTestFiles", fileDataLabTest)
    //     formData.append("date_of_test", "7-15-2020")
    //   }

    // } else {
    //   formData.append("is_test_scheduled", false)
    //   formData.append("get_test_done", false)
    // }
    formData.append("description", values.description || "")
    formData.append("prescription_no", "345345")
    let jsonObject = {}
    for (const part of formData.getParts()) {
      console.log((jsonObject[part.fieldName] = part.string))
    }



    console.log('formData', `patient/prescriptions/${prescriptionDetails._id}`);
    console.log('formData', formData);
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + " - " + pair[1])
    // }
    axios
      .put(`patient/prescriptions/${prescriptionDetails._id}`, formData, {
        headers: {
          Authorization: `Baerer ${authToken}`,
          "content-type": "application/x-www-form-urlencoded",
        },
      })
      .then(function (res) {
        const resData = res.data
        console.log(resData)
        if (resData.status) {
          setShowLoader(false)
          setSuccessModal(true)
          setSuccessMessage(resData.message)
        } else {
          setModal(true)
          setErrorMessage(resData.message)
          setShowLoader(false)
        }
      })
      .catch((error) => {
        console.log("==========error==========================")
        console.log(error)
        setModal(true)
        setErrorMessage('All fields are mandatory')
        setShowLoader(false)
        console.log("====================================")
      })
  }

  const modalHideHandler = () => {
    setModal(false)
  }

  const successModalHideHandler = () => {
    setSuccessModal(false)
    navigation.goBack();
  }

  const handleFocus = () => {
    dateInputRef.current.focus()
  }
  const handleBlur = () => {
    setTimeout(() => {
      dateInputRef.current.focus()
    }, 100)
  }
  const handleDateChange = (date) => {
    console.log('date')
    handleClose()
    setprescribedOn(moment(date).format('MM-DD-YYYY'));
  }

  const handleClose = () => {
    setOpenDatePicker(false)
    handleBlur()
  }

  const handleOpen = () => {
    Keyboard.dismiss()
    handleFocus()
    setOpenDatePicker(true)
  }

  const renderTouchText = (props) => {
    const { style, value } = props

    return (
      <TouchableRipple onPress={handleOpen}>
        <Text style={style}>{value}</Text>
      </TouchableRipple>
    )
  }
  const handleFollowUpFocus = () => {
    dateFollowUpInputRef.current.focus()
  }
  const handleFollowUpBlur = () => {
    setTimeout(() => {
      dateFollowUpInputRef.current.focus()
    }, 100)
  }
  const handleFollowUpDateChange = (date) => {
    console.log('date', date);
    console.log('date', moment(date).format('MM-DD-YYYY'));
    handleFollowUpClose()
    setfollowUpDate(moment(date).format('MM-DD-YYYY'));
  }

  const handleFollowUpClose = () => {
    setOpenFollowUpDatePicker(false)
    handleFollowUpBlur()
  }

  const handleFollowUpOpen = () => {
    Keyboard.dismiss()
    handleFollowUpFocus()
    setOpenFollowUpDatePicker(true)
  }

  const renderTouchTextFollowUp = (props) => {
    const { style, value } = props

    return (
      <TouchableRipple onPress={handleFollowUpOpen}>
        <Text style={style}>{value}</Text>
      </TouchableRipple>
    )
  }

  // Date of Test
  const handleDateOfTestFocus = () => {
    dateOfTestInputRef.current.focus()
  }
  const handleDateOfTestBlur = () => {
    setTimeout(() => {
      dateOfTestInputRef.current.focus()
    }, 100)
  }
  const handleDateOfTestChange = (date) => {
    // let dob = new Date(date)
    // const month = dob.getMonth()
    // const day = dob.getDate()
    // const year = dob.getFullYear()

    // dob = month + "-" + day + "-" + year
    handleDateOfTestClose()
    setDateOfTest(moment(date).format('MM-DD-YYYY'))
  }

  const handleDateOfTestClose = () => {
    setOpenDateOfTestPicker(false)
    handleDateOfTestBlur()
  }

  const handleDateOfTestOpen = () => {
    Keyboard.dismiss()
    handleDateOfTestFocus()
    setOpenDateOfTestPicker(true)
  }

  const updatePrescription = () => {
    axios
      .put(`patient/prescriptions/${prescriptionDetails._id}`, formData, {
        headers: {
          Authorization: `Baerer ${authToken}`,
          "content-type": "multipart/form-data",
        },
      })
      .then(function (res) {
        console.log("==========res==========================")
        console.log(res)
        console.log("====================================")
      })
      .catch((error) => {
        console.log("==========error==========================")
        console.log(error)
        console.log("====================================")
        const errData = error.response.data
        // console.log("==================errData==================")
        // console.log(errData)
        // console.log("====================================")
        setModal(true)
        setErrorMessage(errData.message)
        setShowLoader(false)
      })
  }

  const renderTouchTextDateOfTest = (props) => {
    const { style, value } = props

    return (
      <TouchableRipple onPress={handleDateOfTestOpen}>
        <Text style={style}>{value}</Text>
      </TouchableRipple>
    )
  }

  console.log('isEditablePrescription', isEditablePrescription);


  return (
    <>
      {showLoader && <Loader />}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.screen}>
          <LinearGradient colors={["#54C8D6", "#5101C2"]} style={styles.topBar}>
            <View style={styles.topTitleContainer}>
              <TouchableOpacity onPress={() => props.navigation.goBack()} activeOpacity={0.6}>
                <AntDesign
                  name="arrowleft"
                  size={24}
                  color="black"
                  style={styles.titleIcon}
                />
              </TouchableOpacity>

              <BodyText style={styles.topTitle}>Edit Prescription</BodyText>
            </View>
          </LinearGradient>
          <View style={styles.body}>
            <ScrollView>
              <View style={styles.list}>
                <View>
                  <BodyText style={styles.title}>Prescription</BodyText>
                </View>
                <View style={styles.row}>
                  {prescriptionImages.length > 0 ? (
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={prescriptionImages}
                      contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      renderItem={({ item, index }) => {
                        return (
                          <>
                            <View style={styles.col} key={item}>
                              <Image
                                source={{ uri: item }}
                                style={styles.mediaImage}
                              />
                            </View>
                          </>
                        )
                      }}
                    />
                  ) : (
                      <>
                        {
                          new Array(3).fill('').map(() => {
                            return (
                              <View style={[styles.col, { width: '33.33%' }]}>
                                <Image
                                  style={[styles.localMediaImage]}
                                  source={require("../../../assets/img/prescription.png")}
                                />
                              </View>
                            );
                          })
                        }
                      </>
                    )}
                </View>
                <View>
                  <SmallButton style={styles.smallButton} onPress={pickImage}>
                    <BodyText style={styles.buttonText}>
                      Upload Prescription
                    </BodyText>
                  </SmallButton>
                </View>
                <View style={styles.formContainer}>
                  {
                    isEditablePrescription ? (
                      <Formik
                        initialValues={{
                          clinicName: prescriptionDetails.clinic_name,
                          doctorName: prescriptionDetails.doctor_name,
                          doctorNumber: prescriptionDetails.doctor_phone_no,
                          specialization: prescriptionDetails.specialization,
                          prescribedOn: prescriptionDetails.prescribed_on,
                          followUpDate: followUpDate,
                          followUpRequired: prescriptionDetails.is_required_follow_up,
                          labtestRequired: prescriptionDetails.lab_test_required,
                          testSheduled: prescriptionDetails.is_test_scheduled,
                          testDone: prescriptionDetails.get_test_done,
                          description: prescriptionDetails.description,
                        }}
                        onSubmit={(values, { resetForm }) => {
                          if (prescribedOn === undefined) {
                            setDobErrorShow(true)
                            setDobError("Prescribed date is required")
                            return
                          }
                          onSubmitHandler(values)
                          setShowLoader(true)
                          // resetForm()
                        }}
                        validationSchema={validationSchema}
                      >
                        {({
                          values,
                          handleChange,
                          errors,
                          setFieldTouched,
                          touched,
                          isValid,
                          handleSubmit,
                          setFieldValue,
                        }) => {
                          console.log('values', isEditablePrescription ? prescriptionDetails.lab_test_required : "");
                          console.log('values', values);
                          return (
                            <>
                              <View style={styles.formGroup}>
                                <TextInput
                                  style={styles.input}
                                  Type="flat"
                                  label="Clinic Name / Header"
                                  value={values.clinicName}
                                  onChangeText={handleChange("clinicName")}
                                  onBlur={() => setFieldTouched("clinicName")}
                                  theme={{
                                    colors: {
                                      placeholder: "rgba(115, 39, 194, .43)",
                                      text: "#7327C2",
                                      primary: "rgba(115, 39, 194, .43)",
                                      underlineColor: "rgba(226, 226, 226, 1)",
                                    },
                                  }}
                                />
                              </View>
                              <View style={styles.errorContainer}>
                                {touched.clinicName && errors.clinicName && (
                                  <BodyText style={styles.error}>
                                    {errors.clinicName}
                                  </BodyText>
                                )}
                              </View>
                              <View style={styles.formGroup}>
                                <TextInput
                                  style={styles.input}
                                  Type="flat"
                                  label="Doctor Name *"
                                  value={values.doctorName}
                                  onChangeText={handleChange("doctorName")}
                                  onBlur={() => setFieldTouched("doctorName")}
                                  theme={{
                                    colors: {
                                      placeholder: "rgba(115, 39, 194, .43)",
                                      text: "#7327C2",
                                      primary: "rgba(115, 39, 194, .43)",
                                      underlineColor: "rgba(226, 226, 226, 1)",
                                    },
                                  }}
                                />
                              </View>
                              <View style={styles.errorContainer}>
                                {touched.doctorName && errors.doctorName && (
                                  <BodyText style={styles.error}>
                                    {errors.doctorName}
                                  </BodyText>
                                )}
                              </View>
                              <View style={styles.formGroup}>
                                <TextInput
                                  style={styles.input}
                                  Type="flat"
                                  label="Doctor Phone No *"
                                  keyboardType={"numeric"}
                                  maxLength={10}
                                  value={values.doctorNumber}
                                  onChangeText={(mobile) => {
                                    handleChange("doctorNumber", mobile)
                                    setFieldValue(
                                      "doctorNumber",
                                      mobile.replace(/[^0-9]/g, "")
                                    )
                                  }}
                                  onBlur={() => setFieldTouched("doctorNumber")}
                                  theme={{
                                    colors: {
                                      placeholder: "rgba(115, 39, 194, .43)",
                                      text: "#7327C2",
                                      primary: "rgba(115, 39, 194, .43)",
                                      underlineColor: "rgba(226, 226, 226, 1)",
                                    },
                                  }}
                                />
                              </View>
                              <View style={styles.errorContainer}>
                                {touched.doctorNumber && errors.doctorNumber && (
                                  <BodyText style={styles.error}>
                                    {errors.doctorNumber}
                                  </BodyText>
                                )}
                              </View>
                              <View style={styles.formGroup}>
                                <TextInput
                                  style={styles.input}
                                  Type="flat"
                                  label="Specialization *"
                                  value={values.specialization}
                                  onChangeText={handleChange("specialization")}
                                  onBlur={() => setFieldTouched("specialization")}
                                  theme={{
                                    colors: {
                                      placeholder: "rgba(115, 39, 194, .43)",
                                      text: "#7327C2",
                                      primary: "rgba(115, 39, 194, .43)",
                                      underlineColor: "rgba(226, 226, 226, 1)",
                                    },
                                  }}
                                />
                              </View>
                              <View style={styles.errorContainer}>
                                {touched.specialization && errors.specialization && (
                                  <BodyText style={styles.error}>
                                    {errors.specialization}
                                  </BodyText>
                                )}
                              </View>
                              <View style={styles.formGroup}>
                                <TextInput
                                  label="Prescribed On *"
                                  ref={dateInputRef}
                                  style={styles.input}
                                  Type="flat"
                                  value={
                                    prescribedOn
                                  }
                                  render={renderTouchText}
                                  theme={{
                                    colors: {
                                      placeholder: "rgba(115, 39, 194, .43)",
                                      text: "#7327C2",
                                      primary: "rgba(115, 39, 194, .43)",
                                      underlineColor: "rgba(226, 226, 226, 1)",
                                    },
                                  }}
                                />

                                <DateTimePicker
                                  date={new Date(values.prescribedOn)}
                                  isVisible={openDatePicker}
                                  maximumDate={new Date()}
                                  onConfirm={(date) => {
                                    handleDateChange(date)
                                    setDobErrorShow(false)
                                  }}
                                  onCancel={handleClose}
                                  mode="date"
                                />
                              </View>

                              <View style={styles.errorContainer}>
                                {dobErrorShow && (
                                  <BodyText style={styles.error}>{dobError}</BodyText>
                                )}
                              </View>
                              <View style={styles.formGroupRadio}>
                                <View style={styles.radioLeftContainer}>
                                  <BodyText style={styles.radioTextLeft}>
                                    Follow-Ups Required *
                            </BodyText>
                                </View>
                                <View style={styles.radioGroup}>
                                  <RadioButton.Group
                                    onValueChange={(value) =>
                                      setFollowUpRequired(value)
                                    }
                                    value={followUpRequired}
                                  >
                                    <View style={styles.radioTextContainer}>
                                      <RadioButton value="yes" color="#685BA9" />
                                      <Text style={styles.radioText}>Yes</Text>
                                    </View>
                                    <View style={styles.radioTextContainer}>
                                      <RadioButton value="no" color="#685BA9" />
                                      <Text style={styles.radioText}>No</Text>
                                    </View>
                                  </RadioButton.Group>
                                </View>
                              </View>
                              {followUpRequired === "yes" && (
                                <View>
                                  <TextInput
                                    label="Date of Follow-Up"
                                    ref={dateFollowUpInputRef}
                                    style={styles.input}
                                    Type="flat"
                                    value={followUpDate}
                                    render={renderTouchTextFollowUp}
                                    theme={{
                                      colors: {
                                        placeholder: "rgba(115, 39, 194, .43)",
                                        text: "#7327C2",
                                        primary: "rgba(115, 39, 194, .43)",
                                        underlineColor: "rgba(226, 226, 226, 1)",
                                      },
                                    }}
                                  />

                                  <DateTimePicker
                                    date={new Date(followUpDate)}
                                    isVisible={openFollowUpDatePicker}
                                    minimumDate={new Date(Date.now())}
                                    onConfirm={(date) => {
                                      handleFollowUpDateChange(date)
                                      setFollowUpErrorShow(false)
                                    }}
                                    onCancel={handleFollowUpClose}
                                    mode="date"
                                  />
                                </View>
                              )}

                              <View style={styles.formGroupRadio}>
                                <View style={styles.radioLeftContainer}>
                                  <BodyText style={styles.radioTextLeft}>
                                    Lab test recommended :
                            </BodyText>
                                </View>
                                <View style={styles.radioGroup}>
                                  <RadioButton.Group
                                    onValueChange={(value) =>
                                      setLabTestRequired(value)
                                    }
                                    value={labTestRequired}
                                  >
                                    <View style={styles.radioTextContainer}>
                                      <RadioButton value="yes" color="#685BA9" />
                                      <Text style={styles.radioText}>Yes</Text>
                                    </View>
                                    <View style={styles.radioTextContainer}>
                                      <RadioButton value="no" color="#685BA9" />
                                      <Text style={styles.radioText}>No</Text>
                                    </View>
                                  </RadioButton.Group>
                                </View>
                              </View>
                              {labTestRequired === "yes" && (
                                <>
                                  <View style={styles.formGroupRadio}>
                                    <View style={styles.radioLeftContainer}>
                                      <BodyText style={styles.radioTextLeft}>
                                        Is the test scheduled :
                                </BodyText>
                                    </View>
                                    <View style={styles.radioGroup}>
                                      <RadioButton.Group
                                        onValueChange={(value) =>
                                          setTestSheduled(value)
                                        }
                                        value={testSheduled}
                                      >
                                        <View style={styles.radioTextContainer}>
                                          <RadioButton value="yes" color="#685BA9" />
                                          <Text style={styles.radioText}>Yes</Text>
                                        </View>
                                        <View style={styles.radioTextContainer}>
                                          <RadioButton value="no" color="#685BA9" />
                                          <Text style={styles.radioText}>No</Text>
                                        </View>
                                      </RadioButton.Group>
                                    </View>
                                  </View>
                                  <View style={styles.formGroupRadio}>
                                    <View style={styles.radioLeftContainer}>
                                      <BodyText style={styles.radioTextLeft}>
                                        Did you get the test done :
                                </BodyText>
                                    </View>
                                    <View style={styles.radioGroup}>
                                      <RadioButton.Group
                                        onValueChange={(value) => setTestDone(value)}
                                        value={testDone}
                                      >
                                        <View style={styles.radioTextContainer}>
                                          <RadioButton value="yes" color="#685BA9" />
                                          <Text style={styles.radioText}>Yes</Text>
                                        </View>
                                        <View style={styles.radioTextContainer}>
                                          <RadioButton value="no" color="#685BA9" />
                                          <Text style={styles.radioText}>No</Text>
                                        </View>
                                      </RadioButton.Group>
                                    </View>
                                  </View>
                                  <View>
                                    <TextInput
                                      label="Date of Test"
                                      ref={dateOfTestInputRef}
                                      style={styles.input}
                                      Type="flat"
                                      value={
                                        dateOfTest
                                      }
                                      render={renderTouchTextDateOfTest}
                                      theme={{
                                        colors: {
                                          placeholder: "rgba(115, 39, 194, .43)",
                                          text: "#7327C2",
                                          primary: "rgba(115, 39, 194, .43)",
                                          underlineColor: "rgba(226, 226, 226, 1)",
                                        },
                                      }}
                                    />

                                    <DateTimePicker
                                      date={new Date(dateOfTest)}
                                      isVisible={openDateOfTestPicker}
                                      maximumDate={new Date()}
                                      onConfirm={(date) => {
                                        handleDateOfTestChange(date)
                                        setDateOfTestErrorShow(false)
                                      }}
                                      onCancel={handleDateOfTestClose}
                                      mode="date"
                                    />
                                  </View>
                                  <View>
                                    <BodyText style={styles.labTestText}>
                                      Lab test
                              </BodyText>
                                  </View>

                                  <View style={styles.row}>
                                    {labTestImages.length > 0 ? (
                                      <FlatList
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        data={labTestImages}
                                        contentContainerStyle={{
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                        renderItem={({ item, index }) => {
                                          return (
                                            <>
                                              <View style={styles.col} key={item}>
                                                <Image
                                                  source={{ uri: item }}
                                                  style={styles.mediaImage}
                                                />
                                              </View>
                                            </>
                                          )
                                        }}
                                      />
                                    ) : (
                                        <>
                                          {
                                            new Array(3).fill('').map(() => {
                                              return (
                                                <View style={styles.col}>
                                                  <Image
                                                    style={styles.localMediaImage}
                                                    source={require("../../../assets/img/prescription.png")}
                                                  />
                                                </View>
                                              );
                                            })
                                          }
                                        </>
                                      )}
                                  </View>
                                  <View>
                                    <SmallButton
                                      style={styles.smallButton}
                                      onPress={pickImageLabTest}
                                    >
                                      <BodyText style={styles.buttonText}>
                                        Upload Lab Reports
                                </BodyText>
                                    </SmallButton>
                                  </View>
                                </>
                              )}

                              <View style={styles.textAreaContainer}>
                                <BodyText style={styles.textAreaTitle}>
                                  Prescription Name / Description
                          </BodyText>
                                <RNTextInput
                                  style={[styles.textArea, {
                                    padding: 10,
                                    justifyContent: 'flex-start'
                                  }]}
                                  multiline
                                  numberOfLines={5}
                                  value={values.description}
                                  onChangeText={handleChange("description")}
                                  onBlur={() => setFieldTouched("description")}
                                  underlineColor="transparent"
                                />
                              </View>
                              <View>
                                <GradientButton
                                  disabled={!isValid}
                                  style={styles.button}
                                  onPress={handleSubmit}
                                >
                                  Save
                          </GradientButton>
                              </View>
                            </>
                          )
                        }}
                      </Formik>
                    ) : (
                        null
                      )
                  }
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <ErrorModal
        isVisible={modalShow}
        errorMessage={errorMessage}
        onHide={modalHideHandler}
      />
      <SuccessModal
        isVisible={successModalShow}
        successMessage={successMessage}
        onHide={successModalHideHandler}
      />
    </>
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
  title: {
    color: "rgba(115, 39, 194, 1)",
    fontSize: 17,
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
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 20,
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
    fontSize: 21,
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  col: {
    // width: "33.333%",
    alignItems: "center",
  },
  mediaImage: {
    marginTop: 20,
    marginHorizontal: 20,
    height: height / 5,
    width: width / 4,
  },
  localMediaImage: {
    marginTop: 20,
    marginHorizontal: 20,
    height: height / 5,
    resizeMode: 'contain',
    width: width / 4.5,
  },
  smallButton: {
    height: height / 18,
    marginVertical: 20,
    width: width * 0.5,
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    color: "#7327C2",
    paddingVertical: 0,
    height: 50,
  },
  formGroupRadio: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",

    paddingLeft: 10,
    paddingTop: 10,
  },
  radioLeftContainer: {
    width: "60%",
  },
  radioGroup: {
    width: "40%",
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
  middleTitle: {
    color: "rgba(115, 39, 194, .43)",
    paddingLeft: 10,
    marginTop: 10,
  },
  textArea: {
    backgroundColor: "#fff",
    borderColor: "rgba(181, 129, 255, 1)",
    color: "rgba(115, 39, 194, .43)",
    borderWidth: 1,
    overflow: "hidden",
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textAreaTitle: {
    textAlign: "center",
    fontSize: 17,
    color: "rgba(115, 39, 194, 1)",
    marginBottom: 10,
  },
  labTestText: {
    color: "rgba(115, 39, 194, 1)",
    fontSize: 17,
    paddingLeft: 10,
    marginTop: 30,
    marginBottom: 10,
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
})

export default EditPrescription
