import {
  Table,
  Card,
  Divider,
  Button,
  Message,
  Icon,
  Modal,
  Form,
  Input,
  Radio,
  Select,
  Alert,
  Spin,
  Descriptions,
  Badge
} from "antd";
import dynamic from "next/dynamic";
import reqwest from "reqwest";
import globals from "../constants/Globals";
import moment from "moment";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import Capitalized from "../lib/Capitalize";
import Capitalize from "../lib/Capitalize";
const columns = [
  {
    title: "User ID",
    dataIndex: "reportId",
    sorter: true,
    // render: name => `${name.first} ${name.last}`,
    width: "20%"
  },
  {
    sorter: true,
    title: "Role",
    dataIndex: "type"
  },
  {
    sorter: true,
    title: "Issue Status",
    dataIndex: "status",
    filters: [
      { text: "Pending", value: "pending" },
      { text: "Planned", value: "planned" },
      { text: "In Progress", value: "in progress" },
      { text: "Resolved", value: "resolved" },
      { text: "Escalated", value: "escalated" },
      { text: "Closed", value: "closed" }
    ],
    render: stat => (
      <b>
        <Capitalize text={stat ? stat : "Pending"} />
      </b>
    )
  },
  {
    sorter: true,
    title: "County",
    dataIndex: "county"
  },
  {
    sorter: true,
    title: "Sub County",
    dataIndex: "sub_county",
    render: sub => (sub ? sub : "NA")
  },
  {
    title: "Reported On",
    dataIndex: "createdAt",
    sorter: true,
    render: at => moment(at).format("YYYY-MM-DD")
  },
  {
    title: "",
    dataIndex: "",
    render: () => <Icon type="select" />,
    width: "100px"
  }
];
