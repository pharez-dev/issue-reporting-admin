import Head from "next/head";
import { Breadcrumb, Icon } from "antd";
import Reports from "../CustomComponents/Reports";

const ReportsPage = props => {
  return (
    <>
      <Breadcrumb
        style={{
          margin: "10px"
        }}
      >
        <Breadcrumb.Item href="">
          <Icon style={{ marginTop: "-4px" }} type="home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <span>Reports</span>
        </Breadcrumb.Item>
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
};

export default ReportsPage;
