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
Report.getInitialProps = async ({ req, res }) => {
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

  return {};
};

export default ReportsPage;
