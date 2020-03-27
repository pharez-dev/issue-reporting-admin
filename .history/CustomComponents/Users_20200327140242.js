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
import NewOfficial from "./smComponents/NewOfficial";
import FullUser from "./smComponents/FullUser";
const columns = [
  {
    title: "User ID",
    dataIndex: "_id",
    sorter: true,
    // render: name => `${name.first} ${name.last}`,
    width: "20%"
  },
  {
    sorter: true,
    title: "Name",
    dataIndex: "name"
  },
  {
    sorter: true,
    title: "Email",
    dataIndex: "email"
  },
  {
    sorter: true,
    title: "Phone number",
    dataIndex: "phoneNumber"
  },
  {
    sorter: true,
    title: "Role",
    dataIndex: "role",
    filters: [
      { text: "Mobile-client", value: "mobile-client" },
      { text: "Admin", value: "admin" },
      { text: "Sub County Admin", value: "sub-county-admin" },
      { text: "Ward Admin", value: "ward-admin" }
    ],
    render: r => <Capitalize text={r} />
  },
  {
    sorter: true,
    title: "Status",
    dataIndex: "status",
    // filters: [
    //   { text: "Pending", value: "pending" },
    //   { text: "Planned", value: "planned" },
    //   { text: "In Progress", value: "in progress" },
    //   { text: "Resolved", value: "resolved" },
    //   { text: "Escalated", value: "escalated" },
    //   { text: "Closed", value: "closed" }
    // ],
    render: stat => (
      <b>
        <Capitalize text={stat} />
      </b>
    )
  },

  {
    title: "created On",
    dataIndex: "createdAt",
    sorter: true,
    render: at => moment(at).format("YYYY-MM-DD")
  },
  {
    title: "",
    dataIndex: "",
    render: () => <Icon color="blue" type="select" />,
    width: "100px"
  }
];
class App extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
    filters: [],
    visible: false
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      sortField: sorter.field,
      sortOrder: sorter.order,
      tfilters: filters
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };
  set = value => {
    const { filters } = this.state;
    if (filters.includes(value)) {
      filters.splice(filters.indexOf(value), 1);
    } else {
      filters.push(value);
    }
    this.setState({ filters }, () => {
      this.fetch();
    });
  };
  clearFilters = () => {
    this.setState({ filters: [] }, () => {
      this.fetch();
    });
  };
  fetch = async (params = {}) => {
    if (Object.entries(params).length == 0)
      params = {
        ...this.state.tfilters,
        sortField: this.state.sortField,
        sortOrder: this.state.sortOrder
      };
    console.log("params:", params);
    this.setState({ loading: true });
    try {
      const data = await reqwest({
        url: `${globals.BASE_URL}/api/admin/allUsers`,
        headers: {
          Authorization: this.props.token
        },
        method: "post",
        data: {
          limit: 10,
          ...params,
          type: this.state.filters
        },
        type: "json"
      });

      if (!data.success) throw new Error(data.message);
      //  console.log("[server data]", data);
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = data.meta.totalDocs;
      this.setState({
        loading: false,
        data: data.issues,
        pagination
      });
    } catch (err) {
      Message.error(err.message);
      this.setState({ loading: false });
    }
  };
  shownModal = () => {
    this.setState({ visiblen: true });
  };
  shownUser = () => {
    this.setState({ visibleu: true });
  };

  handlenCancel = () => {
    this.setState({ visiblen: false });
  };
  handleuCancel = () => {
    this.setState({ visibleu: false });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { state } = this;
    //  console.log("report props", this.props);
    return (
      <Card bodyStyle={{ padding: 0 }} id="components-button-demo">
        <Divider orientation="left">
          <large>Users</large>
        </Divider>

        <div className="p-4">
          <div
            css={`
              margin-bottom: 16px;
              margin-top: -1.5rem !important;
            `}
          >
            <div
              css={`
                width: 100%;
              `}
            >
              <b
                css={`
                  font-size: 20px;
                `}
              ></b>
              <div
                css={`
                  margin-top: 10px;
                  flex-direction: row;
                  display: block;
                `}
              >
                <Button
                  style={{ display: "block" }}
                  type={"primary"}
                  icon="plus"
                  onClick={() => this.shownModal()}
                >
                  New Official
                </Button>{" "}
              </div>
            </div>

            <Button onClick={this.clearFilters}>Clear filters</Button>
          </div>
          <Table
            bordered
            size="middle"
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  this.setState({ mdRecord: record._id }), this.showUser();

                  // Router.push({
                  //   pathname: "/reports/full",
                  //   query: { record: record._id }
                  // });
                } // click row
              };
            }}
            columns={columns}
            rowKey={record => record._id}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>
        {state.visibleu && (
          <FullUser
            token={this.props.token}
            record={state.mdRecord}
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visibleu}
            onCancel={this.handleuCancel}
            //  onCreate={this.handleSubmit}
          />
        )}
        {state.visiblen && (
          <NewOfficial
            token={this.props.token}
            // record={state.mdRecord}
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visiblen}
            onCancel={this.handlenCancel}
            //  onCreate={this.handleSubmit}
          />
        )}
      </Card>
    );
  }
}

export default App;
