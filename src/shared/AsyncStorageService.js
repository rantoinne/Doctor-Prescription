// LocalStorageService.js
import { AsyncStorage } from "react-native";
const AsyncStorageService = (() => {
  let service;
  function getService() {
    if (!service) {
      service = this;

      return service;
    }

    return service;
  }
  const setToken = async (tokenObj) => {
    try {
      await AsyncStorage.setItem("token", tokenObj);
    } catch (error) {
      // Error saving data
    }
  };

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        return value;
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const setRole = async (roleObj) => {
    try {
      await AsyncStorage.setItem("role", roleObj);
    } catch (error) {
      // Error saving data
    }
  };

  const getRole = async () => {
    try {
      const value = await AsyncStorage.getItem("role");
      if (value !== null) {
        return value;
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  return {
    getService,
    setToken,
    getToken,
    setRole,
    getRole,
  };
})();
export default AsyncStorageService;
