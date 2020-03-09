import Head from "next/head";
import { Breadcrumb, Icon } from "antd";
import Notifications from "../CustomComponents/Notifications";
//For checking if token is valid
import { parseCookies } from "../lib/helpers";
import authCheck from "../lib/AuthCheck";
const ReportsPage = props => {
  console.log("[notification prop]", props.hahha);
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
      <Notifications />
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

  return { hahha: "just trying" };
};

export default ReportsPage;
