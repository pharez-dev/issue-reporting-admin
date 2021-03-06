import Head from "next/head";
import { Breadcrumb, Icon } from "antd";
import Notifications from "../CustomComponents/Notifications";
import fetch from "isomorphic-unfetch";
//For checking if token is valid
import { parseCookies } from "../lib/helpers";
import authCheck from "../lib/AuthCheck";
const ReportsPage = props => {
  console.log("[notification prop]", props);
  return (
    <>
      <Breadcrumb
        style={{
          margin: "10px"
        }}
      >
        <Breadcrumb.Item href="">
          <Icon style={{ marginTop: "-4px" }} type="bell" />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <span>Notifications</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Notifications props />
    </>
    // <>
    //   <Head>
    //     <link rel="stylesheet" href="/static/react-vis.css" />
    //   </Head>
    //   <Overview />
    // </>
  );
};
ReportsPage.getInitialProps = async ({ req, res }) => {
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

  // console.log("token", token);
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
  const get = await fetch("https://api.tvmaze.com/search/shows?q=batman");
  const data = await get.json();

  return { hahha: "just trying" };
};

export default ReportsPage;
