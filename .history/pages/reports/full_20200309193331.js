import Head from "next/head";
import { Breadcrumb, Icon } from "antd";
import Reports from "../../customComponents/full";
//For data
import fetch from "isomorphic-unfetch";
//For checking if token is valid
import { parseCookies } from "../../lib/helpers";
import authCheck from "../../lib/AuthCheck";
import globals from "../../constants/Globals";
import { withRouter } from "next/router";
import Router from "next/router";
const FullReportPage = props => {
  return (
    <>
      <Breadcrumb
        style={{
          margin: "10px"
        }}
      >
        <Breadcrumb.Item
          href="#"
          onClick={() => {
            Router.push("/");
          }}
        >
          <Icon style={{ marginTop: "-4px" }} type="home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item
          href="#"
          onClick={() => {
            Router.push("/reports");
          }}
        >
          <span>Reports</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">
          <span>Full Report</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Reports {...props} />
    </>
  );
};

export default withRouter(FullReportPage);

FullReportPage.getInitialProps = async ({ req, res, query }) => {
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
  console.log("query");
  // Must return an object
  //   const res = await fetch("https://my.weather.api/london/today");
  //   const json = await res.json();

  return {};
  // return { name: "Charlie" };
};
