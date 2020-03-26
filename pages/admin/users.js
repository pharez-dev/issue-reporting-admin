import Head from "next/head";
import { Breadcrumb, Icon } from "antd";
import Users from "../../CustomComponents/Users";
//For checking if token is valid
import { parseCookies } from "../../lib/helpers";
import authCheck from "../../lib/AuthCheck";
import Router from "next/router";
const ReportsPage = props => {
  return (
    <>
      <Breadcrumb
        style={{
          margin: "10px"
        }}
      >
        <Breadcrumb.Item
          href="#"
          //   onClick={() => {
          //     Router.push("/");
          //   }}
        >
          <Icon style={{ marginTop: "-4px" }} type="home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">
          <span>Users</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Users {...props} />
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

  return { token: token };
};

export default ReportsPage;
