import React from "react";
import PropTypes from "prop-types";

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: "Hello Testing",
      token: "",
      changeToken: "",
    };
  }

  setToken = (token) => {
    this.setState({ token: token });
  };

  setChangePasswordToken = (token) => {
    console.log("================Context Token====================");
    console.log(token);
    console.log("====================================");
    this.setState({ changeToken: token });
  };

  render() {
    const { children } = this.props;

    return (
      <AppContext.Provider
        value={{
          ...this.state,
          setToken: this.setToken,
          setChangePasswordToken: this.setChangePasswordToken,
        }}
      >
        {children}
      </AppContext.Provider>
    );
  }
}

AppProvider.propTypes = {
  children: PropTypes.shape({}).isRequired,
};
