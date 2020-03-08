import React from "react";

//import globals from "../constants/Globals";
import jwt_decode from "jwt-decode";
import { Cookies } from "react-cookie";
const { token } = parseCookies(req);
const GlobalContext = React.createContext({});
// set up cookies
const cookies = new Cookies();
export class GlobalContextProvider extends React.Component {
  state = {
    isLoadingState: true,

    user: null,

    token: null
  };

  signIn = token => {
    cookies.set("token", token);
    const user = jwt_decode(token);
    this.setState(
      {
        user,
        token
      }
      // ,
      // () => {
      //   Router.push("/");
      // }
    );
  };

  signOut = () => {
    cookies.remove("token");
    this.setState({
      user: null
    });
    // Router.push("/signin");
  };
  fetchToken = () => {
    // const user = jwt_decode(token);
    // this.setState(
    //   {
    //     user,
    //     token
    //   }
    // ,
    // () => {
    //   Router.push("/");
    // }
    // );
  };
  componentDidMount = () => {
    this.fetchToken();
  };
  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,

          signIn: this.signIn,
          signOut: this.signOut
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

// create the consumer as higher order component
export const withGlobalContext = ChildComponent => props => (
  <GlobalContext.Consumer>
    {context => <ChildComponent {...props} global={context} />}
  </GlobalContext.Consumer>
);
