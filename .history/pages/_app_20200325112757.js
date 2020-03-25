import "../assets/styles.less";

import App, { Container } from "next/app";

import AppProvider from "../components/shared/AppProvider";
import { GlobalStyles } from "../components/styles/GlobalStyles";
import Head from "next/head";
import NProgress from "nprogress";
import Page from "../components/Page";
import Router from "next/router";
import jwt_decode from "jwt-decode";

//Context
import { GlobalContextProvider } from "../context/global";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

class MyApp extends App {
  state = {
    user: null
  };
  static async getInitialProps({ Component, ctx, req }) {
    let pageProps = {};

    const userAgent = ctx.req
      ? ctx.req.headers["user-agent"]
      : navigator.userAgent;

    let ie = false;
    if (userAgent.match(/Edge/i) || userAgent.match(/Trident.*rv[ :]*11\./i)) {
      ie = true;
    }
    //console.log("INITIAL PROPS", Component);
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    //  console.log("[pageProps]", pageProps);
    pageProps.query = ctx.query;
    pageProps.ieBrowser = ie;
    return {
      pageProps,
      user: pageProps.token ? jwt_decode(pageProps.token) : null
    };
  }

  render() {
    const { Component, pageProps } = this.props;
    console.log("Page props]", pageProps);
    return (
      <Container>
        <GlobalStyles />
        <Head>
          <meta
            name="viewport"
            content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height"
          />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="shortcut icon" href="/static/images/triangle.png" />
          <title>Issue Reporting App Dashboard</title>
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Anonymous+Pro:400,700"
            rel="stylesheet"
          />
          {pageProps.ieBrowser && (
            <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.2.5/polyfill.min.js" />
          )}
        </Head>
        <AppProvider>
          <GlobalContextProvider>
            <Page>
              <Component {...pageProps} />
            </Page>
          </GlobalContextProvider>
        </AppProvider>
      </Container>
    );
  }
}

export default MyApp;
