import Signin from "../components/Signin";
import "isomorphic-fetch";

import { Cookies } from "react-cookie";
import { parseCookies } from "../lib/helpers";
import authCheck from "../lib/AuthCheck";
import Router from "next/router";
// set up cookies
const cookies = new Cookies();
const SigninPage = props => <Signin {...props} />;

SigninPage.getInitialProps = async ({ req, res }) => {
  // console.log("GETTING INITIAL PROPS");
  // Must validate JWT
  //const cookies = parseCookies(req);
  // If the JWT is invalid it must redirect  // back to the main page. You can do that// with Router from 'next/router
  const { token } = parseCookies(req);
  // console.log("token", token);
  if (!token) return {};
  //CHECK IF JWT IS VALID
  const isValid = await authCheck(token);
  console.log(isValid);
  if (isValid) {
    if (req) {
      // If `ctx.req` is available it means we are on the server.
      res.writeHead(302, { Location: "/" });
      res.end();
    } else {
      // This should only happen on client.
      Router.push("/");
    }
  }
  // Must return an object
  //   const res = await fetch("https://my.weather.api/london/today");
  //   const json = await res.json();

  return {};
  // return { name: "Charlie" };
};

export default SigninPage;
