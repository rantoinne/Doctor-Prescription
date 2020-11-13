import APIKit from "../shared/APIKit";

export const patientSignup = async (payLoad) => {
  try {
    const { data } = await APIKit.post(`auth/patient-registration`, payLoad, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (err) {
    return err;
  }
};
export const userLogin = async (payLoad) => {
  console.log("====================================");
  console.log(payLoad);
  console.log("====================================");
  try {
    const { data } = await APIKit.post(`auth/login`, payLoad, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (err) {
    return err;
  }
};

export const otpVerify = async (payLoad, token) => {
  console.log("====================================");
  console.log(payLoad);
  console.log("====================================");
  console.log("====================================");
  console.log(token);
  console.log("====================================");
  try {
    const { data } = await APIKit.post(`auth/verify-otp`, payLoad, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    return err;
  }
};

export const getUserProfile = async (id) => {
  try {
    const { data } = await APIKit.get(`users/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};
export const changePassword = async (id, payLoad) => {
  try {
    const { data } = await APIKit.post(`users/${id}/changepassword`, payLoad);
    return data;
  } catch (err) {
    return err;
  }
};
export const forgotPassword = async (payLoad) => {
  try {
    const { data } = await APIKit.post(`users/forgotpassword`, payLoad);
    return data;
  } catch (err) {
    return err;
  }
};

export default {
  patientSignup,
  userLogin,
  getUserProfile,
  changePassword,
  forgotPassword,
  otpVerify,
};
