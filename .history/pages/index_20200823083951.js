import Head from "next/head";
import Overview from "../components/Overview";
import "isomorphic-fetch";
import { Cookies } from "react-cookie";
import { parseCookies } from "../lib/helpers";
import authCheck from "../lib/AuthCheck";
import Router from "next/router";
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
  const data = await fetch("https://.../posts");
  data = await data.json();
  console.log(data);
  return {};
};

export default OverviewPage;
