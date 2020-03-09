import Head from "next/head";
import { Breadcrumb, Icon } from "antd";
import Reports from "../../customComponents/Reports";
//For data
import fetch from "isomorphic-unfetch";
//For checking if token is valid
import { parseCookies } from "../lib/helpers";
import authCheck from "../lib/AuthCheck";
import globals from "../constants/Globals";
import Router from "next/router";
const ReportsPage = () => <Reports />;

export default ReportsPage;
