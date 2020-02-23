import Head from "next/head";
import { Breadcrumb, Icon } from "antd";
import Reports from "../components/custom/Reports";

const ReportsPage = () => (
  <>
    <Breadcrumb style={{{
  margin: '40px',
  border: '5px solid pink'
}}}>
      <Breadcrumb.Item href="">
        <Icon type="home" />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="">
        <Icon type="user" />
        <span>Application List</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>Application</Breadcrumb.Item>
    </Breadcrumb>
    <Reports />
  </>
  // <>
  //   <Head>
  //     <link rel="stylesheet" href="/static/react-vis.css" />
  //   </Head>
  //   <Overview />
  // </>
);

export default ReportsPage;
