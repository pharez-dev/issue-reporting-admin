import { Table, Card, Divider, Button } from "antd";
import reqwest from "reqwest";
import globals from "../constants/Globals";
import moment from "moment";
import Router from "next/router";
import Capitalized from "../lib/Capitalize";
import Capitalize from "../lib/Capitalize";
const columns = [
  {
    title: "Report ID",
    dataIndex: "reportId",
    sorter: true,
    // render: name => `${name.first} ${name.last}`,
    width: "20%"
  },
  {
    sorter: true,
    title: "Issue Type",
    dataIndex: "type",
    filters: [
      { text: "Water and sanitation", value: "Water and sanitation" },
      { text: "Housing and land", value: "Housing and land" },
      { text: "Agriculture and livestock", value: "Agriculture and livestock" }
    ]
  },
  {
    sorter: true,
    title: "Issue Status",
    dataIndex: "status",
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
    render: () => "Open",
    width: "100px"
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
    // console.log("params:", params);
    this.setState({ loading: true });
    reqwest({
      url: `${globals.BASE_URL}/api/issues/all`,
      method: "post",
      data: {
        limit: 10,
        ...params
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
  };

  componentDidMount() {
    this.fetch();
  }

  render() {
    //  console.log(this.state.data);
    return (
      <Card bodyStyle={{ padding: 0 }} id="components-button-demo">
        <Divider orientation="left">
          <large>Reported Issues</large>
        </Divider>
        <div className="p-4">
          <div
            css={`
              margin-bottom: 16px;
            `}
          >
            <div
              css={`
                width: 200px;
              `}
            >
              <b
                css={`
                  font-size: 20px;
                `}
              >
                Type
              </b>
              <div
                css={`
                  margin-top: 10px;
                  flex-direction: row;
                `}
              >
                <Button onClick={this.setAgeSort}>Housing and land</Button>{" "}
                <Button onClick={this.setAgeSort}>Water and sanitation</Button>
              </div>
            </div>

            <Button onClick={this.clearFilters}>Clear filters</Button>
            <Button onClick={this.clearAll}>Clear filters and sorters</Button>
          </div>
          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  Router.push({
                    pathname: "/reports/full",
                    query: { record: record._id }
                  });
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
      </Card>
    );
  }
}

export default App;
