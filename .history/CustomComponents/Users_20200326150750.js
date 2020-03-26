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
      reqwest({
        url: `${globals.BASE_URL}/api/issues/all`,
        method: "post",
        data: {
          limit: 10,
          ...params,
          type: this.state.filters
        },
        type: "json"
      }).then(data => {
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
      });
    } catch (err) {
      Message.error(err.message);
      this.setState({ loading: false });
    }
  };
  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
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
          <large>Reported Issues</large>
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
                `}
              >
                <Button
                  type={
                    state.filters.includes("Housing and land")
                      ? "primary"
                      : "default"
                  }
                  onClick={() => this.set("Housing and land")}
                >
                  Housing and land
                </Button>{" "}
                <Button
                  type={
                    state.filters.includes("Water and sanitation")
                      ? "primary"
                      : "default"
                  }
                  onClick={() => this.set("Water and sanitation")}
                >
                  Water and sanitation
                </Button>{" "}
                <Button
                  type={
                    state.filters.includes("Roads and Transport")
                      ? "primary"
                      : "default"
                  }
                  onClick={() => this.set("Roads and Transport")}
                >
                  Roads and Transport
                </Button>
                <Button
                  type={
                    state.filters.includes("Agriculture and livestock")
                      ? "primary"
                      : "default"
                  }
                  onClick={() => this.set("Agriculture and livestock")}
                >
                  Agriculture and livestock
                </Button>
                <Button
                  type={
                    state.filters.includes("Bursery allocations")
                      ? "primary"
                      : "default"
                  }
                  onClick={() => this.set("Bursery allocations")}
                >
                  Bursery allocations
                </Button>
                <Button
                  type={state.filters.includes("Other") ? "primary" : "default"}
                  onClick={() => this.set("Other")}
                >
                  Other
                </Button>
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
                  this.setState({ mdRecord: record._id }), this.showModal();

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
        {state.visible && (
          <CollectionCreateForm
            token={this.props.token}
            record={state.mdRecord}
            wrappedComponentRef={this.saveFormRef}
            confirmLoading={this.state.confirmLoading}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            //  onCreate={this.handleSubmit}
          />
        )}
      </Card>
    );
  }
}

export default App;
