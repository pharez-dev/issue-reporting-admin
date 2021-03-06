import Head from "next/head";
import { Breadcrumb, Icon } from "antd";
import Reports from "../components/custom/Reports";

const ReportsPage = props => {
  return (
    <>
      <Breadcrumb
        style={{
          margin: "10px"
        }}
      >
        <Breadcrumb.Item href="">
          <Icon type="home" />
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
