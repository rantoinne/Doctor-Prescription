import React, { useState } from "react";
import { View, StyleSheet, Modal, Image, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Dimensions, Platform } from "react-native";
import BodyText from "./BodyText";
import { AntDesign } from '@expo/vector-icons';
import SmallButton from "./SmallButton";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get('window');

const ActiveUsersModal = ({
  hideModal,
  visible,
  members,
  setCurrentActiveMember,
  currentActiveMember,
  showNewMemberForm
}) => {
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
                      MANAGE ACTIVE USERS
                  </BodyText>
                  </LinearGradient>
                  <View
                    style={styles.parentUIContainer}
                  >
                    <View
                      style={{
                        maxHeight: height / 3.5
                      }}
                    >
                      <ScrollView
                        showsVerticalScrollIndicator={false}
                      >
                        {
                          members?.map((member, index) => {
                            return (
                              <TouchableOpacity
                                key={index}
                                onPress={() => setCurrentActiveMember(index)}
                                style={styles.rowMemberContainer}
                              >
                                <View
                                  key={index}
                                  style={styles.avatarTextContainer}
                                >
                                  <Image
                                    source={require('../../assets/img/profile.png')}
                                    style={styles.avatarStyle}
                                  />
                                  <BodyText
                                    key={index}
                                    style={styles.memberNameTextStyle}
                                  >
                                    {member?.name || 'Anonymous'}
                                  </BodyText>
                                </View>
                                {
                                  currentActiveMember === index && (
                                    <AntDesign
                                      name="checkcircle"
                                      size={height / 30}
                                      color="#00E5DF"
                                    />
                                  )
                                }
                              </TouchableOpacity>
                            );
                          })
                        }
                        <TouchableOpacity
                          onPress={() => {
                            hideModal();
                            showNewMemberForm(true);
                          }}
                          style={styles.addNewMemberContainer}
                        >
                          <View
                            style={styles.avatarTextContainer}
                          >
                            <Image
                              source={require('../../assets/img/user-icon-circle.png')}
                              style={styles.avatarStyle}
                            />
                            <BodyText
                              style={styles.memberNameTextStyle}
                            >
                              Add a family Member
                          </BodyText>
                          </View>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
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
    paddingVertical: height / 40,
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

export default ActiveUsersModal;
