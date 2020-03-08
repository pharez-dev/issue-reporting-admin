import { Table, Card, Divider } from "antd";
import reqwest from "reqwest";
import globals from "../constants/Globals";
const columns = [
  {
    title: "Report ID",
    dataIndex: "reportId",
    sorter: true,
    // render: name => `${name.first} ${name.last}`,
    width: "20%"
  },
  {
    title: "Issue Type",
    dataIndex: "type"
  },
  {
    title: "County",
    dataIndex: "email"
  },
  {
    title: "Sub County",
    dataIndex: "email"
  },
  {
    title: "Gender",
    dataIndex: "url",
    filters: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" }
    ],
    width: "20%",
    key: "url"
  }
];

class App extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };

  fetch = (params = {}) => {
    console.log("params:", params);
    this.setState({ loading: true });
    reqwest({
      url: `${globals.BASE_URL}/api/issues/all`,
      method: "post",
      data: {
        results: 10,
        ...params
      },
      type: "json"
    }).then(data => {
      console.log("[server data]", data);
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 200;
      this.setState({
        loading: false,
        data: data.issues,
        pagination
      });
    });
  };

  componentDidMount() {
    this.fetch();
  }

  render() {
    console.log(this.state.data);
    return (
      <Card bodyStyle={{ padding: 0 }} id="components-button-demo">
        <Divider orientation="left">
          <large>Reported Issues</large>
        </Divider>
        <div className="p-4">
          <Table
            columns={columns}
            rowKey={record => record._id}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default App;
