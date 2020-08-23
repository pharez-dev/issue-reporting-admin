import Head from "next/head";
import Overview from "../components/Overview";
import "isomorphic-fetch";
import { Cookies } from "react-cookie";
import { parseCookies } from "../lib/helpers";
import authCheck from "../lib/AuthCheck";
import Router from "next/router";
import globals from "../constants/Globals";

const OverviewPage = () => (
  <>
    <Head>
      <link rel="stylesheet" href="/static/react-vis.css" />
    </Head>
    <Overview />
  </>
);
OverviewPage.getInitialProps = async ({ req, res }) => {
  const { token } = parseCookies(req);
  try {
    if (!token) {
      if (req) {
        // If `ctx.req` is available it means we are on the server.
        res.writeHead(302, { Location: "/signin" });
        res.end();
      } else {
        // This should only happen on client.
        Router.push("/signin");
      }
    }
    //CHECK IF JWT IS VALID
    const isValid = await authCheck(token);

    console.log("token", token);
    if (!isValid) {
      if (req) {
        // If `ctx.req` is available it means we are on the server.
        res.writeHead(302, { Location: "/signin" });
        res.end();
      } else {
        // This should only happen on client.
        Router.push("/signin");
      }
    }
    //Dash data

    const response = await fetch(`${globals.BASE_URL}/api/admin/dash_data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },

      body: JSON.stringify(values),
    });
    if (response.ok) {
      const data = await response.json();
      return { data: data };
    } else {
      throw new Error(response);
    }
    console.log(data);
  } catch (error) {
    console.log(error);
  }
  return {};
};

export default OverviewPage;
