import { Table, Card, Divider, Carousel } from "antd";
import reqwest from "reqwest";
import globals from "../constants/Globals";
import moment from "moment";
import { withRouter } from "next/router";
class Full extends React.Component {
  state = {
    data: this.props.data,
    pagination: {},
    loading: false
  };

  // handleTableChange = (pagination, filters, sorter) => {
  //   const pager = { ...this.state.pagination };
  //   pager.current = pagination.current;
  //   this.setState({
  //     pagination: pager
  //   });
  //   this.fetch({
  //     results: pagination.pageSize,
  //     page: pagination.current,
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     ...filters
  //   });
  // };

  // fetch = (params = {}) => {
  //   // console.log("params:", params);
  //   this.setState({ loading: true });
  //   reqwest({
  //     url: `${globals.BASE_URL}/api/issues/all`,
  //     method: "post",
  //     data: {
  //       limit: 10,
  //       ...params
  //     },
  //     type: "json"
  //   }).then(data => {
  //     //  console.log("[server data]", data);
  //     const pagination = { ...this.state.pagination };
  //     // Read total count from server
  //     // pagination.total = data.totalCount;
  //     pagination.total = data.meta.totalDocs;
  //     this.setState({
  //       loading: false,
  //       data: data.issues,
  //       pagination
  //     });
  //   });
  // };

  componentDidMount() {
    // this.fetch();
    //console.log("[received Params]", this.props.router.query);
  }

  render() {
    const { state } = this;
    const { data } = state;
    const carocss = `
    text-align: center;
    height: 300px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
  `;
    // console.log(this.state.data);
    return (
      <Card bodyStyle={{ padding: 0 }} id="components-button-demo">
        <Divider orientation="left">
          <large>Single Issue</large>
        </Divider>
        <Carousel>
          <div css={carocss}>
            <img src={"http://placehold.it/400x20&text=slide1"} alt="boohoo" />
            <h3>1</h3>
          </div>
          <div css={carocss}>
            <h3>2</h3>
          </div>
          <div css={carocss}>
            <h3>3</h3>
          </div>
          <div css={carocss}>
            <h3>4</h3>
          </div>
        </Carousel>
        <div className="p-4"></div>
      </Card>
    );
  }
}

export default withRouter(Full);