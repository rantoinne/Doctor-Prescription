import axios from "axios";
import { AsyncStorage } from "react-native";
// Create axios client, pre-configured with baseURL
let APIKit = axios.create({
  baseURL:
    "http://healthsafebackend-env-1.eba-uc2fmrz3.us-east-2.elasticbeanstalk.com/",
  timeout: 10000,
});

export default APIKit;
