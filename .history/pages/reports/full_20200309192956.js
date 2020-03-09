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
